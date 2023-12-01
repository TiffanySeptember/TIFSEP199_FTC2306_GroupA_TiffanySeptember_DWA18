import { useState, useCallback, useEffect } from "react";
import searchIcon from "../images/icons/search.svg";
import PodcastCard from "../components/PodcastCard";
import { Link } from "react-router-dom";

function Genre({
  podcasts: initialPodcasts,
  onToggleFavorite,
  loading,
  error,
}) {
  const genreMapping = {
    1: "Personal Growth",
    2: "True Crime and Investigative Journalism",
    3: "History",
    4: "Comedy",
    5: "Entertainment",
    6: "Business",
    7: "Fiction",
    8: "News",
    9: "Kids and Family",
  };
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

  const groupPodcastsByGenre = () => {
    const groupedPodcasts = {};

    podcasts.forEach((podcast) => {
      podcast.genres.forEach((genreId) => {
        const genreTitle = genreMapping[genreId];
        if (!groupedPodcasts[genreTitle]) {
          groupedPodcasts[genreTitle] = [];
        }
        groupedPodcasts[genreTitle].push(podcast);
      });
    });

    return groupedPodcasts;
  };

  const groupedPodcasts = groupPodcastsByGenre();

  return (
    <div className="app">
      <h1>Genre❤️</h1>

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
      ) : Object.keys(groupedPodcasts).length > 0 ? (
        <div className="container">
          {Object.keys(groupedPodcasts).map((genreTitle) => (
            <>
              <h2>{genreTitle}</h2>
              {groupedPodcasts[genreTitle].map((podcast) => (
                <Link to={`/podcast/${podcast.id}`} key={podcast.id}>
                  <PodcastCard
                    podcast={podcast}
                    onToggleFavorite={onToggleFavorite}
                  />
                </Link>
              ))}
            </>
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

export default Genre;
