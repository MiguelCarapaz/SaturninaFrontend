import React from 'react';

const StarRating2 = ({ rating, starSize = '24px', filledColor = 'gold', emptyColor = 'lightgray', clickable = false, onRatingChange }) => {
  const handleStarClick = (clickedRating) => {
    if (clickable) {
      onRatingChange(clickedRating);
    }
  };

  const filledStars = Array.from({ length: rating }, (_, index) => (
    <span
      key={index}
      className={`star filled-star${clickable ? ' clickable' : ''}`}
      style={{ fontSize: starSize, color: filledColor }}
      onClick={() => handleStarClick(index + 1)}
    >
      ★
    </span>
  ));

  const emptyStars = Array.from({ length: 5 - rating }, (_, index) => (
    <span
      key={index + rating}
      className={`star${clickable ? ' clickable' : ''}`}
      style={{ fontSize: starSize, color: emptyColor }}
      onClick={() => handleStarClick(rating + 1 + index)}
    >
      ☆
    </span>
  ));

  return (
    <div className={`star-rating${clickable ? ' clickable' : ''}`}>
      {filledStars}
      {emptyStars}
    </div>
  );
};

export default StarRating2;
