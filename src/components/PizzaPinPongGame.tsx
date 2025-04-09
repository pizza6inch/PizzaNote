"use client";

import { useEffect, useRef } from "react";

const COLOR = "#FFFFFF";
const HIT_COLOR = "#333333";
const BACKGROUND_COLOR = "#000000";
const BALL_COLOR = "#FFFFFF";
const PADDLE_COLOR = "#FFFFFF";

// Pizza colors
const CRUST_COLOR = "#D2691E"; // Brown
const CHEESE_COLOR = "#FFC125"; // Yellow
const SAUCE_COLOR = "#B22222"; // Red
const PEPPERONI_COLOR = "#8B0000"; // Dark red

interface Pixel {
  x: number;
  y: number;
  size: number;
  hit: boolean;
  color: string;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  targetY: number;
  isVertical: boolean;
}

export function PizzaPinPongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 0 });
  const paddlesRef = useRef<Paddle[]>([]);
  const scaleRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 1000);
      initializeGame();
    };

    const initializeGame = () => {
      const scale = scaleRef.current;
      const PIXEL_SIZE = 15 * scale; // Much larger pixels for lower resolution
      const BALL_SPEED = 6 * scale;

      pixelsRef.current = [];

      // Create pizza pixel art
      createPizzaPixelArt(canvas.width / 2, canvas.height / 2, PIXEL_SIZE);

      // Initialize ball position near the top right corner
      const ballStartX = canvas.width * 0.9;
      const ballStartY = canvas.height * 0.1;

      ballRef.current = {
        x: ballStartX,
        y: ballStartY,
        dx: -BALL_SPEED,
        dy: BALL_SPEED,
        radius: PIXEL_SIZE / 2,
      };

      const paddleWidth = PIXEL_SIZE;
      const paddleLength = 10 * PIXEL_SIZE;

      paddlesRef.current = [
        {
          x: 0,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width - paddleWidth,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: 0,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: canvas.height - paddleWidth,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
      ];
    };

    const createPizzaPixelArt = (centerX: number, centerY: number, pixelSize: number) => {
      const pizzaSize = 20; // Fewer pixels across for lower resolution
      const radius = pizzaSize / 2;

      // Create the pizza base (circle)
      for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
          const distanceFromCenter = Math.sqrt(x * x + y * y);

          if (distanceFromCenter <= radius) {
            let color = CHEESE_COLOR;

            // Crust (outer edge)
            if (distanceFromCenter > radius - 2) {
              color = CRUST_COLOR;
            }
            // Sauce layer (visible in some spots under cheese)
            else if (Math.random() < 0.15) {
              color = SAUCE_COLOR;
            }

            // Add pixel to the pizza
            pixelsRef.current.push({
              x: centerX + x * pixelSize,
              y: centerY + y * pixelSize,
              size: pixelSize,
              hit: false,
              color: color,
            });
          }
        }
      }

      // Add pepperoni toppings - fewer but larger
      const numPepperoni = 6;
      for (let i = 0; i < numPepperoni; i++) {
        // Random position within the pizza (avoiding the crust)
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * (radius - 3);
        const pepX = Math.round(Math.cos(angle) * distance);
        const pepY = Math.round(Math.sin(angle) * distance);

        // Just a single pixel for each pepperoni
        pixelsRef.current.push({
          x: centerX + pepX * pixelSize,
          y: centerY + pepY * pixelSize,
          size: pixelSize,
          hit: false,
          color: PEPPERONI_COLOR,
        });
      }
    };

    const updateGame = () => {
      const ball = ballRef.current;
      const paddles = paddlesRef.current;

      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
      }
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx = -ball.dx;
      }

      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          if (
            ball.x - ball.radius < paddle.x + paddle.width &&
            ball.x + ball.radius > paddle.x &&
            ball.y > paddle.y &&
            ball.y < paddle.y + paddle.height
          ) {
            ball.dx = -ball.dx;
          }
        } else {
          if (
            ball.y - ball.radius < paddle.y + paddle.height &&
            ball.y + ball.radius > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
          ) {
            ball.dy = -ball.dy;
          }
        }
      });

      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          paddle.targetY = ball.y - paddle.height / 2;
          paddle.targetY = Math.max(0, Math.min(canvas.height - paddle.height, paddle.targetY));
          paddle.y += (paddle.targetY - paddle.y) * 0.1;
        } else {
          paddle.targetY = ball.x - paddle.width / 2;
          paddle.targetY = Math.max(0, Math.min(canvas.width - paddle.width, paddle.targetY));
          paddle.x += (paddle.targetY - paddle.x) * 0.1;
        }
      });

      pixelsRef.current.forEach((pixel) => {
        if (
          !pixel.hit &&
          ball.x + ball.radius > pixel.x &&
          ball.x - ball.radius < pixel.x + pixel.size &&
          ball.y + ball.radius > pixel.y &&
          ball.y - ball.radius < pixel.y + pixel.size
        ) {
          pixel.hit = true;
          const centerX = pixel.x + pixel.size / 2;
          const centerY = pixel.y + pixel.size / 2;
          if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
            ball.dx = -ball.dx;
          } else {
            ball.dy = -ball.dy;
          }
        }
      });
    };

    const drawGame = () => {
      if (!ctx) return;

      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      pixelsRef.current.forEach((pixel) => {
        ctx.fillStyle = pixel.hit ? HIT_COLOR : pixel.color;
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
      });

      ctx.fillStyle = BALL_COLOR;
      ctx.beginPath();
      ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = PADDLE_COLOR;
      paddlesRef.current.forEach((paddle) => {
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      });
    };

    const gameLoop = () => {
      updateGame();
      drawGame();
      requestAnimationFrame(gameLoop);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    gameLoop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
      aria-label="Pizza Pong: Fullscreen Pong game with pixel art pizza"
    />
  );
}

export default PizzaPinPongGame;
