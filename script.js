var initDealer = function () {
  globalStat[0] = {
    name: "Dealer",
    cartAtHand: [],
    bust: false,
  };
};

var initPlayer = function (input) {
  if (input == "") {
    return `Name was not entered, please enter properly!`;
  }

  var playerObject = {
    name: input,
    cartAtHand: [],
    bust: false,
  };
  globalStat.push(playerObject);

  if (globalStat.length == Number(noOfPlayer) + 1) {
    gameMode = 2;
    document.querySelector("#submit-button").disabled = true;
    document.querySelector("#input-field").disabled = true;
    document.querySelector("#continue-button").style.visibility = "visible";
    return `All names has been registered. Please click continue to deal cards to player.`;
  } else {
    return `Please enter the next player name`;
  }
};

var dealCard = function (playerIndex, noOfCard) {
  for (let i = 0; i < noOfCard; i++) {
    globalStat[playerIndex].cartAtHand.push(cardDeck.pop());
  }
};

// return -1 if there is no winner
// winOutcome | 0 - everyone busted | 1 - there is winner | 2 - draw
var findWinner = function () {
  var maxScore = 0;
  scoreList = [];
  for (let i = 0; i < globalStat.length; i++) {
    var score = 0;
    for (let j = 0; j < globalStat[i].cartAtHand.length; j++) {
      score = score + Number(globalStat[i].cartAtHand[j].rank);
    }
    if (globalStat[i].bust) {
      score = 0;
    }
    scoreList.push(score);
  }
  maxScore = Math.max.apply(Math, scoreList);
  if (maxScore == 0) {
    winOutcome = 0;
    return -1;
  }
  if (checkForDraw(scoreList)) {
    winOutcome = 2;
    return -1;
  }
  winOutcome = 1;
  return globalStat[scoreList.indexOf(maxScore)].name;
};

var shuffleCards = function (cardDeck) {
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    var randomIndex = Math.floor(Math.random() * cardDeck.length);
    var randomCard = cardDeck[randomIndex];
    var currentCard = cardDeck[currentIndex];
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    currentIndex = currentIndex + 1;
  }
  return cardDeck;
};

var makeDeck = function () {
  var cardDeck = [];
  var suits = ["♥️", "♦️", "♣️", "♠️"];
  var suitIndex = 0;
  while (suitIndex < suits.length) {
    var currentSuit = suits[suitIndex];
    var rankCounter = 1;
    while (rankCounter <= 13) {
      var cardName = rankCounter;
      if (cardName == 1) {
        cardName = "A";
      } else if (cardName == 11) {
        cardName = "J";
      } else if (cardName == 12) {
        cardName = "Q";
      } else if (cardName == 13) {
        cardName = "K";
      }
      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };
      cardDeck.push(card);
      rankCounter += 1;
    }
    suitIndex += 1;
  }
  return cardDeck;
};

var isCurrPlayerBust = function () {
  var score = 0;
  for (let i = 0; i < globalStat[currentPlayer].cartAtHand.length; i++) {
    score = score + Number(globalStat[currentPlayer].cartAtHand[i].rank);
  }
  if (score > 21) {
    return true;
  } else {
    return false;
  }
};

var initGame = function (input) {
  noOfPlayer = input;
  initDealer();
  gameMode = 1;
  return `Game has been set for ${noOfPlayer} player(s). Next enter the player name (one by one).`;
};

const sta1 = "You have hit and you are alive. You can choose to hit again.";
const sta2 = "You have busted, it is now next player turn to hit.";
const sta3 = "You have busted, it is now dealer turn to be dealt.";

var hit = function () {
  dealCard(currentPlayer, 1);

  if (!isCurrPlayerBust()) {
    myOutputValue = sta1;
  }
  if (isCurrPlayerBust()) {
    globalStat[currentPlayer].bust = true;
    if (currentPlayer < noOfPlayer) {
      currentPlayer++;
      myOutputValue = sta2;
    } else {
      currentPlayer = 0;
      gameMode = 4;
      myOutputValue = sta3;
      document.querySelector("#hit-button").disabled = true;
      document.querySelector("#stand-button").disabled = true;
      document.querySelector("#continue-button").disabled = false;
    }
  }
  /* var myOutputValue;
  if (isCurrPlayerBust()) {
    globalStat[currentPlayer].bust = true;
    myOutputValue = `${globalStat[currentPlayer].name} have bust. `;
    if (currentPlayer == noOfPlayer) {
      gameMode = 4;
      currentPlayer = 0;
    } else {
      currentPlayer++;
    }
    if (currentPlayer < globalStat.length && gameMode != 4) {
      myOutputValue =
        myOutputValue +
        ` ${
          globalStat[Number(currentPlayer)].name
        } it is now your turn to hit or stand.`;
    }
  } else if (gameMode != 4) {
    myOutputValue = `${globalStat[currentPlayer].name} have hit. And you are alive`;
  } else if (gameMode == 4) {
    document.querySelector("#hit-button").disabled = true;
    document.querySelector("#stand-button").disabled = true;
    document.querySelector("#continue-button").disabled = false;
    myOutputValue =
      myOutputValue + ` Please click continue to deal the dealer.`;
  } */
  return myOutputValue;
};

var stand = function () {
  currentPlayer++;
  if (currentPlayer == Number(noOfPlayer) + 1) {
    gameMode = 4;
    currentPlayer--;
    document.querySelector("#hit-button").disabled = true;
    document.querySelector("#stand-button").disabled = true;
    document.querySelector("#continue-button").disabled = false;
    return `Everyone had their turn. Its dealer turn to be dealt. Click continue`;
  }
  return `It is now ${globalStat[currentPlayer].name} turn to hit`;
};

var checkForDraw = function (array) {
  let valuesAlreadySeen = [];
  for (let i = 0; i < array.length; i++) {
    let value = array[i];
    if (valuesAlreadySeen.indexOf(value) !== -1 && value != 0) {
      return true;
    }
    valuesAlreadySeen.push(value);
  }
  return false;
};

function showCurrPlayer() {
  console.log(currentPlayer);
  document.getElementById("currPlayer").innerHTML =
    globalStat[currentPlayer].name;
}

function expose() {
  var statusStatement = [];
  if (typeof globalStat[1] != "undefined") {
    for (let i = 1; i < globalStat.length; i++) {
      statusStatement.push(globalStat[i].name);
      statusStatement.push(": ");
      if (typeof globalStat[i].cartAtHand[0] != "undefined") {
        for (let j = 0; j < globalStat[i].cartAtHand.length; j++) {
          statusStatement.push(globalStat[i].cartAtHand[j].name);
          statusStatement.push(globalStat[i].cartAtHand[j].suit);
          if (j < globalStat[i].cartAtHand.length - 1) {
            statusStatement.push(", ");
          }
        }
      }
      statusStatement.push(`<br>`);
    }
  }

  if (typeof globalStat[0].cartAtHand[0] != "undefined") {
    statusStatement.push(globalStat[0].name);
    statusStatement.push(": ");
    for (let j = 0; j < globalStat[0].cartAtHand.length; j++) {
      statusStatement.push(globalStat[0].cartAtHand[j].name);
      statusStatement.push(globalStat[0].cartAtHand[j].suit);
      if (j < globalStat[0].cartAtHand.length - 1) {
        statusStatement.push(", ");
      }
    }
  }
  document.getElementById("status").innerHTML = statusStatement.join("");
}

function resetGame() {
  cardDeck = shuffleCards(makeDeck());
  globalStat = [];
  gameMode = 0;
  noOfPlayer;
  currentPlayer = 1;
  scoreList = [];
  winOutcome = 0;
}

var cardDeck = shuffleCards(makeDeck());
var globalStat = [];
var gameMode = 0;
var noOfPlayer;
var currentPlayer = 1;
var scoreList = [];
var winOutcome = 0;

var main = function (input) {
  var winner;
  var myOutputValue = "";

  if (gameMode == 2) {
    for (let i = 1; i < globalStat.length; i++) {
      dealCard(i, 2);
    }
    gameMode = 3;
    document.querySelector("#hit-button").style.visibility = "visible";
    document.querySelector("#stand-button").style.visibility = "visible";
    document.querySelector("#continue-button").disabled = true;
    myOutputValue = `All the card has been dealt to players. ${globalStat[currentPlayer].name} do you want to hit`;
  }
  if (gameMode == 4) {
    currentPlayer = 0;
    dealCard(0, 2);
    var dealerScore = 0;
    var j = 0;
    for (let i = 0; i < globalStat[0].cartAtHand.length; i++) {
      dealerScore = dealerScore + Number(globalStat[0].cartAtHand[i].rank);
    }
    while (dealerScore < 17) {
      dealCard(0, 1);
      j++;
      dealerScore = 0;
      for (let i = 0; i < globalStat[0].cartAtHand.length; i++) {
        dealerScore = dealerScore + Number(globalStat[0].cartAtHand[i].rank);
      }
      if (dealerScore > 17) {
        break;
      }
    }
    globalStat[currentPlayer].bust = isCurrPlayerBust();

    if (j == 0) {
      myOutputValue = `Dealer has been dealt 2 cards and chose not to hit.`;
    } else {
      myOutputValue = `Dealer has been dealt 2 cards and chose to hit ${j} times.`;
    }
    gameMode = 5;
  } else if (gameMode == 5) {
    document.getElementById("currPlayer").innerHTML = "";
    document.querySelector("#continue-button").disabled = true;
    findWinner();
    if (winOutcome == 0) {
      return `Everyone has busted, it's a draw`;
    }
    if (winOutcome == 1) {
      return `The winner is ` + findWinner();
    }
    if (winOutcome == 2) {
      return `It is a draw, two or more players shared the same score`;
    }
  }

  return myOutputValue;
};
