window.addEventListener('DOMContentLoaded', carregarInfosPedido);

async function carregarInfosPedido() {
  const numeroPedido = localStorage.getItem('numeroPedido');
  const pedidoNumeroElement = document.getElementById('pedido-numero');
  const pedidoClienteElement = document.getElementById('pedido-cliente');
  const tabelaItens = document.querySelector('.detalhes_tabela');

  try {
      const responsePedido = await fetch(`http://localhost:3000/api/v1/pedido/${numeroPedido}`);
      if (responsePedido.ok) {
          const pedido = await responsePedido.json();
          pedidoNumeroElement.textContent = pedido.numero;
          pedidoClienteElement.textContent = pedido.cliente;

          const responseItens = await fetch(`http://localhost:3000/api/v1/pedido/${numeroPedido}/item/`);
          if (responseItens.ok) {
              const itens = await responseItens.json();
              for (const item of itens) {
                  const row = tabelaItens.insertRow();
                  const indiceCell = row.insertCell();
                  const skuCell = row.insertCell();
                  const produtoCell = row.insertCell();
                  const precoCell = row.insertCell();
                  const quantidadeCell = row.insertCell();
                  const outrosPedidosCell = row.insertCell();

                  indiceCell.textContent = item.indice;
                  skuCell.textContent = item.SKU;
                  produtoCell.textContent = item.produto;
                  precoCell.textContent = item.preco.toFixed(2);
                  quantidadeCell.textContent = item.quantidade;

                  const outrosPedidosButton = document.createElement('button');
                  outrosPedidosButton.textContent = 'Ver mais';
                  outrosPedidosButton.addEventListener('click', () => {
                      buscarPedidoPorProduto(item.produto);
                  });
                  outrosPedidosCell.appendChild(outrosPedidosButton);
              }
          } else {
              console.error('Erro ao buscar itens do pedido:', responseItens.statusText);
          }
      } else {
          console.error('Erro ao buscar detalhes do pedido:', responsePedido.statusText);
      }
  } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
  }
}

function adicionarItemPedido() {
  const numeroPedido = localStorage.getItem('numeroPedido');
  const SKU = document.getElementById('item-sku').value;
  const produto = document.getElementById('item-produto').value;
  const preco = parseFloat(document.getElementById('item-preco').value);
  const quantidade = parseInt(document.getElementById('item-quantidade').value);

  const novoItem = {
    SKU,
    produto,
    preco,
    quantidade
  };

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoItem)
  };

  fetch(`http://localhost:3000/api/v1/pedido/${numeroPedido}/item`, requestOptions)
    .then(response => {
      if (response.ok) {
        window.location.href='pedidoDetalhe.html';
      } else {
        console.error('Erro ao adicionar item ao pedido:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Erro ao adicionar item ao pedido:', error);
    });

  let a = document.getElementById('modal-add-close');
  a.click();
}
  
function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function buscarItemPorIndice() {
  event.preventDefault();
  const numeroPedido = localStorage.getItem('numeroPedido');
  const indice = document.getElementById('indice-item').value;
  const tabelaItens = document.querySelector('.detalhes_tabela');
  tabelaItens.innerHTML = ``;

  fetch(`http://localhost:3000/api/v1/pedido/${numeroPedido}/item/${indice}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Erro ao buscar o item do pedido.');
      }
    })
    .then(item => {
      const { indice, SKU, produto, preco, quantidade } = item;
      const row = tabelaItens.insertRow();
      row.innerHTML = `
          <td class="tabela_indice">${indice}</td>
          <td class="tabela_sku">${SKU}</td>
          <td class="tabela_produto">${produto}</td>
          <td class="tabela_preco">${preco.toFixed(2)}</td>
          <td class="tabela_quant">${quantidade}</td>
          <td class="tabela_btn">
              <button onclick="console.log('Nome do produto: ${produto}')">Ver mais</button>
          </td>
      `;
    })
    .catch(error => {
      console.error('Erro ao buscar o item do pedido:', error);
    });
  setTimeout(() => {
    document.getElementById('indice-item').value = '';
  }, 500);
}
  
function listarTodosItensPedido() {
  document.getElementById('indice-item').value = ''
  const numeroPedido = localStorage.getItem('numeroPedido');
  const tabelaItens = document.querySelector('.detalhes_tabela');
  tabelaItens.innerHTML = ``;

  fetch(`http://localhost:3000/api/v1/pedido/${numeroPedido}/item/`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Erro ao listar os itens do pedido.');
      }
    })
    .then(itens => {
      itens.forEach(item => {
        const { indice, SKU, produto, preco, quantidade } = item;
        const row = tabelaItens.insertRow();
        row.innerHTML = `
          <td class="tabela_indice">${indice}</td>
          <td class="tabela_sku">${SKU}</td>
          <td class="tabela_produto">${produto}</td>
          <td class="tabela_preco">${preco.toFixed(2)}</td>
          <td class="tabela_quant">${quantidade}</td>
          <td class="tabela_btn">
            <button onclick="console.log('Nome do produto: ${produto}')">Ver mais</button>
          </td>
        `;
      });
    })
    .catch(error => {
      console.error('Erro ao listar os itens do pedido:', error);
    });
}