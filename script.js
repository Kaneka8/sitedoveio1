const apiUrl = 'http://127.0.0.1:8000/itens/';
const totalElement = document.getElementById('total');
const mensagemErroElement = document.getElementById('mensagemErro');
const totalGastoElement = document.getElementById('total_gasto');
const quantidadeProdutosElement = document.getElementById('quantidade_produtos');
let total = 12000000000; // Total inicial
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

// Renderizar produtos no DOM com 3 por linha
function renderizarProdutos() {
    const itensProdutos = document.getElementById('itens_produtos').querySelector('tbody');
    itensProdutos.innerHTML = '';

    // Criar linhas com 3 produtos por linha
    for (let i = 0; i < produtos.length; i += 3) {
        const linha = document.createElement('tr');

        for (let j = 0; j < 3; j++) {
            const produto = produtos[i + j];

            const coluna = document.createElement('td');
            if (produto) {
                coluna.innerHTML = `
            <div style="text-align: center;">
                <img src="${produto.image_url}" alt="${produto.name}" width="160" height="160" style="display: block; margin: 0 auto;">
                <p>${produto.name}</p>
                <p>R$ ${produto.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <button onclick="alterarQuantidade(${produto.id}, 1)">+</button>
                <input type="number" value="0" min="0" data-id="${produto.id}" onchange="calcularTotal()" style="width: 50px; text-align: center;">
                <button onclick="alterarQuantidade(${produto.id}, -1)">-</button>
            </div>
                `;
            }
            linha.appendChild(coluna);
        }

        itensProdutos.appendChild(linha);
    }
}

// Alterar a quantidade de produtos
function alterarQuantidade(produtoId, delta) {
    const input = document.querySelector(`input[data-id="${produtoId}"]`);
    let quantidade = parseInt(input.value) || 0;

    // Localizar o produto
    const produto = produtos.find(p => p.id == produtoId);
    if (!produto) return;

    // Calcular o valor máximo possível para este produto
    const maxQuantidadePossivel = Math.floor((total - totalGasto) / produto.price);

    // Atualizar a quantidade com limite (não pode ser negativa ou exceder o máximo)
    quantidade = Math.max(0, quantidade + delta);
    if (quantidade > maxQuantidadePossivel) {
        quantidade = maxQuantidadePossivel; // Limita ao máximo possível
    }

    input.value = quantidade;
    calcularTotal();
}

// Calcular total gasto e atualizar resumo
function calcularTotal() {
    const inputs = document.querySelectorAll('input[type="number"]');
    const tabelaResumoBody = document.getElementById('tabela_resumo').querySelector('tbody');
    let totalGastosTemp = 0;
    let quantidadeTemp = 0;

    // Limpa a tabela de resumo antes de adicionar novos dados
    tabelaResumoBody.innerHTML = '';

    inputs.forEach(input => {
        const quantidade = Math.max(0, parseInt(input.value) || 0); // Garante que não seja negativo
        const produtoId = input.dataset.id;
        const produto = produtos.find(p => p.id == produtoId);

        if (produto && quantidade > 0) {
            const subtotal = produto.price * quantidade;

            // Atualiza os valores temporários
            totalGastosTemp += subtotal;
            quantidadeTemp += quantidade;

            // Adiciona o produto na tabela de resumo
            const linhaResumo = document.createElement('tr');
            linhaResumo.innerHTML = `
                <td>${produto.name}</td>
                <td>${quantidade}</td>
                <td>R$ ${produto.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            `;
            tabelaResumoBody.appendChild(linhaResumo);
        }
    });

    // Ajustar automaticamente os valores se o total ultrapassar o orçamento
    if (totalGastosTemp > total) {
        ajustarInputsParaTotalRestante(inputs);
    } else {
        totalGasto = totalGastosTemp;
        quantidadeProdutos = quantidadeTemp;

        // Atualiza o DOM
        totalElement.textContent = `R$ ${(total - totalGasto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        totalGastoElement.textContent = `R$ ${totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        quantidadeProdutosElement.textContent = quantidadeProdutos;
    }
}
// Inicializar a página
window.onload = carregarProdutos;
