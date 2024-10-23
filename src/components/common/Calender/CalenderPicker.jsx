import React, { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import ImageAssets from '../../../assets/imageAsset';
import './Calender.css';

const CalenderPicker = ({ mode, selectedDate, handleChange, show, handleShow, minDate, maxDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef(null); // To reference the calendar container

  // Close the calendar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [calendarRef]);
  useEffect(() => {
    if ((show && mode === 'M') || (show && mode === 'D')) {
      setIsOpen(true);
    }
  }, [mode]);

  const handleOpen = (open) => {
    if (mode === 'D') {
      setIsOpen(open);
      handleShow(open);
    } else {
      setIsOpen(open);
    }
  };

  return (
    <div className="relative flex items-center " ref={calendarRef}>
      <img src={ImageAssets.calendar} alt="calendar Icon" className="absolute left-3" />

      <input
        type="text"
        className="text-center border border-gray-300 rounded-lg mr-3 cursor-pointer sm:w-full"
        placeholder="Select Date"
        value={mode === 'M' ? moment(selectedDate).format('MMM YYYY') : moment(selectedDate).format('DD MMM YYYY')}
        onFocus={() => {
          handleOpen(true);
        }}
        readOnly
      />

      {isOpen && (
        <Calendar
          className="calenderstyle"
          value={new Date(moment(selectedDate).format('YYYY/MM/DD'))}
          onChange={(e) => {
            handleChange(e);
            handleOpen(false);
          }}
          defaultView="month"
          minDetail={mode === 'D' ? 'decade' : 'year'}
          maxDetail={mode === 'D' ? 'month' : 'year'}
          minDate={new Date(minDate)}
          maxDate={new Date(maxDate)}
          next2Label={null}
          prev2Label={null}
          formatMonthYear={(locale, date) => date.toLocaleString(locale, { month: 'short', year: 'numeric' })}
          formatMonth={(locale, date) => date.toLocaleString(locale, { month: 'short' })}
          formatShortWeekday={(locale, date) => ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][date.getDay()]}
          prevLabel={<img className="rotate-180 mx-auto" src={ImageAssets?.Arrow_Right} alt="" />}
          nextLabel={<img className="mx-auto" src={ImageAssets?.Arrow_Right} alt="" />}
        />
      )}
    </div>
  );
};

export default CalenderPicker;
