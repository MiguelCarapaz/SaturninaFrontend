import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar3, Footer3 } from "../../components/administrador/administrador";
import { Formik, Form, Field, ErrorMessage, FieldArray, useField  } from "formik";
import Swal from "sweetalert2";

const NuevoProducto = () => {
  const [authToken] = useState(localStorage.getItem("authToken") || "");
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);


  const [descripcionLength, setDescripcionLength] = useState(0);
  const MAX_DESCRIPCION_LENGTH = 50;

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
    const currentImages = [...(previewImages || []), ...imagenesArray];
  
    if (currentImages.length > 4) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Solo se permiten hasta 4 imágenes por producto.',
      });
      return;
    }
    setPreviewImages(currentImages);
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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debes adjuntar al menos una imagen al producto.',
        });
        actions.setSubmitting(false);
        return;
      }

      // Validar que todos los campos estén llenos
      const requiredFields = ['nombre_producto', 'descripcion', 'precio', 'id_categoria'];
      const missingFields = requiredFields.filter(field => !values[field]);

      if (missingFields.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Debes llenar todos los campos obligatorios. Faltan: ${missingFields.join(', ')}.`,
        });
        actions.setSubmitting(false);
        return;
      }

      if (values.descripcion.length > 50) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La descripción no puede exceder los 50 caracteres.',
        });
        actions.setSubmitting(false);
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
        Swal.fire({
          icon: 'success',
          title: 'Producto creado',
          text: 'El nuevo producto ha sido creado exitosamente.',
        });
        actions.setSubmitting(false);
        actions.resetForm();
        navigate("/admin/dashboard");
      } else {
        if (response.status === 422) {
          const data = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'Error al crear el nuevo producto',
            text: data.error || 'Error al crear el nuevo producto. Verifica tus datos',
          });
          actions.setStatus({
            error: data.error || "Error al crear el nuevo producto. Verifica tus datos.",
          });
        } else if (response.status === 409) {
          const data = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'Error al crear el nuevo producto',
            text: data.error || 'Este producto ya existe',
          });
          actions.setStatus({
            error: data.error || "Este producto ya existe.",
          });
        } else {
          const data = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'Error al crear el nuevo producto',
            text: data.error || 'Error desconocido',
          });
          actions.setStatus({
            error: data.error || "Error al crear el nuevo producto. Verifica tus datos.",
          });
        }
        actions.setSubmitting(false);
      }
  
    } catch (error) {
      console.error("Error en la solicitud de creación del nuevo producto:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error en la solicitud de creación del nuevo producto: ' + error.message,
      });
      actions.setStatus({
        error: "Error en la solicitud de creación del nuevo producto: " + error.message,
      });
      actions.setSubmitting(false);
    }
  };

  return (
    <>
    <section className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <Navbar3 />
      </header>      <div className="container" style={{  maxWidth: "10000px" }}>
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <h2 className="display-6 text-center" style={{ fontFamily: "Gotham, sans-serif" }}>
              Nuevo Producto
            </h2>
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
              validate={(values) => {
                const errors = {};
            
                if (!values.precio || isNaN(values.precio) || parseFloat(values.precio) < 1) {
                  errors.precio = 'Ingresa un número válido mayor o igual a 1.';
                } else if (!/^\d+(\.\d{1,2})?$/.test(values.precio.toString())) {
                  errors.precio = 'Ingresa un número con hasta 2 decimales.';
                }            
                return errors;
              }}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, status, values }) => (
                <Form>
                  <div className="form my-3">
                    <label htmlFor="imagenes_producto">Imágenes del Producto:</label>
                    <p>Nota: Solo se puede subir un máximo de 4 imágenes</p>
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
                    <label htmlFor="nombre_producto">Nombre:</label>
                    <Field
                      type="text"
                      name="nombre_producto"
                      className="form-control"
                      placeholder="Ingresa el nombre del producto"
                      minLength="5"
                      maxLength="25"
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
  <ErrorMessage name="descripcion" component="div" className="text-danger" />
  {(descripcionLength < 5 || descripcionLength > 50) && (
    <p className="text-danger">La descripción debe tener entre 5 y 50 caracteres.</p>
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
      }
      return error;
    }}
  >
    {({ field, form }) => (
      <>
        <div className="input-group">
          <input
            {...field}
            type="text"
            value={`$${field.value}`}
            className={`form-control ${form.errors.precio && form.touched.precio ? "is-invalid" : ""}`}
            placeholder="Ingresa el precio del producto"
            onBlur={() => form.setFieldTouched("precio", true)}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, '');
              form.setFieldValue("precio", value);
            }}
          />
        </div>
        <ErrorMessage name="precio" component="div" className="text-danger" />
      </>
    )}
  </Field>
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
                                disabled={true}
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
          onClick={async () => {
            const { value: newTallaName } = await Swal.fire({
              input: 'select',  // Cambiado a un campo select
              inputLabel: 'Selecciona una talla:',
              inputOptions: {
                'S': 'S',
                'M': 'M',
                'L': 'L',
                'XL': 'XL',
              },
              inputValidator: (value) => {
                if (!value) {
                  return 'Debes seleccionar una talla';
                }
                const isTallaRepeated = arrayHelpers.form.values.tallas.some(
                  (talla) => talla.name === value
                );
                if (isTallaRepeated) {
                  return 'La talla ya existe. Selecciona una talla diferente.';
                }
                return null;
              },
            });
            if (newTallaName) {
              arrayHelpers.push({ name: newTallaName, status: "true" });
            }
          }}
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
                                disabled={true}

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
        onClick={async () => {
          const { value: newColorName } = await Swal.fire({
            input: 'text',
            inputLabel: 'Ingresa el nombre del color:',
            inputPlaceholder: 'Ej. Rojo, Azul, Verde',
            inputAttributes: {
              maxLength: 15,
            },
            inputValidator: (value) => {
              if (!value) {
                return 'Debes ingresar el nombre del color';
              }
              const isColorRepeated = arrayHelpers.form.values.colores.some(
                (color) => color.name === value
              );
              if (isColorRepeated) {
                return 'El color ya existe. Ingresa un nombre diferente.';
              }
              return null;
            },
          });
          if (newColorName) {
            arrayHelpers.push({ name: newColorName, status: "true" });
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

export default NuevoProducto;
