import { useState, useEffect, useRef } from "react";
import "../styles/pokedex.css";
import typeIcons from "../typeIcons.json";

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

function Card({
  pokemon,
  pokemonDB,
  setPokemonDB,
  setReset,
  setCurrentScore,
  currentScore,
  triggerReset,
}) {
  const [clicked, setClicked] = useState(false);

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

  function handleClick() {
    if (clicked) {
      setClicked(false);
      setReset({ reset: true, score: currentScore });
    } else {
      setClicked(true);
      setCurrentScore((prev) => prev + 1);
    }
    reshuffleDB();
  }

  useEffect(() => {
    if (triggerReset.reset) {
      setClicked(false);
    }
  }, [triggerReset.reset]);

  return (
    <div
      onClick={() => handleClick()}
      className="card"
      style={{
        backgroundColor: pokemon.colour,
      }}
    >
      <p>{pokemon.name}</p>
      <img src={pokemon.image} alt="pokemon image" className="pokemon" />
      <div className="types">
        {pokemon.element_types.map((type, i) => {
          const _type = typeIcons.find((t) => t.name === type);
          return <img src={_type.image.name_icon} key={i} />;
        })}
      </div>
    </div>
  );
}

export default function Pokedex({
  pokemonDB,
  setPokemonDB,
  setReset,
  setCurrentScore,
  currentScore,
  triggerReset,
}) {
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const _pokemonList = Array.from({ length: 12 }, () => {
      return Math.floor(Math.random() * 1025) + 1;
    });

    const fetchAPI = async () => {
      const responses = await Promise.all(
        _pokemonList.map(async (pokemon, index) => {
          try {
            const response = await fetch(`${url}/${pokemon}`);
            const { name, sprites, types } = await response.json();

            const imageUrl = sprites.front_shiny;

            await new Promise((resolve) => {
              const img = new Image();
              img.src = imageUrl;
              img.onload = () => resolve();
              img.onerror = () => resolve();
            });

            return {
              id: index,
              name,
              image: imageUrl,
              colour: colors[Math.floor(Math.random() * colors.length)],
              element_types: types.map((i) => {
                return i.type.name;
              }),
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
          {pokemonDB.map((pokemon) => {
            return (
              <Card
                key={pokemon.id}
                {...{
                  pokemon,
                  pokemonDB,
                  setPokemonDB,
                  setReset,
                  setCurrentScore,
                  currentScore,
                  triggerReset,
                }}
              />
            );
          })}
        </div>
      ) : (
        <img src="/favicon.svg" alt="loading icon" className="loadingIcon" />
      )}
    </>
  );
}
