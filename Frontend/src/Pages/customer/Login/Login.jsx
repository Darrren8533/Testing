import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Login/Login.css';

// Import Assets using ES Modules
import video from '../../../public/Sarawak_2.mp4';
import logo from '../../../public/Sarawak_icon.png';

// Import Icons and 
import { FaUserCircle } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { FaArrowLeft } from "react-icons/fa";

// Import API function
import { loginUser } from '../../../../../Backend/Api/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Function to navigate back
  const handleBackClick = () => {
      if (window.history.length > 1) {
      navigate(-1);
      } 
      
      else {
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
  const userData = { username, password };  
  
    try {
      const response = await loginUser(userData);  
      const data = await response.json(); 
  
      if (response.ok && data.success) {
        // Set login status and userGroup in localStorage
        localStorage.setItem('isLoggedIn', 'true');  
        localStorage.setItem('username', username);
        localStorage.setItem('userGroup', data.userGroup);  
        const userGroup = data.userGroup;
  
        // Check userGroup and navigate to respective dashboard
        if (userGroup === 'Customer') {
          navigate('/login/home');
        } else if (userGroup === 'Owner') {
          navigate('/login/owner_dashboard');
        } else if (userGroup === 'Moderator') {
          navigate('/login/moderator_dashboard');
        } else if (userGroup === 'Administrator') {
          navigate('/login/administrator_dashboard');
        }
      } else {
        // Show error message if login failed
        alert(data.message || 'Error logging in');
      }
    } catch (error) {
      // Handle any error that occurred during the login request
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again.');
    }
  };
  

  return (
    <div className='loginPage flex'>
      <div className='container flex'>
        <div className='videoDiv'>
          <video src={video} autoPlay muted loop></video>
          <div className='textDiv'>
            <h2 className='title_A'>Hello Sarawak</h2>
            <h3 className='title_B'>Your Journey Begins</h3>
          </div>
          <div className='footerDiv flex'>
            <span className='text'>Don't Have An Account?</span>
            <Link to={'/register'}>
              <button className='btn'>Sign Up</button>
            </Link>
          </div>
        </div>

        <div className='formDiv flex'>
          <FaArrowLeft className='icon_arrow' onClick={handleBackClick} />
          <div className='headerDiv'>
            <img src={logo} alt='Logo Image' />
              <div className='textDiv'>
                <h3 className='title_C'>
                  Welcome To
                  <br />
                  Hello Sarawak
                </h3>
              </div>
          </div>

          <form onSubmit={handleSubmit} className='form grid'>
            <div className='inputDiv'>
              <label htmlFor='username'>Username</label>
              <div className='input flex'>
                <FaUserCircle className='icon' />
                <input
                  type='text'
                  id='username'
                  placeholder='Enter Username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className='inputDiv'>
              <label htmlFor='password'>Password</label>
              <div className='input flex'>
                <RiLockPasswordFill className='icon' />
                <input
                  type='password'
                  id='password'
                  placeholder='Enter Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <br/>

            <button type='submit' className='btn'>
              <span>Login</span>
            </button>

            <button onClick={() => navigate('/register')} className='btn_responsive'>
              <span>Sign Up</span>
            </button>

            <span className='forgotpassword'>
              Forgot Password? <Link to="/login">Click Here</Link>
            </span>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
