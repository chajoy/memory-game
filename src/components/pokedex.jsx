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

export default function Pokedex() {
  const [pokemonDB, setPokemonDB] = useState([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const _pokemonList = Array.from({ length: 12 }, () => {
      return Math.floor(Math.random() * 1025) + 1;
    });

    console.log(_pokemonList);

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
