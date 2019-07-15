import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { isEmpty } from '../../../utils/utils';

// ============================
//
// -> This select has no border and streches width 100%
//
// ============================

const SelectInput = ({
  options,
  getSelectedValue,
  placeholder,
  className,
  error,
  name,
  value,
  data
}) => {
  const handleChange = (newValue, actionMeta) => {
    if (newValue) {
      // Pass the selected value to the parent component
      getSelectedValue(newValue, data);
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
      padding: 12,
      fontSize: '14px'
    }),
    control: (base, state) => ({
      ...base,
      fontSize: '14px',
      // color: state.isSelected ? 'red' : '#343434',
      boxShadow: state.isFocused ? 0 : 0,
      // borderColor: '#cdc0b2',
      borderColor: '#fff',
      '&:hover': {
        backgroundColor: '#f1ede7'
        // borderColor: '#fff'
      }
    })
  };

  return (
    <div>
      <Select
        // isClearable
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        options={options}
        className={`selectInput ${className}`}
        value={selectedValue}
        styles={customStyles}
        theme={theme => ({
          ...theme,
          colors: {
            ...theme.colors,
            neutral80: '#9d9584',
            primary25: '#f1ede7',
            primary: '#e8e1d7'
          }
        })}
      />
      {error && <span className="errorMsg">{error}</span>}
    </div>
  );
};

SelectInput.propTypes = {
  options: PropTypes.array.isRequired,
  getSelectedValue: PropTypes.func.isRequired
  // placeholder: PropTypes.string.isRequired,
  // className: PropTypes.string.isRequired
};

export default SelectInput;
