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
    'Pendiente': 'Pendientes',
    'En entrega': 'En entrega',
    'Rechazado': 'Rechazado',
    'Finalizado': 'Finalizados',
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

  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const updateOrderStatus = async (id, status) => {
    try {
      const { value: descripcion } = await Swal.fire({
        title: 'Actualizar Estado',
        input: 'text',
        inputLabel: 'Ingresar Descripción',
        inputPlaceholder: 'Ingrese una descripción...',
        inputAttributes: {
          maxLength: 50,
        },
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
      <div class="text-center">
      <button class="my-2 mx-auto btn btn-warning" id="updateStatusButton">Actualizar Estado del Pedido</button>
    </div>
        <p><strong>Fecha:</strong> ${pedido.fecha}</p>
        <p><strong>Producto Adquirido:</strong> ${pedido.id_producto.name}</p>
        ${imagenes ? imagenes.map(imagen => `<img src="${imagen.secure_url}" alt="Imagen del producto" style="max-width: 30%;" class="mx-auto my-3">`).join('') : ''}
        <p><strong>Descripcion del producto:</strong> ${pedido.id_orden && pedido.id_orden.descripcion}</p>
        <p><strong>Talla:</strong> ${pedido.talla !== null ? pedido.talla : 'No hay talla disponibles'}</p>
        <p><strong>Color:</strong> ${pedido.color !== null ? pedido.color : 'No hay color disponibles'}</p>
        <p><strong>Nombre y Apellido:</strong> ${pedido.id_orden && `${pedido.id_orden.nombre} ${pedido.id_orden.apellido}`}</p>
        <p><strong>Email:</strong> ${pedido.id_orden && pedido.id_orden.email}</p>
        <p><strong>Teléfono:</strong> ${pedido.id_orden && pedido.id_orden.telefono}</p>
        <p><strong>Dirección:</strong> ${pedido.id_orden && pedido.id_orden.direccion}</p>
        <p><strong>Descripción del pedido:</strong> ${pedido.id_orden && pedido.id_orden.descripcion}</p>
        <p><strong>Total:</strong> $${pedido.id_producto.precio}</p>
        <p><strong>Estado:</strong> ${pedido.status}</p>
        <p><strong>Voucher:</strong></p>
        ${voucher ? `<img src="${voucher.secure_url}" alt="Voucher del producto"style="max-width: 40%;" class="mx-auto my-3">` : ''}

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
        inputValue: pedido.status,
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Debes seleccionar un estado';
          }
        },
        preConfirm: (status) => {
          updateOrderStatus(pedido.id, status);
        },
      });
    });
  };

  // Filtrar pedidos por estado seleccionado
  const filteredPedidosByStatus = pedidos.filter((pedido) => pedido.status === currentTab);

  // Filtrar pedidos por término de búsqueda
  const filteredPedidosBySearch = filteredPedidosByStatus.filter(
    (pedido) =>
      `${pedido.id_orden.nombre} ${pedido.id_orden.apellido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Calcular índices de inicio y fin para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFilteredItemsByStatus = filteredPedidosBySearch.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
       <section className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <Navbar3 />
      </header>
      <div className="container">
        <div className="my-4">
          <h2 className="text-center display-6" style={{ fontFamily: 'Gotham, sans-serif' }}>
            Pedidos
          </h2>
        </div>

        {/* Tabs de estados */}
        <ul className="nav nav-tabs mb-3">
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

        {/* Barra de búsqueda */}
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

        {/* Tabla de pedidos */}
        {currentFilteredItemsByStatus && currentFilteredItemsByStatus.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Fecha</th>
                  <th>Producto Adquirido</th>
                  <th>Nombre y Apellido</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentFilteredItemsByStatus.map((pedido) => (
                  <tr key={pedido.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{pedido.fecha.substring(0, 10)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{pedido.id_producto.name}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{pedido.id_orden && `${pedido.id_orden.nombre} ${pedido.id_orden.apellido}`}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{pedido.id_orden && pedido.id_orden.email}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{pedido.id_orden && pedido.id_orden.telefono}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>${pedido.id_producto.precio}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{pedido.status}</td>
                    <td>
                      <button className="btn btn-outline-dark" onClick={() => openDetailsModal(pedido)}> 👁️
                        <i className="fa fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No hay pedidos disponibles para este estado.</p>
        )}

        {/* Paginación */}
        <nav className="mt-4" aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
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
      </section>
      <Footer3 className="mt-auto"/>
    </>
  );
};

export default VerPedidosAdmin;
