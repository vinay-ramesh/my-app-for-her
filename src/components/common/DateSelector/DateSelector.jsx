import React, { useState, useEffect, useRef, useContext } from 'react';
import SelectInput from '../SelectInput/SelectInput';
import moment from 'moment';
import { sideBarLayout } from '../../layout/layout';
import CalenderPicker from '../Calender/CalenderPicker';
import Select from 'react-select';

const DateSelector = React.memo(({ mode, setMode, selectedDate, setSelectedValues, handleChange, academic_period_id }) => {
  const contextValues = useContext(sideBarLayout);
  const academicPeriods = contextValues?.academicPeriodList;

  const [showMonth, setShowMonth] = useState(false);
  const monthPickerRef = useRef(null);

  // Handle outside click to close the month picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (monthPickerRef.current && !monthPickerRef.current.contains(event.target)) {
        setShowMonth(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function getMinMaxDates(academicPeriods) {
    if (!academicPeriods || academicPeriods.length === 0) return null;
    return academicPeriods.reduce(
      (acc, period) => {
        const startDate = new Date(period.start_date);
        const endDate = new Date(period.end_date);
        acc.minDate = startDate < acc.minDate ? startDate : acc.minDate;
        acc.maxDate = endDate > acc.maxDate ? endDate : acc.maxDate;
        return acc;
      },
      { minDate: new Date(academicPeriods[0].start_date), maxDate: new Date(academicPeriods[0].end_date) },
    );
  }

  const minMaxDate = getMinMaxDates(academicPeriods);
  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: 35,
    }),

    singleValue: (defaultStyles) => ({
      ...defaultStyles,
      whiteSpace: 'normal',
      color: '#000',
    }),
  };

  // Render SelectInput component for year selection
  const renderSelectInput = () => (
    <div className="mr-2 ">
      <Select
        className="react-select-container"
        styles={customStyles}
        options={
          academicPeriods?.map((i) => ({
            label: i?.academic_period_name,
            value: i?.academic_period_id,
            startDate: i?.start_date,
          })) || []
        }
        placeholder="All Academic Periods"
        name="academicPeriod"
        onChange={(e) => {
          setSelectedValues(e?.value || e);
          handleChange(moment(e?.startDate || e).format('YYYY-MM-DD'));
        }}
        value={academicPeriods
          ?.map((i) => ({
            label: i?.academic_period_name,
            value: i.academic_period_id,
          }))
          ?.filter((i) => i?.value === academic_period_id)}
        isSearchable={false}
      />
    </div>
  );

  // Render mode selection buttons (Day, Month, Year)
  const renderModeButtons = () => (
    <div className="flex w-auto">
      {['D', 'M', 'Y'].map((label, index) => {
        const isActive = label === mode;
        return (
          <button
            key={label}
            className={`px-4 py-2 border ${index === 0 ? 'rounded-l-lg' : ''} ${
              index === 2 ? 'rounded-r-lg' : ''
            } text-sm sm:text-xs md:text-md lg:text-md xl:text-lg 2xl:text-lg text-center`}
            style={{ backgroundColor: isActive ? '#e7e7e7' : '', color: '#000' }}
            onClick={() => {
              setMode(label);
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="z-[10] w-fit sm:flex-col-reverse sm:flex-grow sm:gap-2 flex items-center justify-end relative  p-3 rounded-lg">
      {mode === 'D' || mode === 'M' ? (
        <CalenderPicker
          mode={mode}
          selectedDate={selectedDate}
          handleChange={(e) => handleChange(moment(e).format('YYYY-MM-DD'))}
          minDate={minMaxDate?.minDate || 0}
          maxDate={minMaxDate?.maxDate || 0}
          handleShow={(e) => setShowMonth(e)}
          show={showMonth}
        />
      ) : (
        renderSelectInput()
      )}
      {renderModeButtons()}
    </div>
  );
});

export default DateSelector;
