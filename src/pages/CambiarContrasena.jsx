import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '../../src/components/Dashboard';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const CambiarContrasena = () => {
  const [mensaje, setMensaje] = useState({});
  const [tokenVerified, setTokenVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');

  const { token } = useParams();
  const urlRecuperar = `${import.meta.env.VITE_API_BASE_URL}/recover-password/${token}`;
  const urlCambiar = `${import.meta.env.VITE_API_BASE_URL}/new-password/${token}`;

  const verifyToken = async () => {
    try {
      const respuesta = await axios.get(urlRecuperar);
      setTokenVerified(true);
      setMensaje({ respuesta: respuesta.data.msg, tipo: true });
    } catch (error) {
      setMensaje({ respuesta: error.response.data.msg, tipo: false });
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'new_password') {
      setNewPassword(e.target.value);
    } else if (e.target.name === 'check_password') {
      setCheckPassword(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== checkPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }

    try {
      const respuesta = await axios.post(urlCambiar, { new_password: newPassword, check_password: checkPassword });
      setNewPassword('');
      setCheckPassword('');
      setMensaje({ respuesta: respuesta.data.msg, tipo: true });

      // Redirigir al usuario al login después de cambiar la contraseña con éxito
      if (respuesta.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña cambiada con éxito',
        }).then(() => {
          window.location.href = "/login";
        });
      }
    } catch (error) {
      setMensaje({ respuesta: error.response.data.msg, tipo: false });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-5 py-2">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h2 className="text-center mb-4">Recuperar Contraseña</h2>
            <div className="card mb-4">
              <div className="card-body">
                {Object.keys(mensaje).length > 0 && (
                  <p className={mensaje.tipo ? 'text-green-500' : 'text-red-500'}>
                    {mensaje.respuesta}
                  </p>
                )}
                {tokenVerified && (
                  <form className="w-full" onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label>Nueva Contraseña:</label>
                      <input
                        type="password"
                        className="form-control"
                        name="new_password"
                        value={newPassword}
                        minLength="9"
                        maxLength="18"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label>Confirmar Contraseña:</label>
                      <input
                        type="password"
                        className="form-control"
                        name="check_password"
                        value={checkPassword}
                        minLength="9"
                        maxLength="18"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="text-center">
                      <button className="btn btn-success mx-2" type="submit">
                        Cambiar Contraseña
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CambiarContrasena;
