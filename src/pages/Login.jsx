import { useNavigate } from 'react-router-dom';
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer, Navbar } from '../components/Dashboard';
import { AuthContext } from '../context/AuthProvider';

const Login = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Define un estado para almacenar los datos del usuario
  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar el token de autenticación al cargar la página
    checkAuthStatus();
  }, [setAuth, navigate]); // Agrega las dependencias correctas

  // Función para verificar el token de autenticación
  function checkAuthStatus() {
    const authToken = localStorage.getItem('authToken');
    if (authToken && !auth.authToken) {
      // Agrega una verificación adicional
      setAuth({ authToken });
    }
  }

  useEffect(() => {
    // Redirige después de verificar el estado de autenticación
    if (auth.authToken) {
      console.log('Correo electrónico en la lógica de redirección:', userEmail);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const authToken = data.detail.token;
        const id = data.detail.id;
        const role = data.detail.rol; // Nuevo: obtén el rol del usuario
        const userEmail = data.detail.email; // Nuevo: obtén el correo electrónico del usuario

        // Guarda todos los datos del usuario
        setUserData(data.detail);
        setUserEmail(userEmail);

        // Verifica si se obtuvo un token válido
        if (authToken) {
          localStorage.setItem('authToken', authToken);
          localStorage.setItem('id', id); // Almacena el ID por separado
          setAuth({ authToken });

          // Determina la ruta de redirección según el rol
          if (role === 'rol:74rvq7jatzo6ac19mc79') {
            // Administrador
            navigate('/admin/dashboard3');
          } else if (role === 'rol:vuqn7k4vw0m1a3wt7fkb') {
            // Usuario
            navigate('/usuario/dashboard2');
          } else {
            // Otros roles o manejar de otra manera
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
        setError(data.error || 'Correo o contraseña incorrectos. Verifica tus datos.');
      }
    } catch (error) {
      setError('Error en la solicitud de inicio de sesión: ' + error.message);
    }

    setLoading(false);
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
            <form onSubmit={handleLogin}>
              <div className="my-3">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  id="email"
                  placeholder="ejemplo@gmail.com"
                  required
                />
              </div>
              <div className="my-3">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  id="password"
                  placeholder="*******"
                  required
                />
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
                <button className="my-2 mx-auto btn btn-dark" disabled={loading}>
                  {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
              </div>
            </form>
            {error && <p className="text-danger text-center">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
