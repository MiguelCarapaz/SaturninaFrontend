import React from "react";
import { Footer2, Navbar2 } from "../../components/usuario/usuario";
import { useSelector, useDispatch } from "react-redux";
import { agregarAlCarrito, eliminarDelCarrito } from "../../redux/action";
import { Link } from "react-router-dom";

const Cart = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-6" style={{ fontFamily: "Gotham, sans-serif" }}>
              Tu carrito está vacío
            </h4>
            <Link to="/usuario/dashboard2" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const addItem = (product) => {
    dispatch(agregarAlCarrito(product));
  };

  const removeItem = (product) => {
    dispatch(eliminarDelCarrito(product));
  };

  const ShowCart = () => {
    let subtotal = 0;
    let totalItems = 0;

    state.forEach((item) => {
      subtotal += item.precio * item.cantidad;
      totalItems += item.cantidad;
    });

    const totalOrder = subtotal;

    return (
      <section className="h-100 gradient-custom">
        <div className="container py-5">
          <div className="row d-flex justify-content-center my-4">
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h5 className="mb-0">Lista de Productos</h5>
                </div>
                <div className="card-body">
                  {state.map((item) => (
                    <div key={item.id_producto} className="my-4">
                      <div className="row align-items-center">
                        <div className="col-md-4">
                          <div className="bg-image rounded" data-mdb-ripple-color="light">
                            <img
                              src={item.imagen?.secure_url || ""}
                              alt={item.nombre_producto}
                              width={100}
                              height={75}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <p>
                            <strong>{item.nombre_producto}</strong>
                          </p>
                          <p>Total por Producto: ${Math.round(item.precio * item.cantidad)}</p>
                        </div>
                        <div className="col-md-4">
                          <div className="d-flex align-items-center justify-content-center my-3">
                            <button
                              className="btn btn-outline-dark px-3"
                              onClick={() => {
                                removeItem(item);
                              }}
                            >
                              -
                            </button>
                            <p className="mx-3">{item.cantidad}</p>
                            <button
                              className="btn btn-outline-dark px-3"
                              onClick={() => {
                                addItem(item);
                              }}
                            >
                              +
                            </button>
                          </div>
                          <p className="text-center">
                            <strong>${Math.round(item.precio * item.cantidad)}</strong>
                          </p>
                        </div>
                      </div>
                      <hr className="my-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Detalle de Compra</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {state.map((item) => (
                      <li
                        key={item.id_producto}
                        className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0"
                      >
                        {item.nombre_producto} ({item.cantidad})<span>${Math.round(item.precio * item.cantidad)}</span>
                      </li>
                    ))}
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total</strong>
                      </div>
                      <span>
                        <strong>${Math.round(totalOrder)}</strong>
                      </span>
                    </li>
                  </ul>

                  <Link to="/usuario/checkout" className="btn btn-dark btn-lg btn-block">
                    Iniciar pago
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      <Navbar2 />
      <div className="container" style={{ backgroundColor: " rgba(218, 184, 215, 0.2)", maxWidth: "10000px" }}>
        <h1 className="text-center display-6" style={{ fontFamily: "Gotham, sans-serif" }}>
          Carrito
        </h1>
        <hr />
        {state.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <Footer2 />
    </>
  );
};

export default Cart;
