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
  onBlur,
  disabled,
  id,
  style,
  autoFocus,
  inputClass,
  data,
  onKeyDown
}) => {
  return (
    <label htmlFor={name} className="textInput">
      <span>{label}</span>
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
        autoFocus={autoFocus && autoFocus}
        className={`${inputClass}`}
        data={data}
        onKeyDown={onKeyDown}
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
