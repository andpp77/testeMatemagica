// ===================== CONFIGURAÇÃO SUPABASE =====================
const SUPABASE_URL = "https://xsetrmgmynmrebiwkkya.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZXRybWdteW5tcmViaXdra3lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDQyOTEsImV4cCI6MjA3Nzc4MDI5MX0.DFs9aID-cp693Ow5cwE-GF9cGLtIZQ761z2cCp8dlxw";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===================== VARIÁVEIS DO JOGO =====================
let perguntas = [
  {
    pergunta:
      "Qual é o tipo de dado que representa valores verdadeiros e falsos?",
    alternativas: ["int", "bool", "float", "string"],
    correta: "bool",
    pontos: 10,
  },
  {
    pergunta:
      "Qual operador lógico retorna verdadeiro apenas se todas as condições forem verdadeiras?",
    alternativas: ["AND", "OR", "NOT", "IF"],
    correta: "AND",
    pontos: 20,
  },
  {
    pergunta:
      "Em JavaScript, qual palavra-chave é usada para declarar uma variável de escopo de bloco?",
    alternativas: ["var", "let", "const", "define"],
    correta: "let",
    pontos: 30,
  },
];

let indicePergunta = 0;
let pontuacao = 0;
let tentativaExtra = false;
let jogador = "";
let totalEstrelas = 0;

// ===================== ELEMENTOS DO DOM =====================
const questionElement = document.getElementById("question");
const optionsGrid = document.getElementById("options-grid");
const feedbackMessage = document.getElementById("feedback-message");
const scoreDisplay = document.getElementById("score");
const finalScoreDisplay = document.getElementById("final-score");
const rankingList = document.getElementById("ranking-list");
const currentPlayerName = document.getElementById("current-player-name");
const currentPlayerLevel = document.getElementById("current-player-level");
const currentPlayerStars = document.getElementById("current-player-stars");
const endScreen = document.getElementById("end-screen");
const playAgainBtn = document.getElementById("play-again-btn");
const backHomeBtn = document.getElementById("back-home-btn");

// ===================== CONTROLE DE TELAS =====================
const startScreen = document.getElementById("start-screen");
const nameScreen = document.getElementById("name-screen");
const gameContainer = document.getElementById("game-container");

// ===================== INICIALIZAÇÃO =====================
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const confirmNameBtn = document.getElementById("confirm-name-btn");
  const nameInput = document.getElementById("player-name");
  const backBtn = document.getElementById("back-btn");

  // ---- Botão "Começar Aventura"
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      startScreen.classList.add("hidden");
      nameScreen.classList.remove("hidden");
      nameScreen.style.display = "flex";
    });
  }

  // ---- Botão "Voltar" na tela de nome
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      nameScreen.classList.add("hidden");
      startScreen.classList.remove("hidden");
      startScreen.style.display = "flex";
    });
  }

  // ---- Confirmar nome e iniciar jogo
  if (confirmNameBtn) {
    confirmNameBtn.addEventListener("click", () => {
      jogador = nameInput.value.trim();
      if (!jogador) {
        alert("Por favor, digite seu nome!");
        return;
      }
      iniciarJogo();
    });
  }

  // ---- Botão "Jogar novamente"
  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", () => {
      indicePergunta = 0;
      pontuacao = 0;
      tentativaExtra = false;
      endScreen.classList.add("hidden");
      iniciarJogo();
    });
  }

  // ---- Botão "Voltar ao início"
  if (backHomeBtn) {
    backHomeBtn.addEventListener("click", () => {
      endScreen.classList.add("hidden");
      startScreen.classList.remove("hidden");
      startScreen.style.display = "flex";
    });
  }

  exibirRanking();
});

// ===================== LÓGICA PRINCIPAL =====================
function iniciarJogo() {
  nameScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  gameContainer.style.display = "flex";
  carregarPergunta();
  atualizarUI();
}

function carregarPergunta() {
  const pergunta = perguntas[indicePergunta];
  if (!pergunta) return finalizarJogo();

  questionElement.textContent = pergunta.pergunta;
  optionsGrid.innerHTML = "";
  feedbackMessage.textContent = "";

  pergunta.alternativas.forEach((alternativa) => {
    const botao = document.createElement("button");
    botao.className = "option-btn";
    botao.textContent = alternativa;
    botao.onclick = () => verificarResposta(botao, pergunta);
    optionsGrid.appendChild(botao);
  });
}

function verificarResposta(botao, pergunta) {
  const resposta = botao.textContent;
  const botoes = document.querySelectorAll(".option-btn");
  botoes.forEach((b) => (b.disabled = true));

  if (resposta === pergunta.correta) {
    botao.classList.add("correct");
    const pontosGanhos = tentativaExtra ? pergunta.pontos / 2 : pergunta.pontos;
    pontuacao += pontosGanhos;
    mostrarFeedback(`✨ Correto! +${pontosGanhos} pontos`, true);
    proximaPergunta();
  } else {
    botao.classList.add("wrong");
    mostrarFeedback("❌ Errado!", false);

    if (!tentativaExtra) {
      tentativaExtra = true;
      setTimeout(() => embaralharAlternativas(pergunta), 2000);
    } else {
      tentativaExtra = false;
      proximaPergunta();
    }
  }
}

function embaralharAlternativas(pergunta) {
  feedbackMessage.textContent =
    "🌀 Tentativa extra! As alternativas foram embaralhadas.";
  setTimeout(() => {
    pergunta.alternativas.sort(() => Math.random() - 0.5);
    carregarPergunta();
  }, 2500);
}

function proximaPergunta() {
  setTimeout(() => {
    tentativaExtra = false;
    indicePergunta++;
    if (indicePergunta < perguntas.length) carregarPergunta();
    else finalizarJogo();
    atualizarUI();
  }, 1500);
}

function mostrarFeedback(msg, correto) {
  feedbackMessage.textContent = msg;
  feedbackMessage.style.color = correto ? "green" : "red";
}

function atualizarUI() {
  scoreDisplay.textContent = pontuacao;
}

// ===================== FINAL DE JOGO =====================
async function finalizarJogo() {
  gameContainer.classList.add("hidden");
  endScreen.classList.remove("hidden");
  endScreen.style.display = "flex";

  const estrelas = pontuacao >= 60 ? 3 : pontuacao >= 30 ? 2 : 1;
  totalEstrelas = estrelas;

  finalScoreDisplay.textContent = `Você fez ${pontuacao} pontos!`;

  currentPlayerName.textContent = jogador;
  currentPlayerLevel.textContent = `Pontuação total: ${pontuacao}`;
  currentPlayerStars.innerHTML = "⭐".repeat(estrelas);

  await salvarPontuacao(jogador, estrelas, pontuacao);
  exibirRanking();
}

// ===================== SUPABASE =====================
async function salvarPontuacao(nome, estrelas, pontos) {
  const { data: existente } = await supabase
    .from("ranking")
    .select("*")
    .eq("nome", nome)
    .single();

  if (existente) {
    const novasEstrelas = existente.estrelas + estrelas;
    const novosPontos = (existente.pontos || 0) + pontos;
    await supabase
      .from("ranking")
      .update({ estrelas: novasEstrelas, pontos: novosPontos })
      .eq("id", existente.id);
  } else {
    await supabase.from("ranking").insert([
      { nome, estrelas, pontos, nivel: "Jogador", criado_em: new Date() },
    ]);
  }
}

async function exibirRanking() {
  const { data, error } = await supabase
    .from("ranking")
    .select("*")
    .order("estrelas", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Erro ao carregar ranking:", error);
    rankingList.innerHTML = "<p>Erro ao carregar ranking 😢</p>";
    return;
  }

  rankingList.innerHTML = "";
  data.forEach((jogador) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <div class="ranking-item">
        <span class="ranking-name">${jogador.nome}</span>
        <span class="ranking-stars">${"⭐".repeat(
          jogador.estrelas
        )}</span>
      </div>
    `;
    rankingList.appendChild(item);
  });
}
