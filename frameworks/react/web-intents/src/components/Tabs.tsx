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
		<div className="bg-gray-900 text-white p-1">
			<div className="flex space-x-2 gap-1">
				{Object.entries(layout.layoutTitles).map(([key, value]) => (
					<div
						key={key}
						onClick={() => handleTabClick(key)}
						className="px-4 py-2 cursor-pointer rounded-t-lg text-xs"
					>
						{value}
					</div>
				))}
			</div>
		</div>
	);
}
