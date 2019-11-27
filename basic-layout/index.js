const express = require('express');
const Layout = require('@podium/layout');

const app = express();

const layout = new Layout({
    name: 'myLayout', // required
    pathname: '/demo', // required
});