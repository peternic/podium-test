const express = require('express');
const Layout = require('@podium/layout');

const app = express();

const layout = new Layout({
    name: 'myLayout', // required
    pathname: '/demo', // required
});

const podletCats = layout.client.register({
    name: 'Cats', // required
    uri: 'http://localhost:7100/manifest.json', // required
});
const podletDogs = layout.client.register({
    name: 'Dogs', // required
    uri: 'http://localhost:7200/manifest.json', // required
});

app.use(layout.middleware());

app.get('/demo', async (req, res) => {
    const incoming = res.locals.podium;
    const [cats, dogs] = await Promise.all([
        podletCats.fetch(incoming),
        podletDogs.fetch(incoming),
    ]); 

    incoming.view.title = 'My Super Page';
    res.podiumSend(`
        <section>Cats: ${cats.content}</section>
        <section>Dogs: ${dogs.content}</section>
    `);
});

app.listen(7000);