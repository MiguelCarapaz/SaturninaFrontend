import React,{useContext, useState} from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { AiOutlineMenu } from "react-icons/ai";
import { AuthContext } from '../../context/AuthProvider';

const Navbar2 = ({ userData }) => {
  const { auth } = useContext(AuthContext);
  const state = useSelector((state) => state.handleCart);
  const [showMenu, setShowMenu] = useState(false);


  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("id");
    navigate("/login");
  };

  return (
    <nav className="flex flex-col md:flex-row items-center justify-evenly w-full p-2 bg-white">
      <div className="flex items-center justify-between w-full md:w-auto">
        <a href="/usuario/dashboard">
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
        <Link
          to="../ver-pedidos"
          className="no-underline text-black cursor-pointer"
        >
          Pedidos
        </Link>
        <Link
          to="../comentarios"
          className="no-underline text-black cursor-pointer"
        >
          Comentarios
        </Link>

        <div
          className={`md:flex md:flex-row md:items-center flex-col items-center  ${
            showMenu ? "flex mt-3" : "hidden"
          }`}
        >
          <Link
            to="/usuario/cart"
            className="flex flex-row text-black no underline"
          >
            <FaShoppingCart className="text-2xl mr-2" />
            <span className="mr-4 no-underline"> ({state.length})</span>
          </Link>
          <Link to="../perfil" className="btn m-2">
            <div style={{ display: "flex", alignItems: "center" }}>
              {typeof userData === "string" && <span>{userData} </span>}
              <FaUser className="text-2xl" />
              {auth.user && auth.user.detail.nombre && (
                <span className="ml-2">
                  {auth.user.detail.nombre} {auth.user.detail.apellido}
                  {<span className=" font-bold"> Usuario</span>}
                </span>
              )}
              
            </div>
          </Link>
          <Link to="/login" className="no-underline" onClick={handleLogout}>
            <button className="bg-slate-950 hover:bg-slate-500 text-white p-2 rounded-md">
              Salir
            </button>
          </Link>
        </div>
      </section>
    </nav>
  );
};

export default Navbar2;
