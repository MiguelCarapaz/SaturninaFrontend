import React from "react";
import { NavLink } from "react-router-dom";
import { FaTiktok, FaGooglePlay, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { scroller, animateScroll } from "react-scroll";

const Footer = ({ prevPage, nextPage }) => {
  const anioActual = new Date().getFullYear();

  const handleScrollTo = (elementId) => {
    scroller.scrollTo(elementId, {
      duration: 150,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: 1,
      spy: true,
    });
  };

  const handleScrollToTop = () => {
    animateScroll.scrollToTop({
      duration: 150,
      smooth: "easeInOutQuart",
    });
  };

  return (
    <footer className="bg-slate-100">
      <div className="container mx-auto py-4">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="md:flex md:items-center mb-4 md:mb-0">
            <img
              src="/assets/logo2.png"
              alt="logo-saturnina"
              className="md:mb-0 mb-4"
            />
            <div className="flex flex-col md:ml-8">
              <h4 className="mb-2">Información</h4>
              <p>
                <a
                  href="https://drive.google.com/file/d/1E8T0iK42wmV79q_J4a8tTZ7f4MNQMx79/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'black' }}
                >
                  Términos y Condiciones
                </a>
              </p>
              <NavLink
                to="/dashboard"
                className="no-underline text-black cursor-pointer mb-2"
                onClick={() => {
                  handleScrollToTop();
                }}
              >
              </NavLink>
              <NavLink
                to="/dashboard"
                className="no-underline text-black cursor-pointer"
                onClick={() => {
                  handleScrollTo("comentarios");
                }}
              >
              </NavLink>
            </div>
          </div>

          <div className="flex flex-col items-center md:mb-0 mb-4">
            <h4 className="mb-2">Redes Sociales</h4>
            <div className="flex flex-row text-4xl my-2 gap-4">
              <a href="https://www.tiktok.com/@saturnina.uio?_t=8k1MoBRe8QA&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'black' }}>
                <FaTiktok className="hover:text-blue-500" />
              </a>
              <a href="https://www.instagram.com/saturnina.uio/?igshid=NzZhOTFlYzFmZQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'black' }}>
                <FaInstagram className="hover:text-fuchsia-500" />
              </a>
              <a href=" https://wa.me/+593992708506"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'black' }}>
                <FaWhatsapp className="hover:text-green-500" />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center md:mb-0 mb-4">
            <h4 className="mb-2">App Móvil</h4>
            <a href="https://play.google.com/store/apps/details?id=com.saturnina.saturninaapp"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'black' }}>
              <FaGooglePlay className="text-3xl hover:text-green-500 mt-2" />
            </a>
          </div>
        </div>

        <div className="text-center mt-4">
          <p>&copy; {anioActual} Saturnina. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
