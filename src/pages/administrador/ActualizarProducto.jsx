import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Navbar3, Footer3 } from "../../components/administrador/administrador";
import { Formik, Form, Field, ErrorMessage } from "formik";

const ActualizarProducto = () => {
  const dispatch = useDispatch();
  const [authToken] = useState(localStorage.getItem("authToken") || "");
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    imagen_producto: null,
    nombre_producto: "",
    descripcion: "",
    precio: 0,
    id_categoria: "", // Eliminamos el valor predeterminado
  });

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (id) {
          console.log("ID del producto:", id);
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`);

          if (response.ok) {
            const productDetails = await response.json();
            console.log("Detalles del producto obtenidos:", productDetails);

            // Corrige la lógica para obtener la imagen del producto
            const imagen_producto = productDetails.detail.imagen ? productDetails.detail.imagen.secure_url : null;

            // Establece el estado con los valores obtenidos
            setProducto({
              imagen_producto,
              nombre_producto: productDetails.detail.name,
              descripcion: productDetails.detail.descripcion,
              precio: productDetails.detail.precio,
              id_categoria: productDetails.detail.category,
            });
          } else {
            console.error("Error al obtener detalles del producto:", response.status);
          }
        } else {
          console.error("ID del producto no encontrado en los parámetros de la URL");
        }
      } catch (error) {
        console.error("Error en la solicitud de detalles del producto:", error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category`);
        if (response.ok) {
          const categoriasData = await response.json();
          setCategorias(categoriasData.detail);
        } else {
          console.error("Error al obtener las categorías:", response.status);
        }
      } catch (error) {
        console.error("Error en la solicitud de categorías:", error);
      }
    };

    fetchProductDetails();
    fetchCategorias();
  }, [id]);

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

      console.log("Datos del producto a enviar:", productData);

      const formData = new FormData();
      formData.append("data", JSON.stringify(productData));
      formData.append("imagen_producto", values.imagen_producto);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        console.log("Producto actualizado exitosamente");
        actions.setSubmitting(false);
        actions.resetForm();
        navigate("/admin/dashboard3");
      } else {
        const data = await response.json();
        console.log("Error al actualizar el producto:", data.error || "Error desconocido");
        actions.setStatus({
          error: data.error || "Error al actualizar el producto. Verifica tus datos.",
        });
        actions.setSubmitting(false);
      }
    } catch (error) {
      console.error("Error en la solicitud de actualización del producto:", error);
      actions.setStatus({
        error: "Error en la solicitud de actualización del producto: " + error.message,
      });
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar3 />
      <div className="container" style={{ backgroundColor: "rgba(249, 222, 230, 0.4)", maxWidth: "10000px" }}>
        <h1 className="display-6 text-center" style={{ fontFamily: "Gotham, sans-serif" }}>
          Actualizar Producto
        </h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <Formik
              enableReinitialize  // Habilita la actualización de los valores iniciales
              initialValues={{
                imagen_producto: producto.imagen_producto, // Establece la URL de la imagen actual
                nombre_producto: producto.nombre_producto,
                descripcion: producto.descripcion,
                precio: producto.precio,
                id_categoria: producto.id_categoria,
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
                      <option value="">Selecciona una categoría</option>
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.name}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="text-center">
                    <button className="my-2 mx-auto btn btn-dark" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Actualizando Producto..." : "Actualizar Producto"}
                    </button>
                  </div>
                  {status && status.error && typeof status.error === 'string' && (
                    <p className="text-danger text-center">{status.error}</p>
                  )}
                  {status && status.success && typeof status.success === 'string' && (
                    <p className="text-success text-center">{status.success}</p>
                  )}
                </Form>
              )}
            </Formik>
            <div className="text-center">
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

export default ActualizarProducto;
