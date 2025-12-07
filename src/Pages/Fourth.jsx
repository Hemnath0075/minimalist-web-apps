import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Table } from "antd";
import { apiService, Endpoint } from "../Services/apiService";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

// image imports
import SampleImage from "../Assets/sample_line.png";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import SecondHeader from "../Components/SecondHeader";
import ThirdHeader from "../Components/ThirdHeader";
import FourthHeader from "../Components/FourthHeader";
dayjs.extend(isBetween);

const shiftTimings = {
  1: { start: "00:00", end: "14:00" }, // A
  2: { start: "14:00", end: "22:00" }, // B
  3: { start: "22:00", end: "06:00" }, // C
};

const chartTheme = {
  step1: "#3D2D4F88",
  step2: "#244B6988",
  step3: "#183B5388",
  line1: "#6AA8FF",
  line2: "#00C8C8",
  line3: "#EEC942",
  axis: "#C7D3EA",
  grid: "rgba(255,255,255,0.12)",
};

function Fourth() {
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
      <FourthHeader
        selectedDate={selectedDate}
        onDateChange={(date) => setSelectedDate(date)}
      />
      {/* ========= TOP KPI ROWS ========= */}
      <div className="w-full rounded-[10px] bg-secondary p-4 mt-4 flex flex-col gap-4">
        {/* KPI CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          <div className="bg-[#000B2C] shadow-[4px_4px_20px_0px_#004AF640] rounded-xl p-4 flex flex-col justify-center items-center gap-2">
            <div className="text-xl-responsive text-gray-300 font-[600]">
              Batch Name
            </div>
            <div className="text-green text-xl-responsive font-semibold">
              SPF 50 Sunscreen
            </div>
          </div>

          <div className="bg-[#000B2C] shadow-[4px_4px_20px_0px_#004AF640] rounded-xl p-4 flex flex-col justify-center items-center gap-2">
            <div className="text-xl-responsive text-gray-300 font-[600]">
              BCT
            </div>
            <div className="text-red text-xl-responsive font-semibold">
              6 Hours
            </div>
          </div>

          <div className="bg-[#000B2C] shadow-[4px_4px_20px_0px_#004AF640] rounded-xl p-4 flex flex-col justify-center items-center gap-2">
            <div className="text-xl-responsive text-gray-300 font-[600]">
              Yield %
            </div>
            <div className="text-red text-xl-responsive font-semibold">95%</div>
          </div>

          <div className="bg-[#000B2C] shadow-[4px_4px_20px_0px_#004AF640] rounded-xl p-4 flex flex-col justify-center items-center gap-2">
            <div className="text-xl-responsive text-gray-300 font-[600]">
              Idle time
            </div>
            <div className="text-green text-xl-responsive font-semibold">
              1 Hour
            </div>
          </div>

          <div className="bg-[#000B2C] shadow-[4px_4px_20px_0px_#004AF640] rounded-xl p-4 flex flex-col justify-center items-center gap-2">
            <div className="text-xl-responsive text-gray-300 font-[600]">
              Transfer time
            </div>
            <div className="text-green text-xl-responsive font-semibold">
              48 min
            </div>
          </div>

          <div className="bg-[#000B2C] shadow-[4px_4px_20px_0px_#004AF640] rounded-xl p-4 flex flex-col justify-center items-center gap-2">
            <div className="text-xl-responsive text-gray-300 font-[600]">
              Mixing time
            </div>
            <div className="text-green text-xl-responsive font-semibold">
              5 Hours
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 text-white flex flex-col justify-center items-center w-full">
        <div className="w-full bg-secondary flex flex-row justify-between items-center mt-4">
          <div className="basis-[13%] w-full flex flex-row justify-center items-center">
            <p className="text-xl-responsive text-wrap font-[600]">Mixer Temperature</p>
          </div>

          <div className="basis-[90%]">
            <ProcessChart legend={"Temperature (Celsius)"} />
          </div>
        </div>
      </div>
      <div className="mt-1 text-white flex flex-col justify-center items-center w-full">
        <div className="w-full bg-secondary flex flex-row justify-between items-center mt-4">
          <div className="basis-[13%] w-full flex flex-row justify-center items-center">
            <p className="text-xl-responsive font-[600]">Stirrer RPM</p>
          </div>

          <div className="basis-[90%]">
            <ProcessChart legend={"RPM"} />
          </div>
        </div>
      </div>
      <div className="mt-1 text-white flex flex-col justify-center items-center w-full">
        <div className="w-full bg-secondary flex flex-row justify-between items-center mt-4">
          <div className="basis-[13%] w-full flex flex-row justify-center items-center">
            <p className="text-xl-responsive font-[600]">Batch Viscocity</p>
          </div>

          <div className="basis-[90%]">
            <ProcessChart legend={"Temperature (Celsius)"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Fourth;

const ProcessChart = ({ title, legend }) => {
  // sample data (7 points from 0..6)
  const data = Array.from({ length: 7 }).map((_, i) => ({
    time: i,
    t1: 40 + Math.sin(i) * 25,
    t2: 20 + Math.cos(i * 1.3) * 30,
    t3: 35 + Math.sin(i * 0.8) * 20,
  }));

  // margins must match overlay padding below if you change them
  const chartMargin = { top: 10, right: 20, bottom: 10, left: 40 };

  return (
    <div className="w-full h-[260px] rounded-lg bg-secondary mt-4 overflow-hidden relative">
      {/* --- Chart (fills the container) --- */}
      <ResponsiveContainer>
        <LineChart data={data} margin={chartMargin}>
          {/* ===== SVG gradients (top -> bottom) =====
              Note: stop at 0% has the stronger color and 100% is transparent,
              so color falls from top -> bottom.
          */}
          <defs>
            {/* STEP 1: orange-ish top to transparent bottom */}
            <linearGradient id="step1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(200,100,0,0.30)" />
              <stop offset="100%" stopColor="rgba(200,100,0,0)" />
            </linearGradient>

            {/* STEP 2: blue-ish top to transparent bottom */}
            <linearGradient id="step2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,120,174,0.30)" />
              <stop offset="100%" stopColor="rgba(34,120,174,0)" />
            </linearGradient>

            {/* STEP 3: green-ish top to transparent bottom */}
            <linearGradient id="step3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,75,35,0.30)" />
              <stop offset="100%" stopColor="rgba(0,75,35,0)" />
            </linearGradient>
          </defs>

          {/* ===== Apply shading only inside plot area (x range as example 0..6) ===== */}
          <ReferenceArea x1={0} x2={2} fill="url(#step1)" />
          <ReferenceArea x1={2} x2={4} fill="url(#step2)" />
          <ReferenceArea x1={4} x2={6} fill="url(#step3)" />

          <CartesianGrid stroke="rgba(255,255,255,0.12)" />
          <XAxis dataKey="time" tick={{ className: "chart-tick" }} stroke="#C7D3EA" />
          <YAxis
            tick={{ className: "chart-tick" }}
            stroke="#C7D3EA"
            label={{
              value: legend,
              angle: -90,
              fill: "#C7D3EA",
              position: "insideLeft",
              offset: 0,
              dx: 0,
              dy: 0,
              textAnchor: "middle",
              className: "chart-axis-label",
              fontWeight: 600,
            }}
          />

          <Tooltip
            contentStyle={{
              background: "#0A1A35",
              borderRadius: 8,
              border: "1px solid #1E2F4A",
              color: "white",
            }}
          />

          <Line
            type="monotone"
            dataKey="t1"
            stroke="#6AA8FF"
            dot={{
              r: 4, // dot size
              stroke: "#ffffffaa", // outer ring glow
              strokeWidth: 1,
              fill: "#EAD97C", // dot fill color (your gold/yellow)
            }}
            activeDot={{
              r: 6,
              stroke: "#ffffff",
              strokeWidth: 1,
              fill: "#FFEFA3",
            }}
            strokeWidth={3}
          />
          {/* <Line
            type="monotone"
            dataKey="t2"
            stroke="#00C8C8"
            dot={false}
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="t3"
            stroke="#EEC942"
            dot={false}
            strokeWidth={3}
          /> */}
        </LineChart>
      </ResponsiveContainer>

      {/* --- Overlay: step labels centered inside the PLOT AREA (not axes) --- */}
      {/* This overlay uses the same padding as chartMargin to avoid covering axis ticks/labels */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          display: "flex",
          paddingTop: chartMargin.top,
          paddingBottom: chartMargin.bottom,
          paddingLeft: chartMargin.left, // leaves space for Y axis
          paddingRight: chartMargin.right, // leaves space for right margin
        }}
      >
        {/* Three equal regions (match the ReferenceArea x-intervals: 0-2,2-4,4-6) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
            marginTop: "10px",
            marginLeft: "50px",
          }}
        >
          <div
            className="text-xl-responsive"
            style={{
              color: "white",
              fontWeight: 700,
              textShadow: "0 1px 6px rgba(0,0,0,0.6)",
            }}
          >
            Step 1
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
            marginTop: "10px",
            marginLeft: "50px",
          }}
        >
          <div
            className="text-xl-responsive"
            style={{
              color: "white",
              fontWeight: 700,

              textShadow: "0 1px 6px rgba(0,0,0,0.6)",
            }}
          >
            Step 2
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
            marginTop: "10px",
            marginLeft: "50px",
          }}
        >
          <div
            className="text-xl-responsive"
            style={{
              color: "white",
              fontWeight: 700,
              textShadow: "0 1px 6px rgba(0,0,0,0.6)",
            }}
          >
            Step 3
          </div>
        </div>
      </div>
    </div>
  );
};
