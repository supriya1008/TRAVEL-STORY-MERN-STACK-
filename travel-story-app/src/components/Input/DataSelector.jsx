import React, { useState } from "react";
import { MdOutlineDateRange, MdClose } from "react-icons/md";
import moment from "moment";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const DateSelector = ({ date, setDate, setOpenDatePicker }) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // Renamed state variables

  return (
    <div className="relative">
      {/* Main button to open the date picker */}
      <button
        className="inline-flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/70 rounded px-2 py-1 cursor-pointer"
        onClick={() => setIsDatePickerOpen(true)}
      >
        <MdOutlineDateRange className="text-lg" />
        {date ? moment(date).format("Do MMM YYYY") : moment().format("Do MMM YYYY")}
      </button>

      {/* Conditional rendering for the date picker */}
      {isDatePickerOpen && (
        <div className="absolute top-10 left-0 z-10 bg-white shadow-lg p-4 rounded-lg">
          <div className="flex justify-end">
            <button
              className="text-sky-600 hover:text-red-500"
              onClick={() => setIsDatePickerOpen(false)}
            >
              <MdClose className="text-xl" />
            </button>
          </div>
          <DayPicker
            captionLayout="dropdown-buttons"
            mode="single"
            selected={date}
            onSelect={setDate}
            pagedNavigation
          />
        </div>
      )}
    </div>
  );
};

export default DateSelector;
