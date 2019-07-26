import React from 'react';

const Button = ({
  buttonTitle,
  buttonColour,
  onClick,
  buttonClass
}) => {
  return (
    <div
      onClick={onClick}
      className={`btn btn-${buttonColour} ${buttonClass}`}
    >
      <span>{buttonTitle}</span>
    </div>
  );
};

export default Button;
