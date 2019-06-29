import React from 'react';
import PropTypes from 'prop-types';

const ToggleHorizontal = ({
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
        <label className="switch" onChange={onChange}>
          <input
            type="checkbox"
            checked={checked}
            name={name}
            id="togBtn"
          />
          <div class="slider round">
            <span class="on">{toggleOn}</span>
            <span class="off">OFF</span>
          </div>
        </label>
      </div>
    </div>

    // <div className={`toggleInputHorizontal`}>
    //   <div className="inputTitle">{label}</div>
    //   <div className="toggle">
    //     <label className="switch" onChange={onChange}>
    //       <input
    //         type="checkbox"
    //         checked={checked}
    //         name={name}
    //         id="togBtn"
    //       />
    //       <div className="slider round" />
    //     </label>
    //   </div>
    // </div>
  );
};

ToggleHorizontal.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default ToggleHorizontal;
