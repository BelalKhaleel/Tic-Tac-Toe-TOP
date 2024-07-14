/*
 ** The Gameboard represents the state of the board
 ** Each square holds a Cell (defined later)
 ** and we expose a dropToken method to be able to add Cells to squares
 */

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Create a 2d array that will represent the state of the game board
  // For this 2d array, row 0 will represent the top row and
  // column 0 will represent the left-most column.
  // This nested-loop technique is a simple and common way to create a 2d array.
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // This will be the method of getting the entire board that our
  // UI will eventually need to render it.
  const getBoard = () => board;

  // In order to place a token, we need to find an empty cell, *then* change that cell's value to the player token
  const placeToken = (row, column, player) => {
    if (board[row][column].getValue() === "") {
      board[row][column].addToken(player);
    }
  };

  // This method will be used to print our board to the console.
  // It is helpful to see what the board looks like after each turn as we play,
  // but we won't need it after we build our UI
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  // Here, we provide an interface for the rest of our
  // application to interact with the board
  return { getBoard, placeToken, printBoard };
}

/*
 ** A Cell represents one "square" on the board and can have one of
 ** "": no token is in the square,
 ** "X": Player One's token,
 ** "O": Player Two's token
 */

function Cell() {
  let value = "";

  // Accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };

  // How we will retrieve the current value of this cell through closure
  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

/*
 ** The GameController will be responsible for controlling the
 ** flow and state of the game's turns, as well as whether
 ** anybody has won the game
 */
function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const gameboard = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    gameboard.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const checkForWin = (row, column, player) => {
    const gameBoard = gameboard.getBoard();
    // Row check
    if (gameBoard[row].every((cell) => cell.getValue() === player)) {
      return true;
    }

    // Column check
    if (gameBoard.every((row) => row[column].getValue() === player)) {
      return true;
    }

    // Primary diagonal check (top-left to bottom-right)
    if (row === column) {
      if (gameBoard.every((row, column) => row[column].getValue() === player)) {
        return true;
      }
    }

    // Secondary diagonal check (top-right to bottom-left)
    if (row + column === gameBoard.length - 1) {
      if (
        gameBoard.every(
          (row, index) => row[gameBoard.length - 1 - index].getValue() === player
        )
      ) {
        return true;
      }
    }

    return false;
  };

  const checkForDraw = () => {
    return gameboard.getBoard().every(row => 
      row.every(cell => cell.getValue() !== "")
    );
  };

  const playRound = (row, column) => {
    // Place a token for the current player
    console.log(
      `Placing ${getActivePlayer().name}'s token into cell (${row}, ${column})...`
    );
    gameboard.placeToken(row, column, getActivePlayer().token);
    /*  This is where we would check for a winner and handle that logic,
        such as a win message. */
    if (checkForWin(row, column, getActivePlayer().token)) {
      // Handle win (e.g., stop the game, display a message, etc.)
      gameboard.printBoard();
      console.log(`${getActivePlayer().name} wins!`);
      return;
    }

    if (checkForDraw()) {
      gameboard.printBoard();
      console.log("It's a draw!");
      return;
    }

    // Switch player turn
    switchPlayerTurn();
    printNewRound();
  };

  // Initial play game message
  printNewRound();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer,
  };
}

const game = GameController();
