self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
  // Activate worker immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  // Claim any clients immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
});

self.addEventListener("sync", (event) => {
  console.log("Service Worker: sync event triggered", event);
});
