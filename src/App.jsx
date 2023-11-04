import React from 'react';
import { Outlet, Route, BrowserRouter, Routes, Link, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { AuthProvider } from './context/AuthProvider';
import { PrivateRoute } from './routes/PrivateRoute';


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
import Dashboard2 from './pages/usuario/Dashboard2';
import Products2 from './pages/usuario/Products2';
import Product2 from './pages/usuario/Product2';
import Cart from './pages/usuario/Cart';
import Checkout from './pages/usuario/Checkout';
import Perfil from './pages/usuario/Perfil';



function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route element={<Outlet />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/product" element={<Products />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recuperar" element={<Recuperar />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/product/*" element={<PageNotFound />} />

            <Route path="usuario" element={<PrivateRoute />}>
                {/* Rutas hijas de Dashboard2 */}
                {/* <Routes> */}
                <Route path="Dashboard2" element={<Dashboard2 />}>

                <Route path="products2" element={<Products2 />} />
                <Route path="product2/:id" element={<Product2 />} />
              </Route>
              {/* </Routes> */}
              {/* Otras rutas protegidas */}
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="perfil" element={<Perfil />} />
            </Route>
            
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;
