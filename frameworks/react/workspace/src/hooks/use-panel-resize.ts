import { type OpenFin } from '@openfin/core';
import {
	type BrowserWindowModule,
	getCurrentSync,
	type Page,
	type PanelConfig,
	PanelPosition
} from '@openfin/workspace-platform';
import { useCallback, useEffect, useState } from 'react';

type Options = {
	panelPosition?: PanelPosition;
	collapsedSize?: string | number;
	expandedSize?: string | number;
	defaultExpanded?: boolean;
};

/**
 * Resize a fixed panel in an OpenFin Browser layout
 * @param panelPosition Specify the panel to target - only one panel can be specified per hook
 * @param collapsedSize Collapsed size as string or number, for pixels eg: '300px'
 * @param expandedSize Expanded size as string or number
 * @param defaultExpanded Default expanded state
 */
export const usePanelResize = ({
	panelPosition = PanelPosition.Left,
	collapsedSize = '50px',
	expandedSize = '300px',
	defaultExpanded = false
}: Options): [boolean, (isOpen: boolean) => Promise<void>] => {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);

	const resizePanel = useCallback(
		async (shouldExpand: boolean) => {
			const pageAndPanel = await getPageAndPanel(panelPosition);
			if (!pageAndPanel) {
				return;
			}

			const newDimension =
				panelPosition === PanelPosition.Left || panelPosition === PanelPosition.Right
					? { width: shouldExpand ? expandedSize : collapsedSize }
					: { height: shouldExpand ? expandedSize : collapsedSize };

			const { panels } = pageAndPanel;
			await pageAndPanel.browserWindow.updatePage({
				pageId: pageAndPanel.page.pageId,
				page: {
					panels: panels?.map(
						(panel) =>
							({
								...panel,
								...newDimension
							} as PanelConfig)
					)
				}
			});
			setIsExpanded(shouldExpand);
		},
		[collapsedSize, expandedSize, panelPosition]
	);

	useEffect(() => {
		// Run once on init to set the default state
		resizePanel(defaultExpanded);
	}, [defaultExpanded, resizePanel]);

	return [isExpanded, resizePanel];
};

export async function getPageAndPanel(panelPosition: PanelPosition): Promise<{
	browserWindow: BrowserWindowModule;
	page: Page;
	panels: PanelConfig[];
} | null> {
	if (!fin) {
		return null;
	}

	const platform = getCurrentSync();
	const thisPanel: OpenFin.View = fin.me as OpenFin.View;
	const parentWindow: OpenFin.Window = await thisPanel.getCurrentWindow();
	const browserWindow = platform.Browser.wrapSync(parentWindow.identity);
	if (!browserWindow) {
		return null;
	}

	const pages = await browserWindow.getPages();
	const pageWithPanel = pages
		.filter((page) =>
			page.panels?.find(
				(p) => p.viewOptions.name === thisPanel.identity.name && p.position === panelPosition
			)
		)
		?.at(0);

	return pageWithPanel
		? {
				browserWindow,
				page: pageWithPanel,
				panels: pageWithPanel.panels ?? []
		  }
		: null;
}
