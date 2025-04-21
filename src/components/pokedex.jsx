import { useState, useEffect, useRef } from "react";
import "../styles/pokedex.css";

const url = "https://pokeapi.co/api/v2/pokemon/";

const colors = [
  "rgb(75, 138, 75)",
  "rgb(138, 75, 75)",
  "rgb(75, 75, 138)",
  "rgb(138, 138, 75)",
  "rgb(138, 75, 138)",
  "rgb(138, 105, 75)",
  "rgb(75, 138, 138)",
  "rgb(105, 75, 138)",
  "rgb(138, 75, 105)",
  "rgb(105, 138, 75)",
  "rgb(75, 105, 138)",
];

export default function Pokedex({ pokemonDB, setPokemonDB }) {
  const hasFetched = useRef(false);

  function reshuffleDB() {
    const pokemonDB_copy = [...pokemonDB];
    for (let i = pokemonDB_copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pokemonDB_copy[i], pokemonDB_copy[j]] = [
        pokemonDB_copy[j],
        pokemonDB_copy[i],
      ];
    }
    setPokemonDB(pokemonDB_copy);
  }

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const _pokemonList = Array.from({ length: 12 }, () => {
      return Math.floor(Math.random() * 1025) + 1;
    });

    const fetchAPI = async () => {
      const responses = await Promise.all(
        _pokemonList.map(async (pokemon) => {
          try {
            const response = await fetch(`${url}/${pokemon}`);
            const { name, sprites } = await response.json();

            const imageUrl = sprites.front_shiny;

            await new Promise((resolve) => {
              const img = new Image();
              img.src = imageUrl;
              img.onload = () => resolve();
              img.onerror = () => resolve();
            });

            return {
              name,
              image: imageUrl,
            };
          } catch (e) {
            console.error(e);
          }
        })
      );
      setPokemonDB(responses);
    };

    fetchAPI();
  }, []);

  return (
    <>
      {pokemonDB.length > 0 ? (
        <div className="container">
          {pokemonDB.map((pokemon, key) => {
            return (
              <div
                onClick={() => reshuffleDB()}
                className="card"
                key={key}
                style={{
                  backgroundColor:
                    colors[Math.floor(Math.random() * colors.length)],
                  backgroundImage: `url(${pokemon.image})`,
                }}
              ></div>
            );
          })}
        </div>
      ) : (
        <img src="/favicon.svg" alt="loading icon" className="loadingIcon" />
      )}
    </>
  );
}
