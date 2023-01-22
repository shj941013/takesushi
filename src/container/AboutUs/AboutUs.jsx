import React from 'react';

import { images } from '../../constants';
import './AboutUs.css';

const AboutUs = () => (
  <div className="app__aboutus app__bg flex__center section__padding" id="about">
    
    {/* <div className="app__aboutus-overlay flex__center">
      <img src={images.G} alt="G_overlay" />
    </div> */}

    <div className="app__aboutus-content flex__center">
      <div className="app__aboutus-content_about">
        <h1 className="headtext__cormorant">About Us</h1>
        <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        <p className="p__opensans">Since 1995, TAKE SUSHI has been privileged to serve you. Together, Chef Song and Manager Yong have more than 30 years of experience in the culinary arts, providing guests with first-rate hospitality and services. Chef Song is also trained in the most difficult sushi dish of them all, the blowfish.</p>
        {/* <button type="button" className="custom__button">Know More</button> */}
      </div>

      <div className="app__aboutus-content_knife flex__center">
        <img src={images.knife} alt="about_knife" />
      </div>

      {/* <div className="app__aboutus-content_history">
        <h1 className="headtext__cormorant">Our History</h1>
        <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        <p className="p__opensans">Adipiscing tempus ullamcorper lobortis odio tellus arcu volutpat. Risus placerat morbi volutpat habitasse interdum mi aliquam In sed odio nec aliquet.</p>
        <button type="button" className="custom__button">Know More</button>
      </div> */}

      <div className="app__aboutus-content_history">
        <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        <div className='row'>
          <div className='column'>
            <h1>Chef</h1>
            <h1>Song</h1>
            <img src={images.chef} style={{width: "60%"}} alt="about_spoon" className="spoon__img" />
          </div>
          <div className='column'>
            <h1>Manager</h1>
            <h1>Yong</h1>
            <img src={images.manager} style={{width: "60%"}} alt="about_spoon" className="spoon__img" />
          </div>
        </div>
        <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        {/* <div className='row'>
          <div className='column'>
            <h1>Manager</h1>
            <h1>Yong</h1>
            <img src={images.chef} style={{width: "60%"}} alt="about_spoon" className="spoon__img" />
          </div>
          <div className='column'>
            <h1>Manager</h1>
            <h1>Yong</h1>
            <img src={images.chef} style={{width: "60%"}} alt="about_spoon" className="spoon__img" />
          </div>
          <div className='column'>
            <h1>Manager</h1>
            <h1>Yong</h1>
            <img src={images.chef} style={{width: "60%"}} alt="about_spoon" className="spoon__img" />
          </div>
        </div> */}
        {/* <div className='row'>
          <div className='column'>
            <h1>Manager</h1>
            <h1>Yong</h1>
            <img src={images.chef} style={{width: "60%"}} alt="about_spoon" className="spoon__img" />
          </div>
          <div className='column'>
            <h1>Manager</h1>
            <h1>Yong</h1>
            <img src={images.chef} style={{width: "60%"}} alt="about_spoon" className="spoon__img" />
          </div>
          <div className='column'>
            <h1>Manager</h1>
            <h1>Yong</h1>
            <img src={images.chef} style={{width: "60%"}} alt="about_spoon" className="spoon__img" />
          </div> */}
        {/* </div> */}
      </div>
    </div>
  </div>
);

export default AboutUs;