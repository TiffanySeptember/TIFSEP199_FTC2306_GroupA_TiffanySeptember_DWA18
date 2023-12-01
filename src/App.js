import "./styles.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Favourites from "./components/Favourites";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import PodcastDetail from "./components/PodcastDetail";
import Genre from "./components/Genre";
import Login from "./components/Login";
import Register from "./components/Register";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const PODCASTS_URL = "https://podcast-api.netlify.app/shows";
const FAVORITES_URL = "http://localhost:3001/favorites";
const USERS_URL = "http://localhost:3001/users";

function App() {
  const [podcasts, setPodcasts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const fetchPodcasts = useCallback(async () => {
    try {
      const podcastsResponse = await fetch(PODCASTS_URL);
      const podcastsData = await podcastsResponse.json();

      // Fetch favorites separately
      const favoritesResponse = await fetch(FAVORITES_URL);
      const favoritesData = await favoritesResponse.json();
      // Update the local state with fetched data
      setPodcasts(
        podcastsData.map((podcast) => ({
          ...podcast,
          isFavorite: favoritesData.some(
            (favorite) => favorite.id === podcast.id
          ),
        }))
      );

      setFavorites(favoritesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = async (podcast) => {
    try {
      // Check if the podcast is already a favorite
      const isFavorite = favorites.some(
        (favorite) => favorite.id === podcast.id
      );

      if (isFavorite) {
        // If the podcast is already a favorite, remove it
        await fetch(`${FAVORITES_URL}/${podcast.id}`, {
          method: "DELETE",
        });
      } else {
        // If the podcast is not a favorite, add it
        await fetch(FAVORITES_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(podcast),
        });
      }

      await fetchPodcasts();
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const handleSortChange = (option) => {
    let sortedPodcasts = [...podcasts];

    if (option === "A-Z") {
      sortedPodcasts = sortedPodcasts.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    } else if (option === "Z-A") {
      sortedPodcasts = sortedPodcasts.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    } else if (option === "newest") {
      sortedPodcasts = sortedPodcasts.sort(
        (a, b) => new Date(b.updated) - new Date(a.updated)
      );
    } else if (option === "oldest") {
      sortedPodcasts = sortedPodcasts.sort(
        (a, b) => new Date(a.updated) - new Date(b.updated)
      );
    }

    setPodcasts(sortedPodcasts);
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const userResponse = await fetch(`${USERS_URL}?username=${username}`);
      const userData = await userResponse.json();

      if (userData.length === 1) {
        const storedPassword = userData[0].password;

        const passwordMatch = await bcrypt.compare(password, storedPassword);

        if (passwordMatch) {
          setError(null);
          setCurrentUser({ id: userData[0].id, username });
          navigate("/");
        } else {
          throw new Error("Incorrect username or password");
        }
      } else {
        throw new Error("Incorrect username or password");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      setError(error.message);
    }
  };

  const handleRegister = async ({ username, password }) => {
    try {
      const userId = uuidv4(); // Generate a unique ID for the new user

      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUserResponse = await fetch(
        `${USERS_URL}?username=${username}`
      );
      const existingUser = await existingUserResponse.json();

      if (existingUser.length === 0) {
        await fetch(USERS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userId,
            username,
            password: hashedPassword,
          }),
        });

        setError(null);
        setCurrentUser({ id: userId, username });
        navigate("/");
      } else {
        setError("Username already exists");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred during registration");
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, [fetchPodcasts]);

  return (
    <div>
      <Navbar onSortChange={handleSortChange} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              podcasts={podcasts}
              onToggleFavorite={toggleFavorite}
              loading={loading}
              error={error}
            />
          }
        />
        <Route path="/podcast/:id" element={<PodcastDetail />} />
        <Route
          path="favourites"
          element={
            <Favourites
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              loading={loading}
              error={error}
            />
          }
        />
        <Route
          path="genre"
          element={
            <Genre
              podcasts={podcasts}
              onToggleFavorite={toggleFavorite}
              loading={loading}
              error={error}
            />
          }
        />
        <Route
          path="login"
          element={<Login error={error} onLogin={handleLogin} />}
        />
        <Route
          path="register"
          element={<Register error={error} onRegister={handleRegister} />}
        />
      </Routes>
    </div>
  );
}

export default App;
