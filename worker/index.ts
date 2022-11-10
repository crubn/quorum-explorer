/* eslint-disable object-curly-spacing */
const express = require('express');
const { TransactionsController: TC } =
  require('./controllers/watchTransactions');
const { MongoDB: Mx } = require('./providers/mongo');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

let ar = 1;
setInterval(() => {
  ar = ar + 1;
}, 1000);

const transactionsControllerInstance = new TC();
transactionsControllerInstance.init();

app.get('/', (req: any, res: any) => {
  res.send('Hello World!:' + ar);
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  await Mx.connect(process.env.MONGODB_DEFAULT_DB || 'blocks');
});
