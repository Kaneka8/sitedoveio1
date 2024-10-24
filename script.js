// Selecione todos os campos de input
const inputs = document.querySelectorAll('.quantidade');

// Selecione o elemento que exibe o total
const totalElement = document.querySelector('h2');

// Defina o total inicial
let total = 12000000000000;

// Função para calcular o total
function calcularTotal() {
    total = 12000000000000;
    inputs.forEach((input, index) => {
        const preco = getPreco(index);
        const quantidade = parseInt(input.value);
        total -= preco * quantidade;
    });
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