const statCacheName = 'site-static'
const assets = [
    '/',
    '/index.html',
    '/js/script.js',
    '/css/styles.css',
    '/img/notes2.png',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;700&display=swap'
]

self.addEventListener('install',e=>{
    e.waitUntil(
        caches.open(statCacheName)
        .then(cache =>{
            console.log('caching shell assets...')
            cache.addAll(assets)
        })
    )
})