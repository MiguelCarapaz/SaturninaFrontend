import React, { useState } from 'react';

const StarRatingGener2 = ({ rating, onRatingChange, isEditable = true, totalStars = 5, starSize = '24px', filledColor = 'gold', emptyColor = 'lightgray' }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (selectedRating) => {
    onRatingChange(selectedRating);
  };

  const handleMouseEnter = (selectedRating) => {
    setHoverRating(selectedRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const renderStar = (starValue) => {
    const isFilled = hoverRating >= starValue || rating >= starValue;

    return (
      <span
        key={starValue}
        style={{ cursor: isEditable ? 'pointer' : 'default', fontSize: starSize, color: isFilled ? filledColor : emptyColor }}
        onClick={isEditable ? () => handleClick(starValue) : undefined}
        onMouseEnter={isEditable ? () => handleMouseEnter(starValue) : undefined}
        onMouseLeave={isEditable ? handleMouseLeave : undefined}
      >
        {isFilled ? '★' : '☆'}
      </span>
    );
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((starValue) => renderStar(starValue))}
    </div>
  );
};

export default StarRatingGener2;
