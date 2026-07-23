// Minimal service worker — exists only to make the app installable
// ("Add to Home Screen"). Intentionally NO offline caching (see SPEC/CLAUDE):
// the fetch handler is a pass-through so every request goes to the network.
self.addEventListener("install", () => self.skipWaiting())
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()))
self.addEventListener("fetch", () => {
  // no-op: do not call respondWith, so the browser fetches from network as usual
})
