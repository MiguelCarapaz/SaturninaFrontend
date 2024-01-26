import React from 'react';

const StarRatingGener = ({ rating, totalStars = 5, starSize = '24px', filledColor = 'gold', emptyColor = 'lightgray' }) => {
  const filledStars = Array.from({ length: Math.floor(rating) }, (_, index) => (
    <span key={index} className="star filled-star" style={{ fontSize: starSize, color: filledColor }}>
      ★
    </span>
  ));

  const emptyStars = Array.from({ length: Math.floor(totalStars - rating) }, (_, index) => (
    <span key={index} className="star" style={{ fontSize: starSize, color: emptyColor }}>
      ☆
    </span>
  ));

  return (
    <div className="star-rating">
      {filledStars}
      {emptyStars}
    </div>
  );
};

export default StarRatingGener;
