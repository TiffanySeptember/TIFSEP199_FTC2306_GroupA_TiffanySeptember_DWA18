import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import heart from "../images/icons/heart.svg";
import heartFilled from "../images/icons/heart-filled.svg";

export default function PodcastCard({ podcast, onToggleFavorite }) {
  const handleFavoriteClick = (e) => {
    e.preventDefault();

    onToggleFavorite(podcast);
  };
  return (
    <Link to={`/podcast/${podcast.id}`}>
      <div className="podcast">
        <div>
          <p>{new Date(podcast.updated).toLocaleDateString()}</p>
        </div>
        <div>
          <img src={podcast.image} alt={podcast.title} />
        </div>
        <div>
          <span>{podcast.seasons} seasons</span>
          <h3>
            {podcast.title}
            <span className="favourite">
              <button onClick={handleFavoriteClick}>
                <img
                  width="25px"
                  src={podcast.isFavorite ? heartFilled : heart}
                  alt="search"
                />
              </button>
            </span>
          </h3>
        </div>
      </div>
    </Link>
  );
}

PodcastCard.propTypes = {
  podcast: PropTypes.object.isRequired,
};
