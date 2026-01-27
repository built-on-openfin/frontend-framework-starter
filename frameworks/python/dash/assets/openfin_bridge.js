// HERE FDC3 Bridge for Dash
// This file provides client-side JavaScript functions for FDC3 interoperability

window.dashFdc3Listeners = window.dashFdc3Listeners || {
	userChannel: null,
	appChannel: null,
	instanceId: Math.random().toString(36).substring(2, 11),
};

// Initialize FDC3 context listeners
async function initFdc3Listeners() {
	if (!window.fdc3) {
		console.log("FDC3 not available - waiting for fdc3Ready event");
		window.addEventListener("fdc3Ready", initFdc3Listeners);
		return;
	}

	console.log("FDC3 available - initializing listeners");

	// Listen for user channel context
	if (!window.dashFdc3Listeners.userChannel) {
		try {
			window.dashFdc3Listeners.userChannel = await fdc3.addContextListener(
				null,
				(context, metadata) => {
					// Filter out self-broadcasted messages using metadata (FDC3 2.0+) or custom ID
					const isSelf =
						(metadata &&
							metadata.source &&
							metadata.source.instanceId === fdc3.getInfo().instanceId) ||
						(context.metadata &&
							context.metadata.senderId === window.dashFdc3Listeners.instanceId);

					if (isSelf) {
						return;
					}
					console.log("Received FDC3 User Context:", context);
					updateReceivedContext(context, "user");
				},
			);
			console.log("User channel listener registered");
		} catch (e) {
			console.error("Error adding user context listener:", e);
		}
	}

	// Listen for app channel context
	if (!window.dashFdc3Listeners.appChannel) {
		try {
			const appChannel = await fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL"); // Use any shared channel name appropriate for your app
			window.dashFdc3Listeners.appChannel = await appChannel.addContextListener(
				null,
				(context, metadata) => {
					// Filter out self-broadcasted messages using metadata (FDC3 2.0+) or custom ID
					const isSelf =
						(metadata &&
							metadata.source &&
							metadata.source.instanceId === fdc3.getInfo().instanceId) ||
						(context.metadata &&
							context.metadata.senderId === window.dashFdc3Listeners.instanceId);

					if (isSelf) {
						return;
					}
					console.log("Received FDC3 App Context:", context);
					updateReceivedContext(context, "app");
				},
			);
			console.log("App channel listener registered");
		} catch (e) {
			console.error("Error adding app channel context listener:", e);
		}
	}
}

// Update the received context display
function updateReceivedContext(context) {
	const contextDisplay = document.getElementById("context-display");
	if (!contextDisplay) return;

	// Create a clean copy for display (remove internal metadata)
	const displayContext = { ...context };
	delete displayContext.metadata;
	contextDisplay.textContent = JSON.stringify(displayContext, null, 2);
}

// Broadcast FDC3 User Context (MSFT)
async function broadcastFdc3UserContext() {
	if (!window.fdc3) {
		console.error("FDC3 is not available");
		alert("FDC3 is not available. Please run this app in an HERE container.");
		return;
	}

	try {
		const context = {
			type: "fdc3.instrument",
			name: "Microsoft Corporation",
			id: { ticker: "MSFT" },
			metadata: { senderId: window.dashFdc3Listeners.instanceId },
		};
		await fdc3.broadcast(context);
		console.log("Broadcasted FDC3 User Context: MSFT");
	} catch (e) {
		console.error("Error broadcasting user context:", e);
	}
}

// Broadcast FDC3 App Context (AAPL) via custom app channel
async function broadcastFdc3AppContext() {
	if (!window.fdc3) {
		console.error("FDC3 is not available");
		alert("FDC3 is not available. Please run this app in an HERE container.");
		return;
	}

	try {
		const context = {
			type: "fdc3.instrument",
			name: "Apple Inc.",
			id: { ticker: "AAPL" },
			metadata: { senderId: window.dashFdc3Listeners.instanceId },
		};
		const appChannel = await fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");
		await appChannel.broadcast(context);
		console.log("Broadcasted FDC3 App Context: AAPL");
	} catch (e) {
		console.error("Error broadcasting app context:", e);
	}
}

// Clear the context display
function clearContextDisplay() {
	const contextDisplay = document.getElementById("context-display");
	if (contextDisplay) contextDisplay.textContent = "";
}

// Initialize listeners when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initFdc3Listeners);
} else {
	initFdc3Listeners();
}

// Expose functions globally for Dash clientside callbacks
window.dash_clientside = window.dash_clientside || {};
window.dash_clientside.openfin = {
	broadcastUserContext: function (n_clicks) {
		if (n_clicks > 0) broadcastFdc3UserContext();
		return window.dash_clientside.no_update;
	},
	broadcastAppContext: function (n_clicks) {
		if (n_clicks > 0) broadcastFdc3AppContext();
		return window.dash_clientside.no_update;
	},
	clearContext: function (n_clicks) {
		if (n_clicks > 0) clearContextDisplay();
		return window.dash_clientside.no_update;
	},
};
