import React, { useEffect, useRef, useState } from "react";

const CELL_COUNT_X = 18;
const CELL_COUNT_Y = 18;
const INITIAL_SPEED = 140;

const getRandomCell = (snake) => {
  const s = new Set(snake.map((p) => `${p.x}-${p.y}`));
  while (true) {
    const x = Math.floor(Math.random() * CELL_COUNT_X);
    const y = Math.floor(Math.random() * CELL_COUNT_Y);
    if (!s.has(`${x}-${y}`)) return { x, y };
  }
};

const createInitialSnake = () => [
  { x: 4, y: 9 },
  { x: 3, y: 9 },
  { x: 2, y: 9 },
];

const SnakeGame = () => {
  const [snake, setSnake] = useState(createInitialSnake());
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [pendingDirection, setPendingDirection] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState(getRandomCell(createInitialSnake()));
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const intervalRef = useRef(null);

  const resetGame = () => {
    const init = createInitialSnake();
    setSnake(init);
    setDirection({ x: 1, y: 0 });
    setPendingDirection({ x: 1, y: 0 });
    setFood(getRandomCell(init));
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
  };

  const handleKeyDown = (e) => {
    if (
      ![
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "w",
        "a",
        "s",
        "d",
      ].includes(e.key)
    )
      return;

    let nd = { ...direction };
    if (e.key === "ArrowUp" || e.key === "w") nd = { x: 0, y: -1 };
    if (e.key === "ArrowDown" || e.key === "s") nd = { x: 0, y: 1 };
    if (e.key === "ArrowLeft" || e.key === "a") nd = { x: -1, y: 0 };
    if (e.key === "ArrowRight" || e.key === "d") nd = { x: 1, y: 0 };

    if (nd.x === -direction.x && nd.y === -direction.y) return;

    setPendingDirection(nd);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!running || gameOver) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setSnake((prev) => {
        const dir = pendingDirection;
        setDirection(dir);

        const head = prev[0];
        const newHead = { x: head.x + dir.x, y: head.y + dir.y };

        if (
          newHead.x < 0 ||
          newHead.x >= CELL_COUNT_X ||
          newHead.y < 0 ||
          newHead.y >= CELL_COUNT_Y
        ) {
          setGameOver(true);
          setRunning(false);
          setBestScore((b) => Math.max(b, score));
          return prev;
        }

        const body = prev.slice(0, -1);
        if (body.some((p) => p.x === newHead.x && p.y === newHead.y)) {
          setGameOver(true);
          setRunning(false);
          setBestScore((b) => Math.max(b, score));
          return prev;
        }

        let newSnake;

        if (newHead.x === food.x && newHead.y === food.y) {
          newSnake = [newHead, ...prev];
          setFood(getRandomCell(newSnake));
          setScore((s) => s + 1);
          setSpeed((sp) => Math.max(60, sp - 5));
        } else {
          newSnake = [newHead, ...prev.slice(0, -1)];
        }

        return newSnake;
      });
    }, speed);

    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [running, gameOver, speed, pendingDirection, score, food]);

  const snakeSet = new Set(snake.map((p) => `${p.x}-${p.y}`));
  const headKey = `${snake[0].x}-${snake[0].y}`;
  const foodKey = `${food.x}-${food.y}`;

  return (
    <div className="w-[60%] max-w-4xl mx-auto pt-4 pb-6">
      <div className="flex items-center justify-between text-[13px] text-slate-800 mb-4 px-1">
        <div className="flex gap-4 font-medium">
          <span>score: {score}</span>
          <span className="text-slate-500">best: {bestScore}</span>
        </div>

        <div className="flex gap-2">
          {!running && !gameOver && (
            <button
              onClick={() => setRunning(true)}
              className="px-3.5 py-1.5 rounded-full bg-slate-900 text-slate-50 text-[12px] font-medium hover:bg-slate-800 transition"
            >
              start
            </button>
          )}
          {running && (
            <button
              onClick={() => setRunning(false)}
              className="px-3.5 py-1.5 rounded-full border border-slate-300 bg-white text-[12px] text-slate-800 font-medium hover:bg-slate-100 transition"
            >
              pause
            </button>
          )}
          {(gameOver || (!running && score > 0)) && (
            <button
              onClick={() => {
                resetGame();
                setRunning(true);
              }}
              className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-white text-[12px] font-medium hover:bg-emerald-600 transition"
            >
              restart
            </button>
          )}
        </div>
      </div>

      <div className="relative mx-auto bg-slate-200 rounded-2xl p-4">
        <div
          className="w-full aspect-square grid"
          style={{
            gridTemplateColumns: `repeat(${CELL_COUNT_X}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${CELL_COUNT_Y}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: CELL_COUNT_Y }).map((_, y) =>
            Array.from({ length: CELL_COUNT_X }).map((_, x) => {
              const key = `${x}-${y}`;
              const isHead = key === headKey;
              const isBody = snakeSet.has(key);
              const isFood = key === foodKey;

              let cls = "bg-white rounded-[3px]";

              if (isBody) cls = "bg-emerald-500 rounded-[3px]";
              if (isHead) cls = "bg-emerald-600 rounded-[3px]";
              if (isFood) cls = "bg-rose-500 rounded-full";

              return <div key={key} className={cls} />;
            })
          )}
        </div>

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm">
            <div className="rounded-xl border border-slate-300 bg-white px-5 py-4 flex flex-col items-center">
              <div className="text-sm text-slate-900 font-semibold mb-1">
                game over
              </div>
              <div className="text-xs text-slate-500 mb-3">score: {score}</div>
              <button
                onClick={() => {
                  resetGame();
                  setRunning(true);
                }}
                className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-white text-[12px] font-medium hover:bg-emerald-600 transition"
              >
                play again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-500 text-right mt-3">
        arrows / wasd
      </div>
    </div>
  );
};

export default SnakeGame;
