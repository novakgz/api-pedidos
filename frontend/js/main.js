function criarPedido() {
  event.preventDefault();
  const numeroPedido = document.getElementById('numero-pedido').value;
  const nomeCliente = document.getElementById('nome-pedido').value;

  const pedido = {
      numero: numeroPedido,
      cliente: nomeCliente
  };

  fetch('http://localhost:3000/api/v1/pedido', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(pedido)
  })
  .then(response => response.json())
  .then(data => {
      localStorage.setItem('numeroPedido', numeroPedido);
      window.location.href="pedidoDetalhe.html";
  })
  .catch(error => {
      console.error('Erro ao criar pedido:', error);
  });
}

async function buscarTodosPedidos() {
  event.preventDefault();
  try {
    const response = await fetch('http://localhost:3000/api/v1/pedido');
    if (response.ok) {
      const pedidos = await response.json();
      if (pedidos.length === 0) {
        exibirMensagemModal('Nenhum pedido encontrado');
      } else {
        exibirPedidosModal(pedidos);
      }
    } else if (response.status === 404) {
      exibirMensagemModal('Nenhum pedido encontrado');
    } else {
      console.error('Erro ao buscar pedidos:', response.statusText);
    }
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
  }
}

async function buscarPedido() {
  event.preventDefault();
  const numeroPedido = document.getElementById('numero-pedido').value;

  if(numeroPedido == null || numeroPedido == ''){
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/v1/pedido/${numeroPedido}`);
    if (response.ok) {
      const pedido = await response.json();
      if (pedido.length === 0) {
        exibirMensagemModal('Nenhum pedido encontrado');
      } else {
        exibirPedidosModal(pedido);
      }
    } else if (response.status === 404) {
      exibirMensagemModal('Nenhum pedido encontrado');
    } else {
      console.error('Erro ao buscar pedido:', response.statusText);
    }
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
  }
  setTimeout(() => {
    document.getElementById('numero-pedido').value = '';
  }, 500);
}

async function buscarPedidoPorProduto(nomeProduto) {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/pedido/item?produto=${nomeProduto}`);
    if (response.ok) {
      const pedido = await response.json();
      if (pedido.length === 0) {
        exibirMensagemModal('Nenhum pedido encontrado');
      } else {
        exibirPedidosModal(pedido);
      }
    } else if (response.status === 404) {
      exibirMensagemModal('Nenhum pedido encontrado');
    } else {
      console.error('Erro ao buscar pedido:', response.statusText);
    }
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
  }
}

function exibirMensagemModal(mensagem) {
  const modalList = document.querySelector('.mensagem');
  modalList.innerHTML = '';

  const mensagemItem = document.createElement('span');
  mensagemItem.textContent = mensagem;
  modalList.appendChild(mensagemItem);

  let a = document.createElement('a');
  a.href = '#modal-pedidos';
  a.click();
  a.remove();
}
  
function exibirPedidosModal(pedidos) {
  const modalmessage = document.querySelector('.mensagem');
  modalmessage.innerHTML = '';
  const modalList = document.querySelector('.lista-pedidos');
  modalList.innerHTML = '';

  if (Array.isArray(pedidos)) {
    pedidos.forEach((pedido) => {
      addLista(pedido);
    });
  } else {
    addLista(pedidos);
  }

  let a = document.createElement('a');
  a.href = '#modal-pedidos';
  a.click();
  a.remove();
}

function addLista(pedido) {
  const tabelaPedidos = document.querySelector('.lista-pedidos');

  const row = tabelaPedidos.insertRow();
  
  const numeroCell = row.insertCell();
  numeroCell.classList.add('tabela_numero');
  numeroCell.textContent = pedido.numero;

  const clienteCell = row.insertCell();
  clienteCell.classList.add('tabela_cliente');
  clienteCell.textContent = pedido.cliente;

  const detalhesCell = row.insertCell();
  const detalhesButton = document.createElement('button');
  detalhesButton.textContent = 'Mais';
  detalhesButton.addEventListener('click', () => {
    carregarDetalhesPedido(pedido.numero);
  });
  detalhesCell.appendChild(detalhesButton);
}


function carregarDetalhesPedido(numeroPedido) {
  localStorage.setItem('numeroPedido', numeroPedido);
  window.location.href = `pedidoDetalhe.html`;
}

