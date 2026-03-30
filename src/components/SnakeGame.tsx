import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood());
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black/40 backdrop-blur-md rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)]">
      <div className="flex items-center justify-between w-full mb-4 px-2">
        <div className="flex items-center gap-4">
          <Trophy className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]" />
          <div className="glitch font-digital text-4xl text-cyan-400 font-bold tracking-widest">
            {score.toString().padStart(4, '0')}
            <span aria-hidden="true">{score.toString().padStart(4, '0')}</span>
            <span aria-hidden="true">{score.toString().padStart(4, '0')}</span>
          </div>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-all border border-cyan-500/30"
        >
          {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
        </button>
      </div>

      <div 
        className="relative bg-black/80 rounded-xl overflow-hidden border-2 border-cyan-500/50 shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]"
        style={{ 
          width: GRID_SIZE * 15, 
          height: GRID_SIZE * 15,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Food */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute w-[15px] h-[15px] bg-magenta-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.8)]"
          style={{
            left: food.x * 15,
            top: food.y * 15,
            backgroundColor: '#ec4899'
          }}
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${i}-${segment.x}-${segment.y}`}
            className={`absolute w-[15px] h-[15px] ${i === 0 ? 'bg-cyan-400 z-10' : 'bg-cyan-600/80'} rounded-sm`}
            style={{
              left: segment.x * 15,
              top: segment.y * 15,
              boxShadow: i === 0 ? '0 0 10px rgba(34,211,238,0.8)' : 'none'
            }}
          />
        ))}

        <AnimatePresence>
          {(isGameOver || (isPaused && score === 0)) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-3xl font-black text-magenta-500 mb-4 tracking-tighter italic">GAME OVER</h2>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all transform hover:scale-105"
                  >
                    <RotateCcw className="w-5 h-5" />
                    RETRY
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-cyan-400 mb-6 tracking-widest">NEON SNAKE</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-2 px-8 py-4 bg-cyan-500 text-black font-black rounded-full hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  >
                    <Play className="w-6 h-6 fill-current" />
                    START
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 text-[10px] text-cyan-500/50 font-mono uppercase tracking-[0.2em]">
        Use Arrows to Move • Space to Pause
      </div>
    </div>
  );
}
