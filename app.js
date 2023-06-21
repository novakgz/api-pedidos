const express = require('express');
const cors = require('cors');
const app = express();
const produtoRoutes = require('./api/produtoApi');
const pedidoRoutes = require('./api/pedidoApi');

app.use(cors());

app.use(express.json());
app.use(produtoRoutes);
app.use(pedidoRoutes);

app.listen(3000, () => {
  console.log('Servidor Express em execução na porta 3000');
});
