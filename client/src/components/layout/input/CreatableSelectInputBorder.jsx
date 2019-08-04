import React from 'react';
import CreatableSelect from 'react-select/creatable';
import PropTypes from 'prop-types';
import { isEmpty } from '../../../utils/utils';

// ============================
//
// -> This select has a border and streches width 100%
//
// ============================

const CreatableSelectInputBorder = ({
  options,
  getSelectedValue,
  placeholder,
  className,
  error,
  name,
  value,
  label,
  createLabel,
  largeSelect,
  data,
  onBlur
}) => {
  const handleChange = (newValue, actionMeta) => {
    if (newValue) {
      // Pass the selected value to the parent component
      getSelectedValue(newValue, data);
    }
  };

  let selectedValue;
  if (value) {
    // console.log('VALUE', value);

    let selectedOption;
    if (options) {
      selectedOption = options.filter(option => {
        return option.value === value;
      });
    }

    if (isEmpty(selectedOption)) {
      selectedValue = value;
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
      color: state.isSelected
        ? '#000'
        : `${state.data.__isNew__ ? '#e77d01' : '#9d9584 '}`,
      // color: state.data.__isNew__ && '#343434',
      // backgroundColor: state.data.__isNew__ && '#f1ede7',
      padding: 12,
      fontWeight: 400,
      fontSize: '16px',
      '&:hover': {
        color: '#343434',
        cursor: 'pointer'
      },
      '&:active': {
        backgroundColor: '#f1ede7',
        cursor: 'pointer'
      }
    }),
    control: (base, state) => ({
      ...base,
      height: largeSelect ? '60px' : '38px',
      fontSize: largeSelect ? '19px' : '16px',
      backgroundColor: largeSelect ? '#fbf6ee' : '',
      // fontSize: '16px',
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
    <div className="createtableSelectInputBox">
      {label && <span>{label}</span>}
      <CreatableSelect
        // isClearable
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={onBlur}
        options={options && options}
        className={`borderSelectInput ${className}`}
        value={selectedValue}
        styles={customStyles}
        formatCreateLabel={userInput =>
          `${createLabel} "${userInput}"`
        }
        theme={theme => ({
          ...theme,
          colors: {
            ...theme.colors,
            neutral80: '#343434', //'#666',
            primary25: '#f1ede7',
            primary: '#e8e1d7'
          }
        })}
      />
      {error && <span className="errorMsg">{error}</span>}
    </div>
  );
};

CreatableSelectInputBorder.propTypes = {
  options: PropTypes.array,
  getSelectedValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string
};

export default CreatableSelectInputBorder;
