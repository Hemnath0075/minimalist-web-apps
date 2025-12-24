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
  const [timeRange, setTimeRange] = useState(null);
  const [productName, setProductName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  // const data = generateRowsWithTotal(6); // <-- FIXED
  // const todayStr = dayjs().format("DD-MM-YYYY");
  // const [selectedDate, setSelectedDate] = useState(todayStr);

  // const authenticateSession = async () => {
  //   let payload = {
  //     username: "tester",
  //     password: "password",
  //   };
  //   const loginRes = await apiService.login(payload.username, payload.password);
  //   console.log(loginRes);
  // };

  const [chartData, setChartData] = useState([]);

  const getSessionData = async (start_time, end_time) => {
    const endpoint = Endpoint.ANALYTICS.replace(
      "{start_time}",
      start_time
    ).replace("{end_time}", end_time);

    const res = await apiService.get(endpoint);
    if (res.status !== 200) return;

    // group by created_at
    const grouped = {};

    res.data.data.forEach((item) => {
      const ts = item.created_at;

      if (item.output_key === "Product_Name") {
        setProductName(item.output_value);
      }

      if (!grouped[ts]) {
        grouped[ts] = {
          time: dayjs.unix(ts).format("HH:mm"),
          rawTs: ts, // IMPORTANT
        };
      }

      if (item.output_key === "MLC")
        grouped[ts].mlc = Number(item.output_value);

      if (item.output_key === "Wax_Temp_Actual")
        grouped[ts].wax_temp = Number(item.output_value);

      if (item.output_key === "Stirer_Actual_Speed")
        grouped[ts].stirer_speed = Number(item.output_value);
    });

    const rows = Object.values(grouped)
      .sort((a, b) => a.rawTs - b.rawTs)
      .map((row, idx) => ({
        ...row,
        idx, // numeric X value
      }));

    setChartData(rows);


    // setChartData(Object.values(grouped));
  };

  // useEffect(() => {
  //   authenticateSession();
  // }, []);

  useEffect(() => {
    console.log(timeRange?.start);
    console.log(timeRange?.end);
    if (!timeRange) return;

    getSessionData(timeRange.start, timeRange.end);
  }, [timeRange]);

  return (
    <div className="flex py-1 px-2 flex-col bg-primary items-center w-full min-h-screen">
      <FourthHeader
        onRangeChange={({ start, end }) => {
          setTimeRange({ start, end });
        }}
      />
      {/* ========= TOP KPI ROWS ========= */}
      <div className="w-full rounded-[10px] bg-secondary p-4 mt-4 flex flex-col gap-4">
        {/* KPI CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          <div className="bg-[#000B2C] shadow-[4px_4px_20px_0px_#004AF640] rounded-xl p-4 flex flex-col justify-center items-center gap-2">
            <div className="text-xl-responsive text-gray-300 font-[600]">
              Batch Name
            </div>
            <div className="text-green text-xl-responsive capitalize font-semibold">
              {productName}
            </div>
          </div>

          <div className="bg-[#000B2C] shadow-[4px_4px_20px_0px_#004AF640] rounded-xl p-4 flex flex-col justify-center items-center gap-2">
            <div className="text-xl-responsive text-gray-300 font-[600]">
              Batch Code
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
            <p className="text-xl-responsive text-wrap font-[600]">
              Mixer Temperature
            </p>
          </div>

          <div className="basis-[90%]">
            <ProcessChart
              data={chartData}
              legend="Temperature (°C)"
              dataKey="wax_temp"
              stroke="#6AA8FF"
            />
          </div>
        </div>
      </div>
      <div className="mt-1 text-white flex flex-col justify-center items-center w-full">
        <div className="w-full bg-secondary flex flex-row justify-between items-center mt-4">
          <div className="basis-[13%] w-full flex flex-row justify-center items-center">
            <p className="text-xl-responsive font-[600]">Stirrer RPM</p>
          </div>

          <div className="basis-[90%]">
            <ProcessChart
              data={chartData}
              legend="RPM"
              dataKey="stirer_speed"
              stroke="#00C8C8"
            />
          </div>
        </div>
      </div>
      <div className="mt-1 text-white flex flex-col justify-center items-center w-full">
        <div className="w-full bg-secondary flex flex-row justify-between items-center mt-4">
          <div className="basis-[13%] w-full flex flex-row justify-center items-center">
            <p className="text-xl-responsive font-[600]">Batch Viscocity</p>
          </div>

          <div className="basis-[90%]">
            <ProcessChart
              data={chartData}
              legend="MLC"
              dataKey="mlc"
              stroke="#EEC942"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Fourth;

const ProcessChart = ({ data, legend, dataKey, stroke }) => {
  const total = data.length;
  const step = Math.floor(total / 3);

  const stepRanges = [
    { from: 0, to: step, fill: "url(#step1)" },
    { from: step, to: step * 2, fill: "url(#step2)" },
    { from: step * 2, to: total - 1, fill: "url(#step3)" },
  ];


  // margins must match overlay padding below if you change them
  const chartMargin = { top: 10, right: 20, bottom: 10, left: 40 };

  return (
    <div className="w-full h-[260px] rounded-lg bg-secondary mt-4 relative">
      <ResponsiveContainer>
        <LineChart data={data} margin={chartMargin}>
          <defs>
            <linearGradient id="step1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(200,100,0,0.35)" />
              <stop offset="100%" stopColor="rgba(200,100,0,0)" />
            </linearGradient>

            <linearGradient id="step2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,120,174,0.35)" />
              <stop offset="100%" stopColor="rgba(34,120,174,0)" />
            </linearGradient>

            <linearGradient id="step3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,75,35,0.35)" />
              <stop offset="100%" stopColor="rgba(0,75,35,0)" />
            </linearGradient>
          </defs>

          {/* STEP BACKGROUNDS */}
          {stepRanges.map((s, i) => (
            <ReferenceArea
              key={i}
              x1={s.from}
              x2={s.to}
              fill={s.fill}
              ifOverflow="extendDomain"
            />
          ))}

          {/* X AXIS (still shows time) */}
          <XAxis
            dataKey="idx"
            tickFormatter={(v) => data[v]?.time}
            tick={{ fill: "#C7D3EA" }}
            tickLine={false}
            axisLine={{ stroke: "#1E2F4A" }}
          />

          {/* Y AXIS */}
          <YAxis
            tick={{ fill: "#C7D3EA" }}
            axisLine={{ stroke: "#1E2F4A" }}
          />

          {/* REMOVE GRID */}
          {/* <CartesianGrid /> */}

          <Tooltip
            labelFormatter={(v) => `Time: ${data[v]?.time}`}
            formatter={(value) => {
              if (value == null) return ["-", legend];

              return [`${Number(value).toFixed(2)}`, legend];
            }}
            contentStyle={{
              backgroundColor: "#0A1A35",
              border: "1px solid #1E2F4A",
              borderRadius: 8,
              color: "#C7D3EA",
            }}
            labelStyle={{ color: "#9FB3D1", fontWeight: 600 }}
          />


          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            strokeWidth={3}
            dot={false}
            connectNulls={true}
            // dot={{ r: 3, fill: "#FFEFA3" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
