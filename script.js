const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const nicknameInput = document.getElementById('nickname');
const dificuldadeSelect = document.getElementById('dificuldade');
const playerNameDisplay = document.getElementById('playerName');
const tentativasSpan = document.getElementById('tentativas');
const timerSpan = document.getElementById('timer');
const recordDisplay = document.getElementById('record');
const gameBoard = document.getElementById('gameBoard');
const placarSpan = document.getElementById('placar');
let leaderboardList = document.getElementById('leaderboardList');
const music = document.getElementById('background-music');
const toggleBtn = document.getElementById('toggle-music');

if (!leaderboardList) {
  leaderboardList = document.createElement('ul');
  document.body.appendChild(leaderboardList);
}

let pontos = 0;
let tentativas = 0;
let tempo = 0;
let intervaloTempo;
let cards = [];

function getRecordKey() {
}

const somAcerto = new Audio('sons/acerto.mp3');
const somErro = new Audio('sons/erro.mp3');
const somVitoria = new Audio('sons/vitoria.mp3');

// Atualiza o placar na parte superior e lateral
function updateLeaderboard() {
  placarSpan.textContent = `Pontos: ${pontos}`;
  tentativasSpan.textContent = `Tentativas: ${tentativas}`;
  timerSpan.textContent = `Tempo: ${tempo}s`;

  const placarSuperior = document.getElementById('placarSuperior');
  if (placarSuperior) {
    placarSuperior.textContent = `Pontos: ${pontos}`;
  }
}

// Modifica a função para salvar o recorde com base nos pontos
function salvarRecorde() {
  const recordSalvo = localStorage.getItem(getRecordKey());
  const recordNumerico = recordSalvo ? parseInt(recordSalvo) : null;
  if (!recordNumerico || pontos > recordNumerico) {
    localStorage.setItem(getRecordKey(), pontos);
    recordDisplay.textContent = `Melhor Recorde: ${pontos} pontos`;
  } else {
    recordDisplay.textContent = `Melhor Recorde: ${recordNumerico} pontos`;
  }
  atualizarPlacarLateral();
}

// Atualiza o placar lateral com as informações do jogador
function atualizarPlacarLateral() {
  leaderboardList.prepend(li);
}

// Função que inicia o jogo
startButton.addEventListener('click', () => {
  const nick = nicknameInput.value.trim();
  if (!nick) {
    alert("Por favor, digite seu nome!");
    return;
  }
  playerNameDisplay.textContent = `Jogador: ${nick}`;
  startScreen.classList.add('hidden');  // Tela inicial oculta
  gameScreen.classList.remove('hidden');  // Tela do jogo visível
  iniciarJogo();
});

// Reinicia o jogo
restartButton.addEventListener('click', () => {
  clearInterval(intervaloTempo);
  gameScreen.classList.add('hidden');  // Tela do jogo oculta
  startScreen.classList.remove('hidden');  // Tela inicial visível
  nicknameInput.value = "";
  recordDisplay.textContent = 'Melhor Recorde: –';
  resetGameBoard();  // Reseta o tabuleiro antes de exibir novamente
});

function resetGameBoard() {
  gameBoard.innerHTML = ''; // Limpa o tabuleiro de cartas
  pontos = 0;
  tentativas = 0;
  tempo = 0;
  updateLeaderboard();
}

function iniciarJogo() {
  const nivel = dificuldadeSelect.value;
  let imgs = [];
  const recordSalvo = localStorage.getItem(getRecordKey());

  const corPorImagem = {
    "amarelo.png": "#f1c40f",
    "azul.png": "#3498db",
    "verde.png": "#2ecc71",
    "vermelho.png": "#e74c3c",
    "marrom.png": "#8e5c42",
    "agua.png": "#1ca9c9",
    "cidade.png": "#7f8c8d",
    "clima.png": "#95a5a6",
    "desigual.png": "#e67e22",
    "econo.png": "#2c3e50",
    "energia.png": "#f39c12",
    "estudo.png": "#2980b9",
    "fome.png": "#c0392b",
    "genero.png": "#9b59b6",
    "infra.png": "#34495e",
    "ods.png": "#16a085",
    "parce.png": "#27ae60",
    "paz.png": "#bdc3c7",
    "pobreza.png": "#7d3c98",
    "potavel.png": "#5dade2",
    "prod.png": "#f4d03f",
    "saude.png": "#c0392b",
    "vida.png": "#229954",
    "comp.jpg": "#f7dc6f",
    "ecos.png": "#239b56",
    "dia.png": "#85c1e9",
    "cuidar.webp": "#58d68d",
    "plante.jpg": "#27ae60",
    "economizar.jpg": "#1abc9c"
  };

  if (nivel === 'facil') {
    imgs = ['amarelo.png', 'azul.png', 'verde.png', 'vermelho.png', 'marrom.png'];
  } else if (nivel === 'medio') {
    imgs = [
      'pobreza.png', 'potavel.png', 'prod.png', 'saude.png', 'vida.png',
      'agua.png', 'cidade.png', 'clima.png', 'desigual.png', 'econo.png',
      'energia.png', 'estudo.png', 'fome.png', 'genero.png', 'infra.png',
      'ods.png', 'parce.png', 'paz.png'
    ];
  } else if (nivel === 'dificil') {
    imgs = Object.keys(corPorImagem);
  }

  cards = [...imgs, ...imgs].sort(() => 0.5 - Math.random());

  gameBoard.innerHTML = "";
  let firstCard = null, secondCard = null, lock = false;
  pontos = 0;
  tentativas = 0;
  tempo = 0;
  updateLeaderboard();

  clearInterval(intervaloTempo);
  intervaloTempo = setInterval(() => {
    tempo++;
    timerSpan.textContent = `Tempo: ${tempo}s`;
  }, 1000);

  recordDisplay.textContent = recordSalvo ? `Melhor Recorde: ${recordSalvo} tentativas` : 'Melhor Recorde: –';

  cards.forEach((imgName, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;
    card.dataset.image = imgName;
    const corFundo = corPorImagem[imgName] || '#ccc';
    card.style.backgroundColor = '#145a32';  // Cor inicial de fundo

    const img = document.createElement('img');
    img.src = `imagens/${nivel}/${imgName}`;
    img.alt = imgName.replace('.png', '');
    img.title = img.alt;
    img.classList.add('hidden-img');  // Imagem inicialmente oculta
    img.style.display = 'none'; // Esconde a imagem por padrão
    img.onload = () => {
      img.style.display = ''; // Mostra a imagem quando ela estiver carregada
    };

    img.onerror = () => {
      img.src = 'imagens/default.png';
      console.error(`Erro ao carregar a imagem: ${img.src}`);
    };

    card.appendChild(img);
    gameBoard.appendChild(card);

    card.addEventListener('click', () => {
      if (lock || card.classList.contains('revealed') || card === firstCard) return;

      console.log(`Carta clicada: ${imgName}`); // Debug: Mostra qual carta foi clicada
      revelarCarta(card);

      if (!firstCard) {
        firstCard = card;
      } else {
        secondCard = card;
        lock = true;
        tentativas++;
        tentativasSpan.textContent = `Tentativas: ${tentativas}`;
        compararCartas(firstCard, secondCard);
      }
    });
  });

  function revelarCarta(card) {
    const img = card.querySelector('img');
    img.classList.remove('hidden-img');
    img.style.display = '';  // Mostra a imagem
    card.classList.add('revealed');
    card.style.backgroundColor = '';  // Remove a cor de fundo
  }

  function compararCartas(card1, card2) {
    console.log(`Comparando cartas: ${card1.dataset.image} com ${card2.dataset.image}`); // Debug
    if (card1.dataset.image === card2.dataset.image) {
      somAcerto.play();
      pontos += 10;  // Adiciona pontos quando as cartas forem iguais
      updateLeaderboard();  // Atualiza o placar
      card1.classList.add('matched');
      card2.classList.add('matched');
      resetSelection();
      checarVitoria();
    } else {
      somErro.play();
      setTimeout(() => {
        esconderCartas(card1, card2);
        resetSelection();
      }, 1000);
    }
  }

  function esconderCartas(card1, card2) {
    console.log("Escondendo as cartas");  // Debug
    card1.querySelector('img').style.display = 'none'; // Esconde a imagem
    card2.querySelector('img').style.display = 'none'; // Esconde a imagem
    card1.classList.remove('revealed');
    card2.classList.remove('revealed');
    card1.style.backgroundColor = '#145a32';
    card2.style.backgroundColor = '#145a32';
  }

  function resetSelection() {
    firstCard = null;
    secondCard = null;
    lock = false;  // Reseta o lock aqui
    console.log("lock resetado");  // Debug
  }

function checarVitoria() {
  const matchedCount = document.querySelectorAll('.card.matched').length;
  if (matchedCount === cards.length) {
    clearInterval(intervaloTempo);
    somVitoria.play();

    // 🎉 Adiciona confetes
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    alert("Você venceu!");
    salvarRecorde();
  }
}

}