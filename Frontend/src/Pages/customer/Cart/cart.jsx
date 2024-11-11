import React from 'react';
import { createRoutesFromElements, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../../Component/Navbar/navbar';
import Footer from '../../../Component/Footer/footer';
import './cart.css'; // Ensure you have a CSS file for styling

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Assuming booking details are passed through the state when navigating from the Product page
  const { room, bookingData, totalPrice } = location.state || {};

  const handlePayment = () => {
    // Here you can add logic for processing the payment
    console.log('Payment initiated for:', room, bookingData, totalPrice);
    
    // You might navigate to a payment gateway here
    // navigate('/payment');
  };
  
  // Get the first image
  const firstImage = Array.isArray(room?.propertyImage) 
    ? room.propertyImage[0] 
    : room?.propertyImage ? room.propertyImage.split(',')[0] : '';


  return (
    <div>
      <Navbar />

      <br/><br/><br/><br/>
      <div className="cart-container">
        <h1>Your Shopping Cart</h1>
        {room && (
          <div className="cart-item">
            <div className="cart-item-content">
              <div className="cart-item-image">
                {firstImage ? (
                  <img src={`data:image/jpeg;base64,${firstImage}`} alt={room.propertyName} />
                ) : (
                  <p>Image not available</p>
                )}
              </div>
              <div className="cart-item-details">
                <h2>{room.propertyName}</h2>
                <div className="details-row">
                  <p>Price: ${room.propertyPrice}/night</p>
                </div>
                <div className="details-row">
                  <p>Arrival Date: {bookingData.arrivalDate}</p>
                  <p>Departure Date: {bookingData.departureDate}</p>
                </div>
                <div className="details-row">
                  <p>First Name: {bookingData.firstname}</p>
                  <p>Last Name: {bookingData.lastname}</p>
                </div>
                <div className="details-row">
                  <p>Email: {bookingData.email}</p>
                  <p>Phone Number: {bookingData.phonenumber}</p>
                </div>
                <div className="details-row">
                  <p>Adults: {bookingData.adults}</p>
                  <p>Children: {bookingData.children}</p>
                </div>
                <div className="details-row">
                  <p>Title: {bookingData.rcTitle}</p>
                  <p>Request: {bookingData.request}</p>
                </div>
                <div className="details-row">
                  <p>Total Price: ${totalPrice}</p>
                </div>
                <div className="button-container">
                  <button className="pay-button" onClick={handlePayment}>Pay</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <br/><br/>
      <Footer />
    </div>
  );
};

export default Cart;