import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { isEmpty } from '../../../utils/utils';

// ============================
//
// -> This select has a border and streches width 100%
// -> It also has a label that is horizontal to the select field
//
// ============================

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
    let selectedOption = options.filter(option => {
      return option.value === value;
    });

    if (isEmpty(selectedOption)) {
      console.log('Name', name);

      console.log('selectedOption: ', selectedOption);
    } else {
      selectedValue = {
        value: value,
        label: selectedOption[0].label
      };
    }
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
        className={`selectInput ${className}`}
        styles={customStyles}
        value={selectedValue}
        theme={theme => ({
          ...theme,
          colors: {
            ...theme.colors,
            // neutral80: '#9d9584',
            primary25: '#f1ede7',
            primary: '#e8e1d7'
          }
        })}
      />
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
  className: PropTypes.string
};

export default SelectInputHorizontal;
