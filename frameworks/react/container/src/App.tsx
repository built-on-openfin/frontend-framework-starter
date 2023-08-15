import React from 'react';
import logo from './logo.svg';

function App() {
	return (
		<div className="col fill gap20">
			<header className="row spread middle">
				<div className="col">
					<h1>OpenFin React</h1>
					<h1 className="tag">Example demonstrating running a react app in an OpenFin container</h1>
				</div>
				<div className="row middle gap10">
					<img src={logo} alt="OpenFin" height="40px" />
				</div>
			</header>
			<main className="col gap10">
				<p>To launch this application in the OpenFin container, run the following command:</p>
				<pre>npm run client</pre>
			</main>
		</div>
	);
}

export default App;
