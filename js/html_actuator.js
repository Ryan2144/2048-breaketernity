function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + Math.pow(2,tile.value), positionClass];
  if (tile.value > 69) {
    classes = ["tile", "tile-" + "2-" + tile.value, positionClass];
  }
  if (tile.value > 160 && tile.value < 400) classes.push("tile-ex");
  if (tile.value >= 400 && tile.value < 500) classes.push("tile-ex1");
  if (tile.value >= 500 && tile.value < 600) classes.push("tile-ex2");
  if (tile.value >= 600 && tile.value < 700) classes.push("tile-ex3");
  if (tile.value >= 700 && tile.value < 800) classes.push("tile-ex4");
  if (tile.value >= 800 && tile.value < 900) classes.push("tile-ex5");
  if (tile.value >= 900 && tile.value < 1000) classes.push("tile-ex6");
  if (tile.value >= 1000 && tile.value < 1024) classes.push("tile-ex7");
  if (tile.value >= 1024 && tile.value < 1100) classes.push("tile-ex8");
  if (tile.value >= 1100 && tile.value < 8100) classes.push("tile-ex" + String(Math.floor((tile.value/100))-2));
  if (tile.value >= 1900 && tile.value < 8100) classes.push("tile-ex-super");
  if (tile.value >= 8100 && tile.value < 10000) classes.push("tile-ex-super-1");
  if (tile.value >= 10000 && tile.value < 20000) classes.push("tile-ex-super-2");
  if (tile.value >= 20000 && tile.value < 30000) classes.push("tile-ex-super-3");
  if (tile.value >= 30000 && tile.value < 40000) classes.push("tile-ex-super-4");
  if (tile.value >= 40000 && tile.value < 50000) classes.push("tile-ex-super-5");
  if (tile.value >= 50000 && tile.value < 60000) classes.push("tile-ex-super-6");
  if (tile.value >= 60000 && tile.value < 70000) classes.push("tile-ex-super-7");
  if (tile.value >= 70000 && tile.value < 80000) classes.push("tile-ex-super-8");
  if (tile.value >= 80000 && tile.value < 90000) classes.push("tile-ex-super-9");
  if (tile.value >= 90000 && tile.value < 100000) classes.push("tile-ex-super-10");
  if (tile.value >= 100000 && tile.value < 200000) classes.push("tile-ex-super-11");
  if (tile.value >= 200000 && tile.value < 300000) classes.push("tile-ex-super-12");
  if (tile.value >= 300000 && tile.value < 400000) classes.push("tile-ex-super-13");
  if (tile.value >= 400000 && tile.value < 500000) classes.push("tile-ex-super-14");
  if (tile.value >= 500000 && tile.value < 600000) classes.push("tile-ex-super-15");
  if (tile.value >= 600000 && tile.value < 700000) classes.push("tile-ex-super-16");
  if (tile.value >= 700000 && tile.value < 800000) classes.push("tile-ex-super-17");
  if (tile.value >= 800000 && tile.value < 900000) classes.push("tile-ex-super-18");
  if (tile.value >= 900000 && tile.value < 1000000) classes.push("tile-ex-super-19");
  if (tile.value >= 1000000) classes.push("tile-ex-super-20");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  if (tile.value === Infinity) {
    inner.textContent = "∞";
  }
  else if (Math.pow(2,tile.value) >=1000000) {
    inner.textContent = abbreviate("2^" + String(tile.value));
  }
  else {
    inner.textContent = Math.pow(2,tile.value);
  }
  var noOfRotations = Math.floor((tile.value*15.6-(120)) / 360)
  if(tile.value > 400 && tile.value != 500 && tile.value != 600 && tile.value != 700 && tile.value != 800 && tile.value != 900 && tile.value != 1000 && tile.value < 1100) inner.style.filter = `hue-rotate(${(tile.value*15.6-120)-(360*noOfRotations)}deg)`
  
  var noOfRotationsSuper = Math.floor((tile.value*5.05-(155)) / 360)
  if(tile.value > 1100) inner.style.filter = `hue-rotate(${(tile.value*5.05-155)-(360*noOfRotationsSuper)}deg)`

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;
if(this.score === Infinity) {
  this.scoreContainer.textContent = "∞";
}
else if(Math.pow(2,this.score) >= 1000000000) {
  this.scoreContainer.textContent = abbreviate("2^" + String(this.score));
}
else {
  this.scoreContainer.textContent = Math.pow(2,this.score);
}

  /*if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
if(this.score/2 === Infinity) {
  addition.textContent = "+" + "∞";
}
else if(Math.pow(2,this.score/2) >= 1000000000) {
  addition.textContent = "+" + abbreviate("2^" + String(this.score) / 2);
}
else {
  addition.textContent = "+" + (Math.pow(2,this.score) / 2);
}

    this.scoreContainer.appendChild(addition);
  }*/
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
if(bestScore == Infinity) {
  this.bestContainer.textContent = "∞";
}
else if(Math.pow(2,bestScore) >= 1000000000) {
  this.bestContainer.textContent = abbreviate("2^" + String(bestScore));
}
else {
  this.bestContainer.textContent = Math.pow(2,bestScore);
}
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  if (language == 2) {
    var message = won ? "達成しました！" : "ゲームオーバー！";
  }
  else if (language == 3) {
    var message = won ? "你赢了！" : "游戏结束！";
  }
  else if (language == 4) {
    var message = won ? "¡Tú ganas!" : "¡Juego terminado!";
  }
  else {
    var message = won ? "You win!" : "Game over!";
  }

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
