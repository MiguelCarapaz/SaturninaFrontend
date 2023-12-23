import React from "react";
import { NavLink } from 'react-router-dom';

const Footer = ({ prevPage, nextPage }) => {
  const facebookIconUrl = "https://img.freepik.com/vector-premium/facebook-icono-global-redes-sociales-mas-popular_944081-130.jpg";
  const instagramIconUrl = "https://i.pinimg.com/originals/3b/21/c7/3b21c7efd2ba9c119fb8d361acacc31d.png";
  const tiktokIconUrl = "https://cdn-icons-png.flaticon.com/512/4138/4138151.png";
  const twitterIconUrl = "https://cdn.icon-icons.com/icons2/2972/PNG/512/twitter_logo_icon_186891.png";
  const playstoreIconUrl = "https://1000marcas.net/wp-content/uploads/2021/07/Google-Play-Logo-2016.png";

  return (
    <footer className="py-3 text-center" style={{ backgroundImage: 'url(public/assets/logo2.png)', backgroundRepeat: 'no-repeat', backgroundColor: 'rgba(249, 222, 230, 0.3)' }}>
      <div className="container">
        <div className="row">
          <div className="col">
            <h4>Términos y Condiciones</h4>
            <p>Misión</p>
            <p>Visión</p>
          </div>

          <div className="col">
            <h4>Redes Sociales</h4>
            <div>
              <a href="tu_enlace_facebook" target="_blank" rel="noopener noreferrer" style={{ background: `url(${facebookIconUrl})`, width: '50px', height: '50px', display: 'inline-block', backgroundSize: 'cover' }}></a>
              <a href="tu_enlace_instagram" target="_blank" rel="noopener noreferrer" style={{ background: `url(${instagramIconUrl})`, width: '50px', height: '50px', display: 'inline-block', backgroundSize: 'cover' }}></a>
              <a href="tu_enlace_tiktok" target="_blank" rel="noopener noreferrer" style={{ background: `url(${tiktokIconUrl})`, width: '50px', height: '50px', display: 'inline-block', backgroundSize: 'cover' }}></a>
              <a href="tu_enlace_twitter" target="_blank" rel="noopener noreferrer" style={{ background: `url(${twitterIconUrl})`, width: '50px', height: '50px', display: 'inline-block', backgroundSize: 'cover' }}></a>
            </div>
          </div>

          <div className="col">
            <h4>App Móvil</h4>
            <div>
              <a href="tu_enlace_playstore" target="_blank" rel="noopener noreferrer" style={{ background: `url(${playstoreIconUrl})`, width: '150px', height: '70px', display: 'inline-block', backgroundSize: 'cover' }}></a>
            </div>
          </div>
        </div>
       <div className="row">
          <div className="col">
            <br />
            <p>&copy; 2023 Saturnina. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;