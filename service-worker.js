
// self.addEventListener('fetch', (event) => {
//   event.respondWith(caches.open('cache').then((cache) => {
//     return cache.match(event.request).then((response) => {
//       console.log("cache request: " + event.request.url);
//       var fetchPromise = fetch(event.request).then((networkResponse) => {
//         // if we got a response from the cache, update the cache  
//         console.log("fetch completed: " + event.request.url, networkResponse);
//         if (networkResponse) {
//           console.debug("updated cached page: " + event.request.url, networkResponse);
//           cache.put(event.request, networkResponse.clone());
//         }
//         return networkResponse;
//       }, function (event) {
//         // rejected promise - just ignore it, we're offline!   
//         console.log("Error in fetch()", event);
//         event.waitUntil(
//           // our 'cache' here is named *cache* in the caches.open()
//           caches.open('cache').then((cache) => {
//             return cache.addAll
//               ([
//                 // cache.addAll(), takes a list of URLs, then fetches them from 
//                 // the server and adds the response to the cache
//                 // './bundle.js',
//                 './server.js',
//                 './index.html', // cache index page
//                 './css/style.css', // cache style.css
//                 './app.js', // cache app.js
//                 './img/*', // cache all images
//                 // external url fetch, twitter's as an example
//                 //   'https://platform.twitter.com/widgets.js',
//               ]);
//           }));
//       });
//       // respond from the cache, or the network
//       return response || fetchPromise;
//     });
//   }));
// });

// // always updating i.e latest version available
// self.addEventListener('install', (event) => {
//   self.skipWaiting();
//   console.log("Latest version installed!");
// });
