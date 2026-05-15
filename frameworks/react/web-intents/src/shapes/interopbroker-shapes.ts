import type { OpenFin } from "@openfin/core";

export interface IntentRegistrationPayload {
	fdc3Version: string;
	handlerId: string;
}

export interface IntentRegistrationEntry {
	fdc3Version: string;
	clientIdentity: OpenFin.ClientIdentity;
	appId?: string;
}

export interface BrokerClientConnection {
	clientIdentity: OpenFin.ClientIdentity;
}

export interface IntentOptions {
	/**
	 * How long the broker waits after launching a view for it to register an intent handler.
	 */
	intentTimeout?: number;
}

export interface PlatformInteropBrokerOptions {
	intentOptions?: IntentOptions;
}
