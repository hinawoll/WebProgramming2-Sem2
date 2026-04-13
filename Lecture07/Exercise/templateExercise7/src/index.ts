import { NumericLiteral } from "../../../../../../../../node_modules/typescript/lib/typescript";

//Array mit Symbolen
const ALL_SYMBOLS: string[] = ["🍎", "🍋", "🍇", "🍍", "🍉", "🥝", "🍒", "🍌"];

//jede Karte hat die folgende Infomationen
interface CardData {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

//jeder Player hat die folgende Infomationen
interface Player {
  id: number;
  name: string;
  score: number;
}

enum TurnResult {
  Match = "MATCH",
  NoMatch = "NO_MATCH",
}

//Array für die Karten (nur für CardData-Typ Objekte)
let cards: CardData[] = [];
//Array für aufgedeckte Karten.
let flippedCards: CardData[] = [];
//Anzahl der gefundenen Kartenpaare.
let matchedPairs = 0;
let lockBoard = false;
let currentPlayerIndex = 0;

let players: Player[] = [
  { id: 1, name: "Player 1", score: 0 },
  { id: 2, name: "Player 2", score: 0 },
];

const scoreBoard = document.getElementById("score-board") as HTMLDivElement;
const message = document.getElementById("message") as HTMLParagraphElement;
const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;

//Fehlermeldung
const gameBoard = document.getElementById("game-board") as HTMLDivElement;
if (!gameBoard) {
  throw new Error("game-board not found");
}

//as HTML... : den Typ deklarieren
const pairCountSelect = document.getElementById(
  "pair-count",
) as HTMLSelectElement;
const startBtn = document.getElementById("start-btn") as HTMLButtonElement;

//da value immer string ist, muss es zu Anzahl geändert werden
//wenn da 6 ausgewählt wird, wird pairCount 6.
const pairCount = Number(pairCountSelect.value);
cards = createDeck(pairCount);
renderBoard();

//Player wechseln
function switchPlayer(): void {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  renderScoreBoard();
}

//ein Array mischen durch generic
function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createDeck(pairCount: number): CardData[] {
  const selectedSymbols = ALL_SYMBOLS.slice(0, pairCount);
  const deckSymbols = shuffle([...selectedSymbols, ...selectedSymbols]);

  return deckSymbols.map((symbol, index) => ({
    id: index,
    symbol,
    isFlipped: false,
    isMatched: false,
  }));
}

//Karten erstellen
function renderBoard(): void {
  //der Inhalt in gameBoard wird gelöscht.
  gameBoard.innerHTML = "";

  //Karten erstelln und Klasse einfuegen
  cards.forEach((cardData) => {
    const card = document.createElement("div");
    card.classList.add("card");

    if (cardData.isFlipped || cardData.isMatched) {
      card.classList.add("flipped");
      card.textContent = cardData.symbol;
    }

    if (cardData.isMatched) {
      card.classList.add("matched");
    }

    card.addEventListener("click", () => flipCard(cardData.id));
    gameBoard.appendChild(card);
  });
}

//eine Funktion zum Umdrehen einer Karte.
function flipCard(cardId: number): void {
  //Wenn das gameBoard gerade gesperrt ist, passiert nichts.
  if (lockBoard) return;
  //Falls schon 2 Karten im Array sind, darf keine dritte geöffnet werden.
  if (flippedCards.length === 2) return;

  const card = cards.find((c) => c.id === cardId);
  if (!card) return;
  if (card.isFlipped || card.isMatched) return;

  card.isFlipped = true;
  flippedCards.push(card);
  renderBoard();

  //Wenn 2 Karten offen sind, prüfen ob sie zusammenpassen.
  if (flippedCards.length === 2) {
    checkIfMatch();
  }
}

//Funktion zum Vergleichen der Karten
function checkIfMatch(): void {
  //Zwei Karten aus dem Array holen
  const firstCard = flippedCards[0];
  const secondCard = flippedCards[1];

  //Prüfen, ob die Symbole gleich sind
  if (firstCard.symbol === secondCard.symbol) {
    firstCard.isMatched = true;
    secondCard.isMatched = true;
    matchedPairs++;

    //das Array wird geleert
    flippedCards = [];

    players[currentPlayerIndex].score++;

    //wenn alle Paare aufgedeckt wurden
    if (matchedPairs === cards.length / 2) {
      showEndGameMessage();
      resetBtn.classList.remove("invisible");
    }
  } else {
    //Falls 1. und 2.Karte nicht gleich sind
    //Das Spielfeld(gameBoard) wird gesperrt.
    lockBoard = true;

    setTimeout(() => {
      //Die Symbole werden wieder versteckt.
      firstCard.isFlipped = false;
      secondCard.isFlipped = false;

      //Array leeren und Spielfeld wieder freigeben.
      flippedCards = [];
      lockBoard = false;

      switchPlayer();
      renderBoard();
    }, 1000);
  }
}

function renderScoreBoard(): void {
  scoreBoard.innerHTML = players
    .map(
      (player, index) => `
        <div class="${index === currentPlayerIndex ? "active-player" : ""}">
          ${player.name}: ${player.score}
        </div>
      `
    )
    .join("");
}


function resetGame() : void {
  const pairCount = Number(pairCountSelect.value);
  cards = createDeck(pairCount);

  flippedCards = [];
  matchedPairs = 0;
  lockBoard = false;
  currentPlayerIndex = 0;

  players = [
    { id: 1, name: "Player 1", score: 0 },
    { id: 2, name: "Player 2", score: 0 }
  ];

  message.textContent = "";
  resetBtn.classList.add("invisible");

  renderBoard();
  renderScoreBoard();
}

startBtn.addEventListener("click", resetGame);

resetBtn.addEventListener("click", () => {
  resetGame();
  resetBtn.classList.add("invisible");
});

shuffle(ALL_SYMBOLS);
renderBoard();

function showEndGameMessage(): void {
  const maxScore = Math.max(...players.map((p) => p.score));
  const winners = players.filter((p) => p.score === maxScore);

  if (winners.length === 1) {
    message.textContent = `${winners[0].name} wins with ${winners[0].score} points!`;
  } else {
    message.textContent = `It's a draw! Score: ${maxScore}`;
  }
}
