import React from 'react';
import { Link } from 'react-router-dom';
import images from '../constants/images';

export default function Brand({ footer = false }) {
  return (
    <Link to="/" className={footer ? 'brand brand-footer' : 'brand'} aria-label="Take Sushi home">
      <img src={images.takeSushiLogo} alt="Take Sushi" width="76" height="76" />
      {!footer && <span className="brand-copy"><strong>Take Sushi</strong><small>JAPANESE RESTAURANT / SINCE 1995</small></span>}
    </Link>
  );
}
