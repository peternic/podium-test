const express = require('express');
const Podlet = require('@podium/podlet');

const app = express();

const podlet = new Podlet({
    name: 'myFooterPodlet',
    version: '1.0.0',
    pathname: '/',
    fallback: '/fallback',
    manifest: '/manifest.json',
    content: '/',
    development: process.env.NODE_ENV !== 'production',
});

app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
    res.status(200).podiumSend(`
        <footer style="background-color: lightgray">Footer</footer>
    `);

});

app.get(podlet.manifest(), (req, res) => {
    res.status(200).send(podlet);
});

app.get(podlet.fallback(), (req, res) => {
    res.status(200).podiumSend('<footer>Footer (fallback)</footer>');
});

app.listen(8001);