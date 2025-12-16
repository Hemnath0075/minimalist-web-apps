import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, Image, Spin } from "antd";
import dayjs from "dayjs";
import { CiCalendar } from "react-icons/ci";
import Select, { components } from "react-select";
import { GoDash } from "react-icons/go";

const { RangePicker } = DatePicker;

const InputOption = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  // styles
  let bg = "#ffffff";
  if (isFocused) bg = "#e7e9eb";
  if (isActive) bg = "#ffffff";

  const style = {
    alignItems: "center",
    backgroundColor: bg,
    color: "inherit",
    display: "flex ",
  };

  // prop assignment
  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style,
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
      className="flex flex-row gap-4 border-filter text-white"
    >
      <input type="checkbox" checked={isSelected} />
      {children}
    </components.Option>
  );
};

const MultiValue = ({ getValue, index, item, ...props }) => {
  console.log(item);
  return !index && `${item} (${getValue().length})`;
};

function FourthHeader({ selectedDate, onRangeChange }) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      selectedDate, // <-- prefill the form with parent value
    },
  });

  const [dateRange, setDateRange] = useState([]);

  function handleRangeChange(date) {
  if (!date) return;

  const start = date.startOf("day").unix();
  const end = date.endOf("day").unix();

  onRangeChange({ start, end });
}


  return (
    <div className="header-main w-full bg-secondary rounded-[10px] flex flex-row justify-between px-6 py-2 items-center">
      <div className="flex flex-row gap-4 items-center">
        <img
          src="/unilever.svg"
          alt=""
          className="header-logo w-[40px] h-[40px]"
        />

        <div className="header-divider w-[2px] h-[40px] bg-white"></div>
        <p className="text-xxl-responsive text-white font-[600]">
          Batch Analytics
        </p>
      </div>
      <div className="flex flex-row justify-center items-center text-white gap-3">
        <div className="basis-[100%]">
          <DatePicker
            
            className="relative"
            
            suffixIcon={<div></div>}
            style={{
              padding: "4% 2%",
              backgroundColor: "#000E38",
              marginTop: "8px",
              fontSize: "2rem",
              fontWeight: "400",
              textAlign: "center",
              borderRadius: "10px",
              borderColor: "#083283"
            }}
            format="DD-MM-YYYY"
            onChange={handleRangeChange}
          />
          <CiCalendar
            color="#ffffff"
            fontSize={"2.5vmin"}
            className="absolute right-[2.5%] top-[25px]"
          />
        </div>
      </div>
    </div>
  );
}

export default FourthHeader;
