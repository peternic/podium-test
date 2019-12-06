const express = require('express');
const Podlet = require('@podium/podlet');
const React = require('react');
const App = require('./src/App');
const renderToString = require('react-dom/server');

const app = express();

const podlet = new Podlet({
    name: 'myCatsPodlet',
    version: '1.0.0',
    pathname: '/',
    fallback: '/fallback',
    manifest: '/manifest.json',
    content: '/',
    development: process.env.NODE_ENV !== 'production',
});

app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
    console.log(res.locals.podium);
    const { mountOrigin, mountPathname, publicPathname } = res.locals.podium.context;
    const url = new URL(publicPathname, mountOrigin);
    console.log(url.href);

    const appString = renderToString(<App/>);

    res.status(200).podiumSend(`
        <div
            data-mount-origin="${mountOrigin}"
            data-mount-pathname="${mountPathname}"
            data-public-pathname="${publicPathname}"
        >
            ${appString}
        </div>
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
    res.json([
        { name: 'fluffy' },
        { name: 'stuffy' },
    ]);
});

app.listen(7400);