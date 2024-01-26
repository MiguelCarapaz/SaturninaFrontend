import React, { useState, useEffect } from "react";
import { Navbar3, Footer3 } from "../../components/administrador/administrador";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Swal from 'sweetalert2'; 
import "react-toastify/dist/ReactToastify.css";
import 'sweetalert2/dist/sweetalert2.min.css'; 

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [authToken] = useState(localStorage.getItem("authToken") || "");
  const [error, setError] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [editando, setEditando] = useState(false);

  // Estado para los valores del formulario
  const [formValues, setFormValues] = useState({
    nombre_categoria: "",
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/category`);
        setCategorias(response.data.detail);
      } catch (error) {
      }
    };

    fetchCategorias();
  }, []);

  const handleEliminarCategoria = async (idCategoria) => {
    try {
      const confirmDelete = await Swal.fire({
        title: '¿Está seguro de eliminar esta categoría?',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (confirmDelete.isConfirmed) {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/category/${idCategoria}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        // Actualizar localmente la lista de categorías eliminando la categoría
        setCategorias((prevCategorias) =>
          prevCategorias.filter((categoria) => categoria.id !== idCategoria)
        );

        Swal.fire('Categoría eliminada exitosamente', '', 'success');

        if (categorias.length === 0) {
          setError('No hay categorías disponibles. Puedes agregar una nueva categoría.');
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar la categoría',
          text: 'No se pudo eliminar la categoría porque tiene productos asociados.',
          confirmButtonText: 'OK',
        });
      } else {
        console.error("Error al eliminar la categoría:", error);
        setError("No se pudo eliminar la categoría. Ya que esta tiene asociado productos.");
      }
    }
  };

  const handleEditarCategoria = (categoria) => {
    // Al editar, establece la categoría seleccionada y activa el modo de edición
    setCategoriaSeleccionada(categoria);
    setEditando(true);

    // Autocompletar el formulario con el nombre de la categoría seleccionada
    setFormValues({
      nombre_categoria: categoria.name,
    });
  };

  const handleAgregarCategoria = async (values) => {
    try {
      const newCategory = { name: values.nombre_categoria };
  
      // Verificar si ya existe una categoría con el mismo nombre
      const categoriaExistente = categorias.find(
        (categoria) => categoria.name.toLowerCase() === values.nombre_categoria.toLowerCase()
      );
  
      if (categoriaExistente) {
        // Utiliza SweetAlert2 para mostrar el mensaje de categoría existente
        Swal.fire({
          icon: 'warning',
          title: 'Categoría Existente',
          text: 'Ya existe una categoría con el mismo nombre. Por favor, elige otro nombre.',
          confirmButtonText: 'OK',
        });
      } else {
        // Si no existe, procede con la creación o actualización
        if (editando) {
          await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/category/${categoriaSeleccionada.id}`,
            newCategory,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
            }
          );
  
          // Utiliza SweetAlert2 para mostrar el mensaje de éxito
          Swal.fire('Categoría actualizada exitosamente', '', 'success');
        } else {
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/category`, newCategory, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          });
  
          // Utiliza SweetAlert2 para mostrar el mensaje de éxito
          Swal.fire('Categoría creada exitosamente', '', 'success');
        }
  
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/category`);
        setCategorias(response.data.detail);
  
        // Limpiar el formulario después de la operación con éxito
        setFormValues({
          nombre_categoria: " ",
        });
        setEditando(false);
      }
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
      setError(
        "No se pudo agregar la categoría. Por favor, inténtalo de nuevo más tarde."
      );
    }
  };
  

  // Nueva función para manejar la cancelación de la edición
  const handleCancelarEdicion = () => {
    setEditando(false);
    setCategoriaSeleccionada(null);
    // Limpiar el formulario al cancelar la edición
    setFormValues({
      nombre_categoria: "",
    });
  };

  // Función para manejar la actualización de la categoría
  const handleActualizarCategoria = async (values) => {
    try {
      const newCategory = { name: values.nombre_categoria };

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/category/${categoriaSeleccionada.id}`,
        newCategory,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Utiliza SweetAlert2 para mostrar el mensaje de éxito
      Swal.fire('Categoría actualizada exitosamente', '', 'success');

      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/category`);
      setCategorias(response.data.detail);
      setCategoriaSeleccionada(null);
      setEditando(false);
      // Limpiar el formulario después de la actualización
      setFormValues({
        nombre_categoria: "",
      });
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      setError(
        "No se pudo actualizar la categoría. Por favor, inténtalo de nuevo más tarde."
      );
    }
  };

  return (
    <>
      <Navbar3 />
      <div
        className="container"
        style={{  maxWidth: "10000px" }}
      >
        <h2 className="display-6 text-center" style={{ fontFamily: "Gotham, sans-serif" }}>
          Categorías
        </h2>
        <hr />
        {categorias.length === 0 && (
          <div className="alert alert-info mt-3" role="alert">
            No hay categorías disponibles. Puedes agregar una nueva categoría.
          </div>
        )}

        <div className="row">
          {categorias.map((categoria) => (
            <div key={categoria.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{categoria.name}</h5>
                  <button
                    className="btn btn-danger mr-2"
                    onClick={() => handleEliminarCategoria(categoria.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditarCategoria(categoria)}
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr />

        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  {editando ? "Editar Categoría" : "Agregar Nueva Categoría"}
                </h5>

                <Formik
                  initialValues={formValues}
                  enableReinitialize={true}
                  validate={(values) => {
                    const errors = {};
                    if (!values.nombre_categoria) {
                      errors.nombre_categoria = "Campo requerido";
                    }
                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true);
                    // Determina si se está editando o agregando
                    editando
                      ? handleActualizarCategoria(values)
                      : handleAgregarCategoria(values);
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="form-group">
                        <label htmlFor="nombre_categoria">Nombre de la Categoría</label>
                        <Field
                          type="text"
                          name="nombre_categoria"
                          className="form-control"
                          id="nombre_categoria"
                          minLength="5"
                          maxLength="30"
                        />
                        <ErrorMessage
                          name="nombre_categoria"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <button
                          type="submit"
                          className="btn btn-success ml-2"
                          disabled={isSubmitting}
                        >
                          {editando ? "Guardar Cambios" : "Agregar"}
                        </button>
                        {editando && (
                          <button
                            type="button"
                            className="btn btn-secondary ml-2"
                            onClick={handleCancelarEdicion}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer />
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </div>
      <Footer3 />
    </>
  );
};

export default Categorias;
