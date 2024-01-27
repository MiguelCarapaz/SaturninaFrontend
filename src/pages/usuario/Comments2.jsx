import React, { useState, useEffect, useContext } from 'react';
import StarRatingGener2 from './StarRatingGener2';
import Swal from 'sweetalert2';
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { AuthContext } from '../../context/AuthProvider';
import { Navbar2} from "../../components/usuario/usuario";


export function Comments2() {
  const [comments, setComments] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { auth } = useContext(AuthContext);
  const [reloadComments, setReloadComments] = useState(false);

  const [newComment, setNewComment] = useState({
    descripcion: '',
    calificacion: 0,
  });

  const [showMessage, setShowMessage] = useState(false);
  const [commentError, setCommentError] = useState('');

  const [userComment, setUserComment] = useState({});

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments-general`, {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        });
  
        const data = await response.json();
  
        if (data.detail && data.detail[0] && data.detail[0].result) {
          setComments(data.detail[0].result);
  
          const storedId = localStorage.getItem('id');
          const currentUserComment = data.detail[0].result.find((comment) => comment.user_id?.id === storedId);
          setUserComment(currentUserComment || { calificacion: 0, descripcion: '' });
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    fetchComments();
  }, [auth.authToken, reloadComments]);

  const handleScroll = (direction) => {
    const step = 200;

    if (direction === 'left') {
      setScrollPosition(scrollPosition - step);
    } else {
      setScrollPosition(Math.min(scrollPosition + step, 0));
    }
  };

  const handleCreateOrUpdateComment = async () => {
    try {
      if (!auth || !auth.authToken) {
        console.error('Credenciales de usuario no válidas.');
        return;
      }
  
      const storedId = localStorage.getItem('id');
      const userId = storedId || (userComment && userComment.user_id && userComment.user_id.id);
  
      if (!userId) {
        console.error('No se puede obtener el ID del usuario.');
        return;
      }
  
      if (!newComment.descripcion) {
        setCommentError('Campo de comentario obligatorio');
        return;
      }
  
      if (!newComment.calificacion) {
        setCommentError('Campo de calificación obligatorio');
        return;
      }
  
      if (newComment.descripcion.length < 10 || newComment.descripcion.length > 100) {
        setCommentError('El comentario debe tener entre 10 y 100 caracteres.');
        return;
      }
  
      const endpoint = userComment && userComment.id
        ? `${import.meta.env.VITE_API_BASE_URL}/comments-general/${userComment.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/comments-general`;
  
      const method = userComment && userComment.id ? 'PUT' : 'POST';
  
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.authToken}`,
        },
        body: JSON.stringify({
          descripcion: newComment.descripcion,
          calificacion: newComment.calificacion,
          user_id: userId,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        if (userComment && userComment.id) {
          const updatedComments = comments.map((comment) =>
            comment.id === userComment.id ? { ...comment, descripcion: newComment.descripcion } : comment
          );
  
          setComments(updatedComments);
  
          const updatedUserComment = updatedComments.find((comment) => comment.id === userComment.id);
          setUserComment(updatedUserComment);
  
          setNewComment({ descripcion: '', calificacion: 0 });
          setCommentError('');
  
          await setReloadComments((prev) => !prev);
  
          Swal.fire({
            icon: 'success',
            title: 'Comentario actualizado exitosamente',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          setComments([...comments, data.result]);
          setNewComment({ descripcion: '', calificacion: 0 });
          setCommentError('');
  
          await setReloadComments((prev) => !prev);
          
          Swal.fire({
            icon: 'success',
            title: 'Comentario creado exitosamente',
            showConfirmButton: false,
            timer: 1500,
          });
          window.location.reload();
        }
      } else {
        const errorData = await response.json();
        if (response.status === 406) {
          Swal.fire({
              icon: 'error',
              title: 'No puedes comentar',
              text: 'Necesitas esperar a que tu compra esté finalizada o comprar algo.',
          });   
          }else{
        Swal.fire({
          icon: 'error',
          title: 'Error al realizar la solicitud',
          text: 'Hubo un problema al procesar el comentario. Por favor, inténtalo de nuevo.',
        });
        console.error('Error al realizar la solicitud:', errorData);
      }
      }
    } catch (error) {
      console.error('Error al procesar el comentario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al procesar comentario',
        text: 'Hubo un problema al procesar el comentario. Por favor, inténtalo de nuevo.',
      });
    }
  };
  
  

  return (
    <div>
      <header className="sticky top-0 z-50">
        <Navbar2 className="mt-auto"/>
      </header>
      <h2 className="text-center mt-10" id="comentarios">
        Comentarios
      </h2>
      <div style={styles.card}>
        <div style={styles.cardContent}>
          <h5>Agregar Comentario:</h5>
          <StarRatingGener2
            rating={newComment.calificacion}
            onRatingChange={(rating) => setNewComment({ ...newComment, calificacion: rating })}
            size="40px"
          />
          <textarea
            placeholder="Escribe tu comentario..."
            value={newComment.descripcion}
            onChange={(e) => setNewComment({ ...newComment, descripcion: e.target.value })}
            className="form-control mt-2"
            style={{ height: '50px', width: '300px' }}
          ></textarea>
          <div>
            {commentError && <p style={{ color: 'red', marginTop: '10px' }}>{commentError}</p>}
            <small>{newComment.descripcion.length}/100 caracteres</small>
          </div>
          <div>
            {showMessage && (
              <p style={{ color: 'red', marginTop: '10px' }}>
                Ya has comentado en este producto. Puedes actualizar tu comentario.
              </p>
            )}
          </div>
          <button onClick={handleCreateOrUpdateComment} className="btn btn-primary mt-2">
          {userComment && userComment.id ? 'Actualizar Comentario' : 'Crear Comentario'}
        </button>
        </div>
      </div>
      <div style={styles.controls}>
        <button onClick={() => handleScroll('right')}>
          <BsArrowLeft />
        </button>
        <button onClick={() => handleScroll('left')}>
          <BsArrowRight />
        </button>
      </div>
      <div style={{ ...styles.commentsContainer, marginLeft: scrollPosition + 'px' }} className="comments-scroll">
        {comments && comments.map((comment) => (
          <div key={comment.id} style={styles.commentCard}>
         {comment && comment.calificacion && <StarRatingGener2 rating={comment.calificacion} />}
            <div style={styles.userInfo}>
            <b><small>{comment.user_id && comment.user_id.nombre && comment.user_id.apellido && `${comment.user_id.nombre} ${comment.user_id.apellido}`}</small></b>
              <IoCheckmarkCircle style={styles.checkIcon} />
            </div>
            <p>{comment.descripcion.replace(/(.{30})/g, "$1\n")}</p>
            {comment.user_id?.id === localStorage.getItem('id')}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '20px',
    padding: '20px',
    margin: '20px',
  },
  cardContent: {
    marginTop: '20px',
  },
  commentsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center', 
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
  controls: {
    display: 'flex',
    marginLeft: 'auto',
    alignItems: 'center',
    marginTop: '10px',
    marginBottom:"10px"
  },
};
