const express = require('express');
const db = require('../backend/db');

const router = express.Router();

router.post('/api/v1/pedido/:numero/item', (req, res) => {
  const numeroPedido = req.params.numero;
  const { SKU, produto, preco, quantidade } = req.body;

  db.get('SELECT MAX(indice) AS max_indice FROM item_pedido WHERE numero = ?', [numeroPedido], (err, row) => {
    if (err) {
      console.error('Erro ao consultar pedido:', err);
      res.status(500).send('Erro ao consultar o pedido');
    } else if (row) {
      const indice = (row.max_indice || 0) + 1;

      if (!SKU || !produto || !preco || !quantidade) {
        res.status(400).send('Todos os campos são obrigatórios');
        return;
      }

      db.run(
        'INSERT INTO item_pedido (numero, indice, SKU, produto, preco, quantidade) VALUES (?, ?, ?, ?, ?, ?)',
        [numeroPedido, indice, SKU, produto, preco, quantidade],
        function (err) {
          if (err) {
            console.error('Erro ao adicionar item ao pedido:', err);
            res.status(500).send('Erro ao adicionar item ao pedido');
          } else {
            const itemId = this.lastID;
            res.json({ id: itemId, numeroPedido, indice, SKU, produto, preco, quantidade });
          }
        }
      );
    } else {
      res.status(404).send('Pedido e itens não encontrados');
    }
  });
});

router.get('/api/v1/pedido/:numero/item/:indice', (req, res) => {
  const numeroPedido = req.params.numero;
  const indiceItem = req.params.indice;

  db.get('SELECT * FROM item_pedido WHERE numero = ? AND indice = ?', [numeroPedido, indiceItem], (err, row) => {
    if (err) {
      console.error('Erro ao consultar item do pedido:', err);
      res.status(500).send('Erro ao consultar o item do pedido');
    } else if (row) {
      const item = {
        id: row.id,
        numero: row.numero,
        indice: row.indice,
        SKU: row.SKU,
        produto: row.produto,
        preco: row.preco,
        quantidade: row.quantidade
      };
      res.json(item);
    } else {
      res.status(404).send('Item do pedido não encontrado');
    }
  });
});

router.get('/api/v1/pedido/:numero/item/', (req, res) => {
  const numeroPedido = req.params.numero;

  db.all('SELECT * FROM item_pedido WHERE numero = ?', [numeroPedido], (err, rows) => {
    if (err) {
      console.error('Erro ao consultar itens do pedido:', err);
      res.status(500).send('Erro ao consultar os itens do pedido');
    } else {
      const itens = rows.map(row => ({
        id: row.id,
        numero: row.numero,
        indice: row.indice,
        SKU: row.SKU,
        produto: row.produto,
        preco: row.preco,
        quantidade: row.quantidade
      }));
      res.json(itens);
    }
  });
});

router.get('/api/v1/pedido/item', (req, res) => {
  const produto = req.query.produto;

  if (!produto) {
    res.status(400).send('O parâmetro "produto" é obrigatório');
    return;
  }

  const query = `
    SELECT DISTINCT pedido.*
    FROM pedido
    INNER JOIN item_pedido ON pedido.numero = item_pedido.numero
    WHERE item_pedido.produto = ?
  `;

  db.all(query, [produto], (err, rows) => {
    if (err) {
      console.error('Erro ao consultar pedidos por produto:', err);
      res.status(500).send('Erro ao consultar pedidos por produto');
    } else {
      const pedidos = rows.map(row => ({
        id: row.id,
        numero: row.numero,
        cliente: row.cliente,
      }));
      res.json(pedidos);
    }
  });
});


module.exports = router;
