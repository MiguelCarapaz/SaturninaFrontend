import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Navbar3, Footer3 } from "../../components/administrador/administrador";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";

const ActualizarProducto = () => {
  const dispatch = useDispatch();
  const [authToken] = useState(localStorage.getItem("authToken") || "");
  const navigate = useNavigate();
  const { id } = useParams();

  const [categorias, setCategorias] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [initialValues, setInitialValues] = useState({
    imagenes_producto: [],
    nombre_producto: "",
    descripcion: "",
    precio: 0,
    id_categoria: "",
    tallas: [],
    colores: [],
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`);
        if (response.ok) {
          const productDetails = await response.json();
          console.log("Detalles del producto:", productDetails);
    
          // Asegurémonos de que la estructura sea correcta antes de extraer los datos
          if (productDetails.detail) {
            console.log("Detalles del producto - imágenes:", productDetails.detail.imagen);
    
            setInitialValues({
              imagenes_producto: productDetails.detail.imagen || [],
              nombre_producto: productDetails.detail.name || "",
              descripcion: productDetails.detail.descripcion || "",
              precio: productDetails.detail.precio || 0,
              id_categoria: productDetails.detail.category || "",
              tallas: productDetails.detail.tallas || [],
              colores: productDetails.detail.colores || [],
            });
          } else {
            console.error("La estructura de los detalles del producto no es la esperada.");
          }
        } else {
          console.error("Error al obtener los detalles del producto:", response.status);
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
    const files = event.currentTarget.files;
    const imagenesArray = Array.from(files);
  
    console.log("Nombres de las imágenes:", imagenesArray.map(file => file.name));
  
    const currentImages = [...(previewImages || []), ...imagenesArray];
    setPreviewImages(currentImages);
  
    setFieldValue("imagenes_producto", currentImages);
  };
  
  const handleRemoveImage = (index, setFieldValue) => {
    const currentImages = [...previewImages];
    currentImages.splice(index, 1);

    setPreviewImages(currentImages);

    const currentFiles = currentImages;
    setFieldValue("imagenes_producto", currentFiles);
  };

  const handleSubmit = async (values, actions) => {
    try {
      console.log("Valores del formulario al enviar:", values);
      if (!values.imagenes_producto || values.imagenes_producto.length === 0) {
        console.error("Debes adjuntar al menos una imagen al producto.");
        return;
      }

      const productData = {
        nombre_producto: values.nombre_producto || "",
        id_categoria: values.id_categoria || "",
        descripcion: values.descripcion || "",
        precio: values.precio || "",
        tallas: values.tallas || [],
        colores: values.colores || [],
      };

      console.log("Datos del producto a actualizar:", productData);

      const formData = new FormData();

      for (let i = 0; i < values.imagenes_producto.length; i++) {
        formData.append("imagen_producto", values.imagenes_producto[i]);
      }

      formData.append("data", JSON.stringify(productData));

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
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <h1 className="display-6 text-center" style={{ fontFamily: "Gotham, sans-serif" }}>
              Actualizar Producto
            </h1>
            <hr />
            <Formik initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit}>
              {({ isSubmitting, setFieldValue, status, values }) => (
                <Form>
<div className="form my-3">
  <label htmlFor="imagenes_producto">Imágenes del Producto:</label>
  <input
    type="file"
    name="imagenes_producto"
    id="imagenes_producto"
    onChange={(event) => handleImageChange(event, setFieldValue)}
    multiple
  />
  <ErrorMessage name="imagenes_producto" component="div" className="text-danger" />
  <div className="my-2">
    <ul>
      {previewImages.map((image, index) => (
        <li key={index} className="d-flex align-items-center">
          <span className="mr-2">{image.name}</span>
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => handleRemoveImage(index, setFieldValue)}
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  </div>
</div>

                  <div className="form my-3">
                <label htmlFor="nombre_producto">Nombre del Producto:</label>
                <Field
                  type="text"
                  name="nombre_producto"
                  className="form-control"
                  placeholder="Ingresa el nombre del producto"
                  value={values.nombre_producto}
                  onChange={(event) => {
                    console.log("Valor actual del campo Nombre del Producto:", event.target.value);
                    setFieldValue("nombre_producto", event.target.value);
                  }}
                  onBlur={() => {
                    console.log("Valor actual del campo Nombre del Producto al salir del campo:", values.nombre_producto.trim());
                    setFieldValue("nombre_producto", values.nombre_producto.trim());
                  }}
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
                      value={values.descripcion}
                      onChange={(event) => setFieldValue("descripcion", event.target.value)}
                      onBlur={() => setFieldValue("descripcion", values.descripcion.trim())}
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
                      value={values.precio}
                      onChange={(event) => setFieldValue("precio", event.target.value)}
                      onBlur={() => setFieldValue("precio", values.precio.trim())}
                      required
                    />
                  </div>
                  <div className="form my-3">
                  <label htmlFor="id_categoria">Categoría:</label>
                  <Field
                  as="select"
                  name="id_categoria"
                  className="form-control"
                  value={values.id_categoria}
                  onChange={(event) => {
                    console.log("Valor actual del campo Categoría:", event.target.value);
                    setFieldValue("id_categoria", event.target.value);
                  }}
                  onBlur={() => {
                    console.log("Valor actual del campo Categoría al salir del campo:", values.id_categoria.trim());
                    setFieldValue("id_categoria", values.id_categoria.trim());
                  }}
                  required
                >
                  <option value="" disabled>Selecciona una categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.name}
                    </option>
                  ))}
                </Field>
                  </div>
                  <div className="form my-3">
                    <label htmlFor="tallas">Tallas:</label>
                    <FieldArray name="tallas">
                      {(arrayHelpers) => (
                        <div>
                          {arrayHelpers.form.values.tallas.map((talla, index) => (
                            <div key={index} className="d-flex align-items-center">
                              <Field
                                type="text"
                                name={`tallas.${index}.name`}
                                className="form-control"
                                placeholder={`Ingresa la talla #${index + 1}`}
                                value={talla.name}
                                onChange={(event) => arrayHelpers.replace(index, { name: event.target.value, status: "true" })}
                                onBlur={() => arrayHelpers.replace(index, { name: talla.name.trim(), status: "true" })}
                                required
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger ml-2"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                Eliminar Talla
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => arrayHelpers.push({ name: "", status: "true" })}
                          >
                            Agregar Talla
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                  <div className="form my-3">
                    <label htmlFor="colores">Colores:</label>
                    <FieldArray name="colores">
                      {(arrayHelpers) => (
                        <div>
                          {arrayHelpers.form.values.colores.map((color, index) => (
                            <div key={index} className="d-flex align-items-center">
                              <Field
                                type="text"
                                name={`colores.${index}.name`}
                                className="form-control"
                                placeholder={`Ingresa el color #${index + 1}`}
                                value={color.name}
                                onChange={(event) => arrayHelpers.replace(index, { name: event.target.value, status: "true" })}
                                onBlur={() => arrayHelpers.replace(index, { name: color.name.trim(), status: "true" })}
                                required
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger ml-2"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                Eliminar Color
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => arrayHelpers.push({ name: "", status: "true" })}
                          >
                            Agregar Color
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <div className="text-center">
                    <button className="my-2 mx-auto btn btn-dark" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Actualizando Producto..." : "Actualizar Producto"}
                    </button>
                  </div>
                  {status && status.error && typeof status.error === 'string' && (
                    <p className="text-danger text-center">{status.error}</p>
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
