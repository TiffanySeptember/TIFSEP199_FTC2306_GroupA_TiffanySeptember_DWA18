import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import searchIcon from "../images/icons/search.svg";
import PodcastCard from "./PodcastCard";

function Favourites({
  favorites: initialFavorites,
  onToggleFavorite,
  loading,
  error,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState(initialFavorites);

  const handleInputChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFavorites(term ? filterFavorites(term) : initialFavorites);
  };

  const filterFavorites = useCallback(
    (term) => {
      return initialFavorites.filter((podcast) => {
        return podcast.title.toLowerCase().includes(term);
      });
    },
    [initialFavorites]
  );

  useEffect(() => {
    setFavorites(filterFavorites(searchTerm));
  }, [searchTerm, filterFavorites, initialFavorites]);

  return (
    <div className="app">
      <h1>Favorites❤️</h1>

      <div className="search">
        <input
          type="text"
          placeholder="Search for a podcast"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <img src={searchIcon} alt="search" />
      </div>

      {loading ? (
        <div className="empty">
          <h2>Loading...</h2>
        </div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
        </div>
      ) : favorites.length > 0 ? (
        <div className="container">
          {favorites.map((favorite) => (
            <Link to={`/podcast/${favorite.id}`} key={favorite.id}>
              <PodcastCard
                podcast={{ ...favorite, isFavorite: true }}
                onToggleFavorite={onToggleFavorite}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No favorites found</h2>
        </div>
      )}
    </div>
  );
}

export default Favourites;
