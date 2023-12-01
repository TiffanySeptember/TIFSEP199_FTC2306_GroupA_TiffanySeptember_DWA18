import React from "react";
import { Link } from "react-router-dom";
import "../navbar.css";


const Navbar = ({ onSortChange }) => {
  const handleSortChange = (option) => {
    onSortChange(option);
  };

  return (
    <div>
      <label htmlFor="menu-control" className="hamburger">
        <i className="hamburger__icon"></i>
        <i className="hamburger__icon"></i>
        <i className="hamburger__icon"></i>
      </label>

      <input type="checkbox" id="menu-control" className="menu-control" />

      <aside className="sidebar">
        <nav className="sidebar__menu">
          <nav className="sidebar__menu">
            <Link className="navbar-item" to="/">
              Home
            </Link>
            <Link className="navbar-item" to="/favourites">
              Favourites
            </Link>
            <Link className="navbar-item" to="/genre">
              Genre
            </Link>
            <hr />
            <button
              className="navbar-item"
              onClick={() => handleSortChange("A-Z")}
            >
              A - Z
            </button>
            <button
              className="navbar-item"
              onClick={() => handleSortChange("Z-A")}
            >
              Z - A
            </button>
            <button
              className="navbar-item"
              onClick={() => handleSortChange("oldest")}
            >
              Oldest
            </button>
            <button
              className="navbar-item"
              onClick={() => handleSortChange("newest")}
            >
              Newest
            </button>
            <Link className="navbar-item" to="/login">
              Login
            </Link>
          </nav>
        </nav>

        <label htmlFor="menu-control" className="sidebar__close"></label>
      </aside>
    </div>
  );
};

export default Navbar;
