import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import searchIcon from "../images/icons/search.svg";
import PodcastCard from "../components/PodcastCard";
import Icon from "awesome-react-icons";

function Home({
  podcasts: initialPodcasts,
  title,
  onToggleFavourite,
  loading,
  error,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [podcasts, setPodcasts] = useState(initialPodcasts);
  const [showButton, setShowButton] = useState(false);

  const handleInputChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setPodcasts(term ? filterPodcasts(term) : initialPodcasts);
  };

  const filterPodcasts = useCallback(
    (term) => {
      return initialPodcasts.filter((podcast) => {
        return podcast.title.toLowerCase().includes(term.toLowerCase());
      });
    },
    [initialPodcasts]
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setPodcasts(filterPodcasts(searchTerm));
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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

      <div>
        {showButton && (
          <button className="floating-btn" onClick={scrollToTop}>
            <Icon name="chevron-up" size={30} strokeWidth={3} />
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
      ) : podcasts.length > 0 ? (
        <div className="container">
          <h2>{title}</h2>
          {podcasts.map((podcast) => (
            <Link to={`/podcast/${podcast.id}`} key={podcast.id}>
              <PodcastCard
                podcast={podcast}
                onToggleFavourite={onToggleFavourite}
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
