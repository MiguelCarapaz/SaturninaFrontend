import React, { useState, useContext, useEffect } from 'react';
import { Navbar3, Footer3 } from '../../components/administrador/administrador';
import AuthContext from '../../context/AuthProvider';

const Perfil2 = () => {
  const { auth } = useContext(AuthContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [perfilData, setPerfilData] = useState(null); 
  const [initialData, setInitialData] = useState(null); 
  const [updateSuccess, setUpdateSuccess] = useState(false); 


  useEffect(() => {
    // Realiza una solicitud al servidor para obtener los datos del perfil del usuario
    const storedId = localStorage.getItem('id');
    console.log('Stored ID:', storedId);

    fetch(`${import.meta.env.VITE_API_BASE_URL}/user/${storedId}`, {
      headers: {
        Authorization: `Bearer ${auth.authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPerfilData(data.detail);
        setInitialData(data.detail);
      })
      .catch((error) => {
        console.error('Error al obtener los datos del perfil:', error);
      });
  }, [auth]);

  const handleUpdate = () => {
    setIsEditMode(true);
  };

  const handleConfirm = () => {
    setIsEditMode(false);

    // Crear un objeto que contenga los datos a actualizar
    const updatedData = {
      nombre: perfilData.nombre,
      apellido: perfilData.apellido,
      telefono: perfilData.telefono,
      email: perfilData.email,
    };

    // Realizar la solicitud de actualización al servidor.
    const storedId = localStorage.getItem('id');
    console.log('Stored ID:', storedId);

    fetch(`${import.meta.env.VITE_API_BASE_URL}/user/${storedId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authToken}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Datos actualizados correctamente');
          setUpdateSuccess(true); // Establece el estado para mostrar el mensaje de éxito
        } else {
          console.error('Error al actualizar los datos');
        }
      })
      .catch((error) => {
        console.error('Error al actualizar los datos:', error);
        // Maneja cualquier error que pueda ocurrir durante la solicitud.
      });
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setPerfilData(initialData); // Restaura los datos a sus valores iniciales
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
      <Navbar3 />
      <div className="container my-5 py-2">
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <img
                src="/public/assets/user.png"
                alt="Foto de perfil"
                style={{ width: '40%', margin: 'auto' }}
              />
              <div className="card-body text-center">
                <button
                  className="btn btn-primary mx-auto"
                  onClick={handleUpdate}
                  style={{ display: !isEditMode ? 'block' : 'none' }}
                >
                  Actualizar Perfil
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                {perfilData ? ( // Verifica si los datos del perfil se han cargado antes de mostrarlos
                  <>
                    <div className="mb-3">
                      <label>Email:</label>
                      {isEditMode ? (
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={perfilData.email}
                          onChange={handleChange}
                          disabled={true}
                        />
                      ) : (
                        <div className="form-control-plaintext">{perfilData.email}</div>
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
                          <button className="btn btn-success mx-2" onClick={handleConfirm}>
                            Confirmar
                          </button>
                          <button className="btn btn-danger mx-2" onClick={handleCancel}>
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button></button>
                        )}
                      {updateSuccess && (
                        <p className="text-success">Datos actualizados con éxito.</p>
                      )}
                    </div>
                  </>
                ) : (
                  <p>Cargando datos del perfil...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer3 />
    </>
  );
};

export default Perfil2;
