const express = require('express');
const Podlet = require('@podium/podlet');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const port = 8000

const podlet = new Podlet({
    name: 'myNexjsPodlet',
    version: '1.0.0',
    pathname: '/',
    fallback: '/fallback',
    manifest: '/manifest.json',
    content: '/',
    development: process.env.NODE_ENV !== 'production',
});

nextApp.prepare().then(() => {
  const app = express()

  app.use(podlet.middleware());
  app.use('/_next', express.static('./.next'));

  app.get(podlet.manifest(), (req, res) => {
    res.status(200).send(podlet);
    });

app.get(podlet.fallback(), (req, res) => {
    res.status(200).podiumSend('<div>Sad kitten :(</div>');
});
  app.get('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on localhost:${port}`)
  })
})

