const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./tickets.html",
    "./schedule.html",
    "./assets/css/style.css",
    "./assets/css/bootstrap.css",
    "./assets/css/tickets.css",
    "./dist/app.bundle.js",
    "./dist/events.bundle.js",
    "./dist/tickets.bundle.js",
    "./dist/schedule.bundle.js"
  ];

const APP_PREFIX = "FoodFest-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener("install", function (e) {
	// tells browser to wait for work to complete before terminating service worker
	e.waitUntil(
		// find cache by name and add to files-to-cache
		caches.open(CACHE_NAME).then(function (cache) {
			console.log("installing cache : " + CACHE_NAME);
			return cache.addAll(FILES_TO_CACHE);
		})
	);
});

self.addEventListener("activate", function (e) {
	e.waitUntil(
		caches.keys().then(function (keyList) {
			let cacheKeepList = keyList.filter(function (key) {
				// returns array of cache names -> 'keyList'
				return key.indexOf(APP_PREFIX);
			});
			cacheKeepList.push(CACHE_NAME);

            // returns a promise that resolves when older caches have been deleted
			return Promise.all(
				keyList.map(function (key, i) {
					if (cacheKeepList.indexOf(key) === -1) {
						console.log("deleting cache : " + keyList[i]);
						return caches.delete(keyList[i]);
					}
				})
			);
		})
	);
});

self.addEventListener("fetch", function (e) {
	console.log("fetch request : " + e.request.url);
	// if request is stored in cache, deliver resource
	e.respondWith(
		caches.match(e.request).then(function (request) {
			if (request) {      // if cache respond with cache
				console.log("responding with cache : " + e.request.url);
				return request;
			} else {    // if no cache, try fetching request
				console.log("file is not cached, fetching : " + e.request.url);
				return fetch(e.request);
			}

			// You can omit if/else for console.log & put one line below like this too.
			// return request || fetch(e.request)
		})
	);
});