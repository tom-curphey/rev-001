import React from 'react';

const Button = ({ buttonTitle, buttonColour }) => {
  return (
    <div className={`btn btn-${buttonColour}`}>
      <span>{buttonTitle}</span>
    </div>
  );
};

export default Button;
