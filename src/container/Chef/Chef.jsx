import React from 'react';

import { SubHeading } from '../../components';
import { images } from '../../constants';
import './Chef.css';

const Chef = () => (
  <div className="app__bg app__wrapper section__padding">
    <div className="app__wrapper_img app__wrapper_img-reverse">
      <img src={images.coverphoto3} alt="chef_image" />
    </div>
    <div className="app__wrapper_info">
      <SubHeading title="Chef's word" />
      <h1 className="headtext__cormorant">What we believe in</h1>

      <div className="app__chef-content">
        <div className="app__chef-content_quote">
          <img src={images.quote} alt="quote_image" />
          <p className="p__opensans">Our aim at TAKE SUSHI </p>
        </div>
        <p className="p__opensans">is to provide our clients with the BEST SUSHI in town while also ensuring that they have the best possible experience while dining with us.</p>
      </div>

      <div className="app__chef-sign">
        <p>Song & Yong</p>
        <p className="p__opensans" style={{margin: 0}}>Founders</p>
        <img src={images.sign} alt="sign_image" style={{margin: 0}} />
      </div>

      <button type="button" className="custom__button"><a href="/about">Meet the team</a></button>
    </div>
  </div>
);

export default Chef;