import React, { useState, useEffect } from "react";
import { Footer2, Navbar2 } from "../../components/usuario/usuario";

const Perfil = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [perfilData, setPerfilData] = useState({
    email: "",
    password: "********",
    nombre: "",
    apellido: "",
    telefono: "",
  });

  const initialData = { ...perfilData };

  useEffect(() => {
    // Realiza una solicitud al servidor para obtener los datos del perfil del usuario.
    // Asegúrate de que el servidor tenga una ruta para esto.

    // Ejemplo de cómo podrías hacer la solicitud (ajusta la URL según tu servidor):
    fetch('https://test-back-4kx4.onrender.com/api/v1/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPerfilData(data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos del perfil:", error);
      });
  }, []);

  const handleUpdate = () => {
    setIsEditMode(true);
  };

  const handleConfirm = () => {
    setIsEditMode(false);

    // Crear un objeto que contenga los datos a actualizar.
    const updatedData = {
      nombre: perfilData.nombre,
      apellido: perfilData.apellido,
      telefono: perfilData.telefono,
      email: perfilData.email,
    };

    // Realizar la solicitud de actualización al servidor.
    fetch('https://test-back-4kx4.onrender.com/api/v1/user', {
      method: 'PUT', // Utiliza el método HTTP correcto para actualizar (generalmente PUT o PATCH)
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Datos actualizados correctamente');
          // Puedes mostrar un mensaje de éxito o realizar cualquier otra acción necesaria.
        } else {
          console.error('Error al actualizar los datos');
          // Puedes mostrar un mensaje de error o manejarlo de otra manera.
        }
      })
      .catch((error) => {
        console.error('Error al actualizar los datos:', error);
        // Maneja cualquier error que pueda ocurrir durante la solicitud.
      });
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setPerfilData(initialData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfilData({
      ...perfilData,
      [name]: value,
    });
  };

  return (
    <>
      <Navbar2 />
      <div className="container my-5 py-2">
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <img
                src="/public/assets/user.png"
                alt="Foto de perfil"
                style={{ width: "40%", margin: "auto" }}
              />
              <div className="card-body text-center">
                <button
                  className="btn btn-primary mx-auto"
                  onClick={handleUpdate}
                  style={{ display: !isEditMode ? "block" : "none" }}
                >
                  Actualizar Perfil
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <div className="mb-3">
                  <label>Email:</label>
                  {isEditMode ? (
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={perfilData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="form-control-plaintext">{perfilData.email}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label>Contraseña:</label>
                  {isEditMode ? (
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={perfilData.password}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="form-control-plaintext">{perfilData.password}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label>Nombre:</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={perfilData.nombre}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="form-control-plaintext">{perfilData.nombre}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label>Apellido:</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      className="form-control"
                      name="apellido"
                      value={perfilData.apellido}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="form-control-plaintext">{perfilData.apellido}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label>Teléfono:</label>
                  {isEditMode ? (
                    <input
                      type="tel"
                      className="form-control"
                      name="telefono"
                      value={perfilData.telefono}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="form-control-plaintext">{perfilData.telefono}</div>
                  )}
                </div>
                <div className="text-center">
                  {isEditMode ? (
                    <>
                      <button
                        className="btn btn-success mx-2"
                        onClick={handleConfirm}
                      >
                        Confirmar
                      </button>
                      <button
                        className="btn btn-danger mx-2"
                        onClick={handleCancel}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button></button>
                  )}
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

export default Perfil;
