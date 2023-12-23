import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const CambiarContrasena = () => {
  const { token } = useParams();
  const [mensaje, setMensaje] = useState({});
  const [tokenback, setTokenBack] = useState(false);

  const urlRecuperar = `${import.meta.env.VITE_BACKEND_URL}/api/v1/recover-password/${token}`;
  const urlCambiar = `${import.meta.env.VITE_BACKEND_URL}/api/v1/new-password/${token}`;

  const verifyToken = async () => {
    try {
      const respuesta = await axios.get(urlRecuperar);
      setTokenBack(true);
      setMensaje({ respuesta: respuesta.data.msg, tipo: true });
  
      // Aquí agregamos la redirección después de la confirmación del token
      // Puedes ajustar la ruta según tu estructura de rutas
      window.location.href = "/cambiarcontrasena";
    } catch (error) {
      setMensaje({ respuesta: error.response.data.msg, tipo: false });
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const [form, setForm] = useState({
    new_password: "",
    check_password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await axios.post(urlCambiar, form);
      setForm({});
      setMensaje({ respuesta: respuesta.data.msg, tipo: true });
    } catch (error) {
      setMensaje({ respuesta: error.response.data.msg, tipo: false });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        {Object.keys(mensaje).length > 0 && (
          <p className={mensaje.tipo ? "text-green-500" : "text-red-500"}>
            {mensaje.respuesta}
          </p>
        )}
        <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">
          Bienvenido de nuevo
        </h1>
        <small className="text-gray-400 block my-4 text-sm">
          Por favor ingresa tus datos
        </small>
        {tokenback && (
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-1">
              <label className="mb-2 block text-sm font-semibold">Nueva Contraseña</label>
              <input
                type="password"
                placeholder="Ingresa tu nueva contraseña"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                value={form.new_password || ""}
                name="new_password"
                onChange={handleChange}
              />
              <label className="mb-2 block text-sm font-semibold">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                placeholder="Repite tu nueva contraseña"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                value={form.check_password || ""}
                name="check_password"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
            <div className="mb-3">
            <button className="bg-gray-600 text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white">
              Enviar
            </button>
          </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default CambiarContrasena;
