import React, { useState, useContext, useEffect } from 'react';
import { Navbar3, Footer3 } from '../../components/administrador/administrador';
import { AuthContext } from '../../context/AuthProvider';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Perfil2 = () => {
  const { auth } = useContext(AuthContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [perfilData, setPerfilData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [isChangePasswordMode, setIsChangePasswordMode] = useState(false);
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
  const [phoneValidationMessage, setPhoneValidationMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCheckPassword, setShowCheckPassword] = useState(false);



  useEffect(() => {
    const storedId = localStorage.getItem('id');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nombre' || name === 'apellido') {
      const trimmedValue = value.slice(0, 10);
      setPerfilData({
        ...perfilData,
        [name]: trimmedValue,
      });
    } else if (name === 'telefono') {
      const numericValue = value.replace(/[^0-9]/g, '');
      const trimmedValue = numericValue.slice(0, 10);
      setPerfilData({
        ...perfilData,
        [name]: trimmedValue,
      });

      if (trimmedValue.length !== 10) {
        setPhoneValidationMessage('El número de teléfono debe tener exactamente 10 dígitos.');
      } else {
        setPhoneValidationMessage('');
      }
    } else {
      setPerfilData({
        ...perfilData,
        [name]: value,
      });
      setPhoneValidationMessage('');
    }
  };

  const handleToggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleToggleCheckPassword = () => {
    setShowCheckPassword(!showCheckPassword);
  };

  const handleUpdate = () => {
    setIsEditMode(true);
  };

  const handleUpdatePasswordMode = () => {
    setIsChangePasswordMode(true);
    setIsEditMode(true);
  };

  const handleConfirm = () => {
    // Validar que el número de teléfono tenga 10 dígitos
    if (perfilData.telefono.length !== 10) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El número de teléfono debe tener exactamente 10 dígitos.',
      });
      return; // Detener la actualización si la validación falla
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción actualizará tu perfil. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar perfil',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsEditMode(false);
        const updatedData = {
          nombre: perfilData.nombre,
          apellido: perfilData.apellido,
          telefono: perfilData.telefono,
          email: perfilData.email,
        };

        const storedId = localStorage.getItem('id');
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
              setUpdateSuccess(true);
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Datos actualizados con éxito.',
              });
              setInitialData(perfilData);
            } else {
              if (response.status === 422) {
                return response.json().then((data) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar los datos',
                    text: data.error || 'Error al actualizar los datos. Datos incorrectos.',
                  });
                });
              } else {
                console.error('Error al actualizar los datos');
              }
            }
          })
          .catch((error) => {
            console.error('Error al actualizar los datos:', error);
          });
      }
    });
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setPerfilData(initialData);
  };

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'checkPassword') {
      setCheckPassword(value);
    }
  };

  const handleUpdatePassword = () => {
    if (newPassword !== checkPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }
    fetch(`${import.meta.env.VITE_API_BASE_URL}/update-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authToken}`,
      },
      body: JSON.stringify({
        new_password: newPassword,
        check_password: checkPassword,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Contraseña actualizada correctamente');
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Contraseña actualizada con éxito.',
          });
        } else if (response.status === 406) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña es igual a la anterior.',
          });
        } else {
          console.error('Error al actualizar la contraseña');
        }
      })
      .catch((error) => {
        console.error('Error al actualizar la contraseña:', error);
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
                <Link to="/admin/verpedidosadmin/" className="btn btn-dark btn-lg btn-block">
                  Ver Pedidos
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                {perfilData ? (
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
          <>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={perfilData.nombre}
              minLength="3"
              maxLength="10"
              onChange={handleChange}
            />
            {perfilData.nombre.length < 3 && (
              <small className="text-danger">El nombre debe tener al menos 3 caracteres.</small>
            )}
          </>
        ) : (
          <div className="form-control-plaintext">{perfilData.nombre}</div>
        )}
      </div>

      <div className="mb-3">
        <label>Apellido:</label>
        {isEditMode ? (
          <>
            <input
              type="text"
              className="form-control"
              name="apellido"
              minLength="3"
              maxLength="10"
              value={perfilData.apellido}
              onChange={handleChange}
            />
            {perfilData.apellido.length < 3 && (
              <small className="text-danger">El apellido debe tener al menos 3 caracteres.</small>
            )}
          </>
        ) : (
          <div className="form-control-plaintext">{perfilData.apellido}</div>
        )}
      </div>

      <div className="mb-3">
        <label>Teléfono:</label>
        {isEditMode ? (
          <>
            <input
              type="tel"
              className="form-control"
              name="telefono"
              value={perfilData.telefono}
              onChange={handleChange}
            />
            {phoneValidationMessage && (
              <small className="text-danger">{phoneValidationMessage}</small>
            )}
          </>
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
                    </div>
                  </>
                ) : (
                  <p>Cargando datos del perfil...</p>
                )}
                {(isEditMode || isChangePasswordMode) && (
                  <>
                <div className="mb-3">
                      <label>Nueva Contraseña:</label>
                      {isEditMode ? (
                        <>
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            className="form-control"
                            name="newPassword"
                            value={newPassword}
                            minLength="9"
                            maxLength="18"
                            onChange={handleChangePassword}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleToggleNewPassword}
                          >
                            {showNewPassword ? 'Ocultar' : 'Mostrar'}
                          </button>
      {newPassword.length > 18 || newPassword.length < 9 || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? (
        <small className="text-danger">La contraseña debe tener entre 9 y 18 caracteres y contener al menos una letra mayúscula, un número y un carácter especial.</small>
      ) : (
        <small className="text-success">Contraseña válida.</small>
      )}
    </>
  ) : (
    <div></div>
  )}
</div>

<div className="mb-3">
                      <label>Confirmar Contraseña:</label>
                      {isEditMode ? (
                        <>
                          <input
                            type={showCheckPassword ? 'text' : 'password'}
                            className="form-control"
                            name="checkPassword"
                            value={checkPassword}
                            minLength="9"
                            maxLength="18"
                            onChange={handleChangePassword}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleToggleCheckPassword}
                          >
                            {showCheckPassword ? 'Ocultar' : 'Mostrar'}
                          </button>
      {checkPassword.length > 18 || checkPassword.length < 9 || !/[A-Z]/.test(checkPassword) || !/\d/.test(checkPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(checkPassword) ? (
        <small className="text-danger">La contraseña debe tener entre 9 y 18 caracteres y contener al menos una letra mayúscula, un número y un carácter especial.</small>
      ) : (
        <small className="text-success">Contraseña válida.</small>
      )}
    </>
  ) : (
    <div></div>
  )}
</div>
                    <div className="text-center">
                      {isEditMode && (
                        <button className="btn btn-success mx-2" onClick={handleUpdatePassword}>
                          Actualizar Contraseña
                        </button>
                      )}
                    </div>
                  </>
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
