// URL da API Django (altere conforme necessário)
const apiUrl = 'http://127.0.0.1:8000/itens/';

// Selecione o elemento que exibe o total
const totalElement = document.getElementById('total');

// Selecione o elemento que exibe a mensagem de erro
const mensagemErroElement = document.getElementById('mensagemErro');

// Defina o total inicial
let total = 12000000000000; // Total inicial do Veio da Havan

// Função para calcular o total
function calcularTotal() {
    // Selecione todos os campos de input novamente, pois eles podem ter mudado
    const inputs = document.querySelectorAll('.quantidade');

    // Reiniciar o total de gastos a cada cálculo
    let totalGastos = 0;

    // Calcular os gastos com base nas quantidades inseridas
    inputs.forEach((input, index) => {
        const preco = getPreco(index);
        const quantidade = parseInt(input.value) || 0; // Garantir que seja um número
        totalGastos += preco * quantidade; // Acumular os gastos
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
    totalElement.textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

// Função para obter o preço de um item
function getPreco(index) {
    const precos = [
        16.90, 180.00, 8.00,
        93000.00, 5289.99, 5500000,
        371429500000, 13000000000, 134959.38
    ];
    return precos[index];
}

// Função para carregar os produtos e atualizar a tabela
async function carregarProdutos() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos');
        }
        const produtos = await response.json();
        const tabelaBody = document.querySelector('#itensTabela tbody');
        tabelaBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

        // Para cada produto, cria o HTML dinâmico
        produtos.forEach(produto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.name}</td>
                <td>R$ ${produto.price}</td>
                <td><img src="${produto.image_url}" alt="${produto.name}" style="width: 50px; height: auto;"></td>
                <td>
                    <div class="contador">
                        <input type="number" class="quantidade" value="0" min="0">
                    </div>
                </td>
            `;
            tabelaBody.appendChild(row);
        });

        // Adicione um evento de mudança a cada campo de input após carregar os produtos
        const inputs = document.querySelectorAll('.quantidade');
        inputs.forEach(input => {
            input.addEventListener('input', calcularTotal);
        });

    } catch (error) {
        mensagemErroElement.innerText = error.message;
        mensagemErroElement.style.display = 'block';
    }
}

// Chama a função para carregar os produtos quando a página for carregada
window.onload = carregarProdutos;