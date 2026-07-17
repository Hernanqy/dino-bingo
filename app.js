(function () {
  "use strict";

  var cards = [
    {
      id: 1,
      name: "Argentinosaurus",
      image: "./public/cards/b1.png"
    },
    {
      id: 2,
      name: "Carnotaurus",
      image: "./public/cards/b2.png"
    },
    {
      id: 3,
      name: "Giganotosaurus",
      image: "./public/cards/b3.png"
    },
    {
      id: 4,
      name: "Aristonectes",
      image: "./public/cards/b4.png"
    },
    {
      id: 5,
      name: "Aerotitan",
      image: "./public/cards/b5.png"
    },
    {
      id: 6,
      name: "Pliosaur",
      image: "./public/cards/b6.png"
    },
    {
      id: 7,
      name: "Pterodactilo",
      image: "./public/cards/b7.png"
    },
    {
      id: 8,
      name: "Tethyshadros",
      image: "./public/cards/b8.png"
    },
    {
      id: 9,
      name: "Tylosaurus",
      image: "./public/cards/b9.png"
    }
  ];

  var remainingCards = [];
  var drawnCards = [];
  var isDrawing = false;

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

  function resetGame() {
    remainingCards = copyCards();
    drawnCards = [];
    isDrawing = false;

    selectedImage.src = "";
    selectedImage.alt = "";

    selectionStage.className = "selection-stage";
    selectionMessage.textContent = "Presioná el botón para comenzar el sorteo.";
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

    historyCounter.textContent = drawnCards.length + " / " + cards.length;
  }

  function getRandomCard() {
    var randomIndex = Math.floor(Math.random() * remainingCards.length);
    var selected = remainingCards[randomIndex];

    remainingCards.splice(randomIndex, 1);

    return selected;
  }

  function clearStageAnimations() {
    selectionStage.classList.remove(
      "is-shuffling",
      "is-approaching",
      "is-revealed"
    );

    void selectionStage.offsetWidth;
  }

  function drawCard() {
    if (isDrawing || remainingCards.length === 0) {
      return;
    }

    isDrawing = true;
    drawButton.disabled = true;

    clearStageAnimations();

    selectedImage.src = "";
    selectedImage.alt = "";

    selectionMessage.textContent = "La TARJETAS está girando...";
    selectionStage.classList.add("is-shuffling");

    window.setTimeout(function () {
      var selected = getRandomCard();

      selectionStage.classList.remove("is-shuffling");
      selectionStage.classList.add("is-approaching");

      selectionMessage.textContent = "Una tarjeta está siendo seleccionada...";

      window.setTimeout(function () {
        selectedImage.src = selected.image;
        selectedImage.alt = selected.name;

        selectionStage.classList.remove("is-approaching");
        selectionStage.classList.add("is-revealed");

        selectionMessage.textContent = "¡Salió " + selected.name + "!";

        window.setTimeout(function () {
          drawnCards.push(selected);
          renderHistory();

          isDrawing = false;

          if (remainingCards.length > 0) {
            drawButton.disabled = false;
            drawButton.textContent = "ELEGIR TARJETA AL AZAR";

            progressText.textContent =
              "Tarjeta " + (drawnCards.length + 1) + " de " + cards.length;
          } else {
            drawButton.disabled = true;
            drawButton.textContent = "SORTEO COMPLETADO";
            progressText.textContent = "9 tarjetas sorteadas";

            window.setTimeout(function () {
              finishScreen.classList.remove("hidden");
            }, 1200);
          }
        }, 950);
      }, 850);
    }, 2300);
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

    gameScreen.classList.add("hidden");
    finishScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
  }

  startButton.addEventListener("click", startGame);
  drawButton.addEventListener("click", drawCard);
  homeButton.addEventListener("click", returnHome);
  resetButton.addEventListener("click", resetGame);
  playAgainButton.addEventListener("click", resetGame);



  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function (error) {
        console.log("No se pudo registrar el modo sin conexión:", error);
      });
    });
  }

  resetGame();
})();








