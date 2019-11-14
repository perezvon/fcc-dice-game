"use strict";

// Sort the array elements in ascending order
// imp test case: input arr should remain intact
const selectionSort = arr => {
  let arrDeepCopy = [];
  arr.forEach((element, index) => {
    arrDeepCopy[index] = element;
  });

  for (let i = 0; i < arrDeepCopy.length - 1; i++) {
    let smallest = arrDeepCopy[i];
    let smallestPos = i;
    for (let j = i + 1; j < arrDeepCopy.length; j++) {
      if (arrDeepCopy[j] < smallest) {
        smallest = arrDeepCopy[j];
        smallestPos = j;
      }
    }
    let temp = arrDeepCopy[i];
    arrDeepCopy[i] = smallest;
    arrDeepCopy[smallestPos] = temp;
  }
  return arrDeepCopy;
};

// note: the below function can be made generic by returning
// the max. number of consecutives
// imp test case: console.log(getTotalConsecutives([3, 3, 4, 5, 6]));
const getTotalConsecutives = sortedArr => {
  let totalConsecutives = 0;
  for (let i = 0, j = 1; j < sortedArr.length; i++, j++) {
    if (sortedArr[j] === sortedArr[i] + 1) {
      if (totalConsecutives === 0) totalConsecutives++;
      totalConsecutives++;
    }
  }
  return totalConsecutives;
};

const sumOfArrElements = arr => {
  let arrElementsSum = 0;
  for (let i = 0; i < arr.length; i++) {
    arrElementsSum += arr[i];
  }
  return arrElementsSum;
};

// imp test case: console.log(getNumOfSameDiceValues([4, 4, 4, 6, 6]));
const getNumOfSameDiceValues = sortedArr => {
  const numOfSameDiceValues = {};
  let count = 0;
  for (let i = 1; i < sortedArr.length; i++) {
    let previous = sortedArr[i - 1];
    if (previous === sortedArr[i]) {
      if (count === 0) count++;
      count++;
    }
    if (previous !== sortedArr[i] || i === sortedArr.length - 1) {
      if (count > 0) numOfSameDiceValues[previous] = count;
      count = 0;
    }
  }
  return numOfSameDiceValues;
};

// TO DO
const getSameArrElements = (arrToSearch, arrSearchItems) => {};

// Game class to encapsulate all the properties and methods related to game
class Game {
  constructor() {
    this.diceValues = [0, 0, 0, 0, 0];
    this.rollsInCurrentRound = 0;
    this.totalScore = 0;
    this.currentRound = 1;
    this.scoreHistory = {};
    this.validScoreOptions = {};
    this.isDiceSelectionOn = false;
    this.toggleSelection = event => {
      event.target.classList.toggle("selected");
    };
  }

  resetRadioInputs() {
    document.querySelectorAll("#score-options input").forEach(element => {
      element.disabled = true;
      element.checked = false;
    });
    document.querySelectorAll("#score-options span").forEach(element => {
      element.textContent = "";
    });
  }

  selectAllDice() {
    document.querySelectorAll("#dice > div").forEach(element => {
      element.classList.add("selected");
    });
  }

  toggleDiceSelection() {
    const dice = document.querySelector("#dice");
    if (this.isDiceSelectionOn === false) {
      dice.addEventListener("click", this.toggleSelection);
    } else {
      dice.removeEventListener("click", this.toggleSelection);
    }
    this.isDiceSelectionOn = !this.isDiceSelectionOn;
  }

  rollSelectedDice() {
    const dieDivs = document.querySelectorAll("#dice > div");
    dieDivs.forEach((element, index) => {
      if (element.classList.contains("selected"))
        this.diceValues[index] = element.textContent = Math.ceil(
          Math.random() * 6
        );
    });
    this.rollsInCurrentRound++;
  }

  updateUI() {
    document.querySelector("#current-round").textContent = this.currentRound;
    document.querySelector("#total-score").textContent = this.totalScore;
    document.querySelector(
      "#current-round-rolls"
    ).textContent = this.rollsInCurrentRound;
  }

  generateValidScoreOptions() {
    const sortedDiceValues = selectionSort(this.diceValues);
    const sumOfDiceValues = sumOfArrElements(this.diceValues);
    const totalConsecutives = getTotalConsecutives(sortedDiceValues);
    const numOfSameDiceValues = Object.values(
      getNumOfSameDiceValues(sortedDiceValues)
    );

    this.validScoreOptions = {
      chance: sumOfDiceValues,
      none: 0
    };

    for (let i = 0; i < numOfSameDiceValues.length; i++) {
      if (numOfSameDiceValues[i] >= 3) {
        this.validScoreOptions["three-of-a-kind"] = sumOfDiceValues;
        break;
      }
    }

    if (numOfSameDiceValues[0] >= 4)
      this.validScoreOptions["four-of-a-kind"] = sumOfDiceValues;

    if (numOfSameDiceValues.length === 2) {
      if (sumOfArrElements(numOfSameDiceValues) === 5)
        this.validScoreOptions["full-house"] = 25;
    }

    if (totalConsecutives >= 4) this.validScoreOptions["small-straight"] = 30;

    if (totalConsecutives === 5) this.validScoreOptions["large-straight"] = 40;

    if (numOfSameDiceValues[0] === 5) this.validScoreOptions["yahtzee"] = 50;
  }

  enableValidScoreInputs() {
    const allScoreInputs = document.querySelectorAll("#score-options input");
    const allRadioScores = document.querySelectorAll("#score-options span");
    const validScoreOptionsKeys = Object.keys(this.validScoreOptions);

    // TO DO: make use of binary search as a utility function
    // use const getSameArrElements = (arrToSearch, arrSearchItems) => {};
    for (let i = 0; i < validScoreOptionsKeys.length; i++) {
      for (let j = 0; j < allScoreInputs.length; j++) {
        if (validScoreOptionsKeys[i] === allScoreInputs[j].value) {
          allScoreInputs[j].disabled = false;
          allRadioScores[j].textContent =
            ", score = " + this.validScoreOptions[allScoreInputs[j].value];
        }
      }
    }
  }

  isKeepScoreSuccess() {
    const allScoreInputs = document.querySelectorAll("#score-options input");
    const allRadioLabels = document.querySelectorAll("#score-options label");

    for (let i = 0; i < allScoreInputs.length; i++) {
      if (allScoreInputs[i].checked === true) {
        const currentScore = this.validScoreOptions[allScoreInputs[i].value];
        this.totalScore += currentScore;
        this.scoreHistory[allScoreInputs[i].value] = currentScore;
        this.currentRound++;
        this.rollsInCurrentRound = 0;

        if (allScoreInputs[i].value !== "none") {
          allScoreInputs[i].remove();
          allRadioLabels[i].remove();
        }
        return true;
      }
    }
    alert("Please select a score.");
    return false;
  }
}

const game = new Game();

const rollDiceBtn = document.querySelector("#roll-dice-btn");
const keepScoreBtn = document.querySelector("#keep-score-btn");

rollDiceBtn.addEventListener("click", function(event) {
  if (game.currentRound <= 6) {
    game.rollSelectedDice();
    game.generateValidScoreOptions();
    game.enableValidScoreInputs();
    game.updateUI();

    keepScoreBtn.disabled = false;
    if (game.isDiceSelectionOn === false) game.toggleDiceSelection();
    if (game.rollsInCurrentRound % 3 === 0) event.target.disabled = true;
  }
});

keepScoreBtn.addEventListener("click", function(event) {
  if (game.currentRound <= 6) {
    if (game.isKeepScoreSuccess() === true) {
      game.resetRadioInputs();
      game.selectAllDice();
      game.updateUI();

      if (game.isDiceSelectionOn === true) game.toggleDiceSelection();
      rollDiceBtn.disabled = false;
      event.target.disabled = true;
    }
  }
});
