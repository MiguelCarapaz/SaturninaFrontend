import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Navbar3, Footer3 } from "../../components/administrador/administrador";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Swal from "sweetalert2";

const ActualizarProducto = () => {
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

  const [descripcionLength, setDescripcionLength] = useState(0);
  const MAX_DESCRIPCION_LENGTH = 50;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/products/${id}`
        );
        if (response.ok) {
          const productDetails = await response.json();

          // Asegurémonos de que la estructura sea correcta antes de extraer los datos
          if (productDetails.detail) {
            setInitialValues({
              nombre_producto: productDetails.detail.name || "",
              descripcion: productDetails.detail.descripcion || "",
              precio: productDetails.detail.precio || 0,
              id_categoria: productDetails.detail.category || "",
              tallas: productDetails.detail.tallas || [],
              colores: productDetails.detail.colores || [],
            });
          } else {
            console.error(
              "La estructura de los detalles del producto no es la esperada."
            );
          }
        } else {
          console.error(
            "Error al obtener los detalles del producto:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error en la solicitud de detalles del producto:", error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/category`
        );
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

      const productData = {
        nombre_producto: values.nombre_producto || "",
        id_categoria: values.id_categoria || "",
        descripcion: values.descripcion || "",
        precio: values.precio || 0,
        tallas: values.tallas || [],
        colores: values.colores || [],
      };

      const formData = new FormData();

      if (values.imagenes_producto && values.imagenes_producto.length > 0) {
        values.imagenes_producto.forEach((image, i) => {
          formData.append("imagen_producto", image);
        });
      }

      formData.append("data", JSON.stringify(productData));

      const confirmation = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción actualizará el producto. ¿Deseas continuar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar",
      });

      if (confirmation.isConfirmed) {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/products/${id}`,
          {
            method: "PUT",
            body: formData,
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Producto actualizado exitosamente.",
          });
          actions.setSubmitting(false);
          navigate("/admin/dashboard");
        } else {
          if (response.status === 406) {
            Swal.fire({
              icon: "error",
              title: "Error en las imágenes",
              text: "Únicamente las extensiones de tipo jpg, jpeg, png y web están permitidas.",
            });
            actions.setStatus({
              error: "Error en las imágenes. Únicamente las extensiones de tipo jpg, jpeg, png y webp están permitidas.",
            });
          } else {
            const data = await response.json();
            Swal.fire({
              icon: "error",
              title: "Error",
              text: data.error || "Error al actualizar el producto. Verifica tus datos.",
            });
            actions.setSubmitting(false);
          }
        }
      }
    } catch (error) {
      console.error("Error en la solicitud de actualización del producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error en la solicitud de actualización del producto: " + error.message,
      });
      actions.setSubmitting(false);
    }
}; 
    
  return (
    <>
    <section className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <Navbar3 />
      </header>      <div
        className="container"
        style={{
          maxWidth: "10000px",
        }}
      >
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <h2
              className="display-6 text-center"
              style={{ fontFamily: "Gotham, sans-serif" }}
            >
              Actualizar Producto
            </h2>
            <hr />
            <Formik
              initialValues={initialValues}
              enableReinitialize={true}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, status, values }) => (
                <Form>
                  <div className="form my-3">
                    <label htmlFor="imagenes_producto">
                      Imágenes del Producto:
                    </label>
                    <p>Nota: Solo se puede subir un máximo de 4 imágenes</p>
                    <input
                      type="file"
                      name="imagenes_producto"
                      id="imagenes_producto"
                      onChange={(event) =>
                        handleImageChange(event, setFieldValue)
                      }
                      multiple
                    />
                    <ErrorMessage
                      name="imagenes_producto"
                      component="div"
                      className="text-danger"
                    />
                    <div className="my-2">
                      <ul>
                        {previewImages.map((image, index) => (
                          <li key={index} className="d-flex align-items-center">
                            <span className="mr-2">{image.name}</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() =>
                                handleRemoveImage(index, setFieldValue)
                              }
                            >
                              Eliminar
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="form my-3">
                    <label htmlFor="nombre_producto">
                      Nombre del Producto:
                    </label>
                    <Field
                      type="text"
                      name="nombre_producto"
                      className="form-control"
                      placeholder="Ingresa el nombre del producto"
                      value={values.nombre_producto}
                      onChange={(event) => {
                        setFieldValue("nombre_producto", event.target.value);
                      }}
                      onBlur={() => {
                        setFieldValue(
                          "nombre_producto",
                          values.nombre_producto.trim()
                        );
                      }}
                      required
                    />
                    <ErrorMessage
                      name="nombre_producto"
                      component="div"
                      className="text-danger"
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
                      onChange={(event) => {
                        const newDescription = event.target.value;
                        const newLength = newDescription.length;

                        // Permitir la actualización si la longitud está en el rango de 0 a 50
                        if (newLength <= 50) {
                          setFieldValue("descripcion", newDescription);
                          setDescripcionLength(newLength);
                        }
                      }}
                      onBlur={() => {
                        setFieldValue("descripcion", values.descripcion.trim());
                      }}
                      required
                    />
                    <div className="text-right">
                      <small>
                        {descripcionLength}/{MAX_DESCRIPCION_LENGTH}
                      </small>
                    </div>
                    <ErrorMessage
                      name="descripcion"
                      component="div"
                      className="text-danger"
                    />
                    {(descripcionLength < 5 || descripcionLength > 50) && (
                      <p className="text-danger">
                        La descripción debe tener entre 5 y 50 caracteres.
                      </p>
                    )}
                  </div>

                  <div className="form my-3">
                    <label htmlFor="precio">Precio:</label>
                    <Field
                      name="precio"
                      validate={(value) => {
                        let error;
                        if (!value || isNaN(value) || parseFloat(value) < 1) {
                          error = "Ingresa un número válido mayor o igual a 1.";
                        } else if (parseFloat(value) >= 1000) {
                          error = "El precio debe ser menor a 1000.";
                        } else if (
                          !/^\d+(\.\d{1,2})?$/.test(value.toString())
                        ) {
                          error = "Ingresa un número con hasta 2 decimales.";
                        }
                        return error;
                      }}
                    >
                      {({ field, form }) => (
                        <>
                          <input
                            {...field}
                            type="text"
                            className={`form-control ${
                              form.errors.precio && form.touched.precio
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Ingresa el precio del producto"
                            onBlur={() => form.setFieldTouched("precio", true)}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9.]/g,
                                ""
                              );
                              form.setFieldValue("precio", value);
                            }}
                          />
                          <ErrorMessage
                            name="precio"
                            component="div"
                            className="text-danger"
                          />
                        </>
                      )}
                    </Field>
                  </div>

                  <div className="form my-3">
                    <label htmlFor="id_categoria">Categoría:</label>
                    <Field
                      as="select"
                      name="id_categoria"
                      className="form-control"
                      value={values.id_categoria}
                      onChange={(event) => {
                        setFieldValue("id_categoria", event.target.value);
                      }}
                      onBlur={() => {
                        setFieldValue(
                          "id_categoria",
                          values.id_categoria.trim()
                        );
                      }}
                      required
                    >
                      <option value="" disabled>
                        Selecciona una categoría
                      </option>
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="id_categoria"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form my-3">
                    <label htmlFor="tallas">Tallas:</label>
                    <FieldArray name="tallas">
                      {(arrayHelpers) => (
                        <div>
                          {arrayHelpers.form.values.tallas.map(
                            (talla, index) => (
                              <div
                                key={index}
                                className="d-flex align-items-center"
                              >
                                <Field
                                  type="text"
                                  name={`tallas.${index}.name`}
                                  className="form-control"
                                  placeholder={`Ingresa la talla #${index + 1}`}
                                  value={talla.name}
                                  onChange={(event) => {
                                    const newTallaName =
                                      event.target.value.trim();
                                    const isTallaRepeated =
                                      arrayHelpers.form.values.tallas.some(
                                        (otherTalla, otherIndex) =>
                                          otherIndex !== index &&
                                          otherTalla.name === newTallaName
                                      );
                                    if (!isTallaRepeated) {
                                      arrayHelpers.replace(index, {
                                        name: newTallaName,
                                        status: "true",
                                      });
                                    }
                                  }}
                                  onBlur={() =>
                                    arrayHelpers.replace(index, {
                                      name: talla.name.trim(),
                                      status: "true",
                                    })
                                  }
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
                            )
                          )}
                          <button
                            type="button"
                            onClick={async () => {
                              const { value: newTallaName } = await Swal.fire({
                                input: "select", // Cambiado a un campo select
                                inputLabel: "Selecciona una talla:",
                                inputOptions: {
                                  S: "S",
                                  M: "M",
                                  L: "L",
                                  XL: "XL",
                                },
                                inputValidator: (value) => {
                                  if (!value) {
                                    return "Debes seleccionar una talla";
                                  }
                                  const isTallaRepeated =
                                    arrayHelpers.form.values.tallas.some(
                                      (talla) => talla.name === value
                                    );
                                  if (isTallaRepeated) {
                                    return "La talla ya existe. Selecciona una talla diferente.";
                                  }
                                  return null;
                                },
                              });
                              if (newTallaName) {
                                arrayHelpers.push({
                                  name: newTallaName,
                                  status: "true",
                                });
                              }
                            }}
                          >
                            Agregar Talla
                          </button>
                        </div>
                      )}
                    </FieldArray>

                    <FieldArray name="colores">
                      {(arrayHelpers) => (
                        <div>
                          {arrayHelpers.form.values.colores.map(
                            (color, index) => (
                              <div
                                key={index}
                                className="d-flex align-items-center"
                              >
                                <Field
                                  type="text"
                                  name={`colores.${index}.name`}
                                  className="form-control"
                                  placeholder={`Ingresa el color #${index + 1}`}
                                  value={color.name}
                                  onChange={(event) => {
                                    const newColorName =
                                      event.target.value.trim();
                                    const isColorRepeated =
                                      arrayHelpers.form.values.colores.some(
                                        (otherColor, otherIndex) =>
                                          otherIndex !== index &&
                                          otherColor.name === newColorName
                                      );
                                    if (!isColorRepeated) {
                                      arrayHelpers.replace(index, {
                                        name: newColorName,
                                        status: "true",
                                      });
                                    }
                                  }}
                                  onBlur={() =>
                                    arrayHelpers.replace(index, {
                                      name: color.name.trim(),
                                      status: "true",
                                    })
                                  }
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
                            )
                          )}
                          <button
                            type="button"
                            onClick={async () => {
                              const { value: newColorName } = await Swal.fire({
                                input: "text",
                                inputLabel: "Ingresa el nombre del color:",
                                inputPlaceholder: "Ej. Rojo, Azul, Verde",
                                inputAttributes: {
                                  maxLength: 15,
                                },
                                inputValidator: (value) => {
                                  if (!value) {
                                    return "Debes ingresar el nombre del color";
                                  }
                                  const isColorRepeated =
                                    arrayHelpers.form.values.colores.some(
                                      (color) => color.name === value
                                    );
                                  if (isColorRepeated) {
                                    return "El color ya existe. Ingresa un nombre diferente.";
                                  }
                                  return null;
                                },
                              });
                              if (newColorName) {
                                arrayHelpers.push({
                                  name: newColorName,
                                  status: "true",
                                });
                              }
                            }}
                          >
                            Agregar Color
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <div className="text-center">
                    <button
                      className="my-2 mx-auto btn btn-dark"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Actualizando Producto..."
                        : "Actualizar Producto"}
                    </button>
                  </div>
                  {status &&
                    status.error &&
                    typeof status.error === "string" && (
                      <p className="text-danger text-center">{status.error}</p>
                    )}
                </Form>
              )}
            </Formik>
            <div className="text-center">
              <Link to="/admin/dashboard">
                <button className="my-2 btn btn-secondary">Cancelar</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      </section>
      <Footer3 className="mt-auto"/>
    </>
  );
};

export default ActualizarProducto;
