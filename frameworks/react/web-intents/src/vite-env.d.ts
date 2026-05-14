/// <reference types="vite/client" />

import { type OpenFin } from "@openfin/core";

declare global {
	interface Window {
		fin: OpenFin.Fin<OpenFin.EntityType>;
	}
}
