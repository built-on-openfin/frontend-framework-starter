import type { AppIdentifier } from "@finos/fdc3";
import type { OpenFin } from "@openfin/core";

export interface PlatformApp {
	appId: string;
	name: string;
	title?: string;
	description?: string;
	version?: string;
	tooltip?: string;
	type: "web";
	details: WebAppDetails;
	icons?: AppIcon[];
	screenshots?: Screenshot[];
	interop?: AppInterop;
}

interface AppImage {
	src: string;
	size?: string;
	type?: string;
}

export type AppIcon = AppImage;

export interface Screenshot extends AppImage {
	label?: string;
}

export interface WebAppDetails {
	url: string;
}

export interface AppIntents {
	displayName?: string;
	contexts: string[];
	resultType?: string;
}

export interface AppInterop {
	intents?: {
		listensFor?: {
			[key: string]: AppIntents;
		};
	};
}

export type PlatformAppIdentifier = AppIdentifier & OpenFin.Identity;
