import React from 'react';
import PropTypes from 'prop-types';

const ToggleInputHorizontal = ({
  name,
  checked,
  label,
  onChange,
  labelClass,
  toggleOn
}) => {
  return (
    <div className={`toggleInputHorizontal`}>
      <div className="inputTitle">{label}</div>
      <div className="toggle">
        <label className="switch">
          <input
            type="checkbox"
            checked={checked}
            name={name}
            id="togBtn"
            onChange={onChange}
          />
          <div className="slider round">
            <span className="on">{toggleOn}</span>
            <span className="off">OFF</span>
          </div>
        </label>
      </div>
    </div>
  );
};

ToggleInputHorizontal.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default ToggleInputHorizontal;
