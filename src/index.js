import "./styles.css";

const mySort = (array, sortFn) => {
  for (let i = 0; i < array.length; i++) {
    const indicator = sortFn(array[i], array[i + 1]);
    if (isNaN(indicator)) continue;
    if (indicator > 0) {
      const temp = array[i];
      array[i] = array[i + 1];
      array[i + 1] = temp;
    }
  }
  return array;
};

const myMap = (array, mapFn) => {
  const mappedArray = [];
  for (let i = 0; i < array.length; i++) {
    mappedArray[i] = mapFn(array[i]);
  }
  return mappedArray;
};

const isLargeStraight = arr => {
  if (arr.length < 5) return false;
  let result = true;
  arr.forEach((num, index) => {
    if (arr[index + 1] && +num + 1 !== +arr[index + 1]) result = false;
  });
  return result;
};

const isSmallStraight = arr => {
  if (arr.length < 4) return false;
  let result = true;
  arr.forEach((num, index) => {
    if (arr[index + 1] && +num + 1 !== +arr[index + 1]) result = false;
  });
  return result;
};

class Die {
  constructor(value) {
    this.value = value || "";
    this.roll = () => {
      this.value = Math.floor(Math.random() * 6 + 1);
    };
  }
}

class Game {
  constructor() {
    this.score = 0;
    this.sum = () =>
      myMap(this.dice, die => die.value).reduce((a, c) => a + c, 0);
    this.calculateCurrentScore = () => {
      const scores = {};
      const values = myMap(this.dice, die => die.value);
      values.forEach(
        value => (scores[value] = scores[value] ? scores[value] + 1 : 1)
      );
      const differentNumbers = Object.keys(scores).length;
      if (differentNumbers === 1) {
        this.scoreType = "Five of a kind!";
        return 50;
      }
      const sortedScores = mySort(
        Object.keys(scores),
        (a, b) => scores[b] - scores[a]
      );
      const highestCount = scores[sortedScores[0]];
      const numericalOrder = mySort(Object.keys(scores), (a, b) => a - b);
      switch (highestCount) {
        case 4:
          this.scoreType = "Four of a kind";
          return this.sum();
        case 3:
          if (scores[sortedScores[1]] === 2) {
            this.scoreType = "Full house";
            return 25;
          } else {
            this.scoreType = "Three of a kind";
            return this.sum();
          }
        case 2:
          if (isSmallStraight(numericalOrder)) {
            this.scoreType = "Small straight";
            return 30;
          }
          this.scoreType = "Chance";
          return this.sum();
        case 1:
          if (isLargeStraight(numericalOrder)) {
            this.scoreType = "Large straight";
            return 40;
          } else if (isSmallStraight(numericalOrder)) {
            this.scoreType = "Small straight";
            return 30;
          }
          this.scoreType = "Chance";
          return this.sum();
        default:
          this.scoreType = "Chance";
          return this.sum();
      }
    };
    this.rollDice = () => {
      let filteredDice = this.dice.filter((d, i) =>
        document.getElementById(i).classList.contains("selected")
      );
      if (!filteredDice.length) filteredDice = this.dice;
      const selectedDice = this.numberOfRolls > 0 ? filteredDice : this.dice;
      selectedDice.forEach(die => die.roll());
      this.numberOfRolls = this.numberOfRolls + 1;
      this.score = this.calculateCurrentScore();
      if (this.numberOfRolls === 3) this.recordScore();
      this.updateUI();
    };
    this.recordScore = () => {
      document.getElementById("scores").innerHTML += `<p>${this.score} - ${
        this.scoreType
      }</p>`;
      document.getElementById("roll").disabled = true;
      document.getElementById("keep").disabled = true;
      this.updateUI();
      this.resetDice();
    };
    this.newRound = () => {
      this.dice = [new Die(), new Die(), new Die(), new Die(), new Die()];
      this.numberOfRolls = 0;
      document.getElementById("roll").disabled = false;
      document.getElementById("keep").disabled = false;
      this.score = 0;
      this.resetDice();
      this.updateUI();
      this.rollDice();
    };
    this.updateUI = () => {
      document.getElementById("counter").innerHTML = this.numberOfRolls;
      document.getElementById("score").innerHTML = this.score;
      const currentDice = document.getElementsByClassName("die");
      for (let k in currentDice) {
        currentDice[k].innerHTML = this.dice[k].value;
      }
    };
    this.reset = () => {
      this.newRound();
      document.getElementById("scores").innerHTML = "";
    };
    this.resetDice = () => {
      const dice = document.getElementsByClassName("die");
      for (let k in dice) {
        dice[k].classList.remove("selected");
      }
    };
    this.dice = [new Die(), new Die(), new Die(), new Die(), new Die()];
    this.numberOfRolls = 0;
  }
}

const game = new Game();

document
  .getElementById("roll")
  .addEventListener("click", () => game.rollDice());

document
  .getElementById("keep")
  .addEventListener("click", () => game.recordScore());

document.getElementById("reset").addEventListener("click", () => game.reset());

document
  .getElementById("new-round")
  .addEventListener("click", () => game.newRound());

const dice = document.getElementsByClassName("die");
for (let k in dice) {
  if (dice[k].classList)
    dice[k].addEventListener("click", () =>
      dice[k].classList.toggle("selected")
    );
}
