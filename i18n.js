// Sistema de idiomas do jogo Infiltrado.
// Estruturado para facilitar a adição de novos idiomas no futuro:
// basta acrescentar uma nova chave (ex: "es") com todas as strings traduzidas.
window.I18N = {
  pt: {
    appName: "Infiltrado",
    tagline: "Um entre vocês não sabe a palavra.",

    // Menu principal
    menuPlay: "Jogar",
    menuSettings: "Configurações",
    menuLanguage: "Idioma",
    menuHowToPlay: "Como jogar",
    menuContinue: "Continuar partida",

    // Idiomas
    languagePt: "Português",
    languageEn: "English",

    // Cadastro de jogadores
    playersTitle: "Quem vai jogar?",
    playersSubtitle: "Adicione de 4 a 12 jogadores",
    addPlayer: "Adicionar jogador",
    playerNamePlaceholder: "Nome do jogador",
    playerNameEmpty: "Digite um nome antes de adicionar.",
    playerNameDuplicate: "Esse nome já foi usado.",
    playerMax: "Número máximo de jogadores atingido.",
    playerMin: "Adicione pelo menos 4 jogadores para começar.",
    editPlayer: "Editar",
    removePlayer: "Remover",
    save: "Salvar",
    cancel: "Cancelar",
    continueBtn: "Continuar",
    playersCount: "{count} jogadores",

    // Seleção de tema
    themeTitle: "Escolha o tema",
    themeSubtitle: "As palavras da partida virão desse tema",
    themeRandom: "Tema surpresa",
    startGame: "Começar partida",

    // Nomes dos temas
    theme_celebridades: "Pessoas Famosas",
    theme_futebol: "Futebol",
    theme_esportes: "Esportes",
    theme_escola: "Escola",
    theme_casa: "Casa",
    theme_games: "Games",
    "theme_filmes-series": "Filmes e Séries",
    theme_comidas: "Comidas",
    "theme_lugares-paises": "Lugares e Países",

    theme_desc_celebridades: "Cantores, atores e virais",
    theme_desc_futebol: "Craques, clubes e copas",
    theme_desc_esportes: "Atletas e modalidades",
    theme_desc_escola: "Salas, matérias e recreio",
    theme_desc_casa: "Cômodos, móveis e rotina",
    theme_desc_games: "Consoles, jogos e personagens",
    "theme_desc_filmes-series": "Filmes, séries e animações",
    theme_desc_comidas: "Pratos, frutas e bebidas",
    "theme_desc_lugares-paises": "Países, cidades e pontos turísticos",

    // Configurações
    settingsTitle: "Configurações",
    settingsImpostorCount: "Quantidade de impostores",
    settingsImpostorAuto: "Automático",
    settingsImpostor1: "1 Impostor",
    settingsImpostor2: "2 Impostores",
    settingsImpostor3: "3 Impostores",
    settingsClueTime: "Tempo das pistas",
    settingsTimeNone: "Sem limite",
    settingsTime15: "15 segundos",
    settingsTime30: "30 segundos",
    settingsTime60: "60 segundos",
    settingsImpostorHint: "Dica para o impostor",
    settingsLastChance: "Última chance",
    settingsSound: "Som",
    settingsOn: "Ligado",
    settingsOff: "Desligado",
    settingsThemes: "Temas selecionados",
    settingsBack: "Voltar",

    // Revelação
    revealPassTo: "{name}, é sua vez",
    revealInstruction: "Toque para descobrir seu papel",
    revealTapToSee: "Toque para revelar",
    revealCommonTitle: "A palavra é:",
    revealImpostorTitle: "VOCÊ É O INFILTRADO!",
    revealImpostorNoHint: "Descubra a palavra ouvindo as pistas dos outros.",
    revealImpostorHintLabel: "Sua dica:",
    revealHideAndPass: "Esconder e passar",
    revealPassPhoneTo: "Passe o celular para {name}",
    revealPassPhoneInstruction: "Confira se ninguém mais está vendo a tela.",
    revealAllDone: "Todos já viram seus papéis!",
    revealStartClues: "Começar rodada de pistas",

    // Rodada de pistas
    cluesTitle: "Rodada de pistas",
    cluesInstruction: "Cada jogador deve dizer uma pista sobre a palavra, sem falar a palavra diretamente.",
    cluesTimerLabel: "Tempo restante",
    cluesStartTimer: "Iniciar cronômetro",
    cluesNoTimer: "Esta partida não tem cronômetro.",
    cluesNextPlayer: "Próximo jogador",
    cluesGoToVote: "Ir para votação",
    cluesPlayerTurn: "Vez de {name}",

    // Votação
    voteTitle: "Quem o grupo votou?",
    voteInstruction: "Depois da discussão, selecione o jogador acusado pelo grupo.",
    voteConfirm: "Confirmar acusação",
    voteWrongTitle: "{name} era inocente!",
    voteWrongSubtitle: "O infiltrado ainda está entre vocês.",
    voteAgain: "Votar novamente",
    voteCorrectTitle: "Acertaram!",
    voteCorrectSubtitle: "{name} era o infiltrado.",
    voteNoPlayersLeft: "Não há mais jogadores para acusar.",

    // Última chance
    lastChanceTitle: "Você foi descoberto!",
    lastChanceSubtitle: "Qual é a palavra secreta?",
    lastChanceInstruction: "Digite ou selecione a resposta do infiltrado.",
    lastChancePlaceholder: "Digite a palavra...",
    lastChanceConfirm: "Confirmar resposta",
    lastChanceSkip: "Pular última chance",

    // Resultado
    resultImpostorWinsTitle: "INFILTRADO VENCEU!",
    resultGroupWinsTitle: "GRUPO VENCEU!",
    resultImpostorWasNotFound: "O infiltrado não foi descoberto a tempo.",
    resultImpostorGuessedRight: "O infiltrado acertou a palavra secreta.",
    resultImpostorGuessedWrong: "O infiltrado errou a palavra secreta.",
    resultWordWas: "A palavra era: {word}",
    resultImpostorWas: "O infiltrado era: {name}",
    resultImpostorsWere: "Os infiltrados eram: {names}",
    resultScoreboard: "Placar",
    resultPlayAgain: "Jogar novamente",
    resultNewGame: "Nova partida (trocar jogadores)",
    resultBackToMenu: "Voltar ao menu",

    // Pontuação
    scorePoints: "{points} pts",

    // Como jogar
    howToPlayTitle: "Como jogar",
    howToPlayBody:
      "Cadastre de 4 a 12 jogadores e escolha um tema. Quase todos recebem a mesma palavra secreta, mas um ou mais jogadores são o Infiltrado e não sabem a palavra. Passem o celular para cada pessoa ver seu papel em segredo. Depois, cada jogador dá uma pista sobre a palavra sem dizê-la diretamente. Conversem e votem em quem parece ser o Infiltrado. Se acertarem, o Infiltrado ainda pode tentar adivinhar a palavra para vencer no susto final.",
    howToPlayClose: "Entendi",

    // Genéricos
    back: "Voltar",
    close: "Fechar",
    yes: "Sim",
    no: "Não",
    confirmExit: "Sair da partida atual?",
    confirmExitBody: "O progresso desta partida será perdido.",

    // Sons (rótulos usados em configurações, se necessário futuramente)
    soundReveal: "Revelação",
    soundVote: "Votação",
    soundWin: "Vitória"
  },

  en: {
    appName: "Infiltrator",
    tagline: "One of you doesn't know the word.",

    menuPlay: "Play",
    menuSettings: "Settings",
    menuLanguage: "Language",
    menuHowToPlay: "How to play",
    menuContinue: "Continue game",

    languagePt: "Português",
    languageEn: "English",

    playersTitle: "Who's playing?",
    playersSubtitle: "Add 4 to 12 players",
    addPlayer: "Add player",
    playerNamePlaceholder: "Player name",
    playerNameEmpty: "Type a name before adding.",
    playerNameDuplicate: "This name has already been used.",
    playerMax: "Maximum number of players reached.",
    playerMin: "Add at least 4 players to start.",
    editPlayer: "Edit",
    removePlayer: "Remove",
    save: "Save",
    cancel: "Cancel",
    continueBtn: "Continue",
    playersCount: "{count} players",

    themeTitle: "Choose the theme",
    themeSubtitle: "The round's words will come from this theme",
    themeRandom: "Surprise theme",
    startGame: "Start game",

    theme_celebridades: "Famous People",
    theme_futebol: "Football",
    theme_esportes: "Sports",
    theme_escola: "School",
    theme_casa: "House",
    theme_games: "Games",
    "theme_filmes-series": "Movies & Series",
    theme_comidas: "Food",
    "theme_lugares-paises": "Places & Countries",

    theme_desc_celebridades: "Singers, actors & viral stars",
    theme_desc_futebol: "Stars, clubs & cups",
    theme_desc_esportes: "Athletes & sports",
    theme_desc_escola: "Classrooms & recess",
    theme_desc_casa: "Rooms, furniture & routine",
    theme_desc_games: "Consoles, games & characters",
    "theme_desc_filmes-series": "Movies, series & animation",
    theme_desc_comidas: "Dishes, fruit & drinks",
    "theme_desc_lugares-paises": "Countries, cities & landmarks",

    settingsTitle: "Settings",
    settingsImpostorCount: "Number of impostors",
    settingsImpostorAuto: "Automatic",
    settingsImpostor1: "1 Impostor",
    settingsImpostor2: "2 Impostors",
    settingsImpostor3: "3 Impostors",
    settingsClueTime: "Clue time",
    settingsTimeNone: "No limit",
    settingsTime15: "15 seconds",
    settingsTime30: "30 seconds",
    settingsTime60: "60 seconds",
    settingsImpostorHint: "Hint for the impostor",
    settingsLastChance: "Last chance",
    settingsSound: "Sound",
    settingsOn: "On",
    settingsOff: "Off",
    settingsThemes: "Selected themes",
    settingsBack: "Back",

    revealPassTo: "{name}, it's your turn",
    revealInstruction: "Tap to reveal your role",
    revealTapToSee: "Tap to reveal",
    revealCommonTitle: "The word is:",
    revealImpostorTitle: "YOU ARE THE IMPOSTOR!",
    revealImpostorNoHint: "Figure out the word by listening to the other clues.",
    revealImpostorHintLabel: "Your hint:",
    revealHideAndPass: "Hide and pass",
    revealPassPhoneTo: "Pass the phone to {name}",
    revealPassPhoneInstruction: "Make sure no one else can see the screen.",
    revealAllDone: "Everyone has seen their role!",
    revealStartClues: "Start the clue round",

    cluesTitle: "Clue round",
    cluesInstruction: "Each player should say one clue about the word, without saying the word itself.",
    cluesTimerLabel: "Time left",
    cluesStartTimer: "Start timer",
    cluesNoTimer: "This round has no timer.",
    cluesNextPlayer: "Next player",
    cluesGoToVote: "Go to voting",
    cluesPlayerTurn: "{name}'s turn",

    voteTitle: "Who did the group vote for?",
    voteInstruction: "After the discussion, select the player accused by the group.",
    voteConfirm: "Confirm accusation",
    voteWrongTitle: "{name} was innocent!",
    voteWrongSubtitle: "The impostor is still among you.",
    voteAgain: "Vote again",
    voteCorrectTitle: "You got it!",
    voteCorrectSubtitle: "{name} was the impostor.",
    voteNoPlayersLeft: "There are no more players to accuse.",

    lastChanceTitle: "You've been caught!",
    lastChanceSubtitle: "What's the secret word?",
    lastChanceInstruction: "Type or select the impostor's answer.",
    lastChancePlaceholder: "Type the word...",
    lastChanceConfirm: "Confirm answer",
    lastChanceSkip: "Skip last chance",

    resultImpostorWinsTitle: "IMPOSTOR WINS!",
    resultGroupWinsTitle: "GROUP WINS!",
    resultImpostorWasNotFound: "The impostor was not found in time.",
    resultImpostorGuessedRight: "The impostor guessed the secret word correctly.",
    resultImpostorGuessedWrong: "The impostor guessed the secret word wrong.",
    resultWordWas: "The word was: {word}",
    resultImpostorWas: "The impostor was: {name}",
    resultImpostorsWere: "The impostors were: {names}",
    resultScoreboard: "Scoreboard",
    resultPlayAgain: "Play again",
    resultNewGame: "New game (change players)",
    resultBackToMenu: "Back to menu",

    scorePoints: "{points} pts",

    howToPlayTitle: "How to play",
    howToPlayBody:
      "Add 4 to 12 players and choose a theme. Almost everyone gets the same secret word, but one or more players are the Impostor and don't know it. Pass the phone around so each person can secretly see their role. Then, each player gives one clue about the word without saying it directly. Discuss and vote on who seems to be the Impostor. If you're right, the Impostor still gets one last chance to guess the word and steal the win.",
    howToPlayClose: "Got it",

    back: "Back",
    close: "Close",
    yes: "Yes",
    no: "No",
    confirmExit: "Exit the current game?",
    confirmExitBody: "This game's progress will be lost.",

    soundReveal: "Reveal",
    soundVote: "Vote",
    soundWin: "Win"
  }
};

// Idioma ativo (padrão: português). Pode ser alterado nas configurações.
window.currentLang = window.currentLang || "pt";

// Função utilitária de tradução com suporte a variáveis: t('key', {name: 'Ana'})
window.t = function (key, vars) {
  var dict = window.I18N[window.currentLang] || window.I18N.pt;
  var str = dict[key] !== undefined ? dict[key] : key;
  if (vars) {
    Object.keys(vars).forEach(function (k) {
      str = str.replace("{" + k + "}", vars[k]);
    });
  }
  return str;
};
