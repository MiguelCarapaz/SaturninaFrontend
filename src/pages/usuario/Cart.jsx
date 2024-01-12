import React, { useState } from "react";
import { Footer2, Navbar2 } from "../../components/usuario/usuario";
import { useSelector, useDispatch } from "react-redux";
import { agregarAlCarrito, eliminarDelCarrito } from "../../redux/action";
import { Link } from "react-router-dom";
import { DEL_CART } from "../../redux/action/index";

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
    if (product.cantidad < 20) {
      dispatch(agregarAlCarrito(product));
    }
  };

  const removeItem = (product, reduceQuantity) => {
    console.log('Reducción de cantidad:', reduceQuantity);
    if (reduceQuantity && product.cantidad > 1) {
      dispatch({ type: DEL_CART, payload: product, reduceQuantity: true });
    } else {
      dispatch({ type: DEL_CART, payload: product });
    }
  };

  const deleteItem = (product) => {
    console.log('Eliminando producto:', product);
    dispatch(eliminarDelCarrito(product));
  };

  const ShowCart = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;
    const pagesCount = Math.ceil(state.length / itemsPerPage);

    const handleClick = (page) => {
      setCurrentPage(page);
    };

    const paginatedState = state.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    let subtotal = 0;

    const [imageIndexes, setImageIndexes] = useState(paginatedState.map(() => 0));

    paginatedState.forEach((item, index) => {
      subtotal += item.precio * item.cantidad;
    });

    const totalOrder = subtotal.toFixed(2);

    const handleImageChange = (index, imageIndex) => {
      const newImageIndexes = [...imageIndexes];
      newImageIndexes[index] = imageIndex;
      setImageIndexes(newImageIndexes);
    };

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
                  {paginatedState.map((item, index) => (
                    <div key={item.id_producto} className="my-4">
                      <div className="row align-items-center">
                        <div className="col-md-4">
                          {item.imagen && Array.isArray(item.imagen) && item.imagen.length > 0 && (
                            <div className="image-container">
                              <img
                                className="card-img-top p-3 main-image"
                                src={item.imagen[imageIndexes[index]].secure_url}
                                alt={`${item.nombre_producto}-${imageIndexes[index]}`}
                                style={{ height: "100px", width: "auto" }}
                              />
                              {item.imagen.length > 1 && (
                                <div className="thumbnail-container mt-3">
                                  {item.imagen.map((image, imgIndex) => (
                                    <img
                                      key={imgIndex}
                                      className={`thumbnail ${imgIndex === imageIndexes[index] ? 'selected' : ''}`}
                                      src={image.secure_url}
                                      alt={`${item.nombre_producto}-${imgIndex}`}
                                      onClick={() => handleImageChange(index, imgIndex)}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-md-4">
                          <p>
                            <strong>{item.nombre_producto}</strong>
                          </p>
                          <p>Total por Producto: ${(item.precio * item.cantidad).toFixed(2)}</p>
                        </div>
                        <div className="col-md-4">
                          <div className="d-flex align-items-center justify-content-center my-3">
                            <button
                              className="btn btn-outline-dark px-3"
                              onClick={() => {
                                removeItem(item, true);
                              }}
                              disabled={item.cantidad === 1}
                            >
                              -
                            </button>
                            <p className="mx-3">{item.cantidad}</p>
                            <button
                              className="btn btn-outline-dark px-3"
                              onClick={() => {
                                addItem(item);
                              }}
                              disabled={item.cantidad === 10}
                            >
                              +
                            </button>
                            <button
                              className="btn btn-outline-danger px-3 ml-2"
                              onClick={() => {
                                deleteItem(item);
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                          <p className="text-center">
                            <strong>${(item.precio * item.cantidad).toFixed(2)}</strong>
                          </p>
                          {item.talla && (
                            <p className="text-center">
                              <strong>Talla:</strong> {item.talla}
                            </p>
                          )}
                          {item.color && (
                            <p className="text-center">
                              <strong>Color:</strong> {item.color}
                            </p>
                          )}
                        </div>
                        <div>
                          {item.descripcion && (
                            <p className="text-center">
                              <strong>Descripcion:</strong> {item.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                      <hr className="my-4" />
                    </div>
                  ))}
                </div>
              </div>
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                  {[...Array(pagesCount)].map((_, page) => (
                    <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handleClick(page)}>
                        {page + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
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
                        {item.nombre_producto} ({item.cantidad})<span>${(item.precio * item.cantidad).toFixed(2)}</span>
                      </li>
                    ))}
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total</strong>
                      </div>
                      <span>
                        <strong>${totalOrder}</strong>
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
      <style>{`
        .image-container {
          position: relative;
        }

        .thumbnail-container {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          margin-top: 10px;
        }

        .thumbnail {
          width: 60px;
          height: 60px;
          cursor: pointer;
          border: 2px solid #ddd;
          border-radius: 4px;
        }

        .selected {
          border-color: #4caf50;
        }

        .main-image {
          width: 320px;
          height: 320px;
        }
      `}</style>
    </>
  );
};

export default Cart;
