// Selecione todos os campos de input
const inputs = document.querySelectorAll('.quantidade');

// Selecione o elemento que exibe o total
const totalElement = document.getElementById('total');

// Selecione o elemento que exibe a mensagem de erro
const mensagemErroElement = document.getElementById('mensagemErro');

// Defina o total inicial
let total = 12000000000000; // Total inicial do Veio da Havan

// Função para calcular o total
function calcularTotal() {
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

// Adicione um evento de mudança a cada campo de input
inputs.forEach(input => {
    input.addEventListener('input', calcularTotal);
});

// Chame a função para calcular o total inicialmente
calcularTotal();