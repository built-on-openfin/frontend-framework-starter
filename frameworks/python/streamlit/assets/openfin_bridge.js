// HERE FDC3 Bridge for Streamlit
// This file provides client-side JavaScript functions for FDC3 interoperability

window.streamlitFdc3Listeners = window.streamlitFdc3Listeners || {
	userChannel: null,
	appChannel: null,
	instanceId: Math.random().toString(36).substring(2, 11),
};

async function initFdc3Listeners() {
	if (!window.fdc3) {
		console.log("FDC3 not available - waiting for fdc3Ready event");
		window.addEventListener("fdc3Ready", initFdc3Listeners);
		return;
	}

	console.log("FDC3 available - initializing listeners");

	if (!window.streamlitFdc3Listeners.userChannel) {
		try {
			window.streamlitFdc3Listeners.userChannel = await fdc3.addContextListener(
				null,
				(context, metadata) => {
					// Filter out self-broadcasted messages using metadata (FDC3 2.0+) or custom ID
					const isSelf =
						(metadata &&
							metadata.source &&
							metadata.source.instanceId === fdc3.getInfo().instanceId) ||
						(context.metadata &&
							context.metadata.senderId === window.streamlitFdc3Listeners.instanceId);

					if (isSelf) {
						return;
					}
					console.log("Received FDC3 User Context:", context);
					updateReceivedContext(context);
				},
			);
			console.log("User channel listener registered");
		} catch (e) {
			console.error("Error adding user context listener:", e);
		}
	}

	// Listen for app channel context
	if (!window.streamlitFdc3Listeners.appChannel) {
		try {
			const appChannel = await fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");
			window.streamlitFdc3Listeners.appChannel = await appChannel.addContextListener(
				null,
				(context, metadata) => {
					// Filter out self-broadcasted messages using metadata (FDC3 2.0+) or custom ID
					const isSelf =
						(metadata &&
							metadata.source &&
							metadata.source.instanceId === fdc3.getInfo().instanceId) ||
						(context.metadata &&
							context.metadata.senderId === window.streamlitFdc3Listeners.instanceId);

					if (isSelf) {
						return;
					}
					console.log("Received FDC3 App Context:", context);
					updateReceivedContext(context);
				},
			);
			console.log("App channel listener registered");
		} catch (e) {
			console.error("Error adding app channel context listener:", e);
		}
	}
}

function updateReceivedContext(context) {
	let contextDisplay = document.getElementById("context-display");

	if (!contextDisplay) {
		const iframes = document.querySelectorAll("iframe");
		for (const iframe of iframes) {
			try {
				const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
				contextDisplay = iframeDoc.getElementById("context-display");
				if (contextDisplay) break;
			} catch (e) {
				// Cross-origin iframe, skip
			}
		}
	}

	if (contextDisplay) {
		const displayContext = { ...context };
		delete displayContext.metadata;
		contextDisplay.textContent = JSON.stringify(displayContext, null, 2);
	}
}

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
			id: {
				ticker: "MSFT",
			},
			metadata: {
				senderId: window.streamlitFdc3Listeners.instanceId,
			},
		};
		await fdc3.broadcast(context);
		console.log("Broadcasted FDC3 User Context: MSFT");
	} catch (e) {
		console.error("Error broadcasting user context:", e);
	}
}

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
			id: {
				ticker: "AAPL",
			},
			metadata: {
				senderId: window.streamlitFdc3Listeners.instanceId,
			},
		};
		const appChannel = await fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");
		await appChannel.broadcast(context);
		console.log("Broadcasted FDC3 App Context: AAPL");
	} catch (e) {
		console.error("Error broadcasting app context:", e);
	}
}

function clearContextDisplay() {
	let contextDisplay = document.getElementById("context-display");

	if (!contextDisplay) {
		const iframes = document.querySelectorAll("iframe");
		for (const iframe of iframes) {
			try {
				const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
				contextDisplay = iframeDoc.getElementById("context-display");
				if (contextDisplay) break;
			} catch (e) {
				// Cross-origin iframe, skip
			}
		}
	}

	if (contextDisplay) {
		contextDisplay.textContent = "";
	}
}

window.broadcastFdc3UserContext = broadcastFdc3UserContext;
window.broadcastFdc3AppContext = broadcastFdc3AppContext;
window.clearContextDisplay = clearContextDisplay;

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => {
		initFdc3Listeners();
	});
} else {
	initFdc3Listeners();
}
