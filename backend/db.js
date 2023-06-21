const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('backend/db/database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS pedido (
    id INTEGER PRIMARY KEY,
    numero TEXT UNIQUE,
    cliente TEXT
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela pedido:', err);
  } else {
    console.log('Tabela pedido criada ou já existente');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS item_pedido (
    id INTEGER PRIMARY KEY,
    numero INTEGER,
    indice INTEGER,
    SKU TEXT,
    produto TEXT,
    preco REAL,
    quantidade INTEGER,
    FOREIGN KEY (numero) REFERENCES pedido(numero)
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela item_pedido:', err);
  } else {
    console.log('Tabela item_pedido criada ou já existente');
  }
});

module.exports = db;