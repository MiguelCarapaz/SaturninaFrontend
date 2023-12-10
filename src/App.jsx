import React from 'react';
import { Outlet, Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './routes/PrivateRoute';
import Auth from "./layout/Auth";
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// Componentes
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Product from './pages/Product';
import PageNotFound from './pages/PageNotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Recuperar from './pages/Recuperar';
//usuario
import Dashboard2 from './pages/usuario/Dashboard2';
import Products2 from './pages/usuario/Products2';
import Product2 from './pages/usuario/Product2';
import Cart from './pages/usuario/Cart';
import Checkout from './pages/usuario/Checkout';
import Perfil from './pages/usuario/Perfil';
//administrador
import Dashboard3 from './pages/administrador/Dashboard3';
import Products3 from './pages/administrador/Products3';
import Product3 from './pages/administrador/Product3';
import Perfil2 from './pages/administrador/Perfil2';
import NuevoProducto from './pages/administrador/NuevoProducto';
import ActualizarProducto from './pages/administrador/ActualizarProducto';
import Categorias from './pages/administrador/Categorias';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Rutas públicas */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar" element={<Recuperar />} />

          {/* Rutas privadas */}
          <Route path="/usuario/*" element={<PrivateRoute />}>
            <Route index element={<Navigate to="/usuario/dashboard2" />} />
            <Route path="dashboard2" element={<Dashboard2 />} />
            <Route path="products2" element={<Products2 />} />
            <Route path="product2/:id" element={<Product2 />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="perfil" element={<Perfil />} />
          </Route>
      {/* Rutas privadas del administrador */}
      <Route path="/admin/*" element={<PrivateRoute />}>
            <Route index element={<Navigate to="/admin/dashboard3" />} />
            <Route path="dashboard3" element={<Dashboard3 />} />
            <Route path="products3" element={<Products3 />} />
            <Route path="product3/:id" element={<Product3 />} />
            <Route path="perfil2" element={<Perfil2 />} />
            <Route path="nuevoproducto" element={<NuevoProducto />} />
            <Route path="actualizarproducto/:id" element={<ActualizarProducto />} />
            <Route path="categorias" element={<Categorias />} />

            
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
