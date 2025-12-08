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

function FifthHeader({ selectedDate, onDateChange }) {
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

  async function handleRangeChange(dates) {
    // dates is an array [startDate, endDate] or an empty array if cleared
    const startOfDay = dates[0].startOf("day");
    const endOfDay = dates[1].endOf("day");
    const timestamps = [startOfDay.unix() * 1000, endOfDay.unix() * 1000];
    console.log(timestamps);
    setDateRange([startOfDay, endOfDay]);
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
          Minimalist Control Tower
        </p>
      </div>
      <div className="flex flex-row justify-center items-center text-white gap-3">
        <div className="flex flex-col mt-2 basis-[35%]">
          <Select
            className="text-md-responsive"
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            // placeholder={item}
            styles={{
              control: (base, state) => ({
                ...base,
                padding: "3px 5px",
                fontSize: "1rem",
                borderColor: state.isFocused ? "#083283" : "#083283",
                boxShadow: state.isFocused ? "0 0 0 1px #083283" : "none",
                borderRadius: "10px",
                backgroundColor: "#000e38",
                ":hover": {
                  borderColor: "#083283",
                },
                ":focus": {
                  borderColor: "#083283",
                },
              }),
            }}
            options={[
              { label: "Shift A", value: "Shift A" },
              { label: "Shift B", value: "Shift B" },
              { label: "Shift C", value: "Shift C" },
            ]}
            // value={filteredParameters["item"]}
            // onChange={(selectedOption) =>
            //   handleSelectChange(selectedOption, item)
            // }
          />
        </div>
        <div className="flex flex-col mt-2 basis-[35%]">
          <Select
            // key={index}
            // components={{
            //   Option: InputOption,
            //   MultiValue: ({ data, ...props }) => (
            //     <MultiValue item={item} {...props} />
            //   ),
            // }}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            // placeholder={item}
            styles={{
              control: (base, state) => ({
                ...base,
                padding: "3px 5px",
                fontSize: "1rem",
                borderColor: state.isFocused ? "#083283" : "#083283",
                boxShadow: state.isFocused ? "0 0 0 1px #083283" : "none",
                borderRadius: "10px",
                backgroundColor: "#000e38",
                ":hover": {
                  borderColor: "#083283",
                },
                ":focus": {
                  borderColor: "#083283",
                },
              }),
              option: (styles, { isDisabled, isFocused }) => {
                return {
                  ...styles,
                  backgroundColor: isFocused ? "#ffffff" : "transparent",
                  color: "black",
                  cursor: isDisabled ? "not-allowed" : "default",
                };
              },
            }}
            options={[
              { label: "Lotus", value: "lotus" },
              { label: "Lotus", value: "lotus" },
            ]}
            // value={filteredParameters["item"]}
            // onChange={(selectedOption) =>
            //   handleSelectChange(selectedOption, item)
            // }
          />
        </div>
        <div className="basis-[60%]">
          <RangePicker
            defaultValue={
              dateRange.length > 0
                ? [
                    dayjs(dateRange[0], "DD/MM/YYYY"),
                    dayjs(dateRange[1], "DD/MM/YYYY"),
                  ]
                : null
            }
            className="relative"
            separator={
              <GoDash
                color="#ffffff"
                fontSize={"2.5vmin"}
                className="absolute left-[38%] bottom-[8px]"
              />
            }
            suffixIcon={<div></div>}
            style={{
              padding: "3% 2%",
              backgroundColor: "#000E38",
              marginTop: "8px",
              fontSize: "2rem",
              fontWeight: "400",
              textAlign: "center",
              borderRadius: "10px",
              borderColor: "#083283",
            }}
            format="DD-MM-YYYY"
            onChange={handleRangeChange}
          />
          <CiCalendar
            color="#ffffff"
            fontSize={"2.5vmin"}
            className="absolute right-[2.5%] top-[30px]"
          />
        </div>
      </div>
    </div>
  );
}

export default FifthHeader;
