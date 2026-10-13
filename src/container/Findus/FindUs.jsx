import React from 'react';
import { Hours } from '../Footer/Footer';
export default function FindUs() {
  return <section className="section contact-page">
    <p className="eyebrow">WE LOOK FORWARD TO WELCOMING YOU</p>
    <h1>Make yourself at home.</h1>
    <div className="contact-grid">
      <div>
        <h2>Visit Take Sushi.</h2>
        <address>1366 Walton Blvd<br />Rochester Hills, MI 48309</address>
        <p>Located in the Rochester Hills Plaza</p>
        <a className="text-link" href="https://www.google.com/maps/search/?api=1&query=Take+Sushi+1366+Walton+Blvd+Rochester+Hills+MI">Get directions ↗</a>
        <h3>Reach us at</h3>
        <a href="tel:+12486527800">+1 (248) 652-7800</a>
        <br />
        <a href="tel:+12486524601">+1 (248) 652-4601</a>
        <h3>Opening hours</h3>
        <Hours />
      </div>
      <iframe title="Take Sushi location in Rochester Hills" loading="lazy" className="google-map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2933.0142827792306!2d-83.15847598453347!3d42.68223977916655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8824e9927b5df42d%3A0x515f9772fdbcf08e!2sTake%20Sushi%20Japanese%20Restaurant!5e0!3m2!1sen!2sus!4v1674333103543!5m2!1sen!2sus" />
    </div>
  </section>;
}
