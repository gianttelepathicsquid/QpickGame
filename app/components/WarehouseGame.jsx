"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Trophy, Box, Timer } from 'lucide-react';

const WarehouseGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [warehouseGrid, setWarehouseGrid] = useState([]);
  const targetScore = 500;
  
  // Generate random storage locations
  const generateWarehouseGrid = () => {
    const items = ['Electronics', 'Clothing', 'Food', 'Books', 'Toys'];
    const colors = {
      'Electronics': 'bg-blue-500 hover:bg-blue-600',
      'Clothing': 'bg-purple-500 hover:bg-purple-600',
      'Food': 'bg-green-500 hover:bg-green-600',
      'Books': 'bg-yellow-500 hover:bg-yellow-600',
      'Toys': 'bg-red-500 hover:bg-red-600'
    };
    
    const grid = [];
    
    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * items.length);
      grid.push({
        id: i,
        item: items[randomIndex],
        color: colors[items[randomIndex]],
        isActive: false
      });
    }
    return grid;
  };

  // Generate a new picking order
  const generateOrder = () => {
    const items = ['Electronics', 'Clothing', 'Food', 'Books', 'Toys'];
    return {
      item: items[Math.floor(Math.random() * items.length)],
      quantity: Math.floor(Math.random() * 3) + 1,
      collected: 0
    };
  };

  // Start game
  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setWarehouseGrid(generateWarehouseGrid());
    setCurrentOrder(generateOrder());
  };

  // Handle cell click
  const handleCellClick = (cell) => {
    if (!gameActive || !currentOrder) return;

    if (cell.item === currentOrder.item) {
      setScore(prev => prev + 10);
      const newOrder = { ...currentOrder };
      newOrder.collected++;

      if (newOrder.collected >= newOrder.quantity) {
        setCurrentOrder(generateOrder());
      } else {
        setCurrentOrder(newOrder);
      }
    } else {
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Quetico 3PL Warehouse Pick & Pack</CardTitle>
        <p className="text-center text-lg font-semibold text-gray-600">Can you beat {targetScore} points in 60 seconds?</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
            <span className="text-xl">Score: {score}</span>
          </div>
          <div className="flex items-center">
            <Timer className="w-6 h-6 mr-2 text-red-500" />
            <span className="text-xl">Time: {timeLeft}s</span>
          </div>
        </div>

        {!gameActive && (
          <button
            onClick={startGame}
            className="w-full p-4 mb-4 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Start Game
          </button>
        )}

        {gameActive && currentOrder && (
          <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="text-lg font-semibold">Current Order:</div>
            <div className="flex items-center">
              <Box className="w-5 h-5 mr-2" />
              <span>Pick {currentOrder.quantity - currentOrder.collected} {currentOrder.item}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">
          {warehouseGrid.map((cell) => (
            <button
              key={cell.id}
              onClick={() => handleCellClick(cell)}
              className={`${cell.color} p-4 rounded-lg text-white font-semibold h-24 
                flex items-center justify-center transform hover:scale-105 
                transition-all duration-200 ${!gameActive ? 'opacity-50 cursor-not-allowed' : ''}
                shadow-md hover:shadow-lg`}
              disabled={!gameActive}
            >
              {cell.item}
            </button>
          ))}
        </div>

        {!gameActive && score > 0 && (
          <div className="mt-4 p-4 bg-yellow-100 rounded-lg text-center shadow-md">
            <div className="text-xl font-bold">Game Over!</div>
            <div>Final Score: {score}</div>
            {score >= targetScore ? (
              <div className="text-green-600 font-semibold mt-2">Congratulations! You beat the challenge! 🏆</div>
            ) : (
              <div className="text-blue-600 font-semibold mt-2">Try again to beat {targetScore} points!</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WarehouseGame;
