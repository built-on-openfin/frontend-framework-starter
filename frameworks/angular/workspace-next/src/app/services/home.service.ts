import { Injectable } from "@angular/core";
import {
	Home,
	HomeProvider,
	HomeSearchListenerRequest,
	HomeSearchListenerResponse,
} from "@openfin/workspace";
import { PlatformSettings } from "./types";

@Injectable({ providedIn: "root" })
export class HomeService {
	async register(platformSettings: PlatformSettings) {
		console.log("Initializing the Home provider");

		const homeProvider: HomeProvider = {
			...platformSettings,
			onUserInput: async (request: HomeSearchListenerRequest, response: HomeSearchListenerResponse) => {
				// Here you decide what to do with the user input
				// In this example we simulate an asynchronous lookup and return results via the response param

				const queryLower = request.query.toLowerCase();
				console.log(queryLower);

				// Async results
				response.respond([]);

				// Immediate results
				return {
					results: [],
				};
			},
		};

		await Home.register(homeProvider);
	}

	show() {
		Home.show();
	}
}
