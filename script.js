(function () {
  "use strict";

  /* ======================================================================
     CONSTANTES
     ====================================================================== */
  var THEME_ICONS = {
    celebridades: "🌟",
    futebol: "⚽",
    esportes: "🏅",
    escola: "🏫",
    casa: "🏠",
    games: "🎮",
    "filmes-series": "🎬",
    comidas: "🍔",
    "lugares-paises": "🗺️"
  };
  var ALL_THEME_KEYS = Object.keys(THEME_ICONS);
  var STORAGE_KEY = "infiltrado_settings_v1";

  // Ícones SVG inline (puramente visuais) usados nos botões de ação da lista de jogadores.
  // Apenas presentação — não alteram nenhum comportamento de clique.
  var ICON_EDIT =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
  var ICON_TRASH =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>';

  /* ======================================================================
     ESTADO
     ====================================================================== */
  var state = {
    players: [], // {id, name}
    editingPlayerId: null,
    config: {
      themes: ALL_THEME_KEYS.slice(), // por padrão, todos selecionados
      impostorCount: "auto", // 'auto' | 1 | 2 | 3
      clueTime: 0, // 0 = sem limite
      impostorHint: true,
      lastChance: true,
      sound: true
    },
    scores: {}, // playerId -> pontos

    match: null // preenchido quando a partida começa
  };

  function saveSettings() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ config: state.config, lang: window.currentLang, scores: state.scores })
      );
    } catch (e) {
      /* localStorage indisponível: segue sem persistir */
    }
  }

  function loadSettings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (saved.config) {
        state.config = Object.assign({}, state.config, saved.config);
        if (!state.config.themes || !state.config.themes.length) {
          state.config.themes = ALL_THEME_KEYS.slice();
        }
      }
      if (saved.lang) window.currentLang = saved.lang;
      if (saved.scores) state.scores = saved.scores;
    } catch (e) {
      /* ignora dados corrompidos */
    }
  }

  /* ======================================================================
     UTILITÁRIOS
     ====================================================================== */
  function uid() {
    return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function normalize(str) {
    return (str || "")
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  var toastTimer = null;
  function showToast(msg) {
    var toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  function showScreen(id) {
    var screens = document.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.remove("active");
    }
    document.getElementById(id).classList.add("active");
    window.scrollTo(0, 0);
  }

  function playSound(type) {
    if (!state.config.sound) return;
    try {
      var ctx = playSound._ctx || (playSound._ctx = new (window.AudioContext || window.webkitAudioContext)());
      var freqMap = { reveal: 520, hide: 300, vote: 420, correct: 660, wrong: 220, win: 780, lose: 200, tick: 900 };
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freqMap[type] || 440;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      /* áudio indisponível (ex: antes da primeira interação) — ignora silenciosamente */
    }
  }

  /* ======================================================================
     TRADUÇÃO DE TEXTOS DA TELA
     ====================================================================== */
  function renderAllTexts() {
    document.documentElement.lang = window.currentLang === "en" ? "en" : "pt-BR";
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      nodes[i].textContent = window.t(key);
    }
    var placeholders = document.querySelectorAll("[data-i18n-placeholder]");
    for (var j = 0; j < placeholders.length; j++) {
      var pKey = placeholders[j].getAttribute("data-i18n-placeholder");
      placeholders[j].setAttribute("placeholder", window.t(pKey));
    }
    document.title = window.t("appName");
    renderPlayerList();
    renderThemeGrid();
    renderSettingsSelections();
  }

  /* ======================================================================
     TELA: JOGADORES
     ====================================================================== */
  function renderPlayerList() {
    var list = document.getElementById("playerList");
    list.innerHTML = "";
    if (state.players.length === 0) {
      var empty = document.createElement("div");
      empty.className = "empty-hint";
      empty.textContent = window.t("playerMin");
      list.appendChild(empty);
    }
    state.players.forEach(function (p) {
      var row = document.createElement("div");
      row.className = "player-row";

      var avatar = document.createElement("div");
      avatar.className = "player-avatar";
      avatar.textContent = p.name.trim().charAt(0).toUpperCase();

      var name = document.createElement("div");
      name.className = "player-name";
      name.textContent = p.name;

      var actions = document.createElement("div");
      actions.className = "player-actions";

      var editBtn = document.createElement("button");
      editBtn.innerHTML = ICON_EDIT;
      editBtn.setAttribute("aria-label", window.t("editPlayer"));
      editBtn.onclick = function () {
        startEditPlayer(p.id);
      };

      var removeBtn = document.createElement("button");
      removeBtn.innerHTML = ICON_TRASH;
      removeBtn.setAttribute("aria-label", window.t("removePlayer"));
      removeBtn.onclick = function () {
        removePlayer(p.id);
      };

      actions.appendChild(editBtn);
      actions.appendChild(removeBtn);
      row.appendChild(avatar);
      row.appendChild(name);
      row.appendChild(actions);
      list.appendChild(row);
    });

    updatePlayersContinueButton();
  }

  function updatePlayersContinueButton() {
    var btn = document.getElementById("playersContinueBtn");
    btn.disabled = state.players.length < 4;
    document.getElementById("playersSubtitle").textContent =
      window.t("playersSubtitle") + " · " + window.t("playersCount", { count: state.players.length });
  }

  function startEditPlayer(id) {
    var p = state.players.find(function (x) {
      return x.id === id;
    });
    if (!p) return;
    state.editingPlayerId = id;
    var input = document.getElementById("playerNameInput");
    input.value = p.name;
    input.focus();
    document.getElementById("addPlayerBtn").textContent = window.t("save");
  }

  function removePlayer(id) {
    state.players = state.players.filter(function (p) {
      return p.id !== id;
    });
    renderPlayerList();
  }

  function submitPlayerForm() {
    var input = document.getElementById("playerNameInput");
    var errorEl = document.getElementById("playerFieldError");
    var name = input.value.trim();
    errorEl.textContent = "";

    if (!name) {
      errorEl.textContent = window.t("playerNameEmpty");
      return;
    }
    var normalizedName = normalize(name);
    var duplicate = state.players.some(function (p) {
      return normalize(p.name) === normalizedName && p.id !== state.editingPlayerId;
    });
    if (duplicate) {
      errorEl.textContent = window.t("playerNameDuplicate");
      return;
    }

    if (state.editingPlayerId) {
      var p = state.players.find(function (x) {
        return x.id === state.editingPlayerId;
      });
      if (p) p.name = name;
      state.editingPlayerId = null;
      document.getElementById("addPlayerBtn").textContent = window.t("addPlayer");
    } else {
      if (state.players.length >= 12) {
        errorEl.textContent = window.t("playerMax");
        return;
      }
      state.players.push({ id: uid(), name: name });
    }

    input.value = "";
    renderPlayerList();
    input.focus();
  }

  /* ======================================================================
     TELA: TEMAS
     ====================================================================== */
  function renderThemeGrid() {
    var grid = document.getElementById("themeGrid");
    grid.innerHTML = "";
    ALL_THEME_KEYS.forEach(function (key) {
      var card = document.createElement("div");
      card.className = "theme-card" + (state.config.themes.indexOf(key) !== -1 ? " selected" : "");
      card.innerHTML =
        '<span class="theme-check" aria-hidden="true">✓</span>' +
        '<span class="theme-icon">' +
        THEME_ICONS[key] +
        '</span><span class="theme-label">' +
        window.t("theme_" + key) +
        '</span><span class="theme-desc">' +
        window.t("theme_desc_" + key) +
        "</span>";
      card.onclick = function () {
        toggleTheme(key);
      };
      grid.appendChild(card);
    });
    updateStartGameButton();
  }

  function toggleTheme(key) {
    var idx = state.config.themes.indexOf(key);
    if (idx === -1) {
      state.config.themes.push(key);
    } else {
      if (state.config.themes.length === 1) {
        showToast(window.currentLang === "en" ? "Select at least one theme." : "Selecione ao menos um tema.");
        return;
      }
      state.config.themes.splice(idx, 1);
    }
    saveSettings();
    renderThemeGrid();
  }

  function pickRandomTheme() {
    var randomKey = ALL_THEME_KEYS[randInt(0, ALL_THEME_KEYS.length - 1)];
    state.config.themes = [randomKey];
    saveSettings();
    renderThemeGrid();
    showToast(window.t("theme_" + randomKey));
  }

  function updateStartGameButton() {
    document.getElementById("startGameBtn").disabled = state.config.themes.length === 0;
  }

  /* ======================================================================
     TELA: CONFIGURAÇÕES
     ====================================================================== */
  function renderSettingsSelections() {
    setChipGroupSelection("languageChips", "data-lang", window.currentLang);
    setChipGroupSelection("impostorCountChips", "data-value", String(state.config.impostorCount));
    setChipGroupSelection("clueTimeChips", "data-value", String(state.config.clueTime));
    document.getElementById("impostorHintToggle").checked = !!state.config.impostorHint;
    document.getElementById("lastChanceToggle").checked = !!state.config.lastChance;
    document.getElementById("soundToggle").checked = !!state.config.sound;
  }

  function setChipGroupSelection(containerId, attr, value) {
    var container = document.getElementById(containerId);
    var chips = container.querySelectorAll(".chip");
    chips.forEach(function (chip) {
      chip.classList.toggle("selected", chip.getAttribute(attr) === value);
    });
  }

  function attachChipGroup(containerId, attr, onSelect) {
    var container = document.getElementById(containerId);
    container.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        onSelect(chip.getAttribute(attr));
      });
    });
  }

  /* ======================================================================
     LÓGICA DA PARTIDA — PREPARAÇÃO
     ====================================================================== */
  function getCombinedWordPool() {
    var pool = [];
    state.config.themes.forEach(function (themeKey) {
      var words = window.WORD_BANK[themeKey] || [];
      words.forEach(function (w) {
        pool.push({ theme: themeKey, entry: w });
      });
    });
    return pool;
  }

  function computeImpostorCount(playerCount) {
    if (state.config.impostorCount === "auto") {
      if (playerCount <= 6) return 1;
      if (playerCount <= 9) return 2;
      return randInt(0, 1) === 0 ? 2 : 3;
    }
    var fixed = parseInt(state.config.impostorCount, 10);
    // nunca deixa impostores >= metade dos jogadores para manter o jogo jogável
    var maxAllowed = Math.max(1, Math.floor(playerCount / 2) - 1);
    return Math.min(fixed, Math.max(1, maxAllowed));
  }

  function startMatch() {
    var pool = getCombinedWordPool();
    if (pool.length === 0) {
      showToast(window.currentLang === "en" ? "No words available." : "Nenhuma palavra disponível.");
      return;
    }
    var picked = pool[randInt(0, pool.length - 1)];
    var impostorCount = computeImpostorCount(state.players.length);
    var shuffledPlayers = shuffle(state.players);
    var impostorIds = shuffledPlayers.slice(0, impostorCount).map(function (p) {
      return p.id;
    });

    var impostorHints = {};
    impostorIds.forEach(function (id) {
      var hints = picked.entry.hints[window.currentLang] || picked.entry.hints.pt;
      impostorHints[id] = hints[randInt(0, hints.length - 1)];
    });

    var revealOrder = shuffle(state.players).map(function (p) {
      return p.id;
    });

    state.match = {
      theme: picked.theme,
      wordEntry: picked.entry,
      impostorIds: impostorIds,
      impostorHints: impostorHints,
      revealOrder: revealOrder,
      revealIndex: 0,
      revealStage: "intro", // intro | shown | pass | done
      remainingVotePlayers: state.players.map(function (p) {
        return p.id;
      }),
      accusedWrong: [],
      caughtImpostorId: null,
      cluesCurrentIndex: 0,
      cluesTimerHandle: null,
      cluesTimeLeft: state.config.clueTime,
      outcome: null // 'group' | 'impostor'
    };

    state.players.forEach(function (p) {
      if (state.scores[p.id] === undefined) state.scores[p.id] = 0;
    });

    goToRevealScreen();
  }

  function getWordText(entry) {
    entry = entry || state.match.wordEntry;
    return entry.word[window.currentLang] || entry.word.pt;
  }

  function getPlayerById(id) {
    return state.players.find(function (p) {
      return p.id === id;
    });
  }

  /* ======================================================================
     TELA: REVELAÇÃO
     ====================================================================== */
  function goToRevealScreen() {
    showScreen("screen-reveal");
    renderRevealScreen();
  }

  function renderRevealScreen() {
    var m = state.match;
    var introEl = document.getElementById("revealIntroState");
    var commonEl = document.getElementById("revealCommonResult");
    var impostorEl = document.getElementById("revealImpostorResult");
    var passEl = document.getElementById("revealPassState");
    var doneEl = document.getElementById("revealAllDoneState");

    [introEl].forEach(function (el) {
      el.style.display = "none";
    });
    [commonEl, impostorEl, passEl, doneEl].forEach(function (el) {
      el.classList.remove("show");
    });

    if (m.revealStage === "done") {
      doneEl.classList.add("show");
      return;
    }

    if (m.revealStage === "pass") {
      var nextPlayer = getPlayerById(m.revealOrder[m.revealIndex]);
      document.getElementById("revealPassName").textContent = window.t("revealPassPhoneTo", {
        name: nextPlayer ? nextPlayer.name : ""
      });
      passEl.classList.add("show");
      return;
    }

    var currentPlayer = getPlayerById(m.revealOrder[m.revealIndex]);
    document.getElementById("revealPlayerName").textContent = window.t("revealPassTo", {
      name: currentPlayer ? currentPlayer.name : ""
    });

    if (m.revealStage === "intro") {
      introEl.style.display = "";
      return;
    }

    if (m.revealStage === "shown") {
      var isImpostor = m.impostorIds.indexOf(currentPlayer.id) !== -1;
      if (isImpostor) {
        var hint = m.impostorHints[currentPlayer.id];
        var hintBox = document.getElementById("revealHintBox");
        var noHintText = document.getElementById("revealImpostorNoHintText");
        if (state.config.impostorHint && hint) {
          hintBox.style.display = "";
          document.getElementById("revealHintText").textContent = hint;
          noHintText.style.display = "none";
        } else {
          hintBox.style.display = "none";
          noHintText.style.display = "";
        }
        impostorEl.classList.add("show");
      } else {
        document.getElementById("revealWordText").textContent = getWordText();
        commonEl.classList.add("show");
      }
    }
  }

  function handleRevealFlip() {
    playSound("reveal");
    state.match.revealStage = "shown";
    renderRevealScreen();
  }

  function handleHideAndPass() {
    playSound("hide");
    var m = state.match;
    m.revealIndex++;
    if (m.revealIndex >= m.revealOrder.length) {
      m.revealStage = "done";
    } else {
      m.revealStage = "pass";
    }
    renderRevealScreen();
  }

  function handleRevealPassContinue() {
    state.match.revealStage = "intro";
    renderRevealScreen();
  }

  function goToCluesScreen() {
    var m = state.match;
    m.cluesCurrentIndex = 0;
    m.cluesTimeLeft = state.config.clueTime;
    showScreen("screen-clues");
    renderCluesScreen();
  }

  /* ======================================================================
     TELA: RODADA DE PISTAS
     ====================================================================== */
  function renderCluesScreen() {
    var m = state.match;
    var order = m.revealOrder;
    var currentPlayer = getPlayerById(order[m.cluesCurrentIndex]);
    document.getElementById("cluesCurrentPlayer").textContent = window.t("cluesPlayerTurn", {
      name: currentPlayer ? currentPlayer.name : ""
    });

    var timerBlock = document.getElementById("cluesTimerBlock");
    var noTimerText = document.getElementById("cluesNoTimerText");
    if (state.config.clueTime > 0) {
      timerBlock.style.display = "";
      noTimerText.style.display = "none";
      document.getElementById("cluesTimerDisplay").textContent = m.cluesTimeLeft;
    } else {
      timerBlock.style.display = "none";
      noTimerText.style.display = "";
    }

    var orderList = document.getElementById("cluesOrderList");
    orderList.innerHTML = "";
    order.forEach(function (id, idx) {
      var pill = document.createElement("span");
      pill.className = "order-pill";
      var player = getPlayerById(id);
      pill.textContent = (idx + 1) + ". " + (player ? player.name : "");
      if (idx === m.cluesCurrentIndex) {
        pill.style.borderColor = "var(--gold)";
        pill.style.color = "var(--gold-strong)";
        pill.style.fontWeight = "700";
      }
      orderList.appendChild(pill);
    });
  }

  function startClueTimer() {
    var m = state.match;
    if (state.config.clueTime <= 0) return;
    clearInterval(m.cluesTimerHandle);
    m.cluesTimeLeft = state.config.clueTime;
    document.getElementById("cluesTimerDisplay").textContent = m.cluesTimeLeft;
    m.cluesTimerHandle = setInterval(function () {
      m.cluesTimeLeft--;
      document.getElementById("cluesTimerDisplay").textContent = Math.max(0, m.cluesTimeLeft);
      if (m.cluesTimeLeft <= 3 && m.cluesTimeLeft > 0) playSound("tick");
      if (m.cluesTimeLeft <= 0) {
        clearInterval(m.cluesTimerHandle);
        playSound("wrong");
      }
    }, 1000);
  }

  function goToNextCluePlayer() {
    var m = state.match;
    clearInterval(m.cluesTimerHandle);
    m.cluesCurrentIndex = (m.cluesCurrentIndex + 1) % m.revealOrder.length;
    m.cluesTimeLeft = state.config.clueTime;
    renderCluesScreen();
  }

  /* ======================================================================
     TELA: VOTAÇÃO
     ====================================================================== */
  var selectedVoteId = null;

  function goToVoteScreen() {
    clearInterval(state.match.cluesTimerHandle);
    selectedVoteId = null;
    showScreen("screen-vote");
    renderVoteScreen();
  }

  function renderVoteScreen() {
    var list = document.getElementById("voteList");
    list.innerHTML = "";
    var m = state.match;
    m.remainingVotePlayers.forEach(function (id) {
      var player = getPlayerById(id);
      if (!player) return;
      var opt = document.createElement("div");
      opt.className = "vote-option" + (selectedVoteId === id ? " selected" : "");
      opt.innerHTML =
        '<span class="vote-avatar">' +
        player.name.trim().charAt(0).toUpperCase() +
        '</span><span class="vote-name">' +
        player.name +
        "</span>";
      opt.onclick = function () {
        selectedVoteId = id;
        renderVoteScreen();
      };
      list.appendChild(opt);
    });
    document.getElementById("voteConfirmBtn").disabled = !selectedVoteId;

    if (m.remainingVotePlayers.length === 0) {
      showToast(window.t("voteNoPlayersLeft"));
    }
  }

  function confirmVote() {
    if (!selectedVoteId) return;
    var m = state.match;
    var isImpostor = m.impostorIds.indexOf(selectedVoteId) !== -1;

    if (isImpostor) {
      playSound("correct");
      m.caughtImpostorId = selectedVoteId;
      if (state.config.lastChance) {
        goToLastChanceScreen();
      } else {
        // sem última chance: grupo vence diretamente
        m.outcome = "group";
        m.impostorGuessResult = null;
        goToResultScreen();
      }
    } else {
      playSound("wrong");
      m.accusedWrong.push(selectedVoteId);
      m.remainingVotePlayers = m.remainingVotePlayers.filter(function (id) {
        return id !== selectedVoteId;
      });
      showVoteWrongScreen(selectedVoteId);
    }
  }

  function showVoteWrongScreen(accusedId) {
    var accused = getPlayerById(accusedId);
    document.getElementById("voteWrongTitle").textContent = window.t("voteWrongTitle", {
      name: accused ? accused.name : ""
    });
    showScreen("screen-vote-wrong");
  }

  function handleVoteAgain() {
    selectedVoteId = null;
    if (state.match.remainingVotePlayers.length === 0) {
      // ninguém mais para acusar: impostor(es) vencem por falta de alvo
      state.match.outcome = "impostor";
      state.match.impostorGuessResult = null;
      goToResultScreen();
      return;
    }
    showScreen("screen-vote");
    renderVoteScreen();
  }

  /* ======================================================================
     TELA: ÚLTIMA CHANCE
     ====================================================================== */
  function goToLastChanceScreen() {
    var m = state.match;
    document.getElementById("lastChanceInput").value = "";
    var optionsWrap = document.getElementById("lastChanceOptions");
    optionsWrap.innerHTML = "";

    var themeWords = (window.WORD_BANK[m.theme] || []).slice();
    var correctText = getWordText();
    var distractors = shuffle(
      themeWords.filter(function (w) {
        return getWordText(w) !== correctText;
      })
    ).slice(0, 3);
    var options = shuffle([m.wordEntry].concat(distractors));

    options.forEach(function (entry) {
      var btn = document.createElement("div");
      btn.className = "vote-option";
      btn.textContent = getWordText(entry);
      btn.onclick = function () {
        document.getElementById("lastChanceInput").value = getWordText(entry);
      };
      optionsWrap.appendChild(btn);
    });

    showScreen("screen-last-chance");
  }

  function confirmLastChance() {
    var input = document.getElementById("lastChanceInput").value;
    var correct = normalize(getWordText()) === normalize(input);
    state.match.impostorGuessResult = correct;
    state.match.outcome = correct ? "impostor" : "group";
    playSound(correct ? "win" : "lose");
    goToResultScreen();
  }

  /* ======================================================================
     TELA: RESULTADO FINAL + PONTUAÇÃO
     ====================================================================== */
  function applyScores() {
    var m = state.match;
    var groupWon = m.outcome === "group";

    state.players.forEach(function (p) {
      var isImpostor = m.impostorIds.indexOf(p.id) !== -1;
      var wasCaught = p.id === m.caughtImpostorId;

      if (!isImpostor) {
        if (groupWon) {
          state.scores[p.id] = (state.scores[p.id] || 0) + 1;
        }
      } else {
        if (wasCaught) {
          if (m.impostorGuessResult === true) {
            state.scores[p.id] = (state.scores[p.id] || 0) + 3;
          }
        } else {
          // impostor(es) que não chegaram a ser acusados corretamente nesta rodada
          state.scores[p.id] = (state.scores[p.id] || 0) + 2;
        }
      }
    });
  }

  function goToResultScreen() {
    applyScores();
    var m = state.match;
    var groupWon = m.outcome === "group";

    document.getElementById("resultIcon").textContent = groupWon ? "🏆" : "🎭";
    var titleEl = document.getElementById("resultTitle");
    titleEl.textContent = groupWon ? window.t("resultGroupWinsTitle") : window.t("resultImpostorWinsTitle");
    titleEl.className = "result-title " + (groupWon ? "win" : "lose");

    var subtitleEl = document.getElementById("resultSubtitle");
    if (m.caughtImpostorId === null) {
      subtitleEl.textContent = window.t("resultImpostorWasNotFound");
    } else if (m.impostorGuessResult === true) {
      subtitleEl.textContent = window.t("resultImpostorGuessedRight");
    } else if (m.impostorGuessResult === false) {
      subtitleEl.textContent = window.t("resultImpostorGuessedWrong");
    } else {
      subtitleEl.textContent = "";
    }

    document.getElementById("resultWordLine").textContent = window.t("resultWordWas", { word: getWordText() });

    var impostorNames = m.impostorIds
      .map(function (id) {
        var p = getPlayerById(id);
        return p ? p.name : "";
      })
      .join(", ");
    var impostorLineEl = document.getElementById("resultImpostorLine");
    if (m.impostorIds.length > 1) {
      impostorLineEl.textContent = window.t("resultImpostorsWere", { names: impostorNames });
    } else {
      impostorLineEl.textContent = window.t("resultImpostorWas", { name: impostorNames });
    }

    renderScoreboard();
    saveSettings();
    showScreen("screen-result");
  }

  function renderScoreboard() {
    var list = document.getElementById("scoreboardList");
    list.innerHTML = "";
    var sorted = state.players.slice().sort(function (a, b) {
      return (state.scores[b.id] || 0) - (state.scores[a.id] || 0);
    });
    sorted.forEach(function (p) {
      var row = document.createElement("div");
      row.className = "score-row";
      var name = document.createElement("span");
      name.textContent = p.name;
      var points = document.createElement("span");
      points.className = "score-points";
      points.textContent = window.t("scorePoints", { points: state.scores[p.id] || 0 });
      row.appendChild(name);
      row.appendChild(points);
      list.appendChild(row);
    });
  }

  /* ======================================================================
     NAVEGAÇÃO GERAL / INICIALIZAÇÃO
     ====================================================================== */
  function init() {
    loadSettings();
    renderAllTexts();

    // ---------- Menu ----------
    document.getElementById("menuPlayBtn").onclick = function () {
      showScreen("screen-players");
      renderAllTexts();
    };
    document.getElementById("menuSettingsBtn").onclick = function () {
      showScreen("screen-settings");
      renderAllTexts();
    };
    document.getElementById("menuHowToPlayBtn").onclick = function () {
      document.getElementById("howToPlayModal").classList.add("show");
    };
    document.getElementById("howToPlayCloseBtn").onclick = function () {
      document.getElementById("howToPlayModal").classList.remove("show");
    };

    // ---------- Jogadores ----------
    document.getElementById("playersBackBtn").onclick = function () {
      showScreen("screen-menu");
    };
    document.getElementById("addPlayerBtn").onclick = submitPlayerForm;
    document.getElementById("playerNameInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter") submitPlayerForm();
    });
    document.getElementById("playersContinueBtn").onclick = function () {
      if (state.players.length < 4) {
        showToast(window.t("playerMin"));
        return;
      }
      showScreen("screen-themes");
      renderAllTexts();
    };

    // ---------- Temas ----------
    document.getElementById("themesBackBtn").onclick = function () {
      showScreen("screen-players");
    };
    document.getElementById("themeRandomBtn").onclick = pickRandomTheme;
    document.getElementById("startGameBtn").onclick = startMatch;

    // ---------- Configurações ----------
    document.getElementById("settingsBackBtn").onclick = function () {
      showScreen(state.players.length ? "screen-players" : "screen-menu");
    };
    document.getElementById("settingsDoneBtn").onclick = function () {
      showScreen(state.players.length ? "screen-players" : "screen-menu");
    };
    attachChipGroup("languageChips", "data-lang", function (lang) {
      window.currentLang = lang;
      saveSettings();
      renderAllTexts();
    });
    attachChipGroup("impostorCountChips", "data-value", function (val) {
      state.config.impostorCount = val === "auto" ? "auto" : parseInt(val, 10);
      saveSettings();
      renderSettingsSelections();
    });
    attachChipGroup("clueTimeChips", "data-value", function (val) {
      state.config.clueTime = parseInt(val, 10);
      saveSettings();
      renderSettingsSelections();
    });
    document.getElementById("impostorHintToggle").addEventListener("change", function (e) {
      state.config.impostorHint = e.target.checked;
      saveSettings();
    });
    document.getElementById("lastChanceToggle").addEventListener("change", function (e) {
      state.config.lastChance = e.target.checked;
      saveSettings();
    });
    document.getElementById("soundToggle").addEventListener("change", function (e) {
      state.config.sound = e.target.checked;
      saveSettings();
    });

    // ---------- Revelação ----------
    document.getElementById("revealFlipBtn").onclick = handleRevealFlip;
    document.getElementById("hideAndPassBtnCommon").onclick = handleHideAndPass;
    document.getElementById("hideAndPassBtnImpostor").onclick = handleHideAndPass;
    document.getElementById("revealPassContinueBtn").onclick = handleRevealPassContinue;
    document.getElementById("startCluesBtn").onclick = goToCluesScreen;

    // ---------- Pistas ----------
    document.getElementById("cluesStartTimerBtn").onclick = startClueTimer;
    document.getElementById("cluesNextPlayerBtn").onclick = goToNextCluePlayer;
    document.getElementById("cluesGoToVoteBtn").onclick = goToVoteScreen;

    // ---------- Votação ----------
    document.getElementById("voteConfirmBtn").onclick = confirmVote;
    document.getElementById("voteAgainBtn").onclick = handleVoteAgain;

    // ---------- Última chance ----------
    document.getElementById("lastChanceConfirmBtn").onclick = confirmLastChance;

    // ---------- Resultado ----------
    document.getElementById("playAgainBtn").onclick = function () {
      startMatch();
    };
    document.getElementById("newGameBtn").onclick = function () {
      state.players = [];
      showScreen("screen-players");
      renderAllTexts();
    };
    document.getElementById("backToMenuBtn").onclick = function () {
      showScreen("screen-menu");
    };

    renderPlayerList();
    renderThemeGrid();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
