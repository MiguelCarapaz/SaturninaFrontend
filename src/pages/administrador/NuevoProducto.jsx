import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Navbar3, Footer3 } from "../../components/administrador/administrador";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";

const NuevoProducto = () => {
  const dispatch = useDispatch();
  const [authToken] = useState(localStorage.getItem("authToken") || "");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [categoriasOptions, setCategoriasOptions] = useState([]);

  useEffect(() => {
    const fetchCategoriasOptions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/category`);
        setCategoriasOptions(response.data.detail);
      } catch (error) {
        console.error("Error al obtener las opciones de categorías:", error);
      }
    };

    fetchCategoriasOptions();
  }, []);

  const handleImageChange = (event, setFieldValue) => {
    setFieldValue("imagen_producto", event.currentTarget.files[0]);
  };

  const handleSubmit = async (values, actions) => {
    try {
      const productData = {
        nombre_producto: values.nombre_producto || "",
        id_categoria: values.id_categoria || "",
        descripcion: values.descripcion || "",
        precio: values.precio || "",
      };

      console.log("Product Data:", productData);

      const formData = new FormData();
      formData.append("data", JSON.stringify(productData));
      formData.append("imagen_producto", values.imagen_producto);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Producto creado exitosamente:", responseData.detail);

        // Muestra el mensaje de éxito durante 3 segundos
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);

        actions.setSubmitting(false);
        actions.resetForm();
      } else {
        const data = await response.json();
        if (response.status === 409) {
          // Manejar el caso en el que el producto ya existe
          actions.setStatus({
            error: `El producto "${productData.nombre_producto}" ya existe.`,
          });
        } else {
          // Manejar otros errores
          actions.setStatus({
            error: data.error || "Error al crear el producto. Verifica tus datos.",
          });
        }
        actions.setSubmitting(false);
      }
    } catch (error) {
      console.error("Error en la solicitud de creación del producto:", error);
      actions.setStatus({
        error: "Error en la solicitud de creación del producto: " + error.message,
      });
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar3 />
      <div className="container" style={{ backgroundColor: "rgba(249, 222, 230, 0.4)", maxWidth: "10000px" }}>
        <h1 className="display-6 text-center" style={{ fontFamily: "Gotham, sans-serif" }}>
          Nuevo Producto
        </h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <Formik
              initialValues={{
                imagen_producto: "",
                nombre_producto: "",
                descripcion: "",
                precio: 0,
                id_categoria: categoriasOptions.length > 0 ? categoriasOptions[0].id : "",
              }}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, status }) => (
                <Form>
                  <div className="form my-3">
                    <label htmlFor="imagen_producto">Imagen del Producto:</label>
                    <input
                      type="file"
                      name="imagen_producto"
                      onChange={(event) => handleImageChange(event, setFieldValue)}
                    />
                    <ErrorMessage name="imagen_producto" component="div" className="text-danger" />
                  </div>
                  <div className="form my-3">
                    <label htmlFor="nombre_producto">Nombre del Producto:</label>
                    <Field
                      type="text"
                      name="nombre_producto"
                      className="form-control"
                      placeholder="Ingresa el nombre del producto"
                      required
                    />
                  </div>
                  <div className="form my-3">
                    <label htmlFor="descripcion">Descripción:</label>
                    <Field
                      as="textarea"
                      name="descripcion"
                      className="form-control"
                      placeholder="Ingresa la descripción del producto"
                      required
                    />
                  </div>
                  <div className="form my-3">
                    <label htmlFor="precio">Precio:</label>
                    <Field
                      type="number"
                      name="precio"
                      className="form-control"
                      placeholder="Ingresa el precio del producto"
                      required
                    />
                  </div>
                  <div className="form my-3">
                    <label htmlFor="id_categoria">Categoría:</label>
                    <Field as="select" name="id_categoria" className="form-control" required>
                      {categoriasOptions.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.name}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="text-center">
                    <button className="my-2 mx-auto btn btn-dark" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creando Producto..." : "Crear Producto"}
                    </button>
                  </div>
                  {status && status.error && typeof status.error === 'string' && (
                    <p className="text-danger text-center">{status.error}</p>
                  )}
                  {showSuccessMessage && (
                    <p className="text-success text-center">Producto creado exitosamente.</p>
                  )}
                </Form>
              )}
            </Formik>
            <div className="text-center">
              <Link to="/admin/categorias">
                <button className="my-2 btn btn-primary">Categorías</button>
              </Link>
              <Link to="/admin/dashboard3">
                <button className="my-2 btn btn-secondary">Cancelar</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer3 />
    </>
  );
};

export default NuevoProducto;
