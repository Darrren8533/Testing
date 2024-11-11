import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Component
import Navbar from '../../../Component/Navbar/navbar';
import Footer from '../../../Component/Footer/footer';

// Import Api
import { fetchProperties, createReservation } from '../../../../../Backend/Api/api';

// Import React Icon and CSS
import { IoIosCloseCircleOutline } from "react-icons/io";
import './product.css';

const Product = () => {
  const [properties, setProperties] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingData, setBookingData] = useState({
    arrivalDate: '',
    departureDate: '',
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: '',
    rcTitle: 'Mr.',
    request: '',
    adults: 1,
    children: 0,
  });
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev); // Toggle fullscreen mode
  };

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const fetchedProperties = await fetchProperties();
        setProperties(fetchedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    loadProperties();
  }, []);

  const handleViewDetails = (property) => {
    setSelectedRoom(property);
    setCurrentImageIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const propertyPrice = selectedRoom?.propertyPrice || 0; 

  // Calculate check-in and check-out dates
  const checkInDate = new Date(bookingData.arrivalDate);
  const checkOutDate = new Date(bookingData.departureDate);

  // Calculate the difference in time
  const timeDifference = checkOutDate - checkInDate; // in milliseconds

  // Calculate the number of days (rounded up)
  const numberOfDays = timeDifference > 0 ? Math.ceil(timeDifference / (1000 * 3600 * 24)) : 0; // converting ms to days

  // Calculate total price
  const totalPrice = numberOfDays * propertyPrice;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const reservationData = {
      propertyID: selectedRoom.propertyID,
      checkInDateTime: checkInDate.toISOString(),
      checkOutDateTime: checkOutDate.toISOString(),
      reservationBlockTime: new Date(checkInDate - 3 * 24 * 60 * 60 * 1000).toISOString(),
      request: bookingData.request,
      totalPrice: totalPrice,
      rcFirstName: bookingData.firstname,
      rcLastName: bookingData.lastname,
      rcEmail: bookingData.email,
      rcPhoneNo: bookingData.phonenumber,
      rcTitle: bookingData.rcTitle,
      adults: bookingData.adults,
      children: bookingData.children,
    };

    try {
      await createReservation(reservationData);
      navigate('/cart', { state: { room: selectedRoom, bookingData, totalPrice } });
    } catch (error) {
      console.error('Error submitting reservation:', error);
    }
  };

  const nextImage = () => {
    if (selectedRoom) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedRoom.propertyImage.length);
    }
  };
  
  const prevImage = () => {
    if (selectedRoom) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedRoom.propertyImage.length) % selectedRoom.propertyImage.length);
    }
  };

  return (
    <div>
      {!selectedRoom && <Navbar />}
      <br /><br /><br />

      <section className="home" id="home">
        <div className="container">
          <div className="content grid">
            <div className="box">
              <span>ARRIVAL DATE</span> <br />
              <input type="date" name="arrivalDate" onChange={handleInputChange} />
            </div>
            <div className="box">
              <span>DEPARTURE DATE</span> <br />
              <input type="date" name="departureDate" onChange={handleInputChange} />
            </div>
            <div className="box">
              <span>ADULTS</span> <br />
              <input type="number" placeholder="1" />
            </div>
            <div className="box">
              <span>CHILDREN </span> <br />
              <input type="number" placeholder="0" />
            </div>   
            <div className="box">
              <button className="view_button_availability">
                Check Availability
                <i className="fas fa-arrow-circle-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="offer mtop" id="services">
        <div className="container">
          <h2>Available Properties</h2> 
          <div className="content grid2 mtop">
            {properties.length > 0 ? (
              properties.map((property) => (
                <div className="box flex" key={property.ID}>
                  <div className="left">
                    {property.propertyImage ? (
                      <img src={`data:image/jpeg;base64,${property.propertyImage[0]}`} alt={property.propertyName} />
                    ) : (
                      <p>Image not available</p>
                    )}
                  </div>
                  <div className="right">
                    <h4>{property.propertyName}</h4>
                    <p>{property.propertyDescription}</p>
                    <h5>From ${property.propertyPrice}/night</h5>
                    <button className="view-button" onClick={() => handleViewDetails(property)}>
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No properties available.</p>
            )}
          </div>
        </div>
      </section>

      {selectedRoom && (
        <div className="room-details-overlay">
          <div className="room-details">
          <IoIosCloseCircleOutline className='icon_close' onClick={handleCloseModal} />
          <div className="room-details-content">
          <div className="room-image">
              <div className="main-image-container">
                <button className="carousel-button left" onClick={prevImage}>&lt;</button>
                <img className={`main-image ${isFullScreen ? 'fullscreen' : ''}`} src={`data:image/jpeg;base64,${selectedRoom.propertyImage[currentImageIndex]}`}
                     alt={selectedRoom.propertyName || 'Property Image'}
                     onClick={toggleFullScreen}
                />
                <button className="carousel-button right" onClick={nextImage}>&gt;</button>
              </div>

              <div className="thumbnails">
                {selectedRoom.propertyImage.map((image, index) => (
                  <div className="thumbnail" key={index} onClick={() => setCurrentImageIndex(index)}>
                    <img src={`data:image/jpeg;base64,${image}`} alt={`${selectedRoom.propertyName} thumbnail ${index + 1}`}
                      className={currentImageIndex === index ? 'active' : ''}
                    />
                  </div>
                ))}
              </div>
            </div>

              <div className="room-info">
                <h2>{selectedRoom.propertyName}</h2>
                <p>{selectedRoom.propertyDescription}</p>
                <h4>From ${selectedRoom.propertyPrice}/night</h4>

                <form className="booking-form" onSubmit={handleBookingSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Arrival Date</label>
                      <input type="date" name="arrivalDate" value={bookingData.arrivalDate} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Departure Date</label>
                      <input type="date" name="departureDate" value={bookingData.departureDate} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input type="text" name="firstname" value={bookingData.firstname} onChange={handleInputChange} placeholder='First Name Only' />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input type="text" name="lastname" value={bookingData.lastname} onChange={handleInputChange} placeholder='Last Name Only' />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" name="email" value={bookingData.email} onChange={handleInputChange} placeholder='e.g. abc123@gmail.com' />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="text" name="phonenumber" value={bookingData.phonenumber} onChange={handleInputChange} placeholder='e.g. 60112345678' />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Adults</label>
                      <input type="number" name="adults" value={bookingData.adults} onChange={handleInputChange} min="1" />
                    </div>
                    <div className="form-group">
                      <label>Children</label>
                      <input type="number" name="children" value={bookingData.children} onChange={handleInputChange} min="0" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className='form-group'>
                      <label>Title</label>
                      <div>
                        <label><input type="radio" name="rcTitle" value="Mr." checked={bookingData.rcTitle === 'Mr.'} onChange={handleInputChange} /> Mr.</label>
                        <label><input type="radio" name="rcTitle" value="Mrs." checked={bookingData.rcTitle === 'Mrs.'} onChange={handleInputChange} /> Mrs.</label>
                        <label><input type="radio" name="rcTitle" value="Ms." checked={bookingData.rcTitle === 'Ms.'} onChange={handleInputChange} /> Ms.</label>
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className='form-group'>
                      <label>Special Requests</label>
                      <textarea name="request" value={bookingData.request} onChange={handleInputChange} rows="10" placeholder='Write Any Special Request Here'></textarea>
                    </div>
                  </div>
                  <div className="form-row">
                    <h3>Total Price: ${totalPrice}</h3>
                  </div>
                  <button type="submit">Confirm Booking</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <br/><br/>
      <Footer />
    </div>
  );
};

export default Product;
