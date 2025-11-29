import React from "react";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, Image, Spin } from "antd";
import dayjs from "dayjs";
import { CiCalendar } from "react-icons/ci";

function Header({ selectedDate,onDateChange }) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    getValues,
  } = useForm({
  defaultValues: {
    selectedDate,  // <-- prefill the form with parent value
  },
});

  return (
    <div className="header-main w-full bg-secondary rounded-[10px] flex flex-row justify-between px-6 py-2 items-center">
      <div className="flex flex-row gap-4 items-center">
        <img src="/unilever.svg" alt="" className="header-logo" />

        <div className="header-divider w-[2px] h-[40px] bg-white"></div>
        <p className="header-title text-white font-[600]">
          Real Time Production Counter
        </p>
      </div>
      <div className="flex flex-row justify-center items-center text-white gap-1">
        {/* <label className="text-[1rem] text-whit font-[400] text-[#090C13] capitalize">
          Select Date{" "}
        </label> */}
        <Controller
          name="selectedDate"
          
          control={control} // comes from useForm()
          rules={{ required: "Please select a date" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div className="relative">
              <DatePicker
                value={value ? dayjs(value, "DD-MM-YYYY") : null}
                className="basis-[15%] w-full custom-date-picker"
                suffixIcon={<div></div>}
                style={{
                  padding: "8px 14px",
                  backgroundColor: "#001E7A",
                  color: "white",
                  border: "1px solid #0031A2",
                  borderRadius: "8px",
                  marginTop: "4px",
                  fontSize: "1rem",
                  fontWeight: "400",
                  textAlign: "center",
                }}
                format="DD-MM-YYYY"
                onChange={(date, dateString) => {
                  onChange(dateString);
                  onDateChange(dateString); // <-- SEND DATE TO HOME
                }}
              />

              <CiCalendar
  color="#ffffff"
  className="header-calendar-icon absolute"
/>

              {error && (
                <p className="text-red-500 text-sm mt-1">{error.message}</p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default Header;
