let cacheStaticName = 'restaurant-static-v3'
let cacheUrls = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg'
];

// Installation of service worker
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(cacheStaticName).then(function (cache) {
            return cache.addAll(cacheUrls)
        })
    );
});   



// Activation of service worker
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('restaurant-') &&
                        cacheName != cacheStaticName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});


// Fetching for offline content viewing
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function(respons) {
            if (respons) return respons;
            return fetch(event.request).then(function(response) {
                response.clone();
                caches.open(cacheStaticName).then(function(cache) {
                    cache.put(event.request, responseClone)
                });
                return response;
            })
        })
    )
});

