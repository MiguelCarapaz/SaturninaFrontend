import React from 'react';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const state = useSelector((state) => state.handleCart);

  const navbarStyle = {
    backgroundColor: 'rgba(193, 170, 208, 0.3)', // Fondo del Navbar
  };

  const buttonStyle = {
    backgroundColor: 'rgba(140, 150, 170, 0.3)', // Fondo del botón con transparencia
    color: '#000', // Color de texto del botón
    borderColor: '#000', // Borde del botón
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light py-1 sticky-top" style={navbarStyle}>
      <div className="container">
        <a className="navbar-brand fw-bold fs-4 px-2" href="/Dashboard">
          <img
            src="/public/assets/logo.png"
            alt="Logo" 
            style={{
              display: 'block',
              margin: '0 auto',
              maxWidth: '100%',
            }}
          />
        </a>
        <button
          className="navbar-toggler mx-2"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="buttons text-center">
          <a className="btn btn-outline-dark m-2" href="/login" style={buttonStyle}>
            <i className="fa fa-sign-in-alt mr-1"></i> Iniciar sesión
          </a>
          <a className="btn btn-outline-dark m-3" href="/register" style={buttonStyle}>
            <i className="fa fa-user-plus mr-1"></i> Registrar
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
