// Piano keys as JavaScript objects
const pianoKeys = [
    { note: "C", key: "a", elementId: "keyC", audio: new Audio("sounds/C.mp3") },
    { note: "D", key: "s", elementId: "keyD", audio: new Audio("sounds/D.mp3") },
    { note: "E", key: "d", elementId: "keyE", audio: new Audio("sounds/E.mp3") },
    { note: "F", key: "f", elementId: "keyF", audio: new Audio("sounds/F.mp3") },
    { note: "G", key: "g", elementId: "keyG", audio: new Audio("sounds/G.mp3") },
    { note: "A", key: "h", elementId: "keyA", audio: new Audio("sounds/A.mp3") },
    { note: "B", key: "j", elementId: "keyB", audio: new Audio("sounds/B.mp3") }
];

let loadedNotes = [];
let currentIndex = 0;
let playInterval = null;
let isPlaying = false;

// Play one note
function playNote(note) {
    const keyObject = pianoKeys.find(pianoKey => pianoKey.note === note);
    if (!keyObject) return;

    const keyElement = document.getElementById(keyObject.elementId);
    if (!keyElement) return;

    keyElement.classList.add("active");

    setTimeout(() => {
        keyElement.classList.remove("active");
    }, 300);

    // play sound
    keyObject.audio.currentTime = 0;
    keyObject.audio.play();
}

// Load notes from JSON
async function loadNotes() {
    try {
        const response = await fetch("notes.json");
        const data = await response.json();

        loadedNotes = data.songs[0].notes;
        renderNoteSequence();
    } catch (error) {
        console.error("Error loading notes:", error);
    }
}

// Show loaded notes on screen
function renderNoteSequence() {
    const noteSequenceContainer = document.getElementById("noteSequence");
    noteSequenceContainer.innerHTML = "";

    loadedNotes.forEach((note, index) => {
        const noteButton = document.createElement("button");
        noteButton.textContent = note;
        noteButton.classList.add("btn", "btn-outline-primary", "m-1", "sequence-note");

        // Additional mouse interaction:
        // click loaded note to play it
        noteButton.addEventListener("click", () => {
            playNote(note);
        });

        noteSequenceContainer.appendChild(noteButton);
    });
}

// Highlight current autoplay note
function highlightCurrentNote(index) {
    const sequenceButtons = document.querySelectorAll(".sequence-note");
    sequenceButtons.forEach(button => button.classList.remove("current-note"));

    if (sequenceButtons[index]) {
        sequenceButtons[index].classList.add("current-note");
    }
}

// Start autoplay
function startPlayback() {
    if (isPlaying || loadedNotes.length === 0) return;

    isPlaying = true;

    playInterval = setInterval(() => {
        if (currentIndex >= loadedNotes.length) {
            stopPlayback();
            return;
        }

        playNote(loadedNotes[currentIndex]);
        highlightCurrentNote(currentIndex);
        currentIndex++;
    }, 800);
}

// Pause autoplay
function pausePlayback() {
    clearInterval(playInterval);
    isPlaying = false;
}

// Stop and reset playback position
function stopPlayback() {
    clearInterval(playInterval);
    isPlaying = false;
    currentIndex = 0;
    highlightCurrentNote(-1);
}

// Reset app
function resetApp() {
    clearInterval(playInterval);
    isPlaying = false;
    currentIndex = 0;

    document.querySelectorAll(".key").forEach(key => {
        key.classList.remove("active");
    });

    document.querySelectorAll(".sequence-note").forEach(note => {
        note.classList.remove("current-note");
    });

    console.log("App reset");
}

// Mouse click on piano keys
document.querySelectorAll(".key").forEach(keyElement => {
    keyElement.addEventListener("click", () => {
        const note = keyElement.dataset.note;
        playNote(note);
    });
});

// Keyboard input
document.addEventListener("keydown", event => {
    const pressedKey = event.key.toLowerCase();

    // Space = play/pause
    if (event.code === "Space") {
        event.preventDefault();

        if (isPlaying) {
            pausePlayback();
        } else {
            startPlayback();
        }
        return;
    }

    // R = reset
    if (pressedKey === "r") {
        resetApp();
        return;
    }

    // Piano keys
    const keyObject = pianoKeys.find(pianoKey => pianoKey.key === pressedKey);
    if (keyObject) {
        playNote(keyObject.note);
    }
});

// Buttons
document.getElementById("playBtn").addEventListener("click", startPlayback);
document.getElementById("pauseBtn").addEventListener("click", pausePlayback);
document.getElementById("resetBtn").addEventListener("click", resetApp);

// Initialize
loadNotes();