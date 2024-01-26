import {Link} from 'react-router-dom'
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


export const Confirmar = () => {
    const { token } = useParams();
    const [mensaje, setMensaje] = useState({});
    console.log(token)
    const verifyToken = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/check-email/${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          }
        );
        if(response.ok){
          setMensaje({
            tipo: "success",
            contenido: "Email confirmado, ahora puedes iniciar sesión",
          });

        }
        else if(response.status == 400){
          setMensaje({
            tipo: "error",
            contenido: "Este correo ya esta confirmado",
          });
        }
        
      } catch (error) {
       setMensaje({
         tipo: "error",
         contenido: "Estamos con inconvenientes con nuestra api inténtalo mas tarde",
       });
      }
    };
    useEffect(() => {
      verifyToken();
    }, []);
        console.log(mensaje);

    return (
      <div
        className="flex flex-col items-center justify-center h-dvh"
        style={{
          backgroundImage: "url('/assets/recorver.svg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800 mt-12">
            Muchas Gracias
          </p>
          <p className="md:text-lg lg:text-xl text-gray-600 mt-8">
            {mensaje.tipo === "success" ? (
              <span className="text-green-600">{mensaje.contenido}</span>
            ) : (
              <span className="text-red-600">{mensaje.contenido}</span>
            )}
          </p>
          <Link
            to="/login"
            className="p-3 m-5 w-full text-center bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white no-underline"
          >
            Login
          </Link>
        </div>
      </div>
    );
}
