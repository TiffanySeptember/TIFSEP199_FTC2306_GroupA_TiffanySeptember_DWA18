import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import searchIcon from "../images/icons/search.svg";
import PodcastCard from "./PodcastCard";
import Icon from "awesome-react-icons/lib/cjs/Icon";

function Favourites({
  favourites: initialFavourites,
  favouritesTitle,
  onToggleFavourite,
  onResetFavourites,
  loading,
  error,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [favourites, setFavourites] = useState(initialFavourites);
  const { userId } = useParams();

  const handleInputChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFavourites(term ? filterFavourites(term) : initialFavourites);
  };

  const handleResetFavourites = () => {
    if (window.confirm("Are you sure you want to Reset all your favourites?")) {
      onResetFavourites();
    }
  };

  const filterFavourites = useCallback(
    (term) => {
      return initialFavourites.filter(
        (podcast) =>
          podcast.title.toLowerCase().includes(term.toLowerCase()) &&
          podcast.userId === userId
      );
    },
    [initialFavourites, userId]
  );

  useEffect(() => {
    setFavourites(filterFavourites(searchTerm));
  }, [searchTerm, filterFavourites, initialFavourites]);

  return (
    <div className="app">
      <h1>Favourites❤️</h1>

      <div className="search">
        <input
          type="text"
          placeholder="Search for a podcast"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <img src={searchIcon} alt="search" />
      </div>

      <div>
        {favourites.length > 0 && (
          <button className="floating-btn" onClick={handleResetFavourites}>
            <Icon name="trash-other" size={30} strokeWidth={3} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="empty">
          <h2>Loading...</h2>
        </div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
        </div>
      ) : favourites.length > 0 ? (
        <div className="container">
          <h2>{favouritesTitle}</h2>
          {favourites.map((favourite) => (
            <Link to={`/podcast/${favourite.id}`} key={favourite.id}>
              <PodcastCard
                podcast={{ ...favourite, isFavourite: true }}
                onToggleFavourite={onToggleFavourite}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No favourites found</h2>
        </div>
      )}
    </div>
  );
}

export default Favourites;
