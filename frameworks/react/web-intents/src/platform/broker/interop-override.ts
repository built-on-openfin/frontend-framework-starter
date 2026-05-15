import type { AppIdentifier, AppMetadata, ImplementationMetadata, IntentResolution } from "@finos/fdc3";
import type { OpenFin } from "@openfin/core";
import type { PlatformApp, PlatformAppIdentifier } from "../../shapes/app-shapes";
import type {
	IntentRegistrationPayload,
	PlatformInteropBrokerOptions,
} from "../../shapes/interopbroker-shapes";
import { getApp, getApps, launch } from "../apps/apps";
import { isEmpty } from "../helpers/utils";
import { AppIdHelper } from "./app-id-helper";
import { AppIntentHelper } from "./app-intent-helper";
import { mapToAppMetaData } from "./app-meta-data-helper";
import { ClientRegistrationHelper } from "./client-registration-helper";
import { RESOLVE_ERROR as ResolveError } from "./fdc3-errors";

/**
 * Get the override constructor for the interop broker.
 * @param options The options for the platform interop broker.
 * @returns The override constructor to be used by OpenFin core-web.
 */
async function constructorOverride(
	options: PlatformInteropBrokerOptions,
): Promise<OpenFin.ConstructorOverride<OpenFin.InteropBroker>> {
	const logger = console;

	return (Base: OpenFin.Constructor<OpenFin.InteropBroker>) =>
		class InteropOverride extends Base {
			private readonly _appIntentHelper: AppIntentHelper;

			private readonly _appIdHelper: AppIdHelper;

			private readonly _clientRegistrationHelper: ClientRegistrationHelper;

			constructor() {
				super();
				this._appIntentHelper = new AppIntentHelper(getApps, logger);
				this._appIdHelper = new AppIdHelper(getApp, logger);
				this._clientRegistrationHelper = new ClientRegistrationHelper(
					async (clientIdentity: OpenFin.ClientIdentity) =>
						this._appIdHelper.lookupAppId(clientIdentity),
					logger,
				);
			}

			public async isConnectionAuthorized(
				id: OpenFin.ClientIdentity,
				payload?: unknown,
			): Promise<boolean> {
				await this._clientRegistrationHelper.clientConnectionRegistered(id);
				return super.isConnectionAuthorized(id, payload);
			}

			public async handleFiredIntent(
				intent: OpenFin.Intent,
				clientIdentity: OpenFin.ClientIdentity,
			): Promise<Omit<IntentResolution, "getResult"> | { source: string; version?: string }> {
				logger.info("Received request for a raised intent", intent, clientIdentity);

				const targetApp = await this._appIntentHelper.findFirstAppForIntent(
					intent.name,
					intent.context?.type,
				);

				if (isEmpty(targetApp)) {
					throw new Error(ResolveError.NoAppsFound);
				}

				return this.launchAppWithIntent(targetApp, intent);
			}

			public async clientDisconnected(clientIdentity: OpenFin.ClientIdentity): Promise<void> {
				await this._clientRegistrationHelper.clientDisconnected(clientIdentity);
				await super.clientDisconnected(clientIdentity);
			}

			public async fdc3HandleGetAppMetadata(
				app: AppIdentifier,
				clientIdentity: OpenFin.ClientIdentity,
			): Promise<AppMetadata> {
				logger.info("fdc3HandleGetAppMetadata call received.", app, clientIdentity);
				const platformApp = await getApp(app.appId);
				if (!isEmpty(platformApp)) {
					return mapToAppMetaData(platformApp);
				}
				throw new Error(ResolveError.TargetAppUnavailable);
			}

			public async fdc3HandleGetInfo(
				payload: { fdc3Version: string },
				clientIdentity: OpenFin.ClientIdentity,
			): Promise<unknown> {
				if (payload?.fdc3Version !== "2.0") {
					return super.fdc3HandleGetInfo(payload, clientIdentity);
				}

				const response = (await super.fdc3HandleGetInfo(
					payload,
					clientIdentity,
				)) as ImplementationMetadata;
				const appId = await this._appIdHelper.lookupAppId(clientIdentity);
				if (isEmpty(appId)) {
					return response;
				}

				return {
					...response,
					appMetadata: { appId, instanceId: clientIdentity.endpointId },
				};
			}

			public async intentHandlerRegistered(
				payload: IntentRegistrationPayload,
				clientIdentity: OpenFin.ClientIdentity,
			): Promise<void> {
				await this._clientRegistrationHelper.intentHandlerRegistered(payload, clientIdentity);
				await super.intentHandlerRegistered(payload, clientIdentity);
			}

			private async launchAppWithIntent(
				app: PlatformApp,
				intent: OpenFin.Intent,
			): Promise<Omit<IntentResolution, "getResult">> {
				const platformIdentities = await launch(app);

				if (isEmpty(platformIdentities) || platformIdentities.length === 0) {
					throw new Error(ResolveError.IntentDeliveryFailed);
				}

				const target = platformIdentities[0];
				let instanceId: string;

				try {
					instanceId = await this._clientRegistrationHelper.onIntentClientReady(
						target,
						intent.name,
						options.intentOptions?.intentTimeout ?? 15000,
					);
				} catch (intentReadyError) {
					logger.warn("Unable to find a registered intent handler for the launched app.", {
						appId: app.appId,
						intentName: intent.name,
						error: intentReadyError,
					});
					throw new Error(ResolveError.IntentDeliveryFailed);
				}

				const intentTarget: PlatformAppIdentifier = {
					...target,
					instanceId,
				};
				await super.setIntentTarget(intent, intentTarget);

				return {
					source: { appId: app.appId, instanceId },
					version: app.version,
					intent: intent.name,
				};
			}
		};
}

/**
 * Get the override constructor for the interop broker.
 * @param options The options for the broker.
 * @returns The override constructor to be used by OpenFin core-web.
 */
export async function getConstructorOverride(
	options: PlatformInteropBrokerOptions,
): Promise<OpenFin.ConstructorOverride<OpenFin.InteropBroker>> {
	return constructorOverride(options);
}
