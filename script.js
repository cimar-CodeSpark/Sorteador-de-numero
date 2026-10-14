const sorteioButton = document.getElementById('btn-sortear');
const numMin = document.getElementById('input-min');
const numMax = document.getElementById('input-max');
const numQtd = document.getElementById('draw-count'); // Input de quantidade
const resultado = document.getElementById('result');
const titleResult = document.getElementById('title-result');
const containerResult = document.getElementById('container-result');

// Variáveis globais para gerenciar o estado do sorteio sequencial
let sorteioIniciado = false;
let numerosDisponiveis = [];
let quantidadeTotal = 0;
let quantidadeSorteada = 0;
let numerosSorteadosAteAgora = [];

function sortear() {
    // --- PASSO 1: Configuração Inicial (Executado apenas no primeiro clique) ---
    if (!sorteioIniciado) {
        const min = parseInt(numMin.value);
        const max = parseInt(numMax.value);
        quantidadeTotal = parseInt(numQtd.value);

        // Validações de entrada de dados
        if (isNaN(min) || isNaN(max) || isNaN(quantidadeTotal)) {
            Swal.fire('Erro', 'Por favor, insira valores válidos em todos os campos.', 'error');
            return;
        }
        if (min >= max) {
            Swal.fire('Erro', 'O valor mínimo deve ser menor que o valor máximo.', 'error');
            return;
        }
        if (quantidadeTotal < 1) {
            Swal.fire('Erro', 'A quantidade de números a sortear deve ser pelo menos 1.', 'error');
            return;
        }

        // Validação matemática: Garante que o usuário não peça mais números do que o intervalo possui
        const intervaloPossivel = (max - min) + 1;
        if (quantidadeTotal > intervaloPossivel) {
            Swal.fire('Erro', `Impossível sortear ${quantidadeTotal} números sem repetir em um intervalo de ${intervaloPossivel} números.`, 'error');
            return;
        }

        // Desabilita os campos de configuração para evitar mudanças durante as etapas
        numMin.disabled = true;
        numMax.disabled = true;
        numQtd.disabled = true;

        // Reseta o histórico da tela e cria a lista sequencial com as opções válidas
        resultado.textContent = "";
        numerosSorteadosAteAgora = [];
        numerosDisponiveis = [];
        for (let i = min; i <= max; i++) {
            numerosDisponiveis.push(i);
        }

        quantidadeSorteada = 0;
        sorteioIniciado = true;
    }

    // --- PASSO 2: Execução das Etapas do Sorteio ---
    
    // Escolhe uma posição aleatória com base no que sobrou na lista
    const indiceAleatorio = Math.floor(Math.random() * numerosDisponiveis.length);
    // Remove o número da lista para que ele nunca mais se repita
    const numeroSorteado = numerosDisponiveis.splice(indiceAleatorio, 1)[0];

    quantidadeSorteada++;
    numerosSorteadosAteAgora.push(numeroSorteado);

    // Dispara a animação original de carregamento
    Swal.fire({
        title: 'Sorteando...',
        text: 'Por favor, aguarde o resultado.',
        imageUrl: './assets/espera2.gif',
        imageWidth: 400,
        imageHeight: 400,
        showConfirmButton: false, 
        allowOutsideClick: false, 
    });

    // Aguarda o término da animação (5 segundos) para mostrar as informações
    setTimeout(() => {
        containerResult.style.backgroundColor = '#d5d5d5ac';
        titleResult.textContent = 'Resultado';
        
        // Exibe todos os números acumulados até esta rodada no container da página
        resultado.textContent = numerosSorteadosAteAgora.join(" - ");

        // Abre a caixa de diálogo do SweetAlert2 informando o vencedor atual da rodada
        Swal.fire({
            title: 'Temos um vencedor!',
            html: `O número sorteado foi: <br><span style="color: #ff0000; font-weight: bold; font-size: 100px;">${numeroSorteado}</span>`,
            icon: 'success',
            confirmButtonText: 'Legal!'
        });

        // --- PASSO 3: Gerenciar o estado do botão ---
        if (quantidadeSorteada < quantidadeTotal) {
            sorteioButton.textContent = "Sortear próximo número";
        } else {
            sorteioButton.textContent = "Fim do sorteio";
            sorteioButton.disabled = true; // Desabilita o clique permanentemente no botão
            sorteioButton.style.backgroundColor = '#aaa'; // Aplica estilo visual cinza de desativado
            sorteioButton.style.cursor = 'not-allowed';
        }

    }, 5000);
}

sorteioButton.addEventListener('click', sortear);
