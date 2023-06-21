const express = require('express');
const db = require('../backend/db');

const router = express.Router();

router.post('/api/v1/pedido', (req, res) => {
  const { numero, cliente } = req.body;

  db.get('SELECT * FROM pedido WHERE numero = ?', [numero], (err, row) => {
    if (err) {
      console.error('Erro ao consultar pedido:', err);
      res.status(500).send('Erro ao criar o pedido');
    } else if (row) {
      res.status(400).send('Número de pedido já existe');
    } else {
      if (!cliente) {
        res.status(400).send('O campo "cliente" é obrigatório');
        return;
      }

      db.run('INSERT INTO pedido (numero, cliente) VALUES (?, ?)', [numero, cliente], function(err) {
        if (err) {
          console.error('Erro ao inserir pedido:', err);
          res.status(500).send('Erro ao criar o pedido');
        } else {
          const pedidoId = this.lastID;
          res.json({ id: pedidoId, numero, cliente });
        }
      });
    }
  });
});

router.get('/api/v1/pedido/:numero', (req, res) => {
  const numeroPedido = req.params.numero;

  db.get('SELECT * FROM pedido WHERE numero = ?', [numeroPedido], (err, row) => {
    if (err) {
      console.error('Erro ao consultar pedido:', err);
      res.status(500).send('Erro ao consultar o pedido');
    } else if (row) {
      const pedido = {
        id: row.id,
        numero: row.numero,
        cliente: row.cliente
      };
      res.json(pedido);
    } else {
      res.status(404).send('Número de pedido não encontrado');
    }
  });
});

router.get('/api/v1/pedido/', (req, res) => {
  db.all('SELECT * FROM pedido', (err, rows) => {
    if (err) {
      console.error('Erro ao consultar pedidos:', err);
      res.status(500).send('Erro ao consultar os pedidos');
    } else {
      const pedidos = rows.map(row => ({
        id: row.id,
        numero: row.numero,
        cliente: row.cliente
      }));
      res.json(pedidos);
    }
  });
});

module.exports = router;
