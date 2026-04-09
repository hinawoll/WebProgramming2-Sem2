//Array mit Symbolen
const cardSymbols = [
  "🍎", "🍎",
  "🍋", "🍋",
  "🍇", "🍇",
  "🍍", "🍍"
];

//Array für aufgedeckte Karten.
let flippedCards = [];
//Anzahl der gefundenen Kartenpaare.
let matchedPairs = 0;
let lockBoard = false;


const gameBoard = document.getElementById("game-board");
const message = document.getElementById("message");
const resetBtn = document.getElementById("reset-btn");


//eine Funktion zum Mischen eines Arrays
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

//eine Funktion zum Erstellen der Karten
function renderCards() {
  //der Inhalt in gameBoard wird gelöscht.
  gameBoard.innerHTML = "";

  //Karten erstelln und Klasse einfuegen
  cardSymbols.forEach((symbol) => {
    const card = document.createElement("div");
    card.classList.add("card");

    //z.B. symbol = 🍎  =>  <div class="card" data-symbol="🍎"></div>
    card.dataset.symbol = symbol;

    card.addEventListener("click", flipCard);

    //Karten in HTML einfuegen
    gameBoard.appendChild(card);
  });
}

//eine Funktion zum Umdrehen einer Karte.
function flipCard() {
  //Wenn das gameBoard gerade gesperrt ist, passiert nichts.
  if (lockBoard) return;

  //Wenn dieselbe Karte schon offen ist, darf man sie nicht nochmal anklicken.
  if (this.classList.contains("flipped")) return;

  //Falls schon 2 Karten im Array sind, darf keine dritte geöffnet werden.
  if (flippedCards.length === 2) return;

  //Karte sichtbar machen
  this.classList.add("flipped"); //gibt der Karte die CSS-Klasse
  this.textContent = this.dataset.symbol; //zeigt das Emoji an

  //Karte im Array speichern
  flippedCards.push(this);

  //Wenn 2 Karten offen sind, prüfen of sie zusammenpassen.
  if (flippedCards.length === 2) {
    checkIfMatch();
  }
}

//Funktion zum Vergleichen der Karten
function checkIfMatch() {
  //Zwei Karten aus dem Array holen
  const firstCard = flippedCards[0];
  const secondCard = flippedCards[1];

  //Prüfen, ob die Symbole gleich sind
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    matchedPairs++;
    //das Array wird geleert
    flippedCards = [];

    //wenn alle Paare aufgedeckt wurden
    if (matchedPairs === cardSymbols.length / 2) {
      message.textContent = "Game Clear!";
      resetBtn.classList.remove("invisible");
    }
  } else {
    //Falls 1. und 2.Karte nicht gleich sind
    //Das Spielfeld(gameBoard) wird gesperrt.
    lockBoard = true;

    setTimeout(() => {
      //Die Symbole werden wieder versteckt.
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.textContent = "";
      secondCard.textContent = "";

      //Array leeren und Spielfeld wieder freigeben.
      flippedCards = [];
      lockBoard = false;
    }, 1000); //1000: nach einer Sekunde
  }
}

//Funktion für Neustart
function resetGame() {
  flippedCards = [];
  matchedPairs = 0;
  lockBoard = false;
  message.textContent = "";

  //das Array(cardSymbols) mischen
  shuffle(cardSymbols);
  renderCards();
}


resetBtn.addEventListener("click",() => {
  resetGame();
  resetBtn.classList.add("invisible");
});

shuffle(cardSymbols);
renderCards();