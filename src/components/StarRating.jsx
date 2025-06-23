import React from 'react';
import ReactStars from 'react-stars';

const StarRating = ({ value, onChange, edit = true }) => {
  return (
    <ReactStars
      count={5}
      value={value}
      size={24}
      color2={'#ffd700'}
      half={false}
      edit={edit}
      onChange={onChange}
    />
  );
};

export default StarRating;
