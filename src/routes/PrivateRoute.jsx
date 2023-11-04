import { Navigate } from "react-router-dom";
export const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken");

  return authToken ? children : <Navigate to="/login" />;
}