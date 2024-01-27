import React, { useState } from "react";
import { Footer2, Navbar2 } from "../../components/usuario/usuario";
import { useSelector, useDispatch } from "react-redux";
import { agregarAlCarrito, eliminarDelCarrito } from "../../redux/action";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { IoRemoveOutline } from "react-icons/io5";
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
            <Link to="/usuario/dashboard" className="btn btn-outline-dark mx-4">
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
    if (reduceQuantity && product.cantidad > 1) {
      dispatch({ type: DEL_CART, payload: product, reduceQuantity: true });
    } else {
      dispatch({ type: DEL_CART, payload: product });
    }
  };

  const deleteItem = (product) => {
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
                                style={{ height: "250px", width: "200px" }}
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
                        <div className="col-md-3 position-relative">
                          <button
                            onClick={() => {
                              deleteItem(item);
                            }}
                            className="position-absolute"
                            style={{ top: '-20px', right: '-250px', background: "none", border: "none", cursor: "pointer" }}
                            >
                            <FaRegTrashAlt style={{position: 'absolute' ,color: 'red', fontSize: '1.5em' }} />
                          </button>
                          <div>
                            <h4>{item.nombre_producto}</h4>
                          </div>
                          {item.talla && (
                            <div>
                              <p>Talla: {item.talla}</p>
                            </div>
                          )}
                          {item.color && (
                            <div>
                              <p>Color:{item.color}</p>
                            </div>
                          )}
                          <div>
                            <b><h4>${(item.precio * item.cantidad).toFixed(2)}</h4></b>
                          </div>
                          <div>
                              <p>Descripción: {item.descripcion}</p>
                            </div>
                        
                          <div>
                            <div
                              className="d-flex"
                              style={{ borderRadius: "30px", backgroundColor: "#f0f0f0", justifyContent:'center', paddingLeft:'70px', paddingRight:'70px', marginLeft:'300px'}}
                            >                       
                              <button
                                className="btn"
                                onClick={() => {
                                  removeItem(item, true);
                                }}
                                disabled={item.cantidad === 1}
                                style={{ fontSize: '1.5em' }}
                              >
                                <IoRemoveOutline />
                              </button>
                              <p className="mx-3" style={{ marginTop: '10px' }}>{item.cantidad}</p>
                              <button
                                className="btn "
                                onClick={() => {
                                  addItem(item);
                                }}
                                disabled={item.cantidad === 10}
                                style={{ fontSize: '1.5em' }}
                              >
                                <IoIosAdd />
                              </button>
                            </div>
                          </div>
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
                        <strong>Envió gratis</strong>
                      </div>
                      <span>
                        $0
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Subtotal</strong>
                      </div>
                      <span>
                        <strong>${totalOrder}</strong>
                      </span>
                    </li>
                  </ul>
                  <div className="row d-flex justify-content-center">
            <Link
              to="/usuario/checkout"
              className="btn btn-dark btn-lg btn-block mt-4"  
              style={{ borderRadius: "30px" }}
            >
              Iniciar pago
            </Link>
          </div>

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
    <section className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <Navbar2 />
      </header>      <div className="container" style={{ maxWidth: "10000px" }}>
        <h2 className="text-center display-6" style={{ fontFamily: "Gotham, sans-serif" }}>
          Carrito
        </h2>
        <hr />
        {state.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      </section>
      <Footer2 className="mt-auto"/>
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
