import React from 'react';
import { Link } from 'react-router-dom';
import { images } from '../../constants';
export default function Chef() {
  return <section className="section intro" id="welcome">
    <div className="intro-photo">
      <img src={images.assortment} alt="An assortment of Take Sushi rolls and nigiri" loading="lazy" />
      <span className="image-caption">A TASTE OF TAKE SUSHI</span>
    </div>
    <div>
      <p className="eyebrow">02 / THE EXPERIENCE</p>
      <h2>A tradition of flavor.<br /><em>An experience to savor.</em></h2>
      <p>Since 1995, Take Sushi has been privileged to serve the Rochester Hills community. Our aim is to give every guest a wonderful experience, from the sushi bar to the table.</p>
      <p>Meet Chef Song and Manager Yong, the people behind our food and hospitality.</p>
      <Link className="text-link" to="/about">Our story <span>✳</span></Link>
      <div className="signature">Song &amp; Yong <small>FOUNDERS</small></div>
    </div>
  </section>;
}
