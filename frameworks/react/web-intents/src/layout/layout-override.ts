import { type LayoutManager, type LayoutManagerConstructor } from '../shapes/layout-shapes';

export function makeOverride() {
	return function layoutManagerOverride(Base: LayoutManagerConstructor): LayoutManagerConstructor {
		return class LayoutManagerOverride extends Base implements LayoutManager {};
	};
}
