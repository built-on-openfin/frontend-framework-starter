// ms365-blob-shim.js
// Workaround for @openfin/microsoft365: prepends the esbuild runtime helpers
// to any worker-Blob the package constructs via `(${fn})()` stringification,
// so helpers stay resolvable inside the Worker's fresh global scope.
//
// Import ONCE at the top of your app entry, before any code that calls connect().

(() => {
	if (typeof Blob === "undefined") return;
	const OriginalBlob = Blob;

	// Standard esbuild runtime — covers the helpers esbuild may emit when
	// downleveling syntax. Cheap (~700 bytes) and idempotent inside the Worker.
	const ESBUILD_RUNTIME = `
var __defProp=Object.defineProperty;
var __getOwnPropSymbols=Object.getOwnPropertySymbols;
var __hasOwnProp=Object.prototype.hasOwnProperty;
var __propIsEnum=Object.prototype.propertyIsEnumerable;
var __defNormalProp=(a,k,v)=>k in a?__defProp(a,k,{enumerable:true,configurable:true,writable:true,value:v}):a[k]=v;
var __spreadValues=(a,b)=>{
  for(var p in b||(b={}))if(__hasOwnProp.call(b,p))__defNormalProp(a,p,b[p]);
  if(__getOwnPropSymbols)for(var p of __getOwnPropSymbols(b)){if(__propIsEnum.call(b,p))__defNormalProp(a,p,b[p])}
  return a;
};
var __spreadProps=(a,b)=>Object.defineProperties(a,Object.getOwnPropertyDescriptors(b));
var __objRest=(a,k)=>{
  var r={};
  for(var p in a)if(__hasOwnProp.call(a,p)&&k.indexOf(p)<0)r[p]=a[p];
  if(a!=null&&__getOwnPropSymbols)for(var p of __getOwnPropSymbols(a))if(k.indexOf(p)<0&&__propIsEnum.call(a,p))r[p]=a[p];
  return r;
};
var __publicField=(a,k,v)=>__defNormalProp(a,typeof k!=="symbol"?k+"":k,v);
var __pow=Math.pow;
var __async=(t,a,g)=>new Promise((r,j)=>{
  var fu=v=>{try{st(g.next(v))}catch(e){j(e)}};
  var re=v=>{try{st(g.throw(v))}catch(e){j(e)}};
  var st=x=>x.done?r(x.value):Promise.resolve(x.value).then(fu,re);
  st((g=g.apply(t,a)).next());
});
`;

	// Babel's _asyncToGenerator (separate codepath; only emitted under webpack+Babel).
	const BABEL_ASYNC_TO_GEN = (name) =>
		`function _ms365_step(g,r,j,n,t,k,a){try{var i=g[k](a),v=i.value}catch(e){return j(e)}if(i.done)r(v);else Promise.resolve(v).then(n,t)}` +
		`function ${name}(fn){return function(){var s=this,a=arguments;return new Promise(function(r,j){var g=fn.apply(s,a);function n(v){_ms365_step(g,r,j,n,t,"next",v)}function t(e){_ms365_step(g,r,j,n,t,"throw",e)}n(undefined)})}}`;

	function isWorkerBlob(parts, options) {
		return (
			Array.isArray(parts) &&
			parts.length === 1 &&
			typeof parts[0] === "string" &&
			options?.type === "text/javascript" &&
			/^\(/.test(parts[0]) &&
			/\)\(\)$/.test(parts[0])
		);
	}

	function buildPrelude(src) {
		let prelude = ESBUILD_RUNTIME;
		// If a Babel-style _asyncToGenerator helper name appears in the body, alias it too.
		const bab = src.match(
			/(_[A-Za-z0-9_]*[Aa]syncToGenerator[A-Za-z0-9_]*)\s*(?:\.default|\["default"\])?\s*\(\s*function\s*\*/,
		);
		if (bab) prelude += BABEL_ASYNC_TO_GEN(bab[1]);
		return prelude;
	}

	globalThis.Blob = function PatchedBlob(parts, options) {
		if (isWorkerBlob(parts, options)) {
			return new OriginalBlob([buildPrelude(parts[0]) + parts[0]], options);
		}
		return new OriginalBlob(parts, options);
	};
	globalThis.Blob.prototype = OriginalBlob.prototype;
})();
