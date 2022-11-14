"use strict";
/* eslint-disable object-curly-spacing */
const express = require('express');
const { TransactionsController: TC } = require('./controllers/watchTransactions');
const { MongoDB: Mx } = require('./providers/mongo');
const { connectionX } = require('mongoose');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
let ar = 1;
setInterval(() => {
    ar = ar + 1;
}, 1000);
app.get('/', (req, res) => {
    res.send('Server has been active for ' + ar + ' seconds');
});
app.listen(port, async () => {
    console.log(`Server listening on port ${port}`);
    let transactionsControllerInstance = null;
    await Mx.connect(process.env.MONGODB_DEFAULT_DB || 'blocks', () => {
        transactionsControllerInstance = new TC();
        transactionsControllerInstance.init();
    }, () => {
        transactionsControllerInstance.manageStopFlag(true);
        transactionsControllerInstance = null;
    });
});
