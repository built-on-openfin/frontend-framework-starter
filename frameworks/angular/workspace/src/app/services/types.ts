import type OpenFin from "@openfin/core";
import type { App } from "@openfin/workspace";

/**
 * The custom settings stored in the manifest.fin.json.
 */
export interface CustomSettings {
	apps?: App[];
}

/**
 * The platform settings stored in the manifest.fin.json.
 */
export interface PlatformSettings {
	id: string;
	title: string;
	icon: string;
}

export type ManifestWithCustomSettings = OpenFin.Manifest & { customSettings?: CustomSettings };
