import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';

function PrivateRoute({ roles, ...props }) {
  const { auth } = useContext(AuthContext);

  // Agregar registros para verificar el token y el rol
  console.log('Auth en PrivateRoute:', auth);

  if (!auth.authToken || (roles && !roles.includes(auth.role))) {
    return <Navigate to="/login" />;
  }

  return <Outlet {...props} />;
}

export default PrivateRoute;
