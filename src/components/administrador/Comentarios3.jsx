import React, { useEffect, useState, useContext } from 'react';
import StarRating3 from './StarRating3';
import { AuthContext } from '../../context/AuthProvider';
import { FaRegTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2'; // Importa SweetAlert2

const Comentario = ({ comentario, onDeleteComment }) => {
  const handleDeleteClick = () => {
    Swal.fire({
      title: '¿Está seguro de eliminar este comentario?',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteComment(comentario.id);
        Swal.fire('Comentario eliminado exitosamente', '', 'success');
      }
    });
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', position: 'relative' }}>
      <button onClick={handleDeleteClick} style={{ position: 'absolute', top: '5px', right: '5px', cursor: 'pointer' }}>
      <FaRegTrashAlt style={styles.deleteIcon} />
      </button>
      <StarRating3 rating={comentario.calificacion} starSize="32px" filledColor="gold" emptyColor="lightgray" />
      <p style={{ marginTop: '5px' }}>
        <strong>Usuario:</strong> {`${comentario.user_id.nombre} ${comentario.user_id.apellido}`}
      </p>
      <p>{comentario.descripcion}</p>
    </div>
  );
};

const Comentarios3 = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth, perfilLoaded } = useContext(AuthContext);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const formattedProductId = productId.startsWith('product:') ? productId : `product:${productId}`;

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments?id_producto=${formattedProductId}`);
        const data = await response.json();

        const fetchedComments = data.detail
          .map((detailItem) => detailItem.result)
          .flat()
          .filter((comment) => comment.id_producto === formattedProductId);

        setComments(fetchedComments);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [productId]);

  const handleDeleteComment = async (commentId) => {
    try {
      const storedId = localStorage.getItem('id');

      if (!perfilLoaded || !storedId) {
        console.error('ID de usuario no válido:', storedId);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.authToken}`,
        },
      });

      if (response.ok) {
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      } else {
      }
    } catch (error) {
    }
  };

  return (
    <>
      {loading && <p>Cargando comentarios...</p>}
      {!loading && comments.length === 0 && <p>No hay comentarios disponibles.</p>}
      {!loading && comments.length > 0 && (
        <div>
          <h3>Comentarios:</h3>
          {comments.map((comment) => (
            <Comentario key={comment.id} comentario={comment} onDeleteComment={handleDeleteComment} />
          ))}
        </div>
      )}
    </>
  );
};

export default Comentarios3;

const styles = {
  deleteIcon: {
    color: 'red',
    cursor: 'pointer',
    fontSize: '24px',
  },
};
