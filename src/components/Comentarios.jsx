import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';

const Comentario = ({ comentario }) => (
  <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
    <StarRating rating={comentario.calificacion} starSize="32px" filledColor="gold" emptyColor="lightgray" />
    <p style={{ marginTop: '5px' }}>
      <strong>Usuario:</strong> {`${comentario.user_id.nombre} ${comentario.user_id.apellido}`}
    </p>
    <p>{comentario.descripcion}</p>
  </div>
);

const Comentarios = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        // Asegurémonos de que el formato del ID del producto sea correcto
        const formattedProductId = productId.startsWith('product:') ? productId : `product:${productId}`;

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments?id_producto=${formattedProductId}`);
        const data = await response.json();

        // Filtrar los comentarios por el ID del producto
        const fetchedComments = data.detail
          .map(detailItem => detailItem.result)
          .flat()
          .filter(comment => comment.id_producto === formattedProductId);

        setComments(fetchedComments);
        console.log('Comentarios del producto:', fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [productId]);

  return (
    <>
      {loading && <p>Cargando comentarios...</p>}
      {!loading && comments.length === 0 && <p>No hay comentarios disponibles.</p>}
      {!loading && comments.length > 0 && (
        <div>
          <h3>Comentarios:</h3>
          {comments.map(comment => (
            <Comentario key={comment.id} comentario={comment} />
          ))}
        </div>
      )}
    </>
  );
};

export default Comentarios;
