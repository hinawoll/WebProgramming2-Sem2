# Memory Game (TypeScript)

## Overview
This project is a simple Memory Game implemented with TypeScript, HTML, CSS, and Bootstrap.  
The game allows players to choose the number of card pairs, start a new game, and play in a two-player mode with alternating turns.

The project was refactored to improve readability, maintainability, and structure.

---

## Features

- Selectable number of card pairs before the game starts
- Two-player mode
- Alternating turns between players
- Dynamic scoreboard update
- Active player highlight
- Card flip animation
- Matched card styling
- End-game message showing the winner or a draw
- Reset functionality

---

## Refactoring / TypeScript Improvements

The code was improved using TypeScript best practices:

### 1. Interfaces
Interfaces are used to define the structure of important objects.

- `CardData`
  - `id`
  - `symbol`
  - `isFlipped`
  - `isMatched`

- `Player`
  - `id`
  - `name`
  - `score`

This makes the code easier to understand and helps prevent type-related mistakes.

### 2. Generics
A generic function is used for shuffling arrays:

```ts
function shuffle<T>(array: T[]): T[]
