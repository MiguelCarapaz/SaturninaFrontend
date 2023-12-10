import React from 'react';
import { Footer, Navbar } from '../components/Dashboard';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';

const Register = () => {
  const handleSubmit = async (values, actions) => {
    // Enviar los datos del formulario a la API para el registro
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Espera 2 segundos
        actions.setSubmitting(false); // Detener la animación de envío
        actions.resetForm(); // Limpiar el formulario
        actions.setStatus({ message: '¡Registro exitoso! Se ha enviado un correo a tu cuenta. Por favor, confirma tu cuenta para poder iniciar sesión.' });

        // Redireccionar al login después de 5 segundos
        setTimeout(() => {
          window.location.href = '/login';
        }, 5000);
      } else {
        const data = await response.json();
        actions.setStatus({ error: data.error || 'Error en el registro. Por favor, verifica tus datos.' });
        actions.setSubmitting(false); // Detener la animación de envío en caso de error
      }
    } catch (error) {
      actions.setStatus({ error: 'Error en la solicitud de registro: ' + error.message });
      actions.setSubmitting(false); // Detener la animación de envío en caso de error
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ backgroundColor: "rgba(249, 222, 230, 0.4)", maxWidth: "10000px" }}>
        <h1 className="display-6 text-center" style={{ fontFamily: "Gotham, sans-serif" }}>Registrar</h1>
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
              }}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, status }) => (
                <Form>
                  <div className="form my-3">
                    <label htmlFor="nombre">Nombre</label>
                    <Field
                      type="text"
                      name="nombre"
                      className="form-control"
                      id="nombre"
                      placeholder="Ingresa tus nombres completos"
                      required
                    />
                  </div>
                  <div className="form my-3">
                    <label htmlFor="apellido">Apellido</label>
                    <Field
                      type="text"
                      name="apellido"
                      className="form-control"
                      id="apellido"
                      placeholder="Ingresa tu apellido"
                      required
                    />
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
                  </div>
                  <div className="form my-3">
                    <label htmlFor="password">Contraseña</label>
                    <Field
                      type="password"
                      name="password"
                      className="form-control"
                      id="password"
                      placeholder="*********"
                      required
                    />
                  </div>
                  <div className="form my-3">
                    <label htmlFor="telefono">Teléfono</label>
                    <Field
                      type="text"
                      name="telefono"
                      className="form-control"
                      id="telefono"
                      placeholder="Ingresa tu teléfono"
                      required
                    />
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
                    <button className="my-2 mx-auto btn btn-dark" disabled={isSubmitting}>
                      {isSubmitting ? 'Registrando...' : 'Registrar'}
                    </button>
                  </div>
                  {status && status.error && <p className="text-danger text-center">{status.error}</p>}
                  {status && status.message && <p className="text-success text-center">{status.message}</p>}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
