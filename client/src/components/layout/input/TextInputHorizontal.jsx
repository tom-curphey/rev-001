import React from 'react';
import PropTypes from 'prop-types';

const TextInputHorizontal = ({
  name,
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  onBlur,
  disabled,
  id,
  style,
  labelClass,
  inputClass
}) => {
  return (
    <label
      htmlFor={name}
      className={`textInputHorizontal ${labelClass}`}
    >
      <span className="label">{label} </span>
      <input
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        id={id}
        style={style}
        className={`${inputClass}`}
      />
      <span className="message">
        {info && <small>{info}</small>}
        {error && <span className="errorMsg">{error}</span>}
      </span>
    </label>
  );
};

TextInputHorizontal.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string,
  style: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string
};

TextInputHorizontal.defaultProps = {
  type: 'text'
};

export default TextInputHorizontal;
