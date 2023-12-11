import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "awesome-react-icons";
import { Navigation } from "react-minimal-side-navigation";

import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import "../navbar.css";

const Navbar = ({ onSortChange, onGenreChange, onLogout, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const genreMapping = {
    0: "All",
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

  const handleNavigate = (path) => {
    setIsSidebarOpen(false);
    if (!currentUser && path.includes("favourites")) {
      alert("You need to login to view your favourites!");
      return;
    }
    navigate(path);
  };

  const handleSortChange = (option) => {
    if (!option) return;
    setIsSidebarOpen(false);
    onSortChange(option, location.pathname);
  };

  const handleGenreChange = (option) => {
    if (!option) return;
    setIsSidebarOpen(false);
    onGenreChange(option, genreMapping[+option], location.pathname);
  };

  const handleLogout = () => {
    setIsSidebarOpen(false);
    onLogout();
  };

  return (
    <>
      <div
        className="overlay"
        style={{ display: isSidebarOpen ? "block" : "none" }}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div>
        <button
          className="menu-btn"
          onClick={() => setIsSidebarOpen(true)}
          type="button"
        >
          <Icon name="burger" size={80} stroke="#f80160" />
        </button>
      </div>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
        </div>

        <Navigation
          activeItemId={location.pathname}
          onSelect={({ itemId }) => handleNavigate(itemId)}
          items={[
            {
              title: "Home",
              itemId: "/",
              elemBefore: () => <Icon size={25} name="coffee" />,
            },
            {
              title: "Favourites",
              itemId: `/favourites/${currentUser?.id}`,
              elemBefore: () => <Icon size={25} name="star" />,
            },
            {
              title: "Accordion",
              itemId: `/accordion`,
              elemBefore: () => <Icon size={25} name="star" />,
            },
          ]}
        />

        <div className="sidebar-dropdown">
          <Navigation
            onSelect={({ itemId }) => handleSortChange(itemId)}
            itemId="/sort"
            activeItemId={location.pathname}
            items={[
              {
                title: "Filters",
                elemBefore: () => <Icon size={25} name="book" />,
                subNav: [
                  {
                    title: "A - Z",
                    itemId: "A-Z",
                    elemBefore: () => <Icon name="arrow-right" />,
                  },
                  {
                    title: "Z - A",
                    itemId: "Z-A",
                    elemBefore: () => <Icon name="arrow-left" />,
                  },
                  {
                    title: "Newest",
                    itemId: "newest",
                    elemBefore: () => <Icon name="arrow-down" />,
                  },
                  {
                    title: "Oldest",
                    itemId: "oldest",
                    elemBefore: () => <Icon name="arrow-up" />,
                  },
                ],
              },
            ]}
          />

          <Navigation
            onSelect={({ itemId }) => handleGenreChange(itemId)}
            itemId="/genre"
            activeItemId={location.pathname}
            items={[
              {
                title: "Genres",
                elemBefore: () => <Icon size={25} name="radio" />,
                subNav: Object.entries(genreMapping).map(([itemId, title]) => ({
                  title:
                    title.length > 20 ? title.substring(0, 15) + "..." : title,
                  itemId,
                })),
              },
            ]}
          />
        </div>

        <div className="sidebar-footer">
          {currentUser ? (
            <Navigation
              onSelect={({ itemId }) => handleLogout()}
              activeItemId={location.pathname}
              items={[
                {
                  title: "Logout",
                  elemBefore: () => <Icon size={25} name="log-out" />,
                },
              ]}
            />
          ) : (
            <Navigation
              onSelect={({ itemId }) => handleNavigate(itemId)}
              activeItemId={location.pathname}
              items={[
                {
                  title: "Login",
                  itemId: "/login",
                  elemBefore: () => <Icon size={25} name="log-in" />,
                },
              ]}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
