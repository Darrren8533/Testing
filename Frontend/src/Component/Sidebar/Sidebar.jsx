import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import { logoutUser } from '../../../../Backend/Api/api';
import '../../Component/Sidebar/Sidebar.css';

const Sidebar = ({ title, links, isCollapsed, toggleSidebar }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const username = localStorage.getItem('username');

      if (username) {
        try {
          const response = await fetch(`http://localhost:5000/checkStatus?username=${username}`);
          const data = await response.json();

          if (data.uStatus === 'login') {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Error fetching user status:', error);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    const username = localStorage.getItem('username');

    try {
      const response = await logoutUser(username);

      if (response.success) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        navigate('/'); // Redirect to login page
      } else {
        alert('Failed to logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Error logging out');
    }
  };

  return (
    <div>
      <button className="menu-toggle" onClick={toggleSidebar}>
        <FiMenu />
      </button>

      <div className={`sidebar-wrapper ${isCollapsed ? 'collapsed' : 'expanded'}`}>
        <h2 className="sidebar-title">{title}</h2>
        <nav>
          <ul className="sideMenus">
            {links.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path} 
                className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
              >
                <span className="menu-icon">{link.icon}</span> {link.label}
              </NavLink>
            ))}
          </ul>
        </nav>

        {isLoggedIn && (
          <div className="logout-container">
            <button onClick={handleLogout} className="logout-item">
              <FiLogOut className="logout-icon" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
