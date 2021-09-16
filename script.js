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
        cardName = "ace";
      } else if (cardName == 11) {
        cardName = "jack";
      } else if (cardName == 12) {
        cardName = "queen";
      } else if (cardName == 13) {
        cardName = "king";
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
  return `Game has been set for ${noOfPlayer} player(s). Next enter the player name one by one.`;
};

var hit = function () {
  dealCard(currentPlayer, 1);
  var myOutputValue;
  if (isCurrPlayerBust()) {
    globalStat[currentPlayer].bust = true;
    myOutputValue = `${globalStat[currentPlayer].name} have bust. `;
    currentPlayer++;
    if (currentPlayer < globalStat.length) {
      myOutputValue =
        myOutputValue +
        ` ${
          globalStat[Number(currentPlayer)].name
        } it is now your turn to hit or stand.`;
    }
  } else {
    myOutputValue = `${globalStat[currentPlayer].name} have hit. And you are alive`;
  }
  if (currentPlayer == globalStat.length) {
    document.querySelector("#hit-button").disabled = true;
    document.querySelector("#stand-button").disabled = true;
    gameMode = 4;
    document.querySelector("#continue-button").disabled = false;
    myOutputValue =
      myOutputValue + ` Please click continue to deal the dealer.`;
  }
  return myOutputValue;
};

var stand = function () {
  currentPlayer++;
  if (currentPlayer == Number(noOfPlayer) + 1) {
    gameMode = 4;
    document.querySelector("#hit-button").disabled = true;
    document.querySelector("#stand-button").disabled = true;
    document.querySelector("#continue-button").disabled = false;
    return `Everyone had their turn. Its dealer turn to be dealt. Click continue`;
  }
  return `It is now ${globalStat[currentPlayer].name} turn to hit`;
};

var cardDeck = shuffleCards(makeDeck());
var globalStat = [];
var gameMode = 0;
var noOfPlayer;
var currentPlayer = 1;
var scoreList = [];

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
    for (let i = 0; i < globalStat[0].cartAtHand.length; i++) {
      dealerScore = dealerScore + Number(globalStat[0].cartAtHand[i].rank);
    }
    while (dealerScore < 17) {
      dealCard(0, 1);
      dealerScore = 0;
      for (let i = 0; i < globalStat[0].cartAtHand.length; i++) {
        dealerScore = dealerScore + Number(globalStat[0].cartAtHand[i].rank);
      }
      if (dealerScore > 17) {
        break;
      }
    }
    globalStat[currentPlayer].bust = isCurrPlayerBust();
    gameMode = 5;
    myOutputValue = `Dealer deal is success `;
  } else if (gameMode == 5) {
    return `The Winner is ` + findWinner();
  }

  return myOutputValue;
};
