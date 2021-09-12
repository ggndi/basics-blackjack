var cardDeck;
var globalStat = [];

var main = function (input) {
  var winner;
  cardDeck = makeDeck();
  cardDeck = shuffleCards(cardDeck);

  globalStat[0] = {
    name: "Dealer",
    cartAtHand: [],
  };
  globalStat[0].cartAtHand.push(cardDeck.pop());
  globalStat[0].cartAtHand.push(cardDeck.pop());

  globalStat[1] = {
    name: "Player 1",
    cartAtHand: [],
  };
  globalStat[1].cartAtHand.push(cardDeck.pop());
  globalStat[1].cartAtHand.push(cardDeck.pop());

  globalStat[2] = {
    name: "Player 2",
    cartAtHand: [],
  };
  globalStat[2].cartAtHand.push(cardDeck.pop());
  globalStat[2].cartAtHand.push(cardDeck.pop());

  winner = findWinner();
  return winner;
};

var findWinner = function () {
  var scoreList = [];
  var winningPlayer = 0;
  var maxScore = 0;
  for (let i = 0; i < globalStat.length; i++) {
    var score = 0;
    for (let j = 0; j < globalStat[i].cartAtHand.length; j++) {
      score = score + Number(globalStat[i].cartAtHand[j].rank);
    }
    scoreList.push(score);
  }
  maxScore = Math.max.apply(Math, scoreList);
  winningPlayer = scoreList.indexOf(maxScore);
  return winningPlayer;
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
  var suits = ["hearts", "diamonds", "clubs", "spades"];
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
