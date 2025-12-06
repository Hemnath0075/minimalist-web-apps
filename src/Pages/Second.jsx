import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Table } from "antd";
import {
  generateSectionColumns,
  generateRowsWithTotal,
} from "../Config/columns"; //
import { apiService, Endpoint } from "../Services/apiService";

// image imports
import abdosImage from "../Assets/abdos.svg";
import alphaImage from "../Assets/alpha.svg";
import clarionImage from "../Assets/clarion.svg";
import hidustanImage from "../Assets/hindustanfoodslimited.svg";
import Image1 from "../Assets/unit1_image1.png";
import Image2 from "../Assets/unit1_image2.png";

import Image3 from "../Assets/unit2_image1.png";
import Image4 from "../Assets/unit2_image2.png";
import Image5 from "../Assets/unit3_image1.png";
import Image6 from "../Assets/unit3_image2.png";
import Image7 from "../Assets/unit4_image1.png";
import Image8 from "../Assets/unit4_image2.png";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import SecondHeader from "../Components/SecondHeader";
dayjs.extend(isBetween);

const ImageItems = [abdosImage, alphaImage, clarionImage, hidustanImage];

const shiftTimings = {
  1: { start: "00:00", end: "14:00" }, // A
  2: { start: "14:00", end: "22:00" }, // B
  3: { start: "22:00", end: "06:00" }, // C
};

const data = [
  {
    name: "Unit 1: Minimalist",
    primary: "#45061B",
    secondary: "#3A0517",
    shadow: "#F6390040",
    items: [
      {
        line: "Bottle Line 1",
        sku: "Hide Nothing Moisturizer",
        images: [Image1, Image2],
      },
      {
        line: "Bottle Line 2",
        sku: "Hide Nothing Moisturizer",
        images: [Image1, Image2],
      },
      {
        line: "Bottle Line 3",
        sku: "Hide Nothing Moisturizer",
        images: [Image1, Image2],
      },
    ],
  },

  {
    name: "Unit 2: Sunrise",
    primary: "#31094B",
    secondary: "#23003A",
    shadow: "#F6007740",
    items: [
      {
        line: "Bottle Line 1",
        sku: "Hide Nothing Moisturizer",
        images: [Image3, Image4],
      },
      {
        line: "Bottle Line 2",
        sku: "Hide Nothing Moisturizer",
        images: [Image3, Image4],
      },
      {
        line: "Bottle Line 3",
        sku: "Hide Nothing Moisturizer",
        images: [Image3, Image4],
      },
      {
        line: "Bottle Line 1",
        sku: "Hide Nothing Moisturizer",
        images: [Image3, Image4],
      },
      {
        line: "Bottle Line 2",
        sku: "Hide Nothing Moisturizer",
        images: [Image3, Image4],
      },
      {
        line: "Bottle Line 3",
        sku: "Hide Nothing Moisturizer",
        images: [Image3, Image4],
      },
    ],
  },

  {
    name: "Unit 1: Nano",
    primary: "#083F30",
    secondary: "#00251B",
    shadow: "#00F68340",
    items: [
      {
        line: "Bottle Line 1",
        sku: "Pears Detoxed Glow Body Wash",
        images: [Image5, Image6],
      },
      {
        line: "Bottle Line 2",
        sku: "Pears Detoxed Glow Body Wash",
        images: [Image5, Image6],
      },
      {
        line: "Bottle Line 3",
        sku: "Pears Detoxed Glow Body Wash",
        images: [Image5, Image6],
      },
      {
        line: "Bottle Line 1",
        sku: "Pears Detoxed Glow Body Wash",
        images: [Image5, Image6],
      },
      {
        line: "Bottle Line 2",
        sku: "Pears Detoxed Glow Body Wash",
        images: [Image5, Image6],
      },
      {
        line: "Bottle Line 3",
        sku: "Pears Detoxed Glow Body Wash",
        images: [Image5, Image6],
      },
    ],
  },

  {
    name: "Unit 2: Bigger Pack",
    primary: "#002A53",
    secondary: "#032240",
    shadow: "#00EEFF40",
    items: [
      {
        line: "Tube Line 1",
        sku: "Pears Detoxed Glow Body Wash",
        images: [Image7, Image8],
      },
      {
        line: "Tube Line 2",
        sku: "Pears Detoxed Glow Body Wash",
        images: [Image7, Image8],
      },
      {
        line: "Tube Line 3",
        sku: "Pears Detoxed Glow Body Wash",
        images: [Image7, Image8],
      },
      {
        line: "Tube Line 4",
        sku: "Pears Detoxed Glow Body Wash",
        images: [Image7, Image8],
      },
      {
        line: "Tube Line 5",
        sku: "Pears Detoxed Glow Body Wash",
        images: [Image7, Image8],
      },
    ],
  },
];

const leftUnits = data.filter((_, index) => index % 2 === 0); // 0,2,4
const rightUnits = data.filter((_, index) => index % 2 === 1); // 1,3,5

function Second() {
  const classifyShift = (epochSec, dateStr) => {
    const ts = dayjs.unix(epochSec);
    const dayStart = dayjs(dateStr, "DD-MM-YYYY");

    const shift1_start = dayStart.hour(6).minute(0);
    const shift1_end = dayStart.hour(14).minute(0);

    const shift2_start = dayStart.hour(14).minute(0);
    const shift2_end = dayStart.hour(22).minute(0);

    const shift3_start = dayStart.hour(22).minute(0);
    const shift3_end = dayStart.add(1, "day").hour(6).minute(0);

    if (ts.isBetween(shift1_start, shift1_end, null, "[)")) return "A";
    if (ts.isBetween(shift2_start, shift2_end, null, "[)")) return "B";
    if (ts.isBetween(shift3_start, shift3_end, null, "[)")) return "C";

    return null;
  };

  const [isLoading, setIsLoading] = useState(false);
  // const data = generateRowsWithTotal(6); // <-- FIXED
  const todayStr = dayjs().format("DD-MM-YYYY");
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // const authenticateSession = async () => {
  //   let payload = {
  //     username: "tester",
  //     password: "admin_password",
  //   };
  //   const loginRes = await apiService.login(payload.username,payload.password);
  //   console.log(loginRes);
  // };

  const getShiftEpochs = ({ selectedDate, shift }) => {
    const { start, end } = { start: "00:00", end: "23:59" };

    const dateFormat = "DD-MM-YYYY HH:mm";

    // Start time is same day
    const startDateTime = dayjs(`${selectedDate} ${start}`, dateFormat);

    // End time — if end < start → means it crosses midnight → add 1 day
    let endDateTime = dayjs(`${selectedDate} ${end}`, dateFormat);
    if (endDateTime.isBefore(startDateTime)) {
      endDateTime = endDateTime.add(1, "day");
    }

    return {
      startEpoch: Math.floor(startDateTime.unix()), // epoch in seconds
      endEpoch: Math.floor(endDateTime.unix()),
      startDateTime: startDateTime.format("YYYY-MM-DD HH:mm:ss"),
      endDateTime: endDateTime.format("YYYY-MM-DD HH:mm:ss"),
    };
  };

  return (
    <div className="flex py-1 px-2 flex-col bg-primary items-center w-full min-h-screen">
      <SecondHeader
        selectedDate={selectedDate}
        onDateChange={(date) => setSelectedDate(date)}
      />
      {/* ========= TOP KPI ROWS ========= */}
      <div className="w-full rounded-[10px] bg-secondary p-4 mt-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          <div className="bg-[#000B2C] shadow-[4px_4px_20px_0px_#004AF640] rounded-xl py-8 px-4 flex flex-col justify-center items-center gap-2">
            <div className="text-xl text-gray-300 font-[600]">
              Product/Coding Images
            </div>
          </div>

          <div className="bg-[#000B2C] shadow-[4px_4px_20px_0px_#004AF640] rounded-xl py-8 px-4 flex flex-col justify-center items-center gap-2">
            <div className="text-xl text-gray-300 font-[600]">Production</div>
          </div>

          <div className="bg-[#000B2C] shadow-[4px_4px_20px_0px_#004AF640] rounded-xl py-8 px-4 flex flex-col justify-center items-center gap-2">
            <div className="text-xl text-gray-300 font-[600]">Prod HS (%)</div>
          </div>

          <div className="bg-[#000B2C] shadow-[4px_4px_20px_0px_#004AF640] rounded-xl py-8 px-4 flex flex-col justify-center items-center gap-2">
            <div className="text-xl text-gray-300 font-[600]">EGA (%)</div>
          </div>

          <div className="bg-[#000B2C] shadow-[4px_4px_20px_0px_#004AF640] rounded-xl py-8 px-4 flex flex-col justify-center items-center gap-2">
            <div className="text-xl text-gray-300 font-[600]">CRQS / T5Z</div>
          </div>
          <div className="bg-[#000B2C] shadow-[4px_4px_20px_0px_#004AF640] rounded-xl py-8 px-4 flex flex-col justify-center items-center gap-2">
            <div className="text-xl text-gray-300 font-[600]">RPM (%)</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full mt-6 gap-3">
        {/* LEFT COLUMN */}
        <div className="flex flex-col w-full md:w-1/2 gap-3">
          {leftUnits.map((unit, unitIndex) => (
            <UnitBlock key={unitIndex} unit={unit} />
          ))}
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col w-full md:w-1/2 gap-3">
          {rightUnits.map((unit, unitIndex) => (
            <UnitBlock key={unitIndex} unit={unit} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Second;

const UnitBlock = ({ unit }) => (
  <div
    className="rounded-[10px] px-4 py-3 w-full"
    style={{ backgroundColor: unit.secondary }}
  >
    <div className="text-gray-200 text-[1.25rem] font-semibold mb-4 text-center">
      {unit.name}
    </div>

    <div
      className="
      grid 
      grid-cols-1
      sm:grid-cols-2
      md:grid-cols-3
      gap-6 
      w-full
    "
    >
      {unit.items.map((item, idx) => (
        <div
          key={idx}
          className="rounded-xl py-3 px-2 flex flex-col justify-between items-center"
          style={{
            backgroundColor: unit.secondary,
            boxShadow: `4px 4px 20px 0px ${unit.shadow}`,
          }}
        >
          <div className="flex flex-col gap-1 justify-center items-center w-full">
            <div className="text-sm text-[#CDD5DF] font-[600]">
              <span className="font-[700] text-white">Line:</span> {item.line}
            </div>

            <div className="text-sm text-[#CDD5DF] font-[600]">
              <span className="font-[700] text-white">SKU:</span> {item.sku}
            </div>
          </div>

          <div className="flex flex-row justify-center gap-4 w-full mt-[6px]">
            {item.images.map((src, i) => (
              <img key={i} src={src} className="w-[110px] h-[100px]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
