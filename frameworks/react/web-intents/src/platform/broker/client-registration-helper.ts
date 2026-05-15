import type OpenFin from "@openfin/core";
import type {
	BrokerClientConnection,
	IntentRegistrationEntry,
	IntentRegistrationPayload,
} from "../../shapes/interopbroker-shapes";
import type { Logger } from "../../shapes/logger-shapes";
import { isEmpty } from "../helpers/utils";
import { RESOLVE_ERROR as ResolveError } from "./fdc3-errors";

/**
 * Tracks clients that connect to the broker and register intent listeners.
 */
export class ClientRegistrationHelper {
	private readonly _logger: Logger;

	private readonly _lookupAppId: (clientIdentity: OpenFin.ClientIdentity) => Promise<string | undefined>;

	private readonly _clientReadyRequests: { [key: string]: (instanceId: string) => void };

	private readonly _trackedClientConnections: { [key: string]: BrokerClientConnection };

	private readonly _trackedIntentHandlers: { [key: string]: IntentRegistrationEntry[] };

	constructor(
		lookupAppId: (clientIdentity: OpenFin.ClientIdentity) => Promise<string | undefined>,
		logger: Logger,
	) {
		this._logger = logger;
		this._lookupAppId = lookupAppId;
		this._clientReadyRequests = {};
		this._trackedClientConnections = {};
		this._trackedIntentHandlers = {};
	}

	public async clientDisconnected(clientIdentity: OpenFin.ClientIdentity): Promise<void> {
		this._logger.info("Client disconnected.", clientIdentity);

		for (const [intentName, handlers] of Object.entries(this._trackedIntentHandlers)) {
			this._trackedIntentHandlers[intentName] = handlers.filter(
				(entry) => entry.clientIdentity.endpointId !== clientIdentity.endpointId,
			);
		}

		const key = this.getClientKey(clientIdentity);
		delete this._trackedClientConnections[key];
	}

	public async intentHandlerRegistered(
		payload: IntentRegistrationPayload,
		clientIdentity: OpenFin.ClientIdentity,
	): Promise<void> {
		if (isEmpty(payload)) {
			return;
		}

		const intentName = payload.handlerId.replace("intent-handler-", "");
		const appId = await this._lookupAppId(clientIdentity);
		if (isEmpty(appId)) {
			this._logger.warn(
				"Unable to determine app id. This intent handler registration will not be tracked.",
			);
			return;
		}

		const trackedHandlers = this._trackedIntentHandlers[intentName] ?? [];
		this._trackedIntentHandlers[intentName] = trackedHandlers;

		const alreadyTracked = trackedHandlers.some(
			(entry) => entry.clientIdentity.endpointId === clientIdentity.endpointId,
		);
		if (!alreadyTracked) {
			trackedHandlers.push({
				fdc3Version: payload.fdc3Version,
				clientIdentity,
				appId,
			});
		}

		const clientReadyKey = this.getClientReadyKey(clientIdentity, "intent", intentName);
		this._clientReadyRequests[clientReadyKey]?.(clientIdentity.endpointId);
	}

	public async clientConnectionRegistered(clientIdentity: OpenFin.ClientIdentity): Promise<void> {
		const key = this.getClientKey(clientIdentity);
		if (!isEmpty(this._trackedClientConnections[key])) {
			return;
		}

		this._trackedClientConnections[key] = {
			clientIdentity,
		};
	}

	public async onIntentClientReady(
		identity: OpenFin.Identity,
		intentName: string,
		timeout: number = 15000,
	): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const registeredHandlers = this._trackedIntentHandlers[intentName];
			const existingHandler = registeredHandlers?.find(
				(handler) =>
					handler.clientIdentity.uuid === identity.uuid &&
					handler.clientIdentity.name === identity.name,
			);

			if (!isEmpty(existingHandler)) {
				resolve(existingHandler.clientIdentity.endpointId);
				return;
			}

			const key = this.getClientReadyKey(identity, "intent", intentName);
			const timerId = setTimeout(() => {
				if (!isEmpty(this._clientReadyRequests[key])) {
					delete this._clientReadyRequests[key];
					reject(new Error(ResolveError.IntentDeliveryFailed));
				}
			}, timeout);

			this._clientReadyRequests[key] = (instanceId: string): void => {
				clearTimeout(timerId);
				delete this._clientReadyRequests[key];
				resolve(instanceId);
			};
		});
	}

	private getClientKey(identity: OpenFin.Identity): string {
		return `${identity.uuid}-${identity.name}`;
	}

	private getClientReadyKey(identity: OpenFin.Identity, type: "intent", name: string): string {
		return `${identity.uuid}/${identity.name}/${type}/${name}`;
	}
}
