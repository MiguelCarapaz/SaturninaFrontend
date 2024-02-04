import React, { useState, useEffect } from 'react';
import StarRatingGener from './StarRatingGener';
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

export function Comments() {
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
  

  return (
    <div className='flex flex-col items-center justify-center'>
      <h2 className="text-center mt-10" id="comentarios">Comentarios</h2>
      <div style={styles.controls}>
        <button onClick={() => handleScroll('right')}><BsArrowLeft /></button>
        <button onClick={() => handleScroll('left')}><BsArrowRight /></button>
      </div>
      <div style={{ ...styles.commentsContainer, marginLeft: scrollPosition + 'px' }} className="comments-scroll">
        {comments.map(comment => (
          <div key={comment.id} style={styles.commentCard}>
            <StarRatingGener rating={comment.calificacion} />
            <div style={styles.userInfo}>
              <b>{comment.user_id.nombre} {comment.user_id.apellido}</b> 
              <IoCheckmarkCircle style={styles.checkIcon} />
            </div>
            <p>{comment.descripcion.replace(/(.{30})/g, "$1\n")}</p>
          </div>
        ))}
      </div>
    </div>
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
  controls: {
    display: 'flex',
    marginLeft:'auto', 
    alignItems: 'center',
    marginTop: '10px',
  },
  slidersIcon: {
    fontSize: '34px',
    marginRight: 'auto',
  },
};
