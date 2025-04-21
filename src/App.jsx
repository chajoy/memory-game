import { useState } from "react";
import Pokedex from "./components/pokedex";

function NavBar({ highScore, currentScore }) {
  return (
    <nav>
      <ul>
        <li>
          <img src="/favicon.svg" alt="dice icon" />
        </li>
        <li>Memory Game</li>
        <li>High Score: {highScore}</li>
        <li>Current Score: {currentScore}</li>
      </ul>
    </nav>
  );
}

export default function App() {
  const [highScore, setHighScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  return (
    <div className="app">
      <NavBar highScore={highScore} currentScore={currentScore} />
      <Pokedex />
    </div>
  );
}
