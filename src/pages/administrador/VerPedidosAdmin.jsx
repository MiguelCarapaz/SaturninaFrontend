import React, { useState, useContext, useEffect } from 'react';
import { Navbar3, Footer3 } from '../../components/administrador/administrador';
import { AuthContext } from '../../context/AuthProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const VerPedidosAdmin = () => {
  const { auth } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState('Pendiente');
  const itemsPerPage = 5;

  const orderStatusTabs = {
    'Pendiente': 'Pendiente',
    'En entrega': 'En entrega',
    'Rechazado': 'Rechazado',
    'Finalizado': 'Finalizado',
  };

  const fetchPedidos = async () => {
    try {
      const userId = localStorage.getItem('id');

      if (!userId) {
        console.error('ID de usuario no encontrado en el localStorage');
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
      });

      console.log('API Response:', response);

      if (response.data && response.data.detail && response.data.detail[0].result) {
        setPedidos(response.data.detail[0].result);
        setSelectedPedido(response.data.detail[0].result[0]);
      } else {
        console.error('La estructura de la respuesta no es la esperada:', response);
      }
    } catch (error) {
      console.error('Error al obtener los pedidos', error);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [auth]);

  const updateOrderStatus = async (id, status) => {
    try {
      const { value: descripcion } = await Swal.fire({
        title: 'Actualizar Estado',
        input: 'text',
        inputLabel: 'Ingresar Descripción',
        inputPlaceholder: 'Ingrese una descripción...',
        showCancelButton: true,
        preConfirm: (input) => {
          if (!input) {
            Swal.showValidationMessage('Debes ingresar una descripción');
          }
        },
      });
  
      if (descripcion) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/orders/${id}`,
          { status_order: status, descripcion: descripcion },
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
  
        console.log('Actualización de estado exitosa:', response);
        Swal.fire({
          icon: 'success',
          title: '¡Estado actualizado!',
          text: 'El estado del pedido se ha actualizado exitosamente.',
        });
        fetchPedidos();
      }
    } catch (error) {
      console.error('Error en la actualización de estado:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error en la actualización de estado',
        text: 'Hubo un error al intentar actualizar el estado del pedido.',
      });
    }
  };
  

  const openDetailsModal = (pedido) => {
    const imagenes = pedido.id_producto.imagen;
    const voucher = pedido.id_orden.image_transaccion;

    Swal.fire({
      title: 'Detalles del Pedido',
      html: `
        <p><strong>Fecha:</strong> ${pedido.fecha}</p>
        <p><strong>Producto Adquirido:</strong> ${pedido.id_producto.name}</p>
        ${imagenes ? imagenes.map(imagen => `<img src="${imagen.secure_url}" alt="Imagen del producto" style="max-width: 30%;">`).join('') : ''}
        <p><strong>Descripcion del producto:</strong> ${pedido.id_orden && pedido.id_orden.descripcion}</p>
        <p><strong>Tallas Disponibles:</strong> ${pedido.id_producto.tallas ? pedido.id_producto.tallas.map(talla => talla.name).join(', ') : 'No hay tallas disponibles'}</p>
        <p><strong>Colores Disponibles:</strong> ${pedido.id_producto.colores ? pedido.id_producto.colores.map(talla => talla.name).join(', ') : 'No hay colores disponibles'}</p>   
        <p><strong>Nombre y Apellido:</strong> ${pedido.id_orden && `${pedido.id_orden.nombre} ${pedido.id_orden.apellido}`}</p>
        <p><strong>Email:</strong> ${pedido.id_orden && pedido.id_orden.email}</p>
        <p><strong>Teléfono:</strong> ${pedido.id_orden && pedido.id_orden.telefono}</p>
        <p><strong>Dirección:</strong> ${pedido.id_orden && pedido.id_orden.direccion}</p>
        <p><strong>Total:</strong> $${pedido.id_producto.precio}</p>
        <p><strong>Estado:</strong> ${pedido.status}</p>
        <p><strong>Voucher:</strong></p>
        ${voucher ? `<img src="${voucher.secure_url}" alt="Voucher del producto" style="max-width: 60%;">` : ''}
        <div class="text-center">
          <button class="my-2 mx-auto btn btn-warning" id="updateStatusButton">Actualizar Estado</button>
        </div>
      `,
      showCloseButton: true,
    });

    const updateStatusButton = document.getElementById('updateStatusButton');
    updateStatusButton.addEventListener('click', () => {
      Swal.fire({
        title: 'Actualizar Estado',
        input: 'select',
        inputOptions: {
          'Pendiente': 'Pendiente',
          'En entrega': 'En entrega',
          'Rechazado': 'Rechazado',
          'Finalizado': 'Finalizado',
        },
        inputPlaceholder: 'Selecciona un estado',
        showCancelButton: true,
        preConfirm: (status) => {
          if (!status) {
            Swal.showValidationMessage('Debes seleccionar un estado');
          }
        },
      }).then(({ value }) => {
        if (value) {
          updateOrderStatus(pedido.id, value);
        }
      });
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredPedidosByStatus = pedidos.filter(pedido => pedido.status === orderStatusTabs[currentTab]);
  const currentFilteredItemsByStatus = filteredPedidosByStatus.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredPedidos = pedidos.filter((pedido) =>
    `${pedido.id_orden && pedido.id_orden.nombre} ${pedido.id_orden && pedido.id_orden.apellido}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const currentFilteredItems = filteredPedidos.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Navbar3 />
      <div className="container">
        <h1 className="text-center display-6" style={{ fontFamily: 'Gotham, sans-serif' }}>
          Pedidos
        </h1>

        {/* Tabs de estados */}
        <div className="mb-3">
          <ul className="nav nav-tabs">
            {Object.keys(orderStatusTabs).map(tab => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link ${currentTab === tab ? 'active' : ''}`}
                  onClick={() => setCurrentTab(tab)}
                >
                  {orderStatusTabs[tab]}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-3">
          <label htmlFor="search" className="form-label">Buscar por Nombre y Apellido:</label>
          <input
            type="text"
            className="form-control"
            id="search"
            placeholder="Ingrese nombre y apellido"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <hr />

        {currentFilteredItemsByStatus && currentFilteredItemsByStatus.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto Adquirido</th>
                <th>Talla</th>
                <th>Color</th>
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
              {currentFilteredItemsByStatus.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.fecha}</td>
                  <td>{pedido.id_producto.name}</td>
                  <td>{pedido.id_producto.tallas ? pedido.id_producto.tallas.map(talla => talla.name).join(', ') : 'No hay tallas disponibles'}</td>
                  <td>{pedido.id_producto.colores ? pedido.id_producto.colores.map(talla => talla.name).join(', ') : 'No hay colores disponibles'}</td>
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
          <p>No hay pedidos disponibles para este estado.</p>
        )}

        <nav aria-label="Page navigation example">
          <ul className="pagination">
            {Array.from({ length: Math.ceil(filteredPedidosByStatus.length / itemsPerPage) }, (_, index) => (
              <li className={`page-item ${index + 1 === currentPage ? 'active' : ''}`} key={index}>
                <button className="page-link" onClick={() => paginate(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Footer3 />
    </>
  );
};

export default VerPedidosAdmin;
