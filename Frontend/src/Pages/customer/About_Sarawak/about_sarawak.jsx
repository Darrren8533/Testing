import React from 'react';
import Navbar from '../../../Component/Navbar/navbar';
import Footer from '../../../Component/Footer/footer';
import './about_sarawak.css';

//Import Images
import Bako from '../../../public/Bako.jpg';
import Bird from '../../../public/Bird.jpg';
import Cave from '../../../public/cave.jpg';
import Temple from '../../../public/Temple.jpg';
import Laksa from '../../../public/Laksa.jpg';


const About_Sarawak = () => {
  return (
    <div>
      <Navbar />

      <br/><br/><br/><br/><br/><br/>
      
      <div className="container">
        <section className="about">
          <div className="about-image">
            <img src={Bird} alt="bird" />
          </div>
          <div className="about-content">
            <h1>About Sarawak</h1>
            <p>
              Nestled on the island of Borneo, Sarawak is Malaysia's largest state, renowned 
              for its rich cultural tapestry, diverse wildlife, and breathtaking natural landscapes. 
              Often referred to as the "Land of the Hornbills," Sarawak offers an unparalleled journey 
              into the heart of Southeast Asia.
            </p>
          </div>
        </section>

       <br/><br/><br/><br/>

        <section className="about">
          <div className="about-content">
            <h1>Cultural Diversity</h1>
            <p>
              Home to over 27 ethnic groups, including the Iban, Bidayuh, and Orang Ulu, Sarawak boasts a mosaic of traditions, 
              languages, and beliefs. Visitors can immerse themselves in this cultural diversity by exploring traditional longhouses, 
              participating in local festivals, and visiting the Sarawak Cultural Village, which showcases the heritage of these indigenous communities.
            </p>
          </div>
          <div className="about-image">
            <img src={Temple} alt="temple" />
          </div>
        </section>

       <br/><br/><br/><br/>

        <section className="about">
          <div className="about-image">
            <img src={Bako} alt="bako" />
          </div>
          <div className="about-content">
            <h1>Natural Wonders</h1>
            <p>
              Sarawak's lush rainforests and diverse ecosystems are protected within numerous national parks. Bako National Park, easily 
              accessible from Kuching, is famed for its proboscis monkeys and varied landscapes. Gunung Mulu National Park, a UNESCO World 
              Heritage Site, captivates with its vast cave systems and the iconic limestone Pinnacles.
            </p>
          </div>
        </section>

       <br/><br/><br/><br/>

        <section className="about">
          <div className="about-content">
            <h1>Wildlife Encounters</h1>
            <p>
              For wildlife enthusiasts, Sarawak offers opportunities to observe orangutans in their natural habitat at centers 
              like the Semenggoh Wildlife Rehabilitation Centre. The state's rivers and coastal areas are also home to diverse 
              marine life and bird species, making it a haven for nature lovers.
            </p>
          </div>
          <div className="about-image">
            <img src={Cave} alt="cave" />
          </div>
        </section>

       <br/><br/><br/><br/>

        <section className="about">
          <div className="about-image">
            <img src={Laksa} alt="laksa" />
          </div>
          <div className="about-content">
            <h1>Culinary Delights</h1>
            <p>
              The state's diverse cultural landscape is mirrored in its cuisine. Dishes like Sarawak laksa, 
              kolo mee, and traditional Iban fare offer a gastronomic journey that delights the senses. Exploring 
              local markets and food stalls provides an authentic taste of Sarawak's culinary heritage.
            </p>
          </div>
        </section>

      </div>

      <br/><br/>

      <Footer />
    </div>
  );
};

export default About_Sarawak;
