import type OpenFin from "@openfin/core";

type LayoutManagerConstructor = OpenFin.LayoutManagerConstructor<OpenFin.LayoutSnapshot>;

export function makeOverride() {
	return function layoutManagerOverride(Base: LayoutManagerConstructor): LayoutManagerConstructor {
		return class LayoutManagerOverride
			extends Base
			implements OpenFin.LayoutManager<OpenFin.LayoutSnapshot>
		{
			/**
			 * This application does not demonstrate multiple layouts
			 * See the following for a complete example:
			 * https://github.com/built-on-openfin/web-starter/blob/main/how-to/web-interop-support-context-and-intents/client/src/platform/layout/layout-override.ts
			 */
			constructor() {
				super();
			}
		};
	};
}
