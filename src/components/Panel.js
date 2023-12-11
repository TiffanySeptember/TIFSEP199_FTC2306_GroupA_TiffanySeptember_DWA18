import React, { useState, useEffect } from "react";

const Panel = ({ label, content, activeTab, index, activateTab }) => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.querySelector(`#panel-${index}`);
      const panelInner = el.querySelector(".panel__inner");
      const newHeight = panelInner.scrollHeight;
      setHeight(newHeight);
    }, 333);

    return () => clearTimeout(timer);
  }, [index]);

  const isActive = activeTab === index;
  const innerStyle = {
    height: `${isActive ? height : 0}px`,
  };

  return (
    <div className="panel" role="tabpanel" id={`panel-${index}`}>
      <button
        className="panel__label"
        role="tab"
        onClick={() => activateTab(index)}
      >
        {label}
      </button>
      <div className="panel__inner" style={innerStyle} aria-hidden={!isActive}>
        <p className="panel__content">{content}</p>
      </div>
    </div>
  );
};

export default Panel;
