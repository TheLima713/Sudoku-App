const statCacheName = 'sudoku-cache'
const assets = [
    '/',
    '/index.html',
    '/js/script.js',
    '/css/styles.css',
    '/img/sudoku1.png',
    '/img/sudoku2.png',
    '/img/sudoku3.png',
    '/img/sudoku4.png',
    '/img/sudoku5.png',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;700&display=swap'
]

/*self.addEventListener('install',e=>{
    e.waitUntil(
        caches.open(statCacheName)
        .then(cache =>{
            console.log('caching shell assets...')
            cache.addAll(assets)
        })
    )
})

self.addEventListener('fetch',e=>{
    e.respondWith(
        caches.match(e.request).then(cacheRes=>{
            return /*cacheRes || *//*fetch(e.request)
        })
    )
})*/