function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeMarker = (row, column, playerMarker) => {
    if (board[row][column].getValue() === "") {
      board[row][column].addMarker(playerMarker);
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, placeMarker, printBoard };
}

function Cell() {
  let value = "";

  const addMarker = (playerMarker) => (value = playerMarker);

  const getValue = () => value;

  return {
    addMarker,
    getValue,
  };
}

function GameController(
  playerOneName = "Player X",
  playerTwoName = "Player O"
) {
  const gameboard = Gameboard();

  const players = [
    {
      name: playerOneName,
      marker: "X",
    },
    {
      name: playerTwoName,
      marker: "O",
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

  const getBoard = () => gameboard.getBoard();

  const checkForWin = (row, column, player) => {
    const gameBoard = gameboard.getBoard();

    if (gameBoard[row].every((cell) => cell.getValue() === player)) {
      return true;
    }

    if (gameBoard.every((row) => row[column].getValue() === player)) {
      return true;
    }

    if (row === column) {
      if (gameBoard.every((row, column) => row[column].getValue() === player)) {
        return true;
      }
    }

    if (row + column === gameBoard.length - 1) {
      if (
        gameBoard.every(
          (row, index) =>
            row[gameBoard.length - 1 - index].getValue() === player
        )
      ) {
        return true;
      }
    }

    return false;
  };

  const checkForDraw = () => {
    return gameboard
      .getBoard()
      .every((row) => row.every((cell) => cell.getValue() !== ""));
  };

  let gameActive = true;

  const getGameState = () => gameActive;

  const playRound = (row, column) => {
    if (!gameActive) return;

    console.log(
      `Placing ${
        getActivePlayer().name
      }'s marker into cell (${row}, ${column})...`
    );
    gameboard.placeMarker(row, column, getActivePlayer().marker);

    if (checkForWin(row, column, getActivePlayer().marker)) {
      gameboard.printBoard();
      console.log(`${getActivePlayer().name} wins!`);
      gameActive = false;
      return;
    }

    if (checkForDraw()) {
      gameboard.printBoard();
      console.log("It's a draw!");
      gameActive = false;
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    getBoard,
    playRound,
    getActivePlayer,
    getGameState,
    checkForWin,
    checkForDraw,
  };
}

(function displayController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');
  const resultDiv = document.querySelector('.result');

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    if (game.getGameState()) {
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
    } else {
      playerTurnDiv.style.display = "none";
    }

    // Render board squares
    board.forEach((row) => {
      row.forEach((cell, index) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        // Create a data attribute to identify the column
        // This makes it easier to pass into our `playRound` function
        cellButton.dataset.row = board.indexOf(row);
        cellButton.dataset.column = index;
        cellButton.textContent = cell.getValue();
        
        boardDiv.appendChild(cellButton);
      });
    });
  };

  // Add event listener for the board
  boardDiv.addEventListener("click", (e) => {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    // Make sure I've clicked a column and not the gaps in between
    if (!selectedColumn || !selectedRow) return;

    // Prevent clicking on a cell that already has a marker
    const board = game.getBoard();
    if (board[selectedRow][selectedColumn].getValue() !== "") return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();

     // Display result message if game has ended
     if (!game.getGameState()) {
      const activePlayer = game.getActivePlayer();
      if (game.checkForWin(selectedRow, selectedColumn, activePlayer.marker)) {
        resultDiv.textContent = `${activePlayer.name} wins!`;
      } else if (game.checkForDraw()) {
        resultDiv.textContent = "It's a draw!";
      }
    }
  });

  // Initial render
  updateScreen();

  // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
})();
