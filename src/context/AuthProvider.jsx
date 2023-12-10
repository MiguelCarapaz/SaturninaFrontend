import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const backendUrl = "https://test-back-dev-nprj.3.us-1.fl0.io";

  const perfil = async (token) => {
    try {
      const url = `${backendUrl}/api/v1/user`; // Ruta correcta para obtener datos del perfil
      const options = {
        method: 'GET', // Utiliza el método HTTP GET para obtener los datos del perfil
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await fetch(url, options);
      if (respuesta.ok) {
        const data = await respuesta.json();
        setAuth(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      perfil(token);
    }
  }, []);

  const login = async (formData) => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        setAuth(data);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        perfil,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
export default AuthContext;
