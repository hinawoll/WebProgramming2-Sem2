"use strict";
//Array mit Symbolen
const ALL_SYMBOLS = ["🍎", "🍋", "🍇", "🍍", "🍉", "🥝", "🍒", "🍌"];
//Array für die Karten (nur für CardData-Typ Objekte)
let cards = [];
//Array für aufgedeckte Karten.
let flippedCards = [];
//Anzahl der gefundenen Kartenpaare.
let matchedPairs = 0;
let lockBoard = false;
let currentPlayerIndex = 0;
let players = [
    { id: 1, name: "Player 1", score: 0 },
    { id: 2, name: "Player 2", score: 0 },
];
//DOM Type Safety, um Raufzeitsfehler zu vermeiden
const scoreBoard = document.getElementById("score-board");
const message = document.getElementById("message");
const resetBtn = document.getElementById("reset-btn");
//Fehlermeldung
const gameBoard = document.getElementById("game-board");
if (!gameBoard) {
    throw new Error("game-board not found");
}
//as HTML... : den Typ deklarieren
const pairCountSelect = document.getElementById("pair-count");
const startBtn = document.getElementById("start-btn");
//ein Array mischen durch generic
function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
//erstellen die Daten der Karten
function createDeck(pairCount) {
    const selectedSymbols = ALL_SYMBOLS.slice(0, pairCount);
    const deckSymbols = shuffle([...selectedSymbols, ...selectedSymbols]);
    return deckSymbols.map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
    }));
}
function startGame() {
    const pairCount = Number(pairCountSelect.value);
    cards = createDeck(pairCount);
    flippedCards = [];
    matchedPairs = 0;
    lockBoard = false;
    currentPlayerIndex = 0;
    players = [
        { id: 1, name: "Player 1", score: 0 },
        { id: 2, name: "Player 2", score: 0 },
    ];
    message.textContent = "";
    renderBoard();
    renderScoreBoard();
}
function clearGame() {
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    lockBoard = false;
    currentPlayerIndex = 0;
    players = [
        { id: 1, name: "Player 1", score: 0 },
        { id: 2, name: "Player 2", score: 0 },
    ];
    message.textContent = "";
    renderBoard();
    renderScoreBoard();
}
//die Karten sichtbar machen
function renderBoard() {
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
function renderScoreBoard() {
    scoreBoard.innerHTML = players
        .map((player, index) => `
        <div class="player-box ${index === currentPlayerIndex ? "active-player" : ""}">
          ${player.name}: ${player.score}
        </div>
      `)
        .join("");
}
function flipCard(cardId) {
    //Wenn das gameBoard gerade gesperrt ist, passiert nichts.
    if (lockBoard)
        return;
    //Falls schon 2 Karten im Array sind, darf keine dritte geöffnet werden.
    if (flippedCards.length === 2)
        return;
    const card = cards.find((c) => c.id === cardId);
    if (!card)
        return;
    if (card.isFlipped || card.isMatched)
        return;
    card.isFlipped = true;
    flippedCards.push(card);
    renderBoard();
    //Wenn 2 Karten offen sind, prüfen ob sie zusammenpassen.
    if (flippedCards.length === 2) {
        checkIfMatch();
    }
}
function checkIfMatch() {
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
        renderScoreBoard();
        renderBoard();
        //wenn alle Paare aufgedeckt wurden
        if (matchedPairs === cards.length / 2) {
            showEndGameMessage();
        }
    }
    else {
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
function switchPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    renderScoreBoard();
}
function showEndGameMessage() {
    const maxScore = Math.max(...players.map((p) => p.score));
    const winners = players.filter((p) => p.score === maxScore);
    if (winners.length === 1) {
        message.innerHTML = `
${winners[0].name} wins with ${winners[0].score} points!<br>
Final Scores:<br>
Player 1: ${players[0].score}<br>
Player 2: ${players[1].score}
`;
    }
    else {
        message.textContent = `It's a draw! Score: ${maxScore}`;
    }
}
renderScoreBoard();
startBtn.addEventListener("click", () => {
    startGame();
    startBtn.classList.add("invisible");
    resetBtn.classList.remove("invisible");
});
resetBtn.addEventListener("click", () => {
    startBtn.classList.remove("invisible");
    resetBtn.classList.add("invisible");
    clearGame();
});
