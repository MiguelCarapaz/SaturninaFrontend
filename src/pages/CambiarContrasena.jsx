import React, { useState, useEffect } from 'react';
import { Navbar } from '../../src/components/Dashboard';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Formik, Form, Field } from 'formik';

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

  const handleSubmit = async (values, { setSubmitting, setStatus, resetForm }) => {
    if (newPassword.length < 9 || checkPassword.length < 9) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas deben tener al menos 9 caracteres.',
      });
      setSubmitting(false);
      return;
    }

    if (newPassword !== checkPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      setSubmitting(false);
      return;
    }

    try {
      const respuesta = await axios.post(urlCambiar, {
        new_password: newPassword,
        check_password: checkPassword,
      });
      setNewPassword('');
      setCheckPassword('');
      setMensaje({ respuesta: respuesta.data.msg, tipo: true });

      if (respuesta.status === 200 ||  response.ok) {
          Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada con éxito',
        }).then(() => {
          window.location.href = '/login';
        });
      }
    } catch (error) {
      setMensaje({ respuesta: error.message || 'Hubo un error al cambiar la contraseña', tipo: false });
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
                  <Formik
                    initialValues={{
                      new_password: '',
                      check_password: '',
                      showPassword: false,
                    }}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting, values, setFieldValue }) => (
                      <Form>
                        <div className="mb-3">
                          <label>Nueva Contraseña:</label>
                          <div className="input-group">
                            <Field
                              type={values.showPassword ? 'text' : 'password'}
                              className="form-control"
                              name="new_password"
                              value={newPassword}
                              minLength="9"
                              maxLength="18"
                              onChange={handleChange}
                            />
                            <div className="input-group-append">
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setFieldValue('showPassword', !values.showPassword)}
                              >
                                {values.showPassword ? 'Ocultar' : 'Mostrar'}
                              </button>
                            </div>
                          </div>
                          {newPassword.length > 18 ||
                          newPassword.length < 9 ||
                          !/[A-Z]/.test(newPassword) ||
                          !/\d/.test(newPassword) ||
                          !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? (
                            <small className="text-danger">
                              La contraseña debe tener entre 9 y 18 caracteres y contener al menos una letra mayúscula, un número y un carácter especial.
                            </small>
                          ) : (
                            <small className="text-success">Contraseña válida.</small>
                          )}
                        </div>

                        <div className="mb-3">
                          <label>Confirmar Contraseña:</label>
                          <div className="input-group">
                            <Field
                              type={values.showPassword ? 'text' : 'password'}
                              className="form-control"
                              name="check_password"
                              value={checkPassword}
                              minLength="9"
                              maxLength="18"
                              onChange={handleChange}
                            />
                            <div className="input-group-append">
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setFieldValue('showPassword', !values.showPassword)}
                              >
                                {values.showPassword ? 'Ocultar' : 'Mostrar'}
                              </button>
                            </div>
                          </div>
                          {checkPassword.length > 18 ||
                          checkPassword.length < 9 ||
                          !/[A-Z]/.test(checkPassword) ||
                          !/\d/.test(checkPassword) ||
                          !/[!@#$%^&*(),.?":{}|<>]/.test(checkPassword) ? (
                            <small className="text-danger">
                              La contraseña debe tener entre 9 y 18 caracteres y contener al menos una letra mayúscula, un número y un carácter especial.
                            </small>
                          ) : (
                            <small className="text-success">Contraseña válida.</small>
                          )}
                        </div>

                        <div className="text-center">
                          <button className="btn btn-success mx-2" type="submit" disabled={isSubmitting}>
                            Cambiar Contraseña
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CambiarContrasena;
