import React from 'react';
import Navbar from '../../../Component/Navbar/navbar';
import './Home.css';

const Customer_HomePage = () => {
  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <div className='hero-section'>
        <div className="container">
          <h1>Your Journey Your Story</h1>
        </div>
      </div>
    </div>
  );
};

export default Customer_HomePage;

