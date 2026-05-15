import type { PlatformApp, PlatformAppIdentifier } from "../../shapes/app-shapes";
import type { PlatformLayoutSnapshot } from "../../shapes/layout-shapes";
import { isEmpty, randomUUID } from "../helpers/utils";

let cachedApps: PlatformApp[] | undefined;

/**
 * The app by its id.
 * @param appId The id of the requested app.
 * @returns The app if it was found.
 */
export async function getApp(appId: string): Promise<PlatformApp | undefined> {
	const apps = await getApps();
	return apps.find((app) => app.appId === appId || (app.type === "web" && app.details.url === appId));
}

/**
 * Get the list of applications and filter if requested.
 * @returns The list of application.
 */
export async function getApps(): Promise<PlatformApp[]> {
	if (cachedApps) {
		return cachedApps;
	}

	// For simplicity loading a named apps.json file. A more flexible solution could load an array of app configs from a settings file.
	const response = await fetch("/apps.json");
	const data = (await response.json()) as { applications: PlatformApp[] };
	cachedApps = data?.applications;
	return cachedApps ?? [];
}

/**
 * Launch an application in the way specified by its manifest type.
 * @param platformApp The application to launch or it's id.
 * @param target The target layout to launch the app in.
 * @param target.layout target the current layout
 * @returns Identifiers specific to the type of application launched.
 */
export async function launch(
	platformApp: PlatformApp | string,
	target?: { layout: boolean },
): Promise<PlatformAppIdentifier[] | undefined> {
	try {
		let appToLaunch: PlatformApp | undefined;
		if (typeof platformApp === "string") {
			appToLaunch = await getApp(platformApp);
		} else {
			appToLaunch = platformApp;
		}
		if (!appToLaunch) {
			return undefined;
		}

		const name = `${appToLaunch.appId}/${randomUUID()}`;
		const uuid = fin.me.identity.uuid;
		const appId = appToLaunch.appId;
		const title = appToLaunch.title;

		await fin?.Platform.Layout.getCurrentSync().addView({
			name,
			url: appToLaunch.details.url,
			titlePriority: "options",
			title,
		});
		return [{ name, uuid, appId }];
	} catch (error) {
		console.error("Error launching app", error);
		return undefined;
	}
}

/**
 * Brings the targeted app to front.
 * @param platformApp The app to bring to front.
 * @param targets The list of apps to bring to front.
 */
export async function bringAppToFront(
	// @ts-expect-error Unused
	platformApp: PlatformApp,
	targets: PlatformAppIdentifier[],
): Promise<void> {
	const currentLayout = fin?.Platform.Layout.getCurrentLayoutManagerSync();
	if (!isEmpty(currentLayout)) {
		for (const target of targets) {
			const targetLayout = currentLayout.getLayoutIdentityForView(target);
			if (targetLayout === undefined) {
				console.error("Target layout for view not found");
			} else {
				await currentLayout.showLayout(targetLayout);
			}
		}
	}
}

/**
 * Get the layout for the application.
 * @param platformApp The application to get the layout for.
 * @param layoutId The id of the layout to create for the app.
 * @param viewName The name of the view to create.
 * @param title Preferred title for the new tab, or otherwise will use document.title
 * @returns The layout options.
 */
function getAppLayout(
	platformApp: PlatformApp,
	layoutId: string,
	viewName: string,
	title: string | undefined,
): PlatformLayoutSnapshot {
	const appSnapshot: PlatformLayoutSnapshot = {
		layouts: {},
		layoutTitles: {},
	};
	appSnapshot.layouts[layoutId] = {
		content: [
			{
				type: "row",
				content: [
					{
						type: "column",
						width: 100,
						content: [
							{
								type: "stack",
								width: 50,
								height: 50,
								content: [
									{
										type: "component",
										componentName: "view",
										componentState: {
											url: platformApp.details.url,
											name: viewName,
											titlePriority: "options",
										},
										title,
									},
								],
							},
						],
					},
				],
			},
		],
	};
	appSnapshot.layoutTitles[layoutId] = platformApp.title ?? "App Layout";
	return appSnapshot;
}
