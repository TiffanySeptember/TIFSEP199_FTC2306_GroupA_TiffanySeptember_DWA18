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
const FAVOURITES_URL =
  "https://humane-nutritious-jumpsuit.glitch.me/favourites";
const USERS_URL = "https://humane-nutritious-jumpsuit.glitch.me/users";

function App() {
  const [podcasts, setPodcasts] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState(null);
  const [filteredFavourites, setFilteredFavourites] = useState(null);
  const [title, setTitle] = useState(null);
  const [favouritesTitle, setfavouritesTitle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const fetchPodcasts = useCallback(async () => {
    try {
      const podcastsResponse = await fetch(PODCASTS_URL);
      const podcastsData = await podcastsResponse.json();

      // Fetch favorites separately
      const favoritesResponse = await fetch(FAVOURITES_URL);
      const favouritesData = await favoritesResponse.json();
      // Update the local state with fetched data
      setPodcasts(
        podcastsData.map((podcast) => ({
          ...podcast,
          isFavourite: favouritesData.some(
            (favourite) => favourite.id === podcast.id
          ),
        }))
      );

      setFavourites(favouritesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavourite = async (podcast) => {
    try {
      if (!currentUser) {
        alert("You need to login to add favourites!");
        return;
      }
      // Check if the podcast is already a favourite
      const isFavourite = favourites.some(
        (favourite) => favourite.id === podcast.id
      );

      if (isFavourite) {
        // If the podcast is already a favourite, remove it
        await fetch(`${FAVOURITES_URL}/${podcast.id}`, {
          method: "DELETE",
        });
      } else {
        // If the podcast is not a favourite, add it
        await fetch(FAVOURITES_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...podcast,
            updated: new Date(),
            userId: currentUser.id,
          }),
        });
      }

      await fetchPodcasts();
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const resetFavourites = async () => {
    setLoading(true);
    favourites.forEach(async (podcast) => {
      await fetch(`${FAVOURITES_URL}/${podcast.id}`, {
        method: "DELETE",
      });
    });

    await fetchPodcasts();
  };

  const handleSortChange = (option, path) => {
    let sortedItems = path === "/" ? [...podcasts] : [...favourites];

    if (option === "A-Z") {
      sortedItems = sortedItems.sort((a, b) => a.title.localeCompare(b.title));
    } else if (option === "Z-A") {
      sortedItems = sortedItems.sort((a, b) => b.title.localeCompare(a.title));
    } else if (option === "newest") {
      sortedItems = sortedItems.sort(
        (a, b) => new Date(b.updated) - new Date(a.updated)
      );
    } else if (option === "oldest") {
      sortedItems = sortedItems.sort(
        (a, b) => new Date(a.updated) - new Date(b.updated)
      );
    }

    if (path === "/") {
      setFilteredPodcasts(sortedItems);
    } else {
      setFilteredFavourites(sortedItems);
    }
  };

  const handleGenreChange = async (option, optionTitle, path) => {
    if (!+option) {
      if (path === "/") {
        setFilteredPodcasts(podcasts);
        setTitle(null);
      } else {
        setfavouritesTitle(null);
        setFilteredFavourites(favourites);
      }
      return;
    }
    let genreItems = path === "/" ? [...podcasts] : [...favourites];

    genreItems = genreItems.filter((item) => item.genres.includes(+option));

    if (path === "/") {
      setTitle(optionTitle);
      setFilteredPodcasts(genreItems);
    } else {
      setfavouritesTitle(optionTitle);
      setFilteredFavourites(genreItems);
    }
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

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
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
      <Navbar
        onSortChange={handleSortChange}
        onGenreChange={handleGenreChange}
        onLogout={handleLogout}
        currentUser={currentUser}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              podcasts={filteredPodcasts || podcasts}
              title={title}
              onToggleFavourite={toggleFavourite}
              loading={loading}
              error={error}
            />
          }
        />
        <Route path="/podcast/:id" element={<PodcastDetail />} />
        <Route
          path="favourites/:userId"
          element={
            <Favourites
              favourites={filteredFavourites || favourites}
              favouritesTitle={favouritesTitle}
              onToggleFavourite={toggleFavourite}
              onResetFavourites={resetFavourites}
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
              onToggleFavourite={toggleFavourite}
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
