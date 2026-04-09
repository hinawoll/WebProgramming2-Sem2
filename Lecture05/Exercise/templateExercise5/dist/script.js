"use strict";
//beim Compilieren wird mit den folgenden ein Fehler kommen
// currentIndex = "hello";
// loadedNotes = ["C", "D", "X"];
var _a, _b, _c;
class PianoKey {
    constructor(note, key, elementId, audioFile) {
        this.note = note;
        this.key = key;
        this.elementId = elementId;
        this.audio = new Audio(audioFile);
    }
}
const pianoKeys = [
    new PianoKey("C", "a", "keyC", "sounds/C.mp3"),
    new PianoKey("D", "s", "keyD", "sounds/D.mp3"),
    new PianoKey("E", "d", "keyE", "sounds/E.mp3"),
    new PianoKey("F", "f", "keyF", "sounds/F.mp3"),
    new PianoKey("G", "g", "keyG", "sounds/G.mp3"),
    new PianoKey("A", "h", "keyA", "sounds/A.mp3"),
    new PianoKey("B", "j", "keyB", "sounds/B.mp3")
];
//Type Annotations
let loadedNotes = [];
let currentIndex = 0;
let playInterval = null;
let isPlaying = false;
//Type Annotations
function playNote(note) {
    const keyObject = pianoKeys.find((pianoKey) => pianoKey.note === note);
    if (!keyObject)
        return;
    const keyElement = document.getElementById(keyObject.elementId);
    if (!keyElement)
        return;
    keyElement.classList.add("active");
    setTimeout(() => {
        keyElement.classList.remove("active");
    }, 300);
    keyObject.audio.currentTime = 0;
    keyObject.audio.play();
}
//Type Annotations
async function loadNotes() {
    try {
        const response = await fetch("notes.json");
        const data = await response.json();
        console.log("loaded data:", data);
        if (data.songs.length > 0) {
            loadedNotes = data.songs[0].notes;
            renderNoteSequence();
        }
    }
    catch (error) {
        console.error("Error loading notes:", error);
    }
}
//Type Annotations
function renderNoteSequence() {
    const noteSequenceContainer = document.getElementById("noteSequence");
    if (!noteSequenceContainer)
        return;
    noteSequenceContainer.innerHTML = "";
    loadedNotes.forEach((note, index) => {
        const noteButton = document.createElement("button");
        noteButton.textContent = note;
        noteButton.classList.add("btn", "btn-outline-primary", "m-1", "sequence-note");
        noteButton.addEventListener("click", () => {
            playNote(note);
        });
        noteSequenceContainer.appendChild(noteButton);
    });
}
//Type Annotations
function highlightCurrentNote(index) {
    const sequenceButtons = document.querySelectorAll(".sequence-note");
    sequenceButtons.forEach((button) => button.classList.remove("current-note"));
    if (sequenceButtons[index]) {
        sequenceButtons[index].classList.add("current-note");
    }
}
//Type Annotations
function startPlayback() {
    if (isPlaying || loadedNotes.length === 0)
        return;
    isPlaying = true;
    playInterval = window.setInterval(() => {
        if (currentIndex >= loadedNotes.length) {
            stopPlayback();
            return;
        }
        playNote(loadedNotes[currentIndex]);
        highlightCurrentNote(currentIndex);
        currentIndex++;
    }, 800);
}
function pausePlayback() {
    if (playInterval !== null) {
        clearInterval(playInterval);
    }
    isPlaying = false;
}
function stopPlayback() {
    if (playInterval !== null) {
        clearInterval(playInterval);
    }
    isPlaying = false;
    currentIndex = 0;
    highlightCurrentNote(-1);
}
function resetApp() {
    if (playInterval !== null) {
        clearInterval(playInterval);
    }
    isPlaying = false;
    currentIndex = 0;
    document.querySelectorAll(".key").forEach((key) => {
        key.classList.remove("active");
    });
    document.querySelectorAll(".sequence-note").forEach((note) => {
        note.classList.remove("current-note");
    });
    console.log("App reset");
}
document.querySelectorAll(".key").forEach((keyElement) => {
    keyElement.addEventListener("click", () => {
        const note = keyElement.getAttribute("data-note");
        if (note) {
            playNote(note);
        }
    });
});
//Type Annotation
document.addEventListener("keydown", (event) => {
    //ここではpressedKeyに型を書いてないけど、TypeScriptは自動でstringだと推論する。
    const pressedKey = event.key.toLowerCase();
    if (event.code === "Space") {
        event.preventDefault();
        if (isPlaying) {
            pausePlayback();
        }
        else {
            startPlayback();
        }
        return;
    }
    if (pressedKey === "r") {
        resetApp();
        return;
    }
    const keyObject = pianoKeys.find((pianoKey) => pianoKey.key === pressedKey);
    if (keyObject) {
        playNote(keyObject.note);
    }
});
(_a = document.getElementById("playBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", startPlayback);
(_b = document.getElementById("pauseBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", pausePlayback);
(_c = document.getElementById("resetBtn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", resetApp);
loadNotes();
