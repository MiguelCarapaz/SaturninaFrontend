import React from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './routes/PrivateRoute';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

// Componentes
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Product from './pages/Product';
import PageNotFound from './pages/PageNotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import RecuperarCorreo from './pages/RecuperarCorreo';
import CambiarContrasena from './pages/CambiarContrasena';
import { Confirmar } from './pages/Confirmar';


//usuario
import Dashboard2 from './pages/usuario/Dashboard2';
import Products2 from './pages/usuario/Products2';
import Product2 from './pages/usuario/Product2';
import Cart from './pages/usuario/Cart';
import Checkout from './pages/usuario/Checkout';
import Perfil from './pages/usuario/Perfil';
import VerPedidos from './pages/usuario/VerPedidos';
import { Comments2 } from './pages/usuario/Comments2';

//administrador
import Dashboard3 from './pages/administrador/Dashboard3';
import Products3 from './pages/administrador/Products3';
import Product3 from './pages/administrador/Product3';
import Perfil2 from './pages/administrador/Perfil2';
import NuevoProducto from './pages/administrador/NuevoProducto';
import ActualizarProducto from './pages/administrador/ActualizarProducto';
import Categorias from './pages/administrador/Categorias';
import VerPedidosAdmin from './pages/administrador/VerPedidosAdmin';
import {Comments3} from "./pages/administrador/Comments3"


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
          <Route path="/recuperar-contrasena" element={<RecuperarCorreo />} />
          <Route
            path="/cambiar-contrasena/:token"
            element={<CambiarContrasena />}
          />
          <Route path="/confirmar/:token" element={<Confirmar />} />

          {/* Rutas privadas */}
          <Route path="/usuario/*" element={<PrivateRoute />}>
            <Route index element={<Navigate to="/usuario/dashboard" />} />
            <Route path="dashboard" element={<Dashboard2 />} />
            <Route path="products" element={<Products2 />} />
            <Route path="product/:id" element={<Product2 />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="ver-pedidos" element={<VerPedidos />} />
            <Route path="comentarios" element={<Comments2 />} />
          </Route>
          {/* Rutas privadas del administrador */}
          <Route path="/admin/*" element={<PrivateRoute />}>
            <Route index element={<Navigate to="/admin/dashboard" />} />
            <Route path="dashboard" element={<Dashboard3 />} />
            <Route path="products" element={<Products3 />} />
            <Route path="product/:id" element={<Product3 />} />
            <Route path="perfil" element={<Perfil2 />} />
            <Route path="nuevo-producto" element={<NuevoProducto />} />
            <Route
              path="actualizar-producto/:id"
              element={<ActualizarProducto />}
            />
            <Route path="categorias" element={<Categorias />} />
            <Route path="ver-pedidos" element={<VerPedidosAdmin />} />
            <Route path="comentarios" element={<Comments3 />}></Route>
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
