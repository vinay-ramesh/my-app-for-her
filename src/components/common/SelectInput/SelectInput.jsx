import React, { memo } from 'react';
import Select from 'react-select';
import './selectInput.css';

const SelectInput = (props, ...rest) => {
  const {
    name,
    options,
    label,
    isrequired,
    isMulti,
    handleChange,
    value,
    menuPlacement,
    placeholder,
    fields,
    isDisabled,
    isSearchable,
    isClearable,
    onFocus,
    error,
    errorText,
  } = props;

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: 35,
    }),
    placeholder: (defaultStyles) => ({
      ...defaultStyles,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: '#000',
    }),
    option: (label) => ({
      ...label,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
  };

  return (
    <div>
      <label htmlFor={name} className="selectlabel">
        {label}
        {isrequired ? <span className="asterik">*</span> : null}
      </label>

      <div id="selectcontainer">
        <Select
          className="basic-single"
          classNamePrefix="select-input"
          options={options}
          isMulti={isMulti}
          onChange={(e) => handleChange(e)}
          value={value}
          menuPlacement={menuPlacement ? menuPlacement : 'auto'}
          placeholder={placeholder}
          {...rest}
          {...fields}
          isDisabled={isDisabled}
          isSearchable={isSearchable}
          isClearable={isClearable}
          styles={customStyles}
          maxMenuHeight={170}
          onFocus={onFocus}
        />
      </div>
      {error ? <div className="errormessage">{errorText}</div> : null}
    </div>
  );
};

export default memo(SelectInput);
