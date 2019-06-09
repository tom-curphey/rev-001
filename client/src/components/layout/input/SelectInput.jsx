import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

const SelectInput = ({
  options,
  getSelectedValue,
  placeholder,
  className
}) => {
  const handleChange = (newValue, actionMeta) => {
    if (newValue) {
      // Pass the selected value to the parent component
      getSelectedValue(newValue);
    }
  };

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
    <Select
      isClearable
      placeholder={placeholder}
      onChange={handleChange}
      options={options}
      className={className}
      styles={customStyles}
      theme={theme => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: '#f1ede7',
          primary: '#e8e1d7'
        }
      })}
    />
  );
};

SelectInput.propTypes = {
  options: PropTypes.array.isRequired,
  getSelectedValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired
};

export default SelectInput;
