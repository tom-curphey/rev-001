import React from 'react';

const Button = ({ buttonTitle, buttonColour, onClick }) => {
  return (
    <div onClick={onClick} className={`btn btn-${buttonColour}`}>
      <span>{buttonTitle}</span>
    </div>
  );
};

export default Button;
