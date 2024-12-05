const apiUrl = 'http://127.0.0.1:8000/itens/';
const totalElement = document.getElementById('total');
const mensagemErroElement = document.getElementById('mensagemErro');
const totalGastoElement = document.getElementById('total_gasto');
const quantidadeProdutosElement = document.getElementById('quantidade_produtos');
let total = 12000000000000; // Total inicial
let produtos = [];
let totalGasto = 0;
let quantidadeProdutos = 0;

// Função para carregar os produtos da API
async function carregarProdutos() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos');
        }
        produtos = await response.json();
        renderizarProdutos();
    } catch (error) {
        console.error('Erro:', error);
        mensagemErroElement.textContent = 'Erro ao carregar produtos.';
        mensagemErroElement.style.display = 'block';
    }
}

// Renderizar produtos no DOM
function renderizarProdutos() {
    const itensProdutos = document.getElementById('itens_produtos').querySelector('tbody');
    itensProdutos.innerHTML = '';

    produtos.forEach(produto => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td><img src="${produto.image_url}" alt="${produto.name}" width="50"></td>
            <td>${produto.name}</td>
            <td>R$ ${produto.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            <td>
                <button onclick="alterarQuantidade(${produto.id}, 1)">+</button>
                <input type="number" value="0" min="0" data-id="${produto.id}" onchange="calcularTotal()">
                <button onclick="alterarQuantidade(${produto.id}, -1)">-</button>
            </td>
        `;
        itensProdutos.appendChild(linha);
    });
}

// Alterar a quantidade de produtos
function alterarQuantidade(produtoId, delta) {
    const input = document.querySelector(`input[data-id="${produtoId}"]`);
    let quantidade = parseInt(input.value) || 0;
    quantidade = Math.max(0, quantidade + delta);
    input.value = quantidade;
    calcularTotal();
}

// Calcular total gasto e atualizar resumo
function calcularTotal() {
    const inputs = document.querySelectorAll('input[type="number"]');
    let totalGastosTemp = 0;
    let quantidadeTemp = 0;

    inputs.forEach(input => {
        const quantidade = parseInt(input.value) || 0;
        const produtoId = input.dataset.id;
        const produto = produtos.find(p => p.id == produtoId);

        if (produto) {
            totalGastosTemp += produto.price * quantidade;
            quantidadeTemp += quantidade;
        }
    });

    if (totalGastosTemp > total) {
        mensagemErroElement.textContent = "Você não pode gastar mais do que o total disponível!";
        mensagemErroElement.style.display = 'block';
    } else {
        mensagemErroElement.style.display = 'none';
        totalGasto = totalGastosTemp;
        quantidadeProdutos = quantidadeTemp;

        totalElement.textContent = `R$ ${(total - totalGasto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        totalGastoElement.textContent = `R$ ${totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        quantidadeProdutosElement.textContent = quantidadeProdutos;
    }
}

// Inicializar a página
window.onload = carregarProdutos;
