import { useState } from "react";

function Square({ value, onSquareClick, squareColor }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{
        backgroundColor: squareColor ? "white" : "yellow"
      }}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  console.log(winner);
  const row = [];
  let u = 0;

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  let status;
  if (winner) {
    status = "Winner: " + winner[0];
  } else if (!squares.includes(null) & !winner) {
    status = "Game Over: Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  for (let t = 0; t < 3; t++) {
    const col = [];
    for (let s = 0; s < 3; s++) {
      let defaultColor = true;
      if (winner) {
        if (winner[1].includes(u)) {
          defaultColor = false;
        }
      }
      col.push(
        <Square
          key={u}
          value={squares[3 * t + s]}
          onSquareClick={() => handleClick(3 * t + s)}
          squareColor={defaultColor}
        />
      );
      u++;
      // return <Square value={squares[indexArray[0]]} onSquareClick={() => handleClick(indexArray[0])} />;
    }
    row.push(
      <div className="board-row" key={u}>
        {col}
      </div>
    );
  }

  return (
    <div>
      <div className="status">{status}</div>
      {row}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [historySortAsc, setHistorySort] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  let movesSorted;
  if (historySortAsc) {
    movesSorted = [...moves];
  } else {
    movesSorted = [...moves].slice(0).reverse();
  }

  function reverseMoves() {
    setHistorySort(!historySortAsc);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={reverseMoves}>v ^</button>
        <ol>{movesSorted}</ol>
      </div>
    </div>
  );
}
