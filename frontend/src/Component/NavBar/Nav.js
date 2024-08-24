import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const subMenuRefs = useRef([]);

  useEffect(() => {
    subMenuRefs.current.forEach((menu, index) => {
      if (menu) {
        if (activeButton === index) {
          menu.style.height = `${menu.scrollHeight}px`;
        } else {
          menu.style.height = '0px';
        }
      }
    });
  }, [activeButton]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleClick = (index) => {
    setActiveButton(activeButton === index ? null : index);
    setSidebarOpen(false);
  };

  return (
    <>
    
    <button type="button" className="sidebar-burger" onClick={toggleSidebar}>
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="2.5vw" height="5vh" viewBox="0 0 50 50">
<path d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 L 0 7.5 z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 L 0 22.5 z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 L 0 37.5 z"></path>
</svg>
    </button>
    <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`} style={{display: isSidebarOpen ? 'flex' : 'none' , background: isSidebarOpen ? 'rgb(0 0 0 / 40%)' : 'rgb(0 0 0 / 0%)' }}>
      <header>
      <div className="marquee">
  <span>Welcome to MBA media</span>
</div>
        
      </header>
      {(isSidebarOpen || activeButton !== null) && (
        <ul>
          <li>
            <button type="button" onClick={() => handleClick(null)}>
              <i className="ai-home-alt1"></i>
              <Link to="../../ViewUserPRofile"><p>EditProfile</p></Link>
              
            </button>
          </li>
          <li>
            <button type="button" onClick={() => handleClick(null)}>
              <i className="ai-home-alt1"></i>
              <Link to="../../GlobalPage"><p>GlobalPage</p></Link> 
            </button>  </li>
            <li>
            <button type="button" onClick={() => handleClick(null)}>
              <i className="ai-home-alt1"></i>
              <Link to="../../POst"><p>Add Post </p></Link>        
            </button>      
          </li>
          <li>
            <button type="button" onClick={() => handleClick(null)}>
              <i className="ai-home-alt1"></i>
              <Link to="../../Home"><p>HomePage</p></Link>        
            </button>      
          </li>
          <li>
          <a href="mailto:mhmd.baqer.attwi@gmail.com">
        <h5>email:mhmd.baqer.attwi@gmail.com</h5>
      </a>
          </li>
          {/* Add other menu items here */}
        </ul>
      )}
      {isSidebarOpen && (
         <div className="marquee">
         <span>Done by Mohammad al-baqer Attwi id(12130259)</span>
       </div>
          
      )}
    </aside>
    </>
  );
};

export default Sidebar;
