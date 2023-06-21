Trabalho final da disciplina APi Gateway & Integration
Para MBA Full Stack Developer na Faculdade Impacta
Feito por Gabriel Novak Zambuzi - RA 2203254

Especificação:
- Constriuir uma aplicação com base na modelagem:
 ___________         ___________
|PEDIDO     |       |ITEM_PEDIDO|
|-----------|       |-----------|
|id (PK)    |       |id (PK)    |
|numero (UK)|o----->|numero (FK)|
|Cliente    |       |indice     |
'-----------'       |SKU        |
                    |Produto    |
                    |Preço      |
                    |Quantidade |
                    '-----------'

- Consumir os endpoint:
    POST /api/v1/pedido
    GET  /api/v1/pedido/{numero}
    GET  /api/v1/pedido/
    POST /api/v1/pedido/{numero}/item
    GET  /api/v1/pedido/{numero}/item/{indice}
    GET  /api/v1/pedido/{numero}/item/
    GET  /api/v1/pedido/item?produto={produto}

Requisitos:
- Node.js

Para executar seguir os seguintes passos:
- Executar o comando "node app.js" na raiz do projeto
- Abrir o arquivo "index.html" no caminho "/frontend/pages/"