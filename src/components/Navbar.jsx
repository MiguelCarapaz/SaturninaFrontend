import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineUser, AiOutlineMenu } from "react-icons/ai";
import { scroller,animateScroll } from "react-scroll";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const state = useSelector((state) => state.handleCart);
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleScrollTo = (elementId) => {
    
    scroller.scrollTo(elementId, {
      duration: 150,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: 50,
      spy: true,
    });
    setShowMenu(false)
  };
  const handleScrollToTop = () => {
     animateScroll.scrollToTop({
       duration: 150, // Puedes ajustar la duración según tus preferencias
       smooth: "easeInOutQuart",
     });
     setShowMenu(false)
  }

  return (
    <nav className="flex flex-col md:flex-row items-center justify-evenly w-full p-2 bg-white ">
      <div className="flex items-center justify-between w-full md:w-auto">
        <a href="/dashboard">
          <img src="/assets/logo2.png" alt="Logo" />
        </a>
        <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
          <AiOutlineMenu className="text-black text-2xl" />
        </div>
      </div>

      <section
        className={`flex flex-col md:flex md:flex-row items-center w-full justify-evenly gap-3 text-lg ${
          showMenu ? "flex flex-col justify-evenly w-full h-dvh " : "hidden"
        }`}
      >
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
            handleScrollTo("productos");
          }}
        >
          Productos
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
        <div
          className={`md:flex md:flex-row ${showMenu ? "flex mt-3" : "hidden"}`}
        >
          <a
            className=" flex items-center justify-center no-underline text-white bg-slate-950 hover:bg-slate-400 font-medium rounded-lg text-xl p-2.5 "
            href="/login"
          >
            <AiOutlineUser />
            <span className={`${showMenu ? "flex ml-2" : "hidden"}`}>
              Ingresa
            </span>
          </a>
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
