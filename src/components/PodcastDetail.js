import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../podcastDetail.css";

function PodcastDetail() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [season, setSeason] = useState(null);

  const handleViewSeason = (season) => {
    setOpenDropdown(false);
    setSelectedSeason(season.season);
    setSeason(season);
  };

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const response = await fetch(
          `https://podcast-api.netlify.app/id/${id}`
        );
        const data = await response.json();
        setPodcast(data);
        setSeason(data.seasons[0]);
      } catch (error) {
        console.error("Error fetching podcast details:", error);
      }
    };

    fetchPodcast();
  }, [id]);

  return (
    <div className="app">
      {podcast ? (
        <div>
          <section>
            <h1>{podcast.title}</h1>
            <div className="content">
              <p>{podcast.description}</p>
            </div>
            <div className="img">
              <img src={podcast.image} alt={podcast.title} />
            </div>
          </section>
          <div className="podcast-detail-container">
            <nav>
              <ul>
                <li>
                  <a href="#/" onClick={() => setOpenDropdown(!openDropdown)}>
                    Season {selectedSeason} ({season.episodes.length} Epidodes)
                    <div id="down-triangle"></div>
                  </a>
                  <ul style={{ display: openDropdown ? "block" : "none" }}>
                    {podcast.seasons.map((season) => (
                      <a href="#/" onClick={() => handleViewSeason(season)}>
                        Season {season.season}{" "}
                        <span className="episodes">
                          ({season.episodes.length} Epidodes)
                        </span>
                      </a>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
            <div className="podcast-detail__section">
              <h4 className="podcast-detail__season_title">{season.title}</h4>
              {season.episodes.map((episode, index) => (
                <div className="podcast-detail__section" key={index}>
                  <div className="podcast-detail">
                    <h3 className="podcast-detail__episode_title">
                      {episode.title}
                    </h3>
                    <h5 className="podcast-detail__title">
                      {episode.description.substring(0, 200)}...
                    </h5>
                    <h5 className="podcast-detail__title">
                      <i>Episode {episode.episode}</i>
                    </h5>

                    <div className="podcast-detail__meta">
                      <audio controls width="100%">
                        <source src={episode.file} type="audio/mpeg" />
                        Your browser does not support the audio tag.
                      </audio>
                      <div className="artwork">
                        <img src={season.image} alt={season.title} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default PodcastDetail;
