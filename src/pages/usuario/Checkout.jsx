import React, { useState, useEffect } from "react";
import { Navbar2, Footer2 } from "../../components/usuario/usuario";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { vaciarCarrito } from "../../redux/action";
import { Link, useNavigate } from "react-router-dom";

const Checkout = () => {
  const [authToken] = useState(localStorage.getItem("authToken") || "");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.handleCart);
  const userId = localStorage.getItem("id");
  const [isEditMode, setIsEditMode] = useState(true);

  const [userProfileData, setUserProfileData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });


  useEffect(() => {
    const storedId = localStorage.getItem("id");
    fetch(`${import.meta.env.VITE_API_BASE_URL}/user/${storedId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos del perfil:", data);
        setUserProfileData({
          nombre: data.detail.nombre || "",
          apellido: data.detail.apellido || "",
          email: data.detail.email || "",
          telefono: data.detail.telefono || "",
        });
      })
      .catch((error) => {
        console.error("Error al obtener los datos del perfil:", error);
      });
  }, [authToken]);

  
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

  const handleChange = (e, setFieldValue) => {
    if (!isEditMode) {
      return; 
    }

    const { name, value } = e.target;

    if (name === "nombre" || name === "apellido") {
      const trimmedValue = value.slice(0, 20);
      setFieldValue(name, trimmedValue);
    } else if (name === "telefono") {
      const numericValue = value.replace(/[^0-9]/g, "");
      const trimmedValue = numericValue.slice(0, 10);
      setFieldValue(name, trimmedValue);
    } else {
      setFieldValue(name, value);
    }
  };

  const handleConfirmPedido = async (values, { setSubmitting, setFieldValue, setStatus }) => {
    console.log("values", values)
    const requiredFields = ["nombre", "apellido", "direccion", "email", "telefono", "descripcion", "transfer_image"];
    const incompleteFields = requiredFields.filter((field) => !values[field]);

    if (incompleteFields.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Por favor, completa todos los campos obligatorios.`,
      });
      return;
    }

    // Validar que el campo de teléfono tenga 10 dígitos
    if (values.telefono.length !== 10) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El número de teléfono debe tener exactamente 10 dígitos.',
      });
      return;
    }

    // Mostrar la alerta de confirmación
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción realizará el pedido. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, realizar pedido',
      cancelButtonText: 'Cancelar',
    });

    // Actualizar el estado local según la respuesta del usuario
    if (result.isConfirmed) {
      setSubmitting(true);
      try {
        await handleSubmit(values, { setSubmitting, setFieldValue, setStatus });
      } catch (error) {
        console.error('Error en la confirmación del pedido:', error);
        setStatus({
          error: 'Error en la confirmación del pedido: ' + error.message,
        });
        setSubmitting(false);
      }
    }
  };

  const handleSubmit = async (values, { setSubmitting, setFieldValue, setStatus }) => {
    try {
      const productsData = state
        .map((item) => ({
          id_producto: item.id,
          cantidad: item.cantidad,
          talla: item.talla !== "" ? item.talla : null, 
          color: item.color !== "" ? item.color : null, 
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
      console.log("datos:", formData.get("data"));

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
        Swal.fire({
          title: "Pedido realizado exitosamente",
          icon: "success",
        }).then(() => {
          setShowSuccessMessage(false);
          navigate("/usuario/dashboard2");
        });
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
                  nombre: userProfileData.nombre,
                  apellido: userProfileData.apellido,
                  direccion: "",
                  email: userProfileData.email,
                  telefono: userProfileData.telefono,
                  descripcion: "",
                }}
                onSubmit={(values, { setSubmitting, setStatus }) =>
                  handleConfirmPedido(values, { setSubmitting, setStatus })
                }
              >
                  {({ isSubmitting, setFieldValue, status, values }) => (
                    <Form>
                      <div className="form my-3">
                        <label htmlFor="nombre">Nombre:</label>
                        <Field
                        type="text"
                        name="nombre"
                        className="form-control"
                        placeholder="Ingresa tu nombre"
                        onChange={(e) => handleChange(e, setFieldValue)}
                        minLength="3"
                        maxLength="10"
                        required
                        value={values.nombre = userProfileData.nombre}
                        readOnly
                      />
                      </div>
                      <div className="form my-3">
                        <label htmlFor="apellido">Apellido:</label>
                        <Field
                        type="text"
                        name="apellido"
                        className="form-control"
                        placeholder="Ingresa tu apellido"
                        onChange={(e) => handleChange(e, setFieldValue)}
                        minLength="3"
                        maxLength="10"
                        required
                        value={values.apellido = userProfileData.apellido}
                        readOnly
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
                        value={values.email = userProfileData.email}
                        readOnly
                      />
                      </div>
                      <div className="form my-3">
                        <label htmlFor="telefono">Teléfono:</label>
                        <Field
                      type="tel"
                      name="telefono"
                      className="form-control"
                      placeholder="Ingresa tu teléfono"
                      onChange={(e) => handleChange(e, setFieldValue)}
                      maxLength="10"
                      required
                      value={values.telefono = userProfileData.telefono}
                      readOnly
                    />
                        {values.telefono.length !== 10 && (
                          <small className="text-danger">El teléfono debe tener exactamente 10 dígitos.</small>
                        )}
                      </div>
                      <div className="form my-3">
                        <label htmlFor="direccion">Dirección:</label>
                        <Field
                          type="text"
                          name="direccion"
                          className="form-control"
                          placeholder="Ingresa tu dirección"
                          onChange={(e) => handleChange(e, setFieldValue)}
                          maxLength="40"
                          required
                        />
                        {values.direccion.length <= 10 && (
                          <small className="text-danger">La dirección debe tener al menos 10 caracteres.</small>
                        )}
                      </div>
                      <div className="form my-3">
                        <label htmlFor="descripcion">Descripción del orden de pago:</label>
                        <Field
                          as="textarea"
                          name="descripcion"
                          className="form-control"
                          placeholder="Ingresa una descripción"
                          onChange={(e) => handleChange(e, setFieldValue)}
                          maxLength="100"
                          required
                        />
                        <div className="text-right mt-2">
                          <small>{values.descripcion.length}/100 caracteres</small>
                        </div>
                      </div>
                      <div className="form my-3">
                        <label htmlFor="transfer_image">Comprobante de Pago:</label>
                        <input
                          type="file"
                          name="transfer_image"
                          onChange={(event) => handleImageChange(event, setFieldValue)}
                          required
                        />
                        <ErrorMessage name="transfer_image" component="div" className="text-danger" />
                      </div>
                      <div className="text-center">
                        <button
                          className="my-2 mx-auto btn btn-dark"
                          type="submit"
                          disabled={isSubmitting || showSuccessMessage}
                        >
                          {isSubmitting ? 'Procesando...' : 'Realizar Pedido'}
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
                        {item.nombre_producto} ({item.cantidad}) - Talla: {item.talla || ""}, Color: {item.color || ""}
                        <span>${item.precio * item.cantidad}</span>
                      </li>
                    ))}
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total</strong>
                      </div>
                      <span>
                        <strong>${calculateTotalOrder(state)}</strong>
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
