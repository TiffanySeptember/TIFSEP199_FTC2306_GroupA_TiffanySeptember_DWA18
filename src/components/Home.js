import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import searchIcon from "../images/icons/search.svg";
import PodcastCard from "../components/PodcastCard";

function Home({ podcasts: initialPodcasts, onToggleFavorite, loading, error }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [podcasts, setPodcasts] = useState(initialPodcasts);

  const handleInputChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setPodcasts(term ? filterPodcasts(term) : initialPodcasts);
  };

  const filterPodcasts = useCallback(
    (term) => {
      return initialPodcasts.filter((podcast) => {
        return podcast.title.toLowerCase().includes(term);
      });
    },
    [initialPodcasts]
  );

  useEffect(() => {
    setPodcasts(filterPodcasts(searchTerm));
  }, [searchTerm, filterPodcasts, initialPodcasts]);

  return (
    <div className="app">
      <h1>The Walking Bookshelf❤️</h1>

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
      ) : podcasts.length > 0 ? (
        <div className="container">
          {podcasts.map((podcast) => (
            <Link to={`/podcast/${podcast.id}`} key={podcast.id}>
              <PodcastCard
                podcast={podcast}
                onToggleFavorite={onToggleFavorite}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No podcasts found</h2>
        </div>
      )}
    </div>
  );
}

export default Home;
