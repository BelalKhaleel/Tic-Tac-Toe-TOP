function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => Cell())
  );
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
  };

  return { getBoard, placeMarker, printBoard };
}

function Cell() {
  let value = "";

  const addMarker = (playerMarker) => (value = playerMarker);

  const resetMarker = () => (value = "");

  const getValue = () => value;

  return {
    addMarker,
    resetMarker,
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
  };

  const getBoard = () => gameboard.getBoard();

  const checkForWin = (row, column, playerMarker) => {
    const gameBoard = gameboard.getBoard();

    const checkRowWin = gameBoard[row].every(
      (cell) => cell.getValue() === playerMarker
    );

    const checkColumnWin = gameBoard.every(
      (row) => row[column].getValue() === playerMarker
    );

    const checkPrimaryDiagonalWin =
      row === column &&
      gameBoard.every((row, column) => row[column].getValue() === playerMarker);

    const checkSecondaryDiagonalWin =
      +row + +column === gameBoard.length - 1 &&
      gameBoard.every(
        (row, index) =>
          row[gameBoard.length - 1 - index].getValue() === playerMarker
      );

    return (
      checkRowWin ||
      checkColumnWin ||
      checkPrimaryDiagonalWin ||
      checkSecondaryDiagonalWin
    );
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

    gameboard.placeMarker(row, column, getActivePlayer().marker);

    if (checkForWin(row, column, getActivePlayer().marker)) {
      gameboard.printBoard();
      gameActive = false;
      return;
    }

    if (checkForDraw()) {
      gameboard.printBoard();
      gameActive = false;
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  const resetGame = () => {
    gameActive = true;
    activePlayer = players[0];
    for (let i = 0; i < gameboard.getBoard().length; i++) {
      for (let j = 0; j < gameboard.getBoard()[i].length; j++) {
        gameboard.getBoard()[i][j].resetMarker();
      }
    }
  };

  printNewRound();

  return {
    getBoard,
    playRound,
    getActivePlayer,
    getGameState,
    checkForWin,
    checkForDraw,
    resetGame,
  };
}

(function displayController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const resultDiv = document.querySelector(".result");
  const resetButton = document.querySelector(".reset");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.style.display = "block";
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    resultDiv.textContent = "";

    board.forEach((row) => {
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = board.indexOf(row);
        cellButton.dataset.column = index;
        cellButton.textContent = cell.getValue();

        boardDiv.appendChild(cellButton);
      });
    });
  };

  boardDiv.addEventListener("click", (e) => {
    if (!game.getGameState()) return;
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (!selectedColumn || !selectedRow) return;

    const board = game.getBoard();
    if (board[selectedRow][selectedColumn].getValue() !== "") return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();

    if (!game.getGameState()) {
      const activePlayer = game.getActivePlayer();
      resultDiv.textContent = game.checkForWin(
        selectedRow,
        selectedColumn,
        activePlayer.marker
      )
        ? `${activePlayer.name} wins!`
        : "It's a draw!";
      playerTurnDiv.style.display = "none";
    }
  });

  resetButton.addEventListener("click", () => {
    game.resetGame();
    updateScreen();
  });

  updateScreen();
})();
