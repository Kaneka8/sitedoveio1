const apiUrl = 'http://127.0.0.1:8000/itens/';

// Selecione o elemento que exibe o total
const totalElement = document.getElementById('total');

// Selecione o elemento que exibe a mensagem de erro
const mensagemErroElement = document.getElementById('mensagemErro');

// Defina o total inicial
let total = 12000000000; // Total inicial do Veio da Havan
let produtos = []; // Array para armazenar os produtos

// Função para calcular o total
function calcularTotal() {
    // Selecione todos os campos de input novamente, pois eles podem ter mudado
    const inputs = document.querySelectorAll('input[type="number"]');

    // Reiniciar o total de gastos a cada cálculo
    let totalGastos = 0;

    // Calcular os gastos com base nas quantidades inseridas
    inputs.forEach(input => {
        const quantidade = parseInt(input.value) || 0; // Garantir que seja um número
        const produtoId = input.dataset.id; // Pega o ID do produto

        // Encontrar o produto correspondente
        const Produtos = Produtos.find(p => p.id == produtoId);
        if (produto) {
            totalGastos += produto.price * quantidade; // Acumular os gastos
        }
    });

    // Verificar se o total gasto excede o total disponível
    if (totalGastos > total) {
        // Se o total gasto exceder o total, reiniciar as quantidades
        inputs.forEach(input => {
            input.value = 0; // Reinicia as quantidades
        });
        mensagemErroElement.textContent = "Você não pode gastar mais do que o total disponível!";
        mensagemErroElement.style.display = 'block'; // Exibir a mensagem de erro
        totalGastos = 0; // Reiniciar totalGastos
    } else {
        mensagemErroElement.style.display = 'none'; // Ocultar a mensagem de erro
    }

    // Atualizar o total restante
    total -= totalGastos;

    // Garantir que o total não fique negativo
    if (total < 0) {
        total = 0; // Se o total ficar negativo, reiniciar para 0
    }

    // Atualizar o elemento que exibe o total
    totalElement.textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

        produtos.forEach(produto => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                    <td><img src="${produto.image_url}" alt="${produto.name}" style="width: 50px; height: auto;"><br>           
                    ${produto.name}<br>
                    R$ ${produto.price}<br>
                    <input type="number" min="0" value="0" data-id="${produto.id}" onchange="calcularTotal()"></td>
                    `;
            itens_produtos.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro:', error);
        mensagemErroElement.textContent = 'Erro ao carregar produtos.';
        mensagemErroElement.style.display = 'block';
    }
}

// Carrega os produtos quando a página é carregada
window.onload = carregarProdutos;