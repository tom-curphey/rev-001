import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({
  name,
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  disabled,
  id,
  style,
  autoFocus,
  inputClass
}) => {
  return (
    <label htmlFor={name} className="textInput">
      {label}{' '}
      <input
        onChange={onChange}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        id={id}
        style={style}
        autoFocus={autoFocus && autoFocus}
        className={`${inputClass}`}
      />
      {info && <small>{info}</small>}
      {error && <span className="errorMsg">{error}</span>}
    </label>
  );
};

TextInput.propTypes = {
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

TextInput.defaultProps = {
  type: 'text'
};

export default TextInput;
