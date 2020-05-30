// --------------- Cached element references ---------------
const squares = $(".square").get();

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
    player1Name = $("input[name='player1Name']").val() || "X";
    player2Name = $("input[name='player2Name']").val() || "O";

    //show board, reset button and "It's your go" heading
    $("#board").removeClass("hide").addClass("show-board");
    $("#reset-button").removeClass("hide").addClass("show-reset-btn");
    $("h2").text(`It's ${player1Name}'s go!`).addClass("show-h2");
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
      $("h2").text(
        win === "Tie"
          ? "It's a tie!"
          : win
          ? `${winner} has won the game!`
          : `It's ${turn.playerName}'s go`
      );
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
    $("#names")[0].reset();
    $("#board").removeClass("show-board").addClass("hide");
    $("#reset-button").removeClass("show-reset-btn").addClass("hide");
    $("h2").removeClass("show-h2").addClass("hide");
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
$("#board").click(game.addMark);
$("#start-button").click(game.startGame);
$("#reset-button").click(game.resetGame);
