const express = require('express');
const path = require('path');
const compression = require('compression');

process.on('SIGTERM', () => process.exit());

const PORT = process.env.PORT || 5000;
const app = express();
app.use(compression());

app.use('/', express.static('dist'));

app.listen(PORT);
