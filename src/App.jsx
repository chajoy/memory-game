import { useState, useEffect } from "react";
import Pokedex from "./components/pokedex";

function NavBar({ highScore, currentScore }) {
  return (
    <nav>
      <ul>
        <li>Memory Game</li>
        <li>High Score: {highScore}</li>
        <li>|</li>
        <li>Current Score: {currentScore}</li>
      </ul>
    </nav>
  );
}

export default function App() {
  const [pokemonDB, setPokemonDB] = useState([]);
  const [highScore, setHighScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [triggerReset, setReset] = useState({ reset: false, score: 0 });

  useEffect(() => {
    setHighScore((prev) => {
      return triggerReset.score > prev ? triggerReset.score : prev;
    });
    setCurrentScore(0);
    setReset({ reset: false, score: 0 });
  }, [triggerReset.reset, triggerReset.score]);

  return (
    <div className="app">
      <NavBar highScore={highScore} currentScore={currentScore} />
      <Pokedex
        {...{
          pokemonDB,
          setPokemonDB,
          setReset,
          setCurrentScore,
          currentScore,
          triggerReset,
        }}
      />
    </div>
  );
}
