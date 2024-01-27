import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaFacebook,
  FaGooglePlay,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
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
          <div className="md:flex md:items-center mb-4 md:mb-0 flex  flex-col items-center">
            <img
              src="/assets/logo2.png"
              alt="logo-saturnina"
              className="md:mb-0 mb-4"
            />
            <div className="flex flex-col md:ml-8 items-center justify-center">
              <h4 className="mb-2">Términos y Condiciones</h4>
              <NavLink
                to="/dashboard"
                className="no-underline text-black cursor-pointer mb-2"
                onClick={() => {
                  handleScrollToTop();
                }}
              >
                Inicio
              </NavLink>
              <NavLink
                to="/dashboard"
                className="no-underline text-black cursor-pointer"
                onClick={() => {
                  handleScrollTo("comentarios");
                }}
              >
                Comentarios
              </NavLink>
            </div>
          </div>

          <div className="flex flex-col items-center md:mb-0 mb-4">
            <h4 className="mb-2">Redes Sociales</h4>
            <div className="flex flex-row text-4xl my-2 gap-4">
              <FaFacebook className="hover:text-blue-600" />
              <FaInstagram className="hover:text-fuchsia-500" />
              <FaWhatsapp className="hover:text-green-500" />
            </div>
          </div>

          <div className="flex flex-col items-center md:mb-0 mb-4">
            <h4 className="mb-2">App Móvil</h4>
            <FaGooglePlay className="text-3xl hover:text-green-500 mt-2" />
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
