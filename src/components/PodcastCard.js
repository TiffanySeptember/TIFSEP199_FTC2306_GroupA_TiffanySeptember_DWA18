import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import heart from "../images/icons/heart.svg";
import heartFilled from "../images/icons/heart-filled.svg";

export default function PodcastCard({ podcast, onToggleFavourite }) {
  const handleFavouriteClick = (e) => {
    e.preventDefault();

    onToggleFavourite(podcast);
  };
  return (
    <Link to={`/podcast/${podcast.id}`}>
      <div className="podcast">
        <div>
          <p>
            {new Date(podcast.updated).toLocaleDateString()}
            <br />
            {new Date(podcast.updated).toLocaleTimeString()}
          </p>
        </div>
        <div>
          <img src={podcast.image} alt={podcast.title} />
        </div>
        <div>
          <span>{podcast.seasons} seasons</span>
          <h3>
            {podcast.title}
            <span className="favourite">
              <button className="icon-btn" onClick={handleFavouriteClick}>
                <img
                  width="25px"
                  src={podcast.isFavourite ? heartFilled : heart}
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
