import { useState } from "react";

const Accordion = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  return (
    <nav>
      <ul>
        <li>
          <a href="#/" onClick={() => setOpenDropdown(!openDropdown)}>
            Simple philosophies<div id="down-triangle"></div>
          </a>
          <ul style={{ display: openDropdown ? "block" : "none" }}>
            <li>
              <a href="#/">Make it simple but significant.</a>
            </li>
            <li>
              <a href="#/">Stay focused and keep shipping.</a>
            </li>
            <li>
              <a href="#/">Done is better than perfect.</a>
            </li>
            <li>
              <a href="#/">Design is how it works.</a>
            </li>
            <li>
              <a href="#/">Think big, start small, learn fast.</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Accordion;
