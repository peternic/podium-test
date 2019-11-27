const express = require('express');
const Podlet = require('@podium/podlet');

const app = express();

const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    fallback: '/fallback',
    manifest: '/manifest.json',
    content: '/',
    development: process.env.NODE_ENV !== 'production',
});

app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
    const { mountOrigin, mountPathname, publicPathname } = res.locals.podium.context;
    const url = new URL(publicPathname, mountOrigin);
    console.log(url.href);
    res.status(200).podiumSend(`
        <div
            id="app"
            data-mount-origin="${mountOrigin}"
            data-mount-pathname="${mountPathname}"
            data-public-pathname="${publicPathname}"
        >
            <div id="content"/>
        </div>
        <script>
            fetch('${url.href + '/api/cats'}')
                .then((response) => response.text())
                .then(content => {
                    const el = document.getElementById('content');
                    el.innerHTML = content;
                });
        </script>
    `);

});

app.get(podlet.manifest(), (req, res) => {
    res.status(200).send(podlet);
});

app.get(podlet.fallback(), (req, res) => {
    res.status(200).podiumSend('<div>Sad kitten :(</div>');
});

podlet.proxy({ target: '/api', name: 'api' });

app.get('/api/cats', (req, res) => {
    res.json([{ name: 'fluffy' }]);
});

app.listen(7100);