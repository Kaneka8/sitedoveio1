const apiUrl = 'http://127.0.0.1:8000/itens/';
const totalElement = document.getElementById('total');
const mensagemErroElement = document.getElementById('mensagemErro');
let total = 12000000000000; // Total inicial do Veio da Havan
let produtos = [];

// Buscar produtos da API
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        produtos = data;
        renderizarProdutos();
    })
    .catch(error => console.error('Erro ao carregar os produtos:', error));

// Renderizar os produtos no DOM
function renderizarProdutos() {
    const container = document.getElementById('produtos');
    produtos.forEach(produto => {
        const produtoHTML = `
            <div>
                <span>${produto.name} - R$ ${produto.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <button onclick="alterarQuantidade(${produto.id}, 1)">+</button>
                <input type="number" data-id="${produto.id}" min="0" placeholder="Quantidade" value="0">
                <button onclick="alterarQuantidade(${produto.id}, -1)">-</button>
            </div>
        `;
        container.innerHTML += produtoHTML;
    });

    // Adicionar eventos para atualizar o total
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', calcularTotal);
    });
}

// Alterar a quantidade de um produto
function alterarQuantidade(produtoId, delta) {
    const input = document.querySelector(`input[data-id="${produtoId}"]`);
    let quantidade = parseInt(input.value) || 0; // Garante que quantidade seja um número
    quantidade += delta;
    input.value = quantidade >= 0 ? quantidade : 0; // Impede valores negativos
    calcularTotal(); // Atualiza o total após a alteração
}

// Calcular o total gasto
function calcularTotal() {
    const inputs = document.querySelectorAll('input[type="number"]');
    let totalGastos = 0;

    inputs.forEach(input => {
        const quantidade = parseInt(input.value) || 0;
        const produtoId = input.dataset.id;
        const produto = produtos.find(p => p.id == produtoId);
        if (produto) {
            totalGastos += produto.price * quantidade;
        }
    });

    if (totalGastos > total) {
        mensagemErroElement.textContent = "Você não pode gastar mais do que o total disponível!";
        mensagemErroElement.style.display = 'block';
        totalGastos = 0;
        inputs.forEach(input => (input.value = 0));
    } else {
        mensagemErroElement.style.display = 'none';
    }

    totalElement.textContent = `R$ ${(total - totalGastos).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Função para carregar os produtos da API
async function carregarProdutos() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos');
        }
        produtos = await response.json(); // Armazena os produtos na variável global
        const itens_produtos = document.getElementById('itens_produtos').querySelector('tbody');
        itens_produtos.innerHTML = ''; // Limpa a tabela antes de preencher

        let linha = document.createElement("tr");
        itens_produtos.appendChild(linha);
        
        produtos.forEach((produto, index) => {
            // Cria uma nova coluna (td) a cada 3 produtos
            if (index % 3 === 0) {
                const coluna = document.createElement("td");
                linha.appendChild(coluna);
            }
        
            // Adiciona o produto à última coluna criada
            const colunaAtual = linha.lastChild;
        
            const produtoInfo = document.createElement("div");
            produtoInfo.innerHTML = `
                <img src="${produto.image_url}" alt="${produto.name}" <br>           
                ${produto.name}<br>
                R$ ${produto.price}<br>
                <button onclick="alterarQuantidade(${produto.id}, 1)">+</button>
                <input type="number" min="0" value="0" data-id="${produto .id}" onchange="calcularTotal()"><br>
                <button onclick="alterarQuantidade(${produto.id}, -1)">-</button><br><br>
            `;
            colunaAtual.appendChild(produtoInfo);
        });

    } catch (error) {
        console.error('Erro:', error);
        mensagemErroElement.textContent = 'Erro ao carregar produtos.';
        mensagemErroElement.style.display = 'block';
    }
}

// Carrega os produtos quando a página é carregada
window.onload = carregarProdutos;