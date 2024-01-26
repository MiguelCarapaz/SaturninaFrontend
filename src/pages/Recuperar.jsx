import React, { useState } from 'react';
import { Footer, Navbar } from '../components/Dashboard';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';

const Recuperar = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);

  const getRecoveryTokenFromURL = () => {
    // Implementa cómo obtener el token de recuperación desde la URL
    // Aquí, asumiremos que el token está en un parámetro llamado 'token'
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('token');
  };

  const handleRecoverAccount = async (values, actions) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recover-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (response.ok) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        actions.setSubmitting(false);
        actions.resetForm();
        actions.setStatus({ message: 'Hemos enviado un correo de recuperación a tu cuenta. Por favor, revisa tu bandeja de entrada.' });

        setTimeout(() => {
          setShowChangePassword(true);
        }, 5000);
      } else {
        const data = await response.json();
        actions.setStatus({ error: data.error || 'Error en la solicitud de recuperación. Verifica tus datos.' });
        actions.setSubmitting(false);
      }
    } catch (error) {
      actions.setStatus({ error: 'Error en la solicitud de recuperación: ' + error.message });
      actions.setSubmitting(false);
    }
  };

  const renderRecoverAccount = () => {
    return (
      <Formik
        initialValues={{
          email: '',
        }}
        onSubmit={handleRecoverAccount}
      >
        {({ isSubmitting, status }) => (
          <Form>
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
            <div className="my-3">
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-info" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando correo...' : 'Recuperar Cuenta'}
                </button>
              </div>
            </div>
            {status && status.error && <p className="text-danger text-center">{status.error}</p>}
            {status && status.message && <p className="text-success text-center">{status.message}</p>}
          </Form>
        )}
      </Formik>
    );
  };

  const renderChangePassword = () => {
    return (
      <Formik
        initialValues={{
          new_password: '',
          check_password: '',
        }}
        onSubmit={async (values, actions) => {
          try {
            const token = getRecoveryTokenFromURL();
            if (!token) {
              actions.setStatus({ error: 'Token de recuperación no válido.' });
              return;
            }

            if (values.new_password !== values.check_password) {
              actions.setStatus({ error: 'Las contraseñas no coinciden.' });
              return;
            }

            const response = await fetch(`https://test-back-dev-nprj.3.us-1.fl0.io/api/v1/new-password/${token}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ new_password: values.new_password }),
            });

            if (response.ok) {
              await new Promise((resolve) => setTimeout(resolve, 2000));
              actions.setSubmitting(false);
              actions.resetForm();
              actions.setStatus({ message: 'Contraseña cambiada exitosamente.' });

              setTimeout(() => {
                window.location.href = '/login';
              }, 3000);
            } else {
              const data = await response.json();
              actions.setStatus({ error: data.error || 'Error al cambiar la contraseña. Verifica tus datos.' });
              actions.setSubmitting(false);
            }
          } catch (error) {
            actions.setStatus({ error: 'Error en la solicitud de cambio de contraseña: ' + error.message });
            actions.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <div className="form my-3">
              <label htmlFor="new_password">Nueva Contraseña</label>
              <Field
                type="password"
                name="new_password"
                className="form-control"
                id="new_password"
                placeholder="Nueva contraseña"
                required
              />
            </div>
            <div className="form my-3">
              <label htmlFor="check_password">Confirmar Nueva Contraseña</label>
              <Field
                type="password"
                name="check_password"
                className="form-control"
                id="check_password"
                placeholder="Confirmar contraseña"
                required
              />
            </div>
            <div className="my-3">
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-info" disabled={isSubmitting}>
                  {isSubmitting ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
                </button>
              </div>
            </div>
            {status && status.error && <p className="text-danger text-center">{status.error}</p>}
          </Form>
        )}
      </Formik>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ backgroundColor: "rgba(249, 222, 230, 0.4)", maxWidth: "10000px" }}>
        <h2 className="display-6 text-center" style={{ fontFamily: "Gotham, sans-serif" }}>
          {showChangePassword ? 'Cambiar Contraseña' : 'Recuperar Cuenta'}
        </h2>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            {showChangePassword ? renderChangePassword() : renderRecoverAccount()}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Recuperar;
