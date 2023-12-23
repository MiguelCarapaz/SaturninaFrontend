import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Navbar3, Footer3 } from "../../components/administrador/administrador";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";

const NuevoProducto = () => {
  const dispatch = useDispatch();
  const [authToken] = useState(localStorage.getItem("authToken") || "");
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
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

    fetchCategorias();
  }, []);

  const handleImageChange = (event, setFieldValue) => {
    const files = event.currentTarget.files;
    const imagenesArray = Array.from(files);

    // Obtener imágenes existentes y agregar las nuevas
    const currentImages = [...(previewImages || []), ...imagenesArray];
    setPreviewImages(currentImages);

    // Mostrar nombres de archivos seleccionados
    const names = currentImages.map((file) => file.name);
    setFieldValue("imagenes_producto", currentImages);
  };

  const handleRemoveImage = (index, setFieldValue) => {
    const currentImages = [...previewImages];
    currentImages.splice(index, 1);

    setPreviewImages(currentImages);

    // Eliminar la imagen del array de imágenes
    const currentFiles = currentImages;
    setFieldValue("imagenes_producto", currentFiles);
  };

  const handleSubmit = async (values, actions) => {
    try {
      // Verificar si hay imágenes adjuntas
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

      console.log("Datos del nuevo producto a enviar:", productData);

      const formData = new FormData();
      
      // Agregar cada imagen al formData
      for (let i = 0; i < values.imagenes_producto.length; i++) {
        formData.append("imagen_producto", values.imagenes_producto[i]);
      }
      
      formData.append("data", JSON.stringify(productData));
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        console.log("Nuevo producto creado exitosamente");
        actions.setSubmitting(false);
        actions.resetForm();
        navigate("/admin/dashboard3");
      } else {
        const data = await response.json();
        console.log("Error al crear el nuevo producto:", data.error || "Error desconocido");
        actions.setStatus({
          error: data.error || "Error al crear el nuevo producto. Verifica tus datos.",
        });
        actions.setSubmitting(false);
      }
    } catch (error) {
      console.error("Error en la solicitud de creación del nuevo producto:", error);
      actions.setStatus({
        error: "Error en la solicitud de creación del nuevo producto: " + error.message,
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
              Nuevo Producto
            </h1>
            <hr />
            <Formik
              initialValues={{
                imagenes_producto: null,
                nombre_producto: "",
                descripcion: "",
                precio: 0,
                id_categoria: "",
                tallas: [],
                colores: [],
              }}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, status }) => (
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
                      {previewImages.map((image, index) => (
                        <div key={index} className="d-flex align-items-center">
                          <span className="mr-2">{image.name}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemoveImage(index, setFieldValue)}
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
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
                      {isSubmitting ? "Creando Producto..." : "Crear Producto"}
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
              <Link to="/admin/categorias">
                <button className="my-2 btn btn-secondary">Categorias</button>
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
