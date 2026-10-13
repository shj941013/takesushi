import React from 'react';
import { images } from '../../constants';
export default function AboutUs() {
  return <section className="section about-page">
    <p className="eyebrow">TAKE SUSHI · SINCE 1995</p>
    <h1>Food brings us together.</h1>
    <div className="about-grid">
      <div>
        <h2>Our story.</h2>
        <p>Since 1995, TAKE SUSHI has been privileged to serve you. Together, Chef Song and Manager Yong have more than 30 years of experience in the culinary arts, providing guests with first-rate hospitality and services. Chef Song is also trained in the most difficult sushi dish of them all, the blowfish.</p>
        <blockquote>“Our aim at TAKE SUSHI is to provide our clients with the BEST SUSHI in town while also ensuring that they have the best possible experience while dining with us.”<cite>Song &amp; Yong · Founders</cite></blockquote>
      </div>
      <div className="team">{[[images.chef, 'Chef Song'], [images.manager, 'Manager Yong']].map(([src, name]) => <figure key={name}>
          <img src={src} alt={name} loading="lazy" />
          <figcaption>{name}</figcaption>
        </figure>)}</div>
    </div>
  </section>;
}
