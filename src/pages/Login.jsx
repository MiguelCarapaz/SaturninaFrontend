import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Footer, Navbar } from '../components/Dashboard';
import { AuthContext } from '../context/AuthProvider';
import Swal from 'sweetalert2';
import { Formik, Form, Field } from 'formik';

const Login = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, [setAuth, navigate]);

  function checkAuthStatus() {
    const authToken = localStorage.getItem('authToken');
    if (authToken && !auth.authToken) {
      setAuth({ authToken });
    }
  }

  useEffect(() => {
    if (auth.authToken) {
      if (userEmail === 'miguelotaku01@gmail.com') {
        navigate('/admin/dashboard3');
      } else if (userEmail === 'miguelcarapaz01@gmail.com') {
        navigate('/usuario/dashboard2');
      }
    }
  }, [auth.authToken, userEmail, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (values, actions) => {
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        const authToken = data.detail.token;
        const id = data.detail.id;
        const role = data.detail.rol;
        const userEmail = data.detail.email;

        setUserData(data.detail);
        setUserEmail(userEmail);

        if (authToken) {
          localStorage.setItem('authToken', authToken);
          localStorage.setItem('id', id);
          setAuth({ authToken });

          if (role === 'rol:74rvq7jatzo6ac19mc79') {
            navigate('/admin/dashboard3');
          } else if (role === 'rol:vuqn7k4vw0m1a3wt7fkb') {
            navigate('/usuario/dashboard2');
          } else {
            console.error('Rol desconocido:', role);
          }

          console.log('Token de autenticación:', authToken);
          console.log('id:', id);
          console.log('Rol:', role);
          console.log('Correo electrónico:', userEmail);
        } else {
          console.error('El token no se recibió en la respuesta.');
        }
      } else {
        const data = await response.json();
        if (response.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Necesitas activar tu cuenta. Revisa tu correo para confirmar.',
          });
        } else {
          setError(data.error || 'Correo o contraseña incorrectos. Verifica tus datos.');
        }
      }
    } catch (error) {
      setError('Error en la solicitud de inicio de sesión: ' + error.message);
    }

    setLoading(false);
    actions.setSubmitting(false);
  };

  return (
    <>
      <Navbar />
      <div className="container py-3" style={{
        backgroundColor: "rgba(249, 222, 230, 0.4)",
        maxWidth: "10000px",
      }}>
        <h1 className="text-center display-6"
          style={{ fontFamily: "Gotham, sans-serif" }}>
          Iniciar sesión
        </h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <Formik
              initialValues={{
                email: '',
                password: '',
                showPassword: false,
              }}
              onSubmit={handleLogin}
            >
              {({ isSubmitting, status, values, setFieldValue }) => (
                <Form>
                  <div className="my-3">
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
                    <label htmlFor="password">Contraseña</label>
                    <div className="input-group">
                      <Field
                        type={values.showPassword ? 'text' : 'password'}
                        name="password"
                        className="form-control"
                        id="password"
                        placeholder="*********"
                        required
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
                    {status && status.error && status.error.password && (
                      <p className="text-danger">{status.error.password}</p>
                    )}
                  </div>
                  <div className="my-3">
                <p>
                  ¿No tienes una cuenta?{' '}
                  <Link to="/register" className="text-decoration-underline text-info">
                    Regístrate aquí
                  </Link>
                </p>
              </div>
              <div className="my-3">
                <p>
                  ¿Olvidaste tu contraseña?{' '}
                  <Link to="/recuperarcorreo" className="text-decoration-underline text-info">
                    Recupera tu cuenta
                  </Link>
                </p>
              </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="my-2 mx-auto btn btn-dark"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                  </div>
                  {error && <p className="text-danger text-center">{error}</p>}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
