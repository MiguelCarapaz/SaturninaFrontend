import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar2, Footer2 } from "../../components/usuario/usuario";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { vaciarCarrito } from "../../redux/action";

const Checkout = () => {
  const [authToken] = useState(localStorage.getItem("authToken") || "");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.handleCart);
  const userId = localStorage.getItem("id");

  const handleImageChange = (event, setFieldValue) => {
    setFieldValue("transfer_image", event.currentTarget.files[0]);
  };

  const calculateTotalOrder = (cartItems) => {
    let totalOrder = 0;
    cartItems.forEach((item) => {
      totalOrder += item.precio * item.cantidad;
    });
    return totalOrder;
  };

  const handleSubmit = async (values, { setSubmitting, setFieldValue, setStatus }) => {
    try {
      const productsData = state.map((item) => ({
        id_producto: item.id,
        cantidad: item.cantidad,
      }));

      const orderData = {
        user_id: userId,
        price_order: calculateTotalOrder(state),
        products: productsData,
        nombre: values.nombre || "",
        apellido: values.apellido || "",
        direccion: values.direccion || "",
        email: values.email || "",
        telefono: values.telefono || "",
        descripcion: values.descripcion || "",
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(orderData));
      formData.append("transfer_image", values.transfer_image);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        dispatch(vaciarCarrito());
        setSubmitting(false);
        setStatus({});
      } else {
        const data = await response.json();
        setStatus({
          error: data.error || "Error al realizar el pedido. Verifica tus datos.",
        });
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error en la solicitud de creación del pedido:", error);
      setStatus({
        error: "Error en la solicitud de creación del pedido: " + error.message,
      });
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let timeout;
    if (showSuccessMessage) {
      timeout = setTimeout(() => {
        setShowSuccessMessage(false);
        navigate("/usuario/dashboard2");
      }, 3000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [showSuccessMessage, navigate]);

  return (
    <>
      <Navbar2 />
      <div className="container" style={{ backgroundColor: "rgba(249, 222, 230, 0.4)", maxWidth: "10000px" }}>
        <h1 className="display-6 text-center" style={{ fontFamily: "Gotham, sans-serif" }}>
          Checkout
        </h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-8 col-lg-8 col-sm-12 mx-auto">
            <div className="row">
              <div className="col-md-6">
                <Formik
                  initialValues={{
                    transfer_image: "",
                    nombre: "",
                    apellido: "",
                    direccion: "",
                    email: "",
                    telefono: "",
                    descripcion: "",
                  }}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, setFieldValue, status }) => (
                    <Form>
                      <div className="form my-3">
                        <label htmlFor="nombre">Nombre:</label>
                        <Field
                          type="text"
                          name="nombre"
                          className="form-control"
                          placeholder="Ingresa tu nombre"
                          required
                        />
                      </div>
                      <div className="form my-3">
                        <label htmlFor="apellido">Apellido:</label>
                        <Field
                          type="text"
                          name="apellido"
                          className="form-control"
                          placeholder="Ingresa tu apellido"
                          required
                        />
                      </div>
                      <div className="form my-3">
                        <label htmlFor="direccion">Dirección:</label>
                        <Field
                          type="text"
                          name="direccion"
                          className="form-control"
                          placeholder="Ingresa tu dirección"
                          required
                        />
                      </div>
                      <div className="form my-3">
                        <label htmlFor="email">Correo Electrónico:</label>
                        <Field
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Ingresa tu correo electrónico"
                          required
                        />
                      </div>
                      <div className="form my-3">
                        <label htmlFor="telefono">Teléfono:</label>
                        <Field
                          type="tel"
                          name="telefono"
                          className="form-control"
                          placeholder="Ingresa tu teléfono"
                          required
                        />
                      </div>
                      <div className="form my-3">
                        <label htmlFor="descripcion">Descripción:</label>
                        <Field
                          as="textarea"
                          name="descripcion"
                          className="form-control"
                          placeholder="Ingresa una descripción"
                          required
                        />
                      </div>
                      <div className="form my-3">
                        <label htmlFor="transfer_image">Comprobante de Pago:</label>
                        <input
                          type="file"
                          name="transfer_image"
                          onChange={(event) => handleImageChange(event, setFieldValue)}
                        />
                        <ErrorMessage name="transfer_image" component="div" className="text-danger" />
                      </div>
                      <div className="text-center">
                        <button className="my-2 mx-auto btn btn-dark" type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Procesando..." : "Realizar Pedido"}
                        </button>
                      </div>
                      {status && status.error && typeof status.error === 'string' && (
                        <p className="text-danger text-center">{status.error}</p>
                      )}
                      {showSuccessMessage && (
                        <p className="text-success text-center">Pedido realizado exitosamente.</p>
                      )}
                    </Form>
                  )}
                </Formik>
              </div>

              {/* Sección de Detalle de Compra */}
              <div className="col-md-6">
                <div className="card mb-4">
                  <div className="card-header py-3 bg-light">
                    <h5 className="mb-0">Detalle de Compra</h5>
                  </div>
                  <div className="card-body">
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
                        <strong>${Math.round(calculateTotalOrder(state))}</strong>
                      </span>
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default Checkout;
