(function () {
  "use strict";

  var cards = [
    { id: 1, name: "Argentinosaurus", image: "./public/cards/b1.png" },
    { id: 2, name: "Carnotaurus", image: "./public/cards/b2.png" },
    { id: 3, name: "Giganotosaurus", image: "./public/cards/b3.png" },
    { id: 4, name: "Aristonectes", image: "./public/cards/b4.png" },
    { id: 5, name: "Aerotitan", image: "./public/cards/b5.png" },
    { id: 6, name: "Pliosaur", image: "./public/cards/b6.png" },
    { id: 7, name: "Pterodactilo", image: "./public/cards/b7.png" },
    { id: 8, name: "Tethyshadros", image: "./public/cards/b8.png" },
    { id: 9, name: "Tylosaurus", image: "./public/cards/b9.png" }
  ];

  var remainingCards = [];
  var drawnCards = [];
  var isDrawing = false;

  var drawRunId = 0;
  var activeTimers = [];

  var startScreen = document.getElementById("startScreen");
  var gameScreen = document.getElementById("gameScreen");
  var finishScreen = document.getElementById("finishScreen");

  var startButton = document.getElementById("startButton");
  var drawButton = document.getElementById("drawButton");
  var homeButton = document.getElementById("homeButton");
  var resetButton = document.getElementById("resetButton");
  var playAgainButton = document.getElementById("playAgainButton");

  var selectionStage = document.getElementById("selectionStage");
  var selectedImage = document.getElementById("selectedImage");
  var selectionMessage = document.getElementById("selectionMessage");
  var progressText = document.getElementById("progressText");
  var historyCounter = document.getElementById("historyCounter");
  var historyGrid = document.getElementById("historyGrid");

  function copyCards() {
    return cards.slice();
  }

  function clearTimers() {
    for (var i = 0; i < activeTimers.length; i += 1) {
      window.clearTimeout(activeTimers[i]);
    }

    activeTimers = [];
  }

  function schedule(callback, delay, runId) {
    var timer = window.setTimeout(function () {
      if (runId !== drawRunId) {
        return;
      }

      callback();
    }, delay);

    activeTimers.push(timer);

    return timer;
  }

  function forceRedraw() {
    void selectionStage.offsetWidth;
  }

  function setStageState(stateClass) {
    selectionStage.className = "selection-stage";

    forceRedraw();

    if (stateClass) {
      selectionStage.classList.add(stateClass);
    }

    forceRedraw();
  }

  function resetGame() {
    drawRunId += 1;
    clearTimers();

    remainingCards = copyCards();
    drawnCards = [];
    isDrawing = false;

    selectedImage.src = "";
    selectedImage.alt = "";

    setStageState("");

    selectionMessage.textContent =
      "Presioná el botón para comenzar el sorteo.";

    drawButton.textContent = "ELEGIR TARJETA AL AZAR";
    drawButton.disabled = false;

    progressText.textContent = "Tarjeta 1 de 9";

    finishScreen.classList.add("hidden");

    renderHistory();
  }

  function renderHistory() {
    historyGrid.innerHTML = "";

    for (var i = 0; i < cards.length; i += 1) {
      var slot = document.createElement("div");

      slot.className = "history-slot";

      if (drawnCards[i]) {
        var image = document.createElement("img");

        image.src = drawnCards[i].image;
        image.alt = drawnCards[i].name;

        slot.classList.add("revealed");
        slot.appendChild(image);
      } else {
        slot.textContent = String(i + 1);
      }

      historyGrid.appendChild(slot);
    }

    historyCounter.textContent =
      drawnCards.length + " / " + cards.length;
  }

  function getRandomCard() {
    var randomIndex =
      Math.floor(Math.random() * remainingCards.length);

    var selected = remainingCards[randomIndex];

    remainingCards.splice(randomIndex, 1);

    return selected;
  }

  function showSelectedCard(selected) {
    selectedImage.src = selected.image;
    selectedImage.alt = selected.name;

    setStageState("is-revealed");

    /* No mostramos “¡Salió...!” porque la tarjeta ya tiene el nombre. */
    selectionMessage.textContent = "";
  }

  function finishDraw(selected, runId, state) {
    if (
      state.finished ||
      runId !== drawRunId ||
      !isDrawing
    ) {
      return;
    }

    state.finished = true;

    clearTimers();

    showSelectedCard(selected);

    drawnCards.push(selected);
    renderHistory();

    isDrawing = false;

    if (remainingCards.length > 0) {
      drawButton.disabled = false;
      drawButton.textContent = "ELEGIR TARJETA AL AZAR";

      progressText.textContent =
        "Tarjeta " +
        (drawnCards.length + 1) +
        " de " +
        cards.length;
    } else {
      drawButton.disabled = true;
      drawButton.textContent = "SORTEO COMPLETADO";
      progressText.textContent = "9 tarjetas sorteadas";

      schedule(function () {
        finishScreen.classList.remove("hidden");
      }, 800, runId);
    }
  }

  function drawCard() {
    if (isDrawing || remainingCards.length === 0) {
      return;
    }

    drawRunId += 1;

    var runId = drawRunId;
    var selected = null;
    var state = {
      finished: false
    };

    clearTimers();

    isDrawing = true;
    drawButton.disabled = true;

    selectedImage.src = "";
    selectedImage.alt = "";

    selectionMessage.textContent = "Mezclando tarjetas...";

    setStageState("is-shuffling");

    schedule(function () {
      if (!selected) {
        selected = getRandomCard();
      }

      setStageState("is-approaching");

      selectionMessage.textContent =
        "Seleccionando una tarjeta...";
    }, 1700, runId);

    schedule(function () {
      if (!selected) {
        selected = getRandomCard();
      }

      showSelectedCard(selected);
    }, 2500, runId);

    schedule(function () {
      if (!selected) {
        selected = getRandomCard();
      }

      finishDraw(selected, runId, state);
    }, 3150, runId);

    /*
      Temporizador de seguridad para Windows 7.
      Si el renderizado o la animación se congelan,
      completa igualmente el sorteo.
    */
    schedule(function () {
      if (!selected) {
        selected = getRandomCard();
      }

      finishDraw(selected, runId, state);
    }, 4800, runId);
  }

  function startGame() {
    resetGame();

    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    window.setTimeout(function () {
      drawButton.focus();
    }, 100);
  }

  function returnHome() {
    if (isDrawing) {
      return;
    }

    drawRunId += 1;
    clearTimers();

    gameScreen.classList.add("hidden");
    finishScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
  }

  startButton.addEventListener("click", startGame);
  drawButton.addEventListener("click", drawCard);
  homeButton.addEventListener("click", returnHome);
  resetButton.addEventListener("click", resetGame);
  playAgainButton.addEventListener("click", resetGame);

  /*
    El Service Worker se registra solamente en la web.
    Dentro del ejecutable se cargan todos los archivos localmente.
  */
  if (
    (window.location.protocol === "http:" ||
      window.location.protocol === "https:") &&
    "serviceWorker" in navigator
  ) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("./sw.js")
        .catch(function (error) {
          console.log(
            "No se pudo registrar el modo sin conexión:",
            error
          );
        });
    });
  }

  resetGame();
})();