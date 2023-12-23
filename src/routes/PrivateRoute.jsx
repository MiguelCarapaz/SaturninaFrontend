import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const PrivateRoute = ({ roles, ...props }) => {
  const { auth, perfilLoaded } = useContext(AuthContext);

  if (!perfilLoaded) {
    // Puedes mostrar un spinner o algún indicador de carga mientras se obtiene el perfil
    return null;
  }

  if (!auth.authToken || (roles && !roles.includes(auth.user?.role))) {
    return <Navigate to="/login" />;
  }

  return <Outlet {...props} />;
};

export default PrivateRoute;
