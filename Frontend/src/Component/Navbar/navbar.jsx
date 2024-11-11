import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FaUserCircle, FaBars } from "react-icons/fa";
import { logoutUser } from '../../../../Backend/Api/api';
import './navbar.css';

function Navbar() {
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
          }else {
            setIsLoggedIn(false);
          }
        }catch (error) {
          console.error('Error fetching user status:', error);
        }
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    const username = localStorage.getItem('username');

    try{
      const response = await logoutUser(username);

      if (response.success) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        navigate('/');
      }else {
        alert('Failed to logout');
      }
    }catch (error) {
      console.error('Error during logout:', error);
      alert('Error logging out');
    }
  };

  return (
    <div>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap/dist/js/bootstrap.bundle.min.js"
          defer
        />
      </Helmet>

      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid">

          <h1 className="navbar-brand mx-4 mb-0" style={{ fontWeight: 500, color: '#fff', fontSize: '23px', transition: '0.3s color' }}>
            Hello Sarawak
          </h1>

          <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">

            <div className="offcanvas-body">

              <ul className="navbar-nav justify-content-left flex-grow-1 pe-3">

                <li className="nav-item mx-4">
                  <Link className="nav-link mx-lg-2" to={isLoggedIn ? '/login/home' : '/'}>
                    Home
                  </Link>
                </li>

                <li className="nav-item mx-4">
                  <Link className="nav-link mx-lg-2" to={isLoggedIn ? '/login/product' : '/product'}>
                    Tour
                  </Link>
                </li>

                <li className="nav-item mx-4">
                  <Link className="nav-link mx-lg-2" to={isLoggedIn ? '/' : '/'}>
                    Cart
                  </Link>
                </li>

                <li className="nav-item mx-4">
                  <Link className="nav-link mx-lg-2" to={isLoggedIn ? '/' : '/'}>
                    Support
                  </Link>
                </li>

                <li className="nav-item mx-4">
                  <Link className="nav-link mx-lg-2" to={isLoggedIn ? '/login/contact_us' : '/contact_us'}>
                    Contact Us
                  </Link>
                </li>

                <li className="nav-item mx-4">
                  <Link className="nav-link mx-lg-2" to={isLoggedIn ? '/' : '/'}>
                    About Us
                  </Link>
                </li>

                <li className="nav-item mx-4">
                  <Link className="nav-link mx-lg-2" to={isLoggedIn ? '/login/about_sarawak' : '/about_sarawak'}>
                    About Sarawak
                  </Link>
                </li>
                
              </ul>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            {isLoggedIn && (
              <button
                className="user-icon-button"
                onClick={() => navigate('/login/profile')}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', marginRight: '20px' }}
              >
                <FaUserCircle size={30} style={{ color: '#fff' }}/>
              </button>
            )}

            {isLoggedIn ? (
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            ) : (
              <Link to="/login" className="login-button">
                Login
              </Link>
            )}

            <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <FaBars size={30} color="#fff" />
            </button>
          </div>

        </div>
      </nav>
    </div>
  );
}

export default Navbar;
