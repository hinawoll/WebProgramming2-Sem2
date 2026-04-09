//beim Compilieren wird mit den folgenden ein Fehler kommen
// currentIndex = "hello";
// loadedNotes = ["C", "D", "X"];

type Note = "C" | "D" | "E" | "F" | "G" | "A" | "B";

interface SongData {
  songs: {
    name: string;
    notes: Note[];
  }[];
}

interface PianoKeyInterface {
  note: Note;
  key: string;
  elementId: string;
  audio: HTMLAudioElement;
}

class PianoKey implements PianoKeyInterface {
  note: Note;
  key: string;
  elementId: string;
  audio: HTMLAudioElement;

  constructor(note: Note, key: string, elementId: string, audioFile: string) {
    this.note = note;
    this.key = key;
    this.elementId = elementId;
    this.audio = new Audio(audioFile);
  }
}

const pianoKeys: PianoKey[] = [
  new PianoKey("C", "a", "keyC", "sounds/C.mp3"),
  new PianoKey("D", "s", "keyD", "sounds/D.mp3"),
  new PianoKey("E", "d", "keyE", "sounds/E.mp3"),
  new PianoKey("F", "f", "keyF", "sounds/F.mp3"),
  new PianoKey("G", "g", "keyG", "sounds/G.mp3"),
  new PianoKey("A", "h", "keyA", "sounds/A.mp3"),
  new PianoKey("B", "j", "keyB", "sounds/B.mp3")
];

//Type Annotations
let loadedNotes: Note[] = [];
let currentIndex: number = 0;
let playInterval: number | null = null;
let isPlaying: boolean = false;


//Type Annotations
function playNote(note: Note): void {
  const keyObject = pianoKeys.find((pianoKey) => pianoKey.note === note);
  if (!keyObject) return;

  const keyElement = document.getElementById(keyObject.elementId);
  if (!keyElement) return;

  keyElement.classList.add("active");

  setTimeout(() => {
    keyElement.classList.remove("active");
  }, 300);

  keyObject.audio.currentTime = 0;
  keyObject.audio.play();
}

//Type Annotations
async function loadNotes(): Promise<void> {
  try {
    const response = await fetch("notes.json");
    const data: SongData = await response.json();

    console.log("loaded data:", data);

    if (data.songs.length > 0) {
      loadedNotes = data.songs[0].notes;
      renderNoteSequence();
    }
  } catch (error) {
    console.error("Error loading notes:", error);
  }
}

//Type Annotations
function renderNoteSequence(): void {
  const noteSequenceContainer = document.getElementById("noteSequence");
  if (!noteSequenceContainer) return;

  noteSequenceContainer.innerHTML = "";

  loadedNotes.forEach((note: Note, index: number) => {
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
function highlightCurrentNote(index: number): void {
  const sequenceButtons = document.querySelectorAll(".sequence-note");
  sequenceButtons.forEach((button) => button.classList.remove("current-note"));

  if (sequenceButtons[index]) {
    sequenceButtons[index].classList.add("current-note");
  }
}

//Type Annotations
function startPlayback(): void {
  if (isPlaying || loadedNotes.length === 0) return;

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

function pausePlayback(): void {
  if (playInterval !== null) {
    clearInterval(playInterval);
  }
  isPlaying = false;
}

function stopPlayback(): void {
  if (playInterval !== null) {
    clearInterval(playInterval);
  }
  isPlaying = false;
  currentIndex = 0;
  highlightCurrentNote(-1);
}

function resetApp(): void {
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
    const note = keyElement.getAttribute("data-note") as Note | null;
    if (note) {
      playNote(note);
    }
  });
});

//Type Annotation
document.addEventListener("keydown", (event: KeyboardEvent) => {
  //ここではpressedKeyに型を書いてないけど、TypeScriptは自動でstringだと推論する。
  const pressedKey = event.key.toLowerCase();

  if (event.code === "Space") {
    event.preventDefault();

    if (isPlaying) {
      pausePlayback();
    } else {
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

document.getElementById("playBtn")?.addEventListener("click", startPlayback);
document.getElementById("pauseBtn")?.addEventListener("click", pausePlayback);
document.getElementById("resetBtn")?.addEventListener("click", resetApp);

loadNotes();