import OpenFin from "@openfin/core";
import type { App } from "@openfin/workspace";

/**
 * The custom settings stored in the manifest.fin.json.
 */
export type CustomSettings = {
	apps?: App[];
};

/**
 * The platform settings stored in the manifest.fin.json.
 */
export type PlatformSettings = {
	id: string;
	title: string;
	icon: string;
};

export type ManifestWithCustomSettings = OpenFin.Manifest & { customSettings?: CustomSettings };
