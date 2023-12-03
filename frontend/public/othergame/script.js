
  let gameToPlay = "";

function showPopup(game) {
  gameToPlay = game;
  document.getElementById("popup").style.display = "flex";
}

function hidePopup() {
  gameToPlay = "";
  document.getElementById("popup").style.display = "none";
}

function playGame(userChoice) {
  if (userChoice === 'Yes' && gameToPlay !== "") {
    window.location.href = gameToPlay;
  }
  hidePopup();
}
