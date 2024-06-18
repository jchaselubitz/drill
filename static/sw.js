self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open('my-cache').then((cache) => {
			return cache.addAll(['/', '/index.html', '/global.css', '/build/bundle.js']);
		})
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		})
	);
});
