import React, { useState } from 'react';
import Navbar from '../../../Component/Navbar/navbar';
import Footer from '../../../Component/Footer/footer';
import './contact_us.css';
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    
    try {
      const response = await fetch('http://localhost:5000/contact_us', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setStatus(result.message); // set status based on response message

      if (response.ok) {
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      setStatus('Failed to send message. Please try again later.');
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <br /><br /><br />
      <section className='contact'>
        <div className='content'>
          <h2>Contact Us</h2>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>

        <div className='container_contact_us'>
          <div className='contactInfo'>
            <div className='box'>
              <FaLocationDot className='icon_contact_us' />
              <div className='text'>
                <h3>Address</h3>
                <p>Lorem ipsum dolor sit amet consectetur.</p>
              </div>
            </div>

            <div className='box'>
              <MdEmail className='icon_contact_us' />
              <div className='text'>
                <h3>Email</h3>
                <p>Lorem ipsum dolor sit amet consectetur.</p>
              </div>
            </div>

            <div className='box'>
              <FaPhoneAlt className='icon_contact_us' />
              <div className='text'>
                <h3>Phone</h3>
                <p>Lorem ipsum dolor sit amet consectetur.</p>
              </div>
            </div>
          </div>

          <div className='contactForm'>
            <form onSubmit={handleSubmit}>
              <h2>Send Message</h2>

              <div className='inputBox'>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <span>Full Name</span>
              </div>

              <div className='inputBox'>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <span>Email</span>
              </div>

              <div className='inputBox'>
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
                <span>Your Message Here</span>
              </div>

              <button type='submit' className='btn_submit'>
                <span>Send</span>
              </button>
              <p>{status}</p> {/* Display status message */}
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
