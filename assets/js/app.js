let deckId;
let draw = false;
let cardsCount = 2;
const drawCardsBtn = document.getElementById("draw-cards");
const newDeckBtn = document.getElementById("new-deck");
const computerDomEl = document.getElementById("computer");
const playerDomEl = document.getElementById("player");
const computerScore = document.getElementById("computer-score");
const playerScore = document.getElementById("player-score");
const messageDomEl = document.getElementById("message");
const values = {
  2: 0,
  3: 1,
  4: 2,
  5: 3,
  6: 4,
  7: 5,
  8: 6,
  9: 7,
  10: 8,
  JACK: 9,
  QUEEN: 10,
  KING: 11,
  ACE: 12,
};
let player = {
  currentCards: [],
  totalCards: [],
};

let computer = {
  currentCards: [],
  totalCards: [],
};

const resetGame = () => {
  player.currentCards = [];
  player.totalCards = [];
  computer.currentCards = [];
  computer.totalCards = [];
  playerDomEl.innerHTML = "";
  computerDomEl.innerHTML = "";
  draw = false;
};

const assignTotalCards = (cards) => {
  for (let i = 0; i < cards.length; i++) {
    if (i % 2 === 0) {
      computer.totalCards.unshift(cards[i]);
    } else {
      player.totalCards.unshift(cards[i]);
    }
  }
};

const checkFinish = () => {
  let count = decideCount();
  if (!player.totalCards.length || (draw && player.totalCards.length < count + 1)) {
    finishGame(computer);
    return true;
  } else if (!computer.totalCards.length || (draw && computer.totalCards.length < count + 1)) {
    finishGame(player);
    return true;
  }
  return false;
};

const finishGame = (winner) => {
  drawCardsBtn.classList.add("display-none");

  if (draw) {
    winner === computer
      ? changeMessage("Computer WON! You haven't got enough cards for war", "computer")
      : changeMessage("You WON! The computer hasn't got enough cards for war", "player");
    return;
  }

  winner === computer
    ? changeMessage("Computer WON! Press New Deck For Restart", "computer")
    : changeMessage("You WON! Press New Deck For Restart", "player");
};

const assignCurrentCards = () => {
  let count = decideCount();
  player.currentCards = player.totalCards.splice(0, count).concat(player.currentCards);
  computer.currentCards = computer.totalCards.splice(0, count).concat(computer.currentCards);
};

const getImage = (player) => {
  let images = "";
  player.currentCards.forEach((card, i) => {
    if (i === 0 && draw) {
      images += `<img src="${card.image}" class="img-last">`;
    } else {
      images += `<img src="${card.image}">`;
    }
  });
  return images;
};

const showCards = () => {
  computerDomEl.innerHTML = getImage(computer);
  playerDomEl.innerHTML = getImage(player);
};

const evaluateScore = () => {
  const computerCardValue = values[computer.currentCards[0].value];
  const playerCardValue = values[player.currentCards[0].value];
  if (computerCardValue === playerCardValue) {
    draw = true;
    changeMessage("War");
  } else if (computerCardValue < playerCardValue) {
    draw = false;
    player.totalCards = player.totalCards.concat(computer.currentCards).concat(player.currentCards);
    player.currentCards = [];
    computer.currentCards = [];
    changeMessage("Player Scored", "player");
  } else {
    draw = false;
    computer.totalCards = computer.totalCards.concat(player.currentCards).concat(computer.currentCards);
    player.currentCards = [];
    computer.currentCards = [];
    changeMessage("Computer Scored", "computer");
  }
};

const decideCount = () => {
  draw ? (cardsCount = 2) : (cardsCount = 1);
  return cardsCount;
};

const changeMessage = (message, color = null) => {
  messageDomEl.textContent = message;
  if (color === "computer") {
    messageDomEl.className = "title title-computer";
  } else if (color === "player") {
    messageDomEl.className = "title title-player";
  }
};

const displayScore = () => {
  computerScore.textContent = computer.totalCards.length;
  playerScore.textContent = player.totalCards.length;
};

const play = () => {
  if (!checkFinish()) {
    assignCurrentCards();
    showCards();
    evaluateScore();
    displayScore();
  }
};

const fetchNewCards = () => {
  fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=52`)
    .then((res) => res.json())
    .then((data) => {
      resetGame();
      assignTotalCards(data.cards);
      displayScore();
      changeMessage("Draw A Card!");
      drawCardsBtn.classList.remove("display-none");
    });
};

const fetchNewDeck = () => {
  fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    .then((res) => res.json())
    .then((data) => {
      deckId = data.deck_id;
      fetchNewCards();
    });
};

newDeckBtn.addEventListener("click", fetchNewDeck);

drawCardsBtn.addEventListener("click", play);
