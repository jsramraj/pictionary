const express = require('express');

const { port } = require('./config');

const app = express();
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Server running at port:${port}`);
});