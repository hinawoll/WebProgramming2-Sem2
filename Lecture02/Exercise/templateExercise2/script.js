// Funktion zum Abspielen eines Tons
function playSound(note) {
  const audio = new Audio("sounds/" + note + ".mp3");// z.B. Falls note = C, ("sounds/C.mp3")
  audio.play();
}

// Klick: Ton anhand der ID abspielen
document.querySelectorAll(".key").forEach(function (key) {
  key.addEventListener("click", function () {
    const note = this.id.replace("key", "");//Falls C geklickt wurde, note = C
    playSound(note);
  });
});



// zuordnung Tasten
const keyboardMap = {
  a: "C",
  s: "D",
  d: "E",
  f: "F",
  g: "G",
  h: "A",
  j: "B",
};

// Taste drücken: Ton anhand der Zuordnungsliste abspielen
document.addEventListener("keydown", function (event) {
  const keyPressed = event.key;

  if (keyboardMap[keyPressed]) {
    playSound(keyboardMap[keyPressed]);
  }
});