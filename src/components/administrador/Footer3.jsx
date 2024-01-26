import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaFacebook,
  FaGooglePlay,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { scroller, animateScroll } from "react-scroll";

const Footer3 = ({ prevPage, nextPage }) => {
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
      <section>
        <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between p-4">
          <img
            src="/assets/logo2.png"
            alt="logo-saturnina"
            className="md:mb-0 mb-4"
          />
          <div className="flex flex-col justify-center items-center md:mb-0 mb-4">
            <h4>Términos y Condiciones</h4>
            <NavLink
              to="/dashboard"
              className="no-underline text-black cursor-pointer"
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

          <div className="flex flex-col items-center md:mb-0 mb-4">
            <h4>Redes Sociales</h4>
            <div className="flex flex-row text-4xl my-2 gap-4">
              <FaFacebook className="hover:text-blue-600" />
              <FaInstagram className="hover:text-fuchsia-500" />
              <FaWhatsapp className="hover:text-green-500" />
            </div>
          </div>

          <div className="flex flex-col justify-center items-center md:mb-0 mb-4">
            <h4>App Móvil</h4>
            <FaGooglePlay className="text-3xl hover:text-green-500 mt-2" />
          </div>
        </div>
        <div className="flex items-center justify-center mt-2 ">
          <br />
          <p>&copy; {anioActual} Saturnina. Todos los derechos reservados.</p>
        </div>
      </section>
    </footer>
  );
};

export default Footer3;