import React from "react";
import images from "../../constants/images"

const Menu = ({ items }) => {
  return (
    <div className="section-center">
      {items.map((item) => {
        const { id, title, img, desc, price, pdf } = item;
        if (img !== null) {
          return (
            <article key={id} className="menu-item">
              <img src={img} alt={title} className="photo" />
              <div className="item-info">
                <header>
                  <h4 className="menuname"> {title} </h4>
                  <h4 className="price"> ${price} </h4>
                </header>
                <p className="item-text"> {desc} </p>
              </div>
            </article>
          );
        } else {
          if (pdf !== null) {
            return (
              <article key={id} className="menu-item">
                <a href={pdf}><img src={images.menu_screen} alt={title} className="photo" /></a>
                <div className="item-info">
                  <header>
                    <h4 className="menuname"> {title} </h4>
                  </header>
                  <p className="item-text">{desc} </p>
                </div>
              </article>
            );
          } else {
            return (
              <article key={id} className="menu-item">
                <div className="item-info">
                  <header>
                    <h4 className="menuname"> {title} </h4>
                    <h4 className="price"> ${price} </h4>
                  </header>
                  <p className="item-text"> {desc} </p>
                </div>
              </article>
            );
          }
        }
        
      })}
    </div>
  );
};

export default Menu;