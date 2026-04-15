# Memory Game (TypeScript)

## Overview

This project is a Memory Game implemented using TypeScript, HTML, CSS, and Bootstrap.
The goal of the project is to refactor and extend an existing game to improve code quality, structure, and user experience.

The game supports multiple players, configurable settings, and dynamic UI updates.

---

## Features

* Selectable number of card pairs (2–8 pairs)
* Two-player mode with alternating turns
* Dynamic scoreboard
* Active player highlighting
* Card flip animation
* Matched card highlighting
* End-game summary with winner and final scores
* Reset functionality

---

## Game Rules

1. Select the number of card pairs.
2. Click the **Start** button.
3. Players take turns flipping two cards.
4. If the cards match:

   * The cards remain visible
   * The player earns 1 point
   * The same player continues
5. If the cards do not match:

   * Cards flip back after a short delay
   * The turn switches to the other player
6. When all pairs are found, the game displays the final result.

---

## TypeScript Improvements (Refactoring)

The code was refactored to improve readability and maintainability using TypeScript best practices.

### Interfaces

Interfaces are used to define structured data:

* **CardData**

  * id
  * symbol
  * isFlipped
  * isMatched

* **Player**

  * id
  * name
  * score

This ensures type safety and clearer code structure.

---

### Generics

A generic function is used for shuffling arrays:

```ts
function shuffle<T>(array: T[]): T[]
```

This makes the function reusable for different data types.

---

### Functions

The logic is divided into clear functions:

* createDeck()
* startGame()
* clearGame()
* renderBoard()
* renderScoreBoard()
* flipCard()
* checkIfMatch()
* switchPlayer()
* showEndGameMessage()

This improves code readability and maintainability.

---

### DOM Type Safety

DOM elements are accessed with explicit TypeScript types:

```ts
const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
```

This avoids runtime errors and improves developer experience.

---

## UI / UX Improvements

* Active player is visually highlighted
* Smooth card flip animation using CSS
* Matched cards are styled differently
* End-game message includes:

  * Winner
  * Final scores of both players

---
