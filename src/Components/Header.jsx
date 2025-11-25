import React from "react";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, Image, Spin } from "antd";
import dayjs from "dayjs";
import { CiCalendar } from "react-icons/ci";

function Header() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    getValues,
  } = useForm();

  return (
    <div className="w-full bg-secondary rounded-[10px] flex flex-row justify-between p-4 items-center">
      <div className="flex flex-row gap-4 items-center ">
        <img src="/unilever.svg" alt="" className="w-[70px] h-[70px]" />
        <div className="w-[2px] h-[4vh] bg-white text-white"></div>
        <p className="text-3xl text-white font-[600]">LIVE EGA DASHBOARD</p>
      </div>
      <div className="flex flex-col gap-1">
        {/* <label className="text-[1rem] font-[400] text-[#090C13] capitalize">
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
                className="basis-[23%] w-full custom-date-picker"
                suffixIcon={<div></div>}
                style={{
                  padding: "14px 14px",
                  backgroundColor: "#5794F1",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  marginTop: "4px",
                  fontSize: "1.5rem",
                  fontWeight: "500",
                  textAlign: "center",
                }}
                format="DD-MM-YYYY"
                onChange={(date, dateString) => onChange(dateString)}
              />

              <CiCalendar
                color="#1016D1"
                fontSize={"2.5vmin"}
                className="absolute right-[2.5%] top-[35%]"
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
