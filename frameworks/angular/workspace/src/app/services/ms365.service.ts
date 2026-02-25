import { Injectable } from "@angular/core";
import { connect, Microsoft365Connection } from "@openfin/microsoft365";
import * as Graph from "@microsoft/microsoft-graph-types";

@Injectable({ providedIn: "root" })
export class Ms365Service {
	private ms365Connection: Microsoft365Connection | null = null;

	async connect(): Promise<void> {
		//
		// TODO: add your keys
		const clientId = "REGISTERED_APP_CLIENT_ID";
		const tenantId = "REGISTERED_APP_TENANT_ID";
		const redirectUri = "REGISTERED_APP_REDIRECT_URI";

		try {
			this.ms365Connection = await connect(clientId, tenantId, redirectUri);
			console.log("Connected as", this.ms365Connection.currentUser.displayName);
		} catch (e: unknown) {
			console.error(e instanceof Error ? e.message : "Failed to connect to Microsoft 365.");
		}
	}

	async searchPeople(query: string): Promise<Graph.User[]> {
		if (!this.ms365Connection) {
			return [];
		}

		try {
			const response = await this.ms365Connection.executeApiRequest<{ value: Graph.User[] }>(
				`/v1.0/users?$search="displayName:${query}"&$select=id,displayName,mail,jobTitle`,
				{
					headers: {
						ConsistencyLevel: "eventual",
					},
				},
			);
			return response?.data?.value ?? [];
		} catch (e: unknown) {
			console.error(e instanceof Error ? e.message : "Failed to search people.");
			return [];
		}
	}

	disconnect(): void {
		this.ms365Connection?.disconnect();
		this.ms365Connection = null;
	}
}
