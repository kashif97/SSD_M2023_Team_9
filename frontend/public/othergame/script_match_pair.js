let isFlipped = false;
let firstCard, secondCard;
let score = 0;
let totalPairs = 3; // Adjust based on your game's difficulty

function flipCard(card) {
  if (isFlipped) return;
  if (card === firstCard) return;

  card.querySelector('img').style.display = 'block';

  if (!isFlipped) {
    isFlipped = true;
    firstCard = card;
  } else {
    isFlipped = false;
    secondCard = card;

    if (firstCard.querySelector('img').src === secondCard.querySelector('img').src) {
      firstCard.removeEventListener('click', flipCard);
      secondCard.removeEventListener('click', flipCard);
      score += 1;
      document.getElementById('score').textContent = `Score: ${score}/${totalPairs}`;
    } else {
      setTimeout(() => {
        firstCard.querySelector('img').style.display = 'none';
        secondCard.querySelector('img').style.display = 'none';
      }, 1000);
    }

    if (score === totalPairs) {
      alert('Congratulations! You won!');
      // You can add code to show fun facts and move to the next level.
    }
  }
}


