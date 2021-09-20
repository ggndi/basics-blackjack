var initDealer = function () {
  globalStat[0] = {
    name: "Dealer",
    cartAtHand: [],
    bust: false,
    winner: false,
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
    winner: false,
  };
  globalStat.push(playerObject);
  if (globalStat.length == Number(noOfPlayer) + 1) {
    gameMode = 1;
    document.querySelector("#submit-button").disabled = true;
    document.querySelector("#input-field").disabled = true;
    document.querySelector("#continue-button").style.visibility = "visible";
    return `All names have been registered. Please click continue to deal cards to player(s).`;
  } else {
    return `Please enter the next player name`;
  }
};

var dealCard = function (playerIndex, noOfCard) {
  for (let i = 0; i < noOfCard; i++) {
    globalStat[playerIndex].cartAtHand.push(cardDeck.pop());
  }
};

var checkForBlackJack = function (array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == 21) {
      return true;
    }
  }
  return false;
};

// Run through the value of the array and see if there is duplicate
// The array value of 0 will not be considered
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

// winOutcome: 0 = everyone busted, 1 = unique winner, 2 = draw
// return: -1 = no clear / unique winner , winnerIndex = clear winner
var findWinner = function () {
  //Generate score list
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

  // If there is blackjack condition
  if (checkForBlackJack(scoreList)) {
    if (checkForDraw(scoreList)) {
      for (let i = 0; i < scoreList.length; i++) {
        if (scoreList[i] == 21) {
          globalStat[i].winner = true;
        }
        winOutcome = 2;
        return -1;
      }
    } else {
      globalStat[scoreList.indexOf(maxScore)].winner = true;
      winOutcome = 1;
      return globalStat[scoreList.indexOf(21)].name;
    }
  }
  // If maxScore is 0 - everyone has busted
  if (maxScore == 0) {
    winOutcome = 0;
    return -1;
  }
  // Set winner status for the highest score
  else if (maxScore != 0) {
    for (let i = 0; i < scoreList.length; i++) {
      if (scoreList[i] == maxScore) {
        globalStat[i].winner = true;
      }
    }
    // Check for Draw
    if (checkForDraw(scoreList)) {
      winOutcome = 2;
      return -1;
    } else {
      winOutcome = 1;
      return globalStat[scoreList.indexOf(maxScore)].name;
    }
  }
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
    if (aceValue == 1) {
      var rankCounter = 1;
      while (rankCounter <= 13) {
        var cardName = rankCounter;
        if (cardName == 1) {
          cardName = "A";
        } else if (cardName == 11) {
          cardName = "J";
          rankCounter = 10;
        } else if (cardName == 12) {
          cardName = "Q";
          rankCounter = 10;
        } else if (cardName == 13) {
          cardName = "K";
          rankCounter = 10;
        }
        var card = {
          name: cardName,
          suit: currentSuit,
          rank: rankCounter,
        };
        cardDeck.push(card);
        if (cardName == "J") {
          rankCounter = 11;
        }
        if (cardName == "Q") {
          rankCounter = 12;
        }
        if (cardName == "K") {
          rankCounter = 13;
        }
        rankCounter += 1;
      }
    } else if (aceValue == 11) {
      var rankCounter = 2;
      while (rankCounter <= 14) {
        var cardName = rankCounter;
        if (cardName == 11) {
          cardName = "A";
        } else if (cardName == 12) {
          cardName = "J";
          rankCounter = 10;
        } else if (cardName == 13) {
          cardName = "Q";
          rankCounter = 10;
        } else if (cardName == 14) {
          cardName = "K";
          rankCounter = 10;
        }
        var card = {
          name: cardName,
          suit: currentSuit,
          rank: rankCounter,
        };
        cardDeck.push(card);
        if (cardName == "J") {
          rankCounter = 12;
        }
        if (cardName == "Q") {
          rankCounter = 13;
        }
        if (cardName == "K") {
          rankCounter = 14;
        }
        rankCounter += 1;
      }
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
  return `Game has been set for ${noOfPlayer} player(s). Next, enter the player name.`;
};

const sta1 = "You have hit and you survived. You can choose to hit again.";
const sta2 = "You have busted, it is now next player turn to hit.";
const sta3 = "You have busted, it is now dealer's turn. Click continue.";

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
      gameMode = 2;
      myOutputValue = sta3;
      document.querySelector("#hit-button").disabled = true;
      document.querySelector("#stand-button").disabled = true;
      document.querySelector("#continue-button").disabled = false;
    }
  }
  return myOutputValue;
};

var stand = function () {
  currentPlayer++;
  if (currentPlayer == Number(noOfPlayer) + 1) {
    gameMode = 2;
    currentPlayer--;
    document.querySelector("#hit-button").disabled = true;
    document.querySelector("#stand-button").disabled = true;
    document.querySelector("#continue-button").disabled = false;
    return `Everyone had their turn. It is now dealer's turn. Click continue`;
  }
  return `It is now ${globalStat[currentPlayer].name}'s turn`;
};

function showCurrPlayer() {
  document.getElementById("currPlayer").innerHTML =
    globalStat[currentPlayer].name;
}

function showTableStatus() {
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

var changeAceValue = function (input) {
  aceValue = input;
};

var aceValue = 1;
var cardDeck = shuffleCards(makeDeck());
var globalStat = [];
// 0: game start | 1: deal player card | 2: deal dealer card | 3: final output
var gameMode = 0;
var noOfPlayer;
var currentPlayer = 1;
var scoreList = [];
var winOutcome = 0;
var maxScore = 0;

var main = function (input) {
  var winner;
  var myOutputValue = "";

  if (gameMode == 1) {
    for (let i = 1; i < globalStat.length; i++) {
      dealCard(i, 2);
    }
    document.querySelector("#hit-button").style.visibility = "visible";
    document.querySelector("#stand-button").style.visibility = "visible";
    document.querySelector("#hit-button").disabled = false;
    document.querySelector("#stand-button").disabled = false;
    document.querySelector("#continue-button").disabled = true;
    myOutputValue = `All the cards have been dealt to players. ${globalStat[currentPlayer].name}, do you want to hit?`;
  } else if (gameMode == 2) {
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
    gameMode = 3;
  } else if (gameMode == 3) {
    document.getElementById("currPlayer").innerHTML = "";
    document.querySelector("#continue-button").disabled = true;
    findWinner();
    if (winOutcome == 0) {
      myOutputValue = `Everyone has busted, it's a draw`;
    } else if (winOutcome == 1) {
      myOutputValue = `The winner is ` + findWinner() + ` 🎉 `;
      if (maxScore == 21) {
        myOutputValue = myOutputValue + `With a blackjack!`;
      }
    } else if (winOutcome == 2) {
      myOutputValue = `It is a draw. <br>The following players share the same score: `;
      for (let i = 0; i < globalStat.length; i++) {
        if (globalStat[i].winner) {
          myOutputValue = myOutputValue + `${globalStat[i].name} `;
        }
      }
      myOutputValue = myOutputValue + "<br>" + `Their score is ${maxScore}.`;
    }
  }
  return myOutputValue;
};
