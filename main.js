// --------------- Cached element references ---------------
const squares = Array.from(document.getElementsByClassName("square"));
const h2 = document.querySelector("h2");

// --------------- Modules ---------------

//Game board IIFE module to control the arrangement of the gameboard
const gameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];
  return { board };
})();

//Game IIFE module to control the flow of the game
const game = (function () {
  let player1Name = "";
  let player2Name = "";
  let turn = { mark: "X", playerName: player1Name };
  let winner = null;
  let win = false;

  function startGame() {
    player1Name =
      Array.from(document.getElementsByName("player1Name"))[0].value || "X";
    player2Name =
      Array.from(document.getElementsByName("player2Name"))[0].value || "O";

    //show board, reset button and "It's your go" heading
    document.getElementById("board").style.display = "flex";
    document.getElementById("reset-button").style.display = "inline-block";
    h2.textContent = `It's ${player1Name}'s go!`;
    h2.style.display = "block";
  }

  function addMark(event) {
    //Find the index of the square that is equal to the click event target
    const clickedSquareIndex = squares.findIndex((square) => {
      return square === event.target;
    });

    //Make sure the square isn't already occupied
    //If it isn't occupied, update the Array, change turns, rerender the board and check for a win
    if (squares[clickedSquareIndex].textContent !== "") {
      alert("This space is already taken, try another!");
    } else {
      //Add to board array
      gameBoard.board[clickedSquareIndex] = turn.mark;

      //re-render the board with the updates
      render();

      //Check for a winner
      win = checkWin(turn.playerName);

      //Switch player and turn
      turn =
        turn.mark === "X"
          ? { mark: "O", playerName: player2Name }
          : { mark: "X", playerName: player1Name };

      //Update the heading based on win status
      h2.textContent =
        win === "Tie"
          ? "It's a tie!"
          : win
          ? `${winner} has won the game!`
          : `It's ${turn.playerName}'s go`;
    }
  }

  function checkWin(playerName) {
    //All possible win cominations (using the 3x3 array as indices)
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    //Look through each winning combination to see if any of them are matching
    let { board } = gameBoard;

    winningCombos.map((combo) => {
      if (
        board[combo[0]] &&
        board[combo[0]] === board[combo[1]] &&
        board[combo[0]] === board[combo[2]]
      ) {
        winner = playerName;
      }
    });

    //check for a winner, or a tie
    if (winner) {
      return winner; //if there's a winner, return it
    } else if (board.includes("")) {
      return null; //if there's no winner, but still blanks, carry on
    } else {
      return "Tie"; //if there's no winner and no blank spaces, return a tie
    }
  }

  function resetGame() {
    gameBoard.board = ["", "", "", "", "", "", "", "", ""];
    document.getElementById("names").reset();
    document.getElementById("board").style.display = "none";
    document.getElementById("reset-button").style.display = "none";
    h2.style.display = "none";
    render();
  }
  return { addMark, startGame, resetGame };
})();

// --------------- Functions ---------------

// Render the DOM changes
function render() {
  // getElementsByClassName returns a HTML collection, need to convert to an array
  squares.map((square, index) => {
    square.textContent = gameBoard.board[index];
  });
}

// --------------- Event listeners ---------------
document.getElementById("board").addEventListener("click", game.addMark);
document
  .getElementById("start-button")
  .addEventListener("click", game.startGame);
document
  .getElementById("reset-button")
  .addEventListener("click", game.resetGame);
