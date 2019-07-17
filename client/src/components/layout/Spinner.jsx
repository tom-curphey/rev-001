import React from 'react';
import spinner from '../../images/spinner.gif';

const Spinner = ({ width }) => {
  if (!width) {
    width = '30px';
  }

  return (
    <div>
      <img
        src={spinner}
        alt="Loading..."
        style={{ width: width, margin: 'auto', display: 'block' }}
      />
    </div>
  );
};

export default Spinner;
