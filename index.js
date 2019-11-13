const express = require('express');
const Podlet = require('@podium/podlet');

const app = express();

const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    fallback: '/fallback',
    manifest: '/manifest.,json',
    content: '/',
    development: process.env.NODE_ENV !== 'production',
});

app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
    const { mountOrigin, mountPathname, publicPathname } = res.locals.podium.context;
    res.status(200).podiumSend(`
        <div
            id="app"
            data-mount-origin="${mountOrigin}"
            data-mount-pathname="${mountPathname}"
            data-public-pathname="${publicPathname}"
        >
            This is the podlet's HTML content
        </div>
    `);
});

app.get(podlet.manifest(), (req, res) => {
    res.status(200).send(podlet);
});

app.get(podlet.fallback(), (req, res) => {
    res.status(200).podiumSend('<div>Sad kitten :(</div>');
});

app.listen(7100);