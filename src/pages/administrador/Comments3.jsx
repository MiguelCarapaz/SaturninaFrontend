import React, { useState, useEffect, useContext } from 'react';
import StarRatingGener from './StarRatingGener3';
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';
import { AuthContext } from '../../context/AuthProvider';
import {Navbar3} from "../../components/administrador/administrador";

export function Comments3() {
  const { auth } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerWidth = 1239; // Ajusta el ancho del contenedor según sea necesario

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments-general`);
        const data = await response.json();

        if (data.detail && data.detail[0] && data.detail[0].result) {
          setComments(data.detail[0].result);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, []); 

  const handleScroll = (direction) => {
    const step = 200; // Ajusta la cantidad de píxeles a desplazar
  
    if (direction === 'left') {
      // Desplazamiento hacia la izquierda sin límite
      setScrollPosition(scrollPosition - step);
    } else {
      // Ajusta el límite hacia la derecha
      setScrollPosition(Math.min(scrollPosition + step, 0));
    }
  };

  const handleDeleteComment = async (commentId) => {
    // Muestra una alerta para confirmar la eliminación
    const confirmDelete = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo'
    });

    // Si el usuario confirma la eliminación
    if (confirmDelete.isConfirmed) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments-general/${commentId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.authToken}`, // Reemplaza con el token adecuado
          },
        });

        if (response.ok) {
          // Filtra los comentarios para excluir el eliminado
          const updatedComments = comments.filter(comment => comment.id !== commentId);
          setComments(updatedComments);

          Swal.fire({
            title: 'Eliminado',
            text: 'El comentario ha sido eliminado exitosamente',
            icon: 'success',
          });
        } else {
          // Manejo de errores si la eliminación falla
          const errorData = await response.json();
          console.error('Error al eliminar el comentario:', errorData);

          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al eliminar el comentario. Inténtalo de nuevo.',
            icon: 'error',
          });
        }
      } catch (error) {
        console.error('Error en la solicitud DELETE:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al eliminar el comentario. Inténtalo de nuevo.',
          icon: 'error',
        });
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50">
        <Navbar3 />
      </header>

      <h2 className="text-center mt-10" id="comentarios">
        Comentarios y/o Sugerencias
      </h2>
      <section className='flex flex-col w-full items-center justify-center'>
        <div style={styles.controls}>
          <button onClick={() => handleScroll("right")}>
            <BsArrowLeft />
          </button>
          <button onClick={() => handleScroll("left")}>
            <BsArrowRight />
          </button>
        </div>
        <div
          style={{
            ...styles.commentsContainer,
            marginLeft: scrollPosition + "px",
          }}
          className="comments-scroll"
        >
          {comments.map((comment) => (
            <div key={comment.id} style={styles.commentCard}>
              <StarRatingGener rating={comment.calificacion} />
              <div style={styles.userInfo}>
                <b>
                  {comment.user_id.nombre} {comment.user_id.apellido}
                </b>
                <IoCheckmarkCircle style={styles.checkIcon} />
                {/* Agregamos el icono de eliminación con un onClick que llama a la función handleDeleteComment */}
                <FaRegTrashAlt
                  onClick={() => handleDeleteComment(comment.id)}
                  style={styles.deleteIcon}
                />
              </div>
              <p>{comment.descripcion}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

const styles = {
  commentsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    transition: 'margin-left 0.3s ease', 
  },
  commentCard: {
    border: '1px solid #ddd',
    borderRadius: '20px',
    padding: '16px',
    margin: '5px',
    width: '300px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
  },
  checkIcon: {
    marginLeft: '8px',
    color: '#5FAB2A',    
    backgroundColor: 'white', 
    borderRadius: '50%',
    padding: '2px', 
    fontSize: '24px', 
  },
  deleteIcon: {
    color: 'red',
    cursor: 'pointer',
    fontSize: '24px', 
    position: 'absolute',
    marginTop: '-80px',
    marginLeft: '250px',
  },
  controls: {
    display: 'flex',
    marginLeft:'1239px', 
    alignItems: 'center',
    marginTop: '10px',
  },
};
