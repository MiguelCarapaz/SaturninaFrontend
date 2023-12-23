import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    authToken: localStorage.getItem('authToken') || null,
    user: null,
  });
  const [perfilLoaded, setPerfilLoaded] = useState(false);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        if (auth.authToken) {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setAuth((prevAuth) => ({
              ...prevAuth,
              user: userData,
            }));
          } else {
            console.error('Error al obtener datos del usuario:', response.status);
          }
        }

        setPerfilLoaded(true);
      } catch (error) {
        console.error('Error al cargar el perfil del usuario:', error);
      }
    };
    
    cargarPerfil();
  }, [auth.authToken]);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuth({
      authToken: token,
      user: null,
    });
  };

  
  const logout = () => {
    localStorage.removeItem('authToken');
    setAuth({
      authToken: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, perfilLoaded, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
