import { type PlatformLayoutSnapshot } from "../shapes/layout-shapes.ts";

type TabsProps = {
	layout: PlatformLayoutSnapshot | null;
	onTabClick: (key: string) => void;
};

export function Tabs({ layout, onTabClick }: TabsProps) {
	if (!layout) return null;

	const handleTabClick = (key: string) => {
		console.log("Click tab", key);
		onTabClick(key);
	};

	return (
		<ul>
			{Object.entries(layout.layoutTitles).map(([key, value]) => (
				<li key={key} onClick={() => handleTabClick(key)}>
					{value}
				</li>
			))}
		</ul>
	);
}
