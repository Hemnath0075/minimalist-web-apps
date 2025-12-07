import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Table } from "antd";
import {
  generateSectionColumns,
  generateRowsWithTotal,
} from "../Config/columns"; //
import { apiService, Endpoint } from "../Services/apiService";

// image imports
import SampleImage from "../Assets/sample_line.png";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import SecondHeader from "../Components/SecondHeader";
import ThirdHeader from "../Components/ThirdHeader";
dayjs.extend(isBetween);

const shiftTimings = {
  1: { start: "00:00", end: "14:00" }, // A
  2: { start: "14:00", end: "22:00" }, // B
  3: { start: "22:00", end: "06:00" }, // C
};

const data = [
  {
    line: "Bottle Line 1",
    primary: "#001040",
    secondary: "#000B2C",
    shadow: "#004AF640",
    stats: {
      tubesAnalyzed: 10000,
      tubesRejected: 5,
      rejectionRatio: "0.05%",
    },
    details: {
      recipeName: "Peptide Bond Strength 175ml",
      locationName: "Sunrise",
      lastRecipeUpdated: "24 Nov 2025, 09:23:12 pm",
      machineName: "Profile Cutting - Sunrise",
    },
    images: ["Image1", "Image2"],
  },

  {
    line: "Bottle Line 2",
    primary: "#083F30",
    secondary: "#00251B",
    shadow: "#00F68340",
    stats: {
      tubesAnalyzed: 10000,
      tubesRejected: 5,
      rejectionRatio: "0.05%",
    },
    details: {
      recipeName: "Peptide Bond Strength 175ml",
      locationName: "Sunrise",
      lastRecipeUpdated: "24 Nov 2025, 09:23:12 pm",
      machineName: "Profile Cutting - Sunrise",
    },
    images: ["Image1", "Image2"],
  },
  {
    line: "Bottle Line 3",
    primary: "#45061B",
    secondary: "#3A0517",
    shadow: "#F6390040",
    stats: {
      tubesAnalyzed: 10000,
      tubesRejected: 5,
      rejectionRatio: "0.05%",
    },
    details: {
      recipeName: "Peptide Bond Strength 175ml",
      locationName: "Sunrise",
      lastRecipeUpdated: "24 Nov 2025, 09:23:12 pm",
      machineName: "Profile Cutting - Sunrise",
    },
    images: ["Image1", "Image2"],
  },
];

function Third() {
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
      <ThirdHeader
        selectedDate={selectedDate}
        onDateChange={(date) => setSelectedDate(date)}
      />
      {/* ========= TOP KPI ROWS ========= */}

      <div className="flex flex-row mt-6 w-full justify-between items-center gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="basis-[33%] text-white flex flex-col justify-center items-center gap-[4px]"
          >
            {/* Header */}
            <div className="bg-secondary w-full rounded-[10px] py-2 px-2 text-center text-xl-responsive font-[600]" style={{
                      backgroundColor: item.primary,
                    }}>
              Line Name: {item.line}
            </div>

            {/* Outer Card */}
            <div
              className="flex flex-col pb-4 pt-2 rounded-[10px] px-4 gap-2"
              style={{ backgroundColor: item.primary }}
            >
              {/* Image */}
              <div>
                <img src={SampleImage} alt="" />
              </div>

              {/* Stats Section */}
              <div
                className="flex mt-2 flex-col w-full justify-between items-center"
                style={{ backgroundColor: item.primary }}
              >
                <div className="flex flex-1 gap-4 flex-row w-full justify-between items-center">
                  {/* Tubes Analysed */}
                  <div
                    className="basis-[33%] flex flex-col px-2 py-3 rounded-[8px] justify-center items-center"
                    style={{
                      backgroundColor: item.secondary,
                      boxShadow: `4px 4px 20px 0px ${item.shadow}`,
                    }}
                  >
                    <p className="text-lg-responsive-cross font-[600]">Tubes Analysed</p>
                    <p className="font-[600] text-xl-responsive">
                      {item.stats.tubesAnalyzed.toLocaleString()}
                    </p>
                  </div>

                  {/* Tubes Rejected */}
                  <div
                    className="basis-[33%] flex flex-col px-2 py-3 rounded-[8px] justify-center items-center"
                    style={{
                      backgroundColor: item.secondary,
                      boxShadow: `4px 4px 20px 0px ${item.shadow}`,
                    }}
                  >
                    <p className="text-lg-responsive-cross font-[600]">Tubes Rejected</p>
                    <p className="font-[600] text-xl-responsive">{item.stats.tubesRejected}</p>
                  </div>

                  {/* Reject Ratio */}
                  <div
                    className="basis-[33%] flex flex-col px-2 py-3 rounded-[8px] justify-center items-center"
                    style={{
                      backgroundColor: item.secondary,
                      boxShadow: `4px 4px 20px 0px ${item.shadow}`,
                    }}
                  >
                    <p className="text-lg-responsive-cross font-[600]">Reject Ratio</p>
                    <p className="font-[600] text-xl-responsive">{item.stats.rejectionRatio}</p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex flex-col mt-3 gap-2 justify-start w-full items-center">
                  <div className="flex flex-row w-full justify-between items-center">
                    <p className="text-md-responsive-cross font-[600]">Recipe Name</p>
                    <p className="text-md-responsive-cross font-[500]">
                      {item.details.recipeName}
                    </p>
                  </div>

                  <div className="flex flex-row w-full justify-between items-center">
                    <p className="text-md-responsive-cross font-[600]">Location Name</p>
                    <p className="text-md-responsive-cross font-[500]">
                      {item.details.locationName}
                    </p>
                  </div>

                  <div className="flex flex-row w-full justify-between items-center">
                    <p className="text-md-responsive-cross font-[600]">
                      Last Recipe Updated
                    </p>
                    <p className="text-md-responsive-cross font-[500]">
                      {item.details.lastRecipeUpdated}
                    </p>
                  </div>

                  <div className="flex flex-row w-full justify-between items-center">
                    <p className="text-md-responsive-cross font-[600]">Machine Name</p>
                    <p className="text-md-responsive-cross font-[500]">
                      {item.details.machineName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Third;
