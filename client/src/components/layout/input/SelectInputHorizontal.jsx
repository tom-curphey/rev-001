import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { capitalizeFirstLetter } from '../../../utils/utils';

const SelectInputHorizontal = ({
  options,
  getSelectedValue,
  placeholder,
  className,
  error,
  labelClass,
  label,
  info,
  name,
  value
}) => {
  const handleChange = (newValue, actionMeta) => {
    if (newValue) {
      console.log('newValue: ', newValue);

      // Pass the selected value to the parent component
      getSelectedValue(newValue);
    }
  };

  let selectedValue;
  if (value) {
    let label = capitalizeFirstLetter(value);
    selectedValue = { value: value, label: label };
  }

  // What to do when input is being typed
  // const handleInputChange = (inputValue, actionMeta) => {
  //   console.log('Input Changed..');
  // };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: 'none',
      color: state.isSelected ? '#000' : '#343434',
      padding: 12
    }),
    control: (base, state) => ({
      ...base,
      color: '#000',
      boxShadow: state.isFocused ? 0 : 0,
      borderColor: '#cdc0b2',
      '&:hover': {
        borderColor: '#cdc0b2'
      }
    })
  };

  return (
    <label
      htmlFor={name}
      className={`textInputHorizontal ${labelClass}`}
    >
      <span className="label">{label} </span>
      <Select
        name={name}
        // isClearable
        placeholder={placeholder}
        onChange={handleChange}
        options={options}
        className={className}
        styles={customStyles}
        value={selectedValue}
        theme={theme => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary25: '#f1ede7',
            primary: '#e8e1d7'
          }
        })}
      />
      {error && <span className="errorMsg">{error}</span>}
      <span className="message">
        {info && <small>{info}</small>}
        {error && <span className="errorMsg">{error}</span>}
      </span>
    </label>
  );
};

SelectInputHorizontal.propTypes = {
  options: PropTypes.array.isRequired,
  getSelectedValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired
};

export default SelectInputHorizontal;
