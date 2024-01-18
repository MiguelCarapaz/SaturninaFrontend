import React from 'react';
import { Footer, Navbar } from '../components/Dashboard';
import { Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Formik, Form, Field } from 'formik';
import Swal from 'sweetalert2';

const Register = () => {
  const handleSubmit = async (values, actions) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok || response.status === 200) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        actions.setSubmitting(false);
        actions.resetForm();
        actions.setStatus({});
          Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Se ha enviado un correo a tu cuenta. Por favor, confirma tu cuenta para poder iniciar sesión.',
          confirmButtonText: 'OK',  
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/login';
          }
        });
      } else {
        const data = await response.json();
  
        if (response.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el registro',
            text: 'Este correo electrónico ya se encuentra en uso. Por favor, utiliza otro correo.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error en el registro',
            text: data.error || 'Error en el registro. Por favor, verifica tus datos.',
          });
        }
      }
    } catch (error) {
      actions.setStatus({ error: 'Error en la solicitud de registro: ' + error.message });
      actions.setSubmitting(false);
      Swal.fire({
        icon: 'error',
        title: 'Error en la solicitud de registro',
        text: 'Error en la solicitud de registro: ' + error.message,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ backgroundColor: 'rgba(249, 222, 230, 0.4)', maxWidth: '10000px' }}>
        <h1 className="display-6 text-center" style={{ fontFamily: 'Gotham, sans-serif' }}>
          Registrar
        </h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
          <Formik
          initialValues={{
            nombre: '',
            email: '',
            password: '',
            apellido: '',
            telefono: '',
            showPassword: false,
          }}
          onSubmit={handleSubmit} 
        >
        
              {({ isSubmitting, status, values, setFieldValue  }) => (
                <Form>
  <div className="form my-3">
        <label htmlFor="nombre">Nombre</label>
        <Field
          type="text"
          name="nombre"
          className="form-control"
          id="nombre"
          placeholder="Ingresa tus nombres completos"
          minLength="3"
          required
          onChange={(e) => {
            if (e.target.value.length <= 10) {
              setFieldValue('nombre', e.target.value);
            }
          }}
          value={values.nombre}
        />
        {status && status.error && status.error.nombre && (
          <p className="text-danger">{status.error.nombre}</p>
        )}
      </div>

      <div className="form my-3">
        <label htmlFor="apellido">Apellido</label>
        <Field
          type="text"
          name="apellido"
          className="form-control"
          id="apellido"
          placeholder="Ingresa tu apellido"
          minLength="3"
          required
          onChange={(e) => {
            if (e.target.value.length <= 10) {
              setFieldValue('apellido', e.target.value);
            }
          }}
          value={values.apellido}
        />
        {status && status.error && status.error.apellido && (
          <p className="text-danger">{status.error.apellido}</p>
        )}
      </div>
                  <div className="form my-3">
                    <label htmlFor="email">Correo electrónico</label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      id="email"
                      placeholder="ejemplo@gmail.com"
                      required
                    />
                    {status && status.error && status.error.email && (
                      <p className="text-danger">{status.error.email}</p>
                    )}
                  </div>
                  <div className="form my-3">
                    <label htmlFor="password">Contraseña</label>
                    <div className="input-group">
              <Field
                type={values.showPassword ? 'text' : 'password'}
                name="password"
                className="form-control"
                id="password"
                placeholder="*********"
                required
                minLength="9"
                maxLength="18"
                value={values.password}
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-3"
                  onClick={() => setFieldValue('showPassword', !values.showPassword)}
                >
                  {values.showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </button>
              </div>
            </div>
                    {values.password.length > 18 || values.password.length < 9 || !/[A-Z]/.test(values.password) || !/\d/.test(values.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(values.password) ? (
                    <small className="text-danger">La contraseña debe tener entre 9 y 18 caracteres y contener al menos una letra mayúscula, un número y un carácter especial.</small>
                  ) : (
                    <small className="text-success">Contraseña válida.</small>
                  )}

                    {status && status.error && status.error.password && (
                      <p className="text-danger">{status.error.password}</p>
                    )}
                  </div>
                  <div className="form my-3">
                    <label htmlFor="telefono">Teléfono</label>
                    <Field
                      type="text"  
                      name="telefono"
                      className="form-control"
                      id="telefono"
                      placeholder="Ingresa tu teléfono"
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, ''); 
                        if (numericValue.length <= 10) {
                          setFieldValue('telefono', numericValue);
                        }
                      }}
                      value={values.telefono}
                      required
                    />
                     {values.telefono.length !== 10 && (
                          <small className="text-danger">El teléfono debe tener exactamente 10 dígitos.</small>
                        )}
                  </div>
                  <div className="my-3">
                    <p>
                      ¿Ya tienes una cuenta?{' '}
                      <Link to="/login" className="text-decoration-underline text-info">
                        Iniciar sesión
                      </Link>
                    </p>
                  </div>
                  <div className="text-center">
                  <button
                  type="submit"
                  className="my-2 mx-auto btn btn-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registrando...' : 'Registrar'}
                </button>
                  </div>
                  {status && status.message && <p className="text-success text-center">{status.message}</p>}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
