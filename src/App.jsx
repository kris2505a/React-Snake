import React, { useEffect, useState, useRef } from "react";
import "./App.css";

const gridSize = 20; // Size of each grid cell
const snakeSpeed = 100; // Speed in milliseconds

const getRandomPosition = (width, height) => ({
  x: Math.floor(Math.random() * (width / gridSize)) * gridSize,
  y: Math.floor(Math.random() * (height / gridSize)) * gridSize,
});

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [snake, setSnake] = useState([
    { x: Math.floor(window.innerWidth / 2 / gridSize) * gridSize, y: Math.floor(window.innerHeight / 2 / gridSize) * gridSize },
  ]);
  const [food, setFood] = useState(getRandomPosition(window.innerWidth, window.innerHeight));
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Draw snake
    ctx.fillStyle = "green";
    snake.forEach((segment) => {
      ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
  }, [snake, food, canvasSize]);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      let newSnake = [...snake];
      let head = { ...newSnake[0] };

      switch (direction) {
        case "UP":
          head.y -= gridSize;
          break;
        case "DOWN":
          head.y += gridSize;
          break;
        case "LEFT":
          head.x -= gridSize;
          break;
        case "RIGHT":
          head.x += gridSize;
          break;
        default:
          break;
      }

      newSnake.unshift(head);

      // Check if snake eats food
      if (head.x === food.x && head.y === food.y) {
        setFood(getRandomPosition(canvasSize.width, canvasSize.height));
      } else {
        newSnake.pop();
      }

      // Check collision with walls
      if (head.x < 0 || head.x >= canvasSize.width || head.y < 0 || head.y >= canvasSize.height) {
        setGameOver(true);
        return;
      }

      // Check collision with itself
      for (let i = 1; i < newSnake.length; i++) {
        if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
          setGameOver(true);
          return;
        }
      }

      setSnake(newSnake);
    };

    const gameInterval = setInterval(moveSnake, snakeSpeed);
    return () => clearInterval(gameInterval);
  }, [snake, direction, gameOver, canvasSize]);

  useEffect(() => {
    const changeDirection = (event) => {
      switch (event.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", changeDirection);
    return () => window.removeEventListener("keydown", changeDirection);
  }, [direction]);

  return (
    <div className="game-container">
      <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height}></canvas>
      {gameOver && <h2 className="message">Game Over! Refresh to try again.</h2>}
    </div>
  );
};

export default SnakeGame;
