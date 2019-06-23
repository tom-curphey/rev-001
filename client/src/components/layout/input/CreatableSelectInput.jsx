import React from 'react';
import CreatableSelect from 'react-select/creatable';
import PropTypes from 'prop-types';
import { isEmpty } from '../../../utils/utils';

// ============================
//
// -> This select has a border and streches width 100%
//
// ============================

const CreatableSelectInput = ({
  options,
  getSelectedValue,
  placeholder,
  className,
  error,
  name,
  value
}) => {
  const handleChange = (newValue, actionMeta) => {
    if (newValue) {
      // Pass the selected value to the parent component
      getSelectedValue(newValue, name);
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
      fontSize: '16px'
    }),
    control: (base, state) => ({
      ...base,
      fontSize: '16px',
      // color: state.isSelected ? 'red' : '#343434',
      boxShadow: state.isFocused ? 0 : 0,
      borderColor: '#cdc0b2',
      // borderColor: '#fff',
      '&:hover': {
        // backgroundColor: '#f1ede7',
        borderColor: '#cdc0b2'
      }
    })
  };

  return (
    <div>
      <CreatableSelect
        isClearable
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        options={options}
        className={`sBorderelectInput ${className}`}
        value={selectedValue}
        styles={customStyles}
        theme={theme => ({
          ...theme,
          colors: {
            ...theme.colors,
            neutral80: '#666',
            primary25: '#f1ede7',
            primary: '#e8e1d7'
          }
        })}
      />
      {error && <span className="errorMsg">{error}</span>}
    </div>
  );
};

CreatableSelectInput.propTypes = {
  options: PropTypes.array.isRequired,
  getSelectedValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string
};

export default CreatableSelectInput;
