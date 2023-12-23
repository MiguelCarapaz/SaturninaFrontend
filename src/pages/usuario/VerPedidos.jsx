import React, { useState, useContext, useEffect } from 'react';
import { Navbar2, Footer2 } from '../../components/usuario/usuario';
import { AuthContext } from '../../context/AuthProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const VerPedidos = () => {
  const { auth } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const userId = localStorage.getItem('id');

        if (!userId) {
          console.error('ID de usuario no encontrado en el localStorage');
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/order/${userId}`, {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
          maxRedirects: 0,
        });

        console.log('API Response:', response);

        if (response.data && response.data.detail && response.data.detail[0].result) {
          setPedidos(response.data.detail[0].result);
        } else {
          console.error('La estructura de la respuesta no es la esperada:', response);
        }
      } catch (error) {
        console.error('Error al obtener los pedidos', error);
      }
    };

    fetchPedidos();
  }, [auth]);

  const sortedPedidos = [...pedidos].sort((a, b) => {
    const dateA = new Date(a.fecha);
    const dateB = new Date(b.fecha);
    return dateB - dateA;
  });

  const filteredPedidos = sortedPedidos.filter((pedido) =>
    `${pedido.id_orden && pedido.id_producto.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPedidos.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openDetailsModal = (pedido) => {
    const imagenes = pedido.id_producto.imagen;
    const voucher = pedido.id_orden.image_transaccion;

    Swal.fire({
      title: 'Detalles del Pedido',
      html: `
        <p><strong>Fecha:</strong> ${pedido.fecha.substring(0, 10)}</p>
        <p><strong>Producto Adquirido:</strong> ${pedido.id_orden && pedido.id_producto.name}</p>
        ${imagenes ? imagenes.map(imagen => `<img src="${imagen.secure_url}" alt="Imagen del producto" style="max-width: 30%;">`).join('') : ''}
        <p><strong>Descripción del Producto:</strong> ${pedido.id_producto.descripcion}</p>
        <p><strong>Tallas Disponibles:</strong> ${pedido.id_producto.tallas.map(talla => talla.name).join(', ')}</p>
        <p><strong>Tallas Disponibles:</strong> ${pedido.id_producto.colores.map(talla => talla.name).join(', ')}</p>
        <p><strong>Nombre y Apellido:</strong> ${pedido.id_orden && `${pedido.id_orden.nombre} ${pedido.id_orden.apellido}`}</p>
        <p><strong>Email:</strong> ${pedido.id_orden && pedido.id_orden.email}</p>
        <p><strong>Teléfono:</strong> ${pedido.id_orden && pedido.id_orden.telefono}</p>
        <p><strong>Dirección:</strong> ${pedido.id_orden && pedido.id_orden.direccion}</p>
        <p><strong>Total:</strong> $${pedido.id_producto.precio}</p>
        <p><strong>Estado:</strong> ${pedido.status}</p>
        <p><strong>Voucher:</strong></p>
        ${voucher ? `<img src="${voucher.secure_url}" alt="Voucher del producto" style="max-width: 60%;">` : ''}
        <div class="text-center">
          <button class="my-2 mx-auto btn btn-dark" id="updateButton">Actualizar</button>
        </div>
      `,
      showCloseButton: true,
    });

    const updateButton = document.getElementById('updateButton');
    updateButton.addEventListener('click', () => {
      Swal.fire({
        title: 'Editar Detalles del Pedido',
        html: `
          <form id="editForm">
            <div class="mb-3">
              <label for="newNombre" class="form-label">Nuevo Nombre:</label>
              <input type="text" class="form-control" id="newNombre" name="newNombre" value="${pedido.id_orden.nombre}">
            </div>
            <div class="mb-3">
              <label for="newApellido" class="form-label">Nuevo Apellido:</label>
              <input type="text" class="form-control" id="newApellido" name="newApellido" value="${pedido.id_orden.apellido}">
            </div>
            <div class="mb-3">
              <label for="newDireccion" class="form-label">Nueva Dirección:</label>
              <input type="text" class="form-control" id="newDireccion" name="newDireccion" value="${pedido.id_orden.direccion}">
            </div>
            <div class="mb-3">
              <label for="newEmail" class="form-label">Nuevo Correo Electrónico:</label>
              <input type="email" class="form-control" id="newEmail" name="newEmail" value="${pedido.id_orden.email}">
            </div>
            <div class="mb-3">
              <label for="newTelefono" class="form-label">Nuevo Teléfono:</label>
              <input type="tel" class="form-control" id="newTelefono" name="newTelefono" value="${pedido.id_orden.telefono}">
            </div>
            <div class="mb-3">
              <label for="newTransferImage" class="form-label">Nuevo Comprobante de Pago:</label>
              <input type="file" class="form-control" id="newTransferImage" name="newTransferImage" accept="image/*">
            </div>
            <button type="submit" class="btn btn-dark">Guardar Cambios</button>
          </form>
        `,
        showCloseButton: true,
      });

      const editForm = document.getElementById('editForm');
      editForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newNombre = document.getElementById('newNombre').value;
        const newApellido = document.getElementById('newApellido').value;
        const newDireccion = document.getElementById('newDireccion').value;
        const newEmail = document.getElementById('newEmail').value;
        const newTelefono = document.getElementById('newTelefono').value;
        const newTransferImage = document.getElementById('newTransferImage').files[0];

        const formData = new FormData();
        formData.append("data", JSON.stringify({
          nombre: newNombre,
          apellido: newApellido,
          direccion: newDireccion,
          email: newEmail,
          telefono: newTelefono,
        }));
        formData.append("transfer_image", newTransferImage);

        try {
          const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/order/${pedido.id_orden.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${auth.authToken}`,
            },
          });

          console.log('Actualización exitosa:', response);
          Swal.fire({
            icon: 'success',
            title: '¡Datos actualizados!',
            text: 'Los detalles del pedido se han actualizado exitosamente.',
          });
          Swal.close();
        } catch (error) {
          console.error('Error en la actualización:', error);

          Swal.fire({
            icon: 'error',
            title: 'Error en la actualización',
            text: 'Hubo un error al intentar actualizar los detalles del pedido.',
          });
        }
      });
    });
  };

  return (
    <>
      <Navbar2 />
      <div className="container">
        <h1 className="text-center display-6" style={{ fontFamily: 'Gotham, sans-serif' }}>
          Pedidos
        </h1>
        <div className="mb-3">
          <label htmlFor="search" className="form-label">Buscar por Producto:</label>
          <input
            type="text"
            className="form-control"
            id="search"
            placeholder="Ingrese nombre del producto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <hr />
        {currentItems && currentItems.length > 0 ? (
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Fecha</th>
                <th>Producto Adquirido</th>
                <th>Nombre y Apellido</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.fecha.substring(0, 10)}</td>
                  <td>{pedido.id_orden && pedido.id_producto.name}</td>
                  <td>{pedido.id_orden && `${pedido.id_orden.nombre} ${pedido.id_orden.apellido}`}</td>
                  <td>{pedido.id_orden && pedido.id_orden.email}</td>
                  <td>{pedido.id_orden && pedido.id_orden.telefono}</td>
                  <td>{pedido.id_orden && pedido.id_orden.direccion}</td>
                  <td>${pedido.id_producto.precio}</td>
                  <td>{pedido.status}</td>
                  <td>
                    <button className="btn btn-outline-dark" onClick={() => openDetailsModal(pedido)}> 👁️
                      <i className="fa fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay pedidos disponibles.</p>
        )}
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            {Array.from({ length: Math.ceil(filteredPedidos.length / itemsPerPage) }, (_, index) => (
              <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => paginate(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Footer2 />
    </>
  );
};

export default VerPedidos;