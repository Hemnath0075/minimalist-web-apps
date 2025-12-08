import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Table } from "antd";
import {
  generateSectionColumns,
  generateRowsWithTotal,
} from "../Config/columns"; //
import { apiService, Endpoint } from "../Services/apiService";

import {
  ResponsiveContainer,
  LineChart,
  AreaChart,
  ComposedChart,
  BarChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
} from "recharts";

// image imports
import abdosImage from "../Assets/abdos.svg";
import alphaImage from "../Assets/alpha.svg";
import clarionImage from "../Assets/clarion.svg";
import hidustanImage from "../Assets/hindustanfoodslimited.svg";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import FifthHeader from "../Components/FifthHeader";
dayjs.extend(isBetween);

const ImageItems = [abdosImage, alphaImage, clarionImage, hidustanImage];

const shiftTimings = {
  1: { start: "00:00", end: "14:00" }, // A
  2: { start: "14:00", end: "22:00" }, // B
  3: { start: "22:00", end: "06:00" }, // C
};

// ---------- SAMPLE DATA ----------
const data = [
  {
    key: "lotus",
    site: { name: "Lotus", sku: "SKU Images" },
    actual: { top: "1,280 Cr.", bottom: "1,320 Cr." },
    prodHs: { top: 60, bottom: 75 },
    ega: { top: 54, bottom: 80 },
    crqs: { top: "Red - 80", bottom: "Amber - 80" },
    rpm: { top: 54, bottom: 80 },
    saarthi: { top: 54, bottom: 80 },
  },
  {
    key: "alpha",
    site: { name: "Alpha", sku: "SKU Images" },
    actual: { top: "1,280 Cr.", bottom: "1,320 Cr." },
    prodHs: { top: 60, bottom: 75 },
    ega: { top: 54, bottom: 80 },
    crqs: { top: "Red - 80", bottom: "Amber - 80" },
    rpm: { top: 54, bottom: 80 },
    saarthi: { top: 54, bottom: 80 },
  },
  {
    key: "lotus",
    site: { name: "Lotus", sku: "SKU Images" },
    actual: { top: "1,280 Cr.", bottom: "1,320 Cr." },
    prodHs: { top: 60, bottom: 75 },
    ega: { top: 54, bottom: 80 },
    crqs: { top: "Red - 80", bottom: "Amber - 80" },
    rpm: { top: 54, bottom: 80 },
    saarthi: { top: 54, bottom: 80 },
  },
  {
    key: "alpha",
    site: { name: "Alpha", sku: "SKU Images" },
    actual: { top: "1,280 Cr.", bottom: "1,320 Cr." },
    prodHs: { top: 60, bottom: 75 },
    ega: { top: 54, bottom: 80 },
    crqs: { top: "Red - 80", bottom: "Amber - 80" },
    rpm: { top: 54, bottom: 80 },
    saarthi: { top: 54, bottom: 80 },
  },
];

// ---------- CELL RENDER HELPERS ----------
const stackedCell = (obj) => (
  <div className="flex flex-col leading-tight font-[600]">
    <span className="text-white text-md-responsive">{obj.top}</span>
    <span className="text-gray-400 text-xs-responsive">{obj.bottom}</span>
  </div>
);

const crqsCell = (obj) => (
  <div className="flex flex-col leading-tight text-sm-responsive-responsive font-[500]">
    <span className="text-white">{obj.top}</span>
    <span className="text-white">{obj.bottom}</span>
  </div>
);

const siteCell = (obj) => (
  <div className="flex flex-col leading-tight text-[0.95rem]">
    <span className="text-white font-semibold">{obj.name}</span>
    <span className="text-gray-400 underline cursor-pointer text-[0.75rem]">
      {obj.sku}
    </span>
  </div>
);

// ---------- COLUMNS ----------
const columns = [
  {
    title: "Site",
    dataIndex: "site",
    key: "site",
    width: 160,
    fixed: "left",
    render: siteCell,
  },
  {
    title: "Actual / Target",
    dataIndex: "actual",
    key: "actual",
    width: 140,
    render: stackedCell,
  },
  {
    title: "Prod HS (%)",
    dataIndex: "prodHs",
    key: "prodHs",
    width: 120,
    render: stackedCell,
  },
  {
    title: "EGA (%)",
    dataIndex: "ega",
    key: "ega",
    width: 100,
    render: stackedCell,
  },
  {
    title: "CRQS / 75Z",
    dataIndex: "crqs",
    key: "crqs",
    width: 120,
    render: crqsCell,
  },
  {
    title: "RPM (%)",
    dataIndex: "rpm",
    key: "rpm",
    width: 100,
    render: stackedCell,
  },
  {
    title: "Saarthi Adoptn. (%)",
    dataIndex: "saarthi",
    key: "saarthi",
    width: 150,
    render: stackedCell,
  },
];

function Fifth() {
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
      <FifthHeader
        selectedDate={selectedDate}
        onDateChange={(date) => setSelectedDate(date)}
      />
      {/* ========= TOP KPI ROWS ========= */}
      <div className="w-full rounded-[10px] bg-secondary p-4 mt-4 flex flex-col gap-4">
        {/* KPI CARD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-responsive">
          <div className="bg-[#000B2C] rounded-xl p-responsive flex flex-col justify-center items-center gap-responsive shadow-[4px_4px_20px_0px_#004AF640]">
            <div className="text-gray-300 font-[600] text-xl-responsive">
              Total Production
            </div>
            <div className="text-green font-semibold text-xl-responsive">
              1,280 Kg
            </div>
          </div>

          <div className="bg-[#000B2C] rounded-xl p-responsive flex flex-col justify-center items-center gap-responsive shadow-[4px_4px_20px_0px_#004AF640]">
            <div className="text-gray-300 font-[600] text-xl-responsive">
              OEE
            </div>
            <div className="text-red text-xl-responsive font-semibold">
              72.87%
            </div>
          </div>

          <div className="bg-[#000B2C] rounded-xl p-responsive flex flex-col justify-center items-center gap-responsive shadow-[4px_4px_20px_0px_#004AF640]">
            <div className="text-gray-300 font-[600] text-xl-responsive">
              DPMU
            </div>
            <div className="text-red text-xl-responsive font-semibold">
              6,500
            </div>
          </div>

          <div className="bg-[#000B2C] rounded-xl p-responsive flex flex-col justify-center items-center gap-responsive shadow-[4px_4px_20px_0px_#004AF640]">
            <div className="text-gray-300 font-[600] text-xl-responsive">
              Overall Wastage
            </div>
            <div className="text-green font-semibold text-xl-responsive">
              5%
            </div>
          </div>

          <div className="bg-[#000B2C] rounded-xl p-responsive flex flex-col justify-center items-center gap-responsive shadow-[4px_4px_20px_0px_#004AF640]">
            <div className="text-gray-300 font-[600] text-xl-responsive">
              Holding Tank 1
            </div>
            <div className="text-red text-xl-responsive font-semibold">54%</div>
            <div className="text-white text-sm-responsive">
              SPF 50 Sunscreen
            </div>
          </div>

          <div className="bg-[#000B2C] rounded-xl p-responsive flex flex-col justify-center items-center gap-responsive shadow-[4px_4px_20px_0px_#004AF640]">
            <div className="text-gray-300 font-[600] text-xl-responsive">
              Holding Tank 2
            </div>
            <div className="text-red text-xl-responsive font-semibold">84%</div>
            <div className="text-white text-sm-responsive">
              SPF 50 Sunscreen
            </div>
          </div>
        </div>
      </div>

      {/* ========= COMPLIANCE (3 blocks) ========= */}
      {/* ========= COMPLIANCE (YTD) SECTION ========= */}
      <div className="flex flex-row justify-between items-center gap-2 w-full h-[32vh]">
        <div className="equal-block w-full max-w-[1800px] bg-secondary text-white px-4 py-2 rounded-[10px] mt-6">
          <div className="grid grid-cols-[120px_1fr_1fr_1fr_1fr] justify-center gap-4 items-center text-center">
            {/* Header Row */}
            <div className="text-lg-responsive font-semibold">-</div>
            <div className="text-lg-responsive font-semibold">Status</div>
            <div className="text-lg-responsive font-semibold">PCRO</div>
            <div className="text-lg-responsive font-semibold">CRQS</div>
            <div className="text-lg-responsive font-semibold">Wastage %</div>

            {/* ===================== LINE 1 ===================== */}
            <div className="text-md-responsive font-semibold">Line 1</div>

            <div className="bg-statusGreen rounded-lg py-3 text-center text-md-responsive font-semibold">
              Running
            </div>

            <div className="bg-statusGreen rounded-lg py-3 text-center text-md-responsive font-semibold">
              Ok
            </div>

            <div className="bg-statusGreen rounded-lg py-3 text-center text-md-responsive font-semibold">
              Ok
            </div>

            <div className="bg-primary rounded-lg py-3 text-center text-md-responsive font-semibold">
              2.02
            </div>

            {/* ===================== LINE 2 ===================== */}
            <div className="text-md-responsive font-semibold">Line 2</div>

            <div className="bg-statusGreen rounded-lg py-3 text-center text-md-responsive font-semibold">
              Running
            </div>

            <div className="bg-statusYellow rounded-lg py-3 text-center text-md-responsive font-semibold">
              1hr Overdue
            </div>

            <div className="bg-statusYellow rounded-lg py-3 text-center text-md-responsive font-semibold">
              1hr Overdue
            </div>

            <div className="bg-primary rounded-lg py-3 text-center text-md-responsive font-semibold">
              3.5
            </div>

            {/* ===================== LINE 3 ===================== */}
            <div className="text-md-responsive font-semibold">Line 3</div>

            <div className="bg-statusRed rounded-lg py-3 text-center text-md-responsive font-semibold">
              Stopped (2 min)
            </div>

            <div className="bg-statusRed rounded-lg py-3 text-center text-md-responsive font-semibold">
              Underweight
            </div>

            <div className="bg-statusRed rounded-lg py-3 text-center text-md-responsive font-semibold">
              Cross Packing
            </div>

            <div className="bg-primary rounded-lg py-3 text-center text-md-responsive font-semibold">
              5.8
            </div>
          </div>
        </div>

        {/* ========= DEEP DIVES ========= */}
        <div className="w-full equal-block max-w-[1800px] bg-containergreen px-4 py-2-responsive rounded-[10px] mt-6">
          <div className="text-gray-200 text-xl-responsive font-semibold mb-2 text-center">
            Deep Dives
          </div>

          <div
            className="w-full grid grid-cols-3 text-white gap-4"
            // style={{
            //   gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            // }}
          >
            {[
              "Batch Analytics",
              "Real-Time Cross-Packing Detection",
              "Digital Quality Station",
              "Manpower Tracking",
              "SFG Quality",
              "BPR/BMR",
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#08252B] max-h-750:h-[80px] h-[100px] rounded-xl flex justify-center items-center text-center text-lg-responsive font-semibold shadow-[4px_4px_20px_0px_#134C58]"
                
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full mt-6">
        <div>
          <div className="text-center bg-secondary rounded-tl-[10px] rounded-tr-[10px] py-1-responsive text-xl-responsive text-white font-semibold">
            Production Compliance
          </div>
          <ProductionComplianceChart />
        </div>

        <div>
          <div className="text-center bg-secondary rounded-tl-[10px] rounded-tr-[10px] py-1-responsive text-xl-responsive text-white font-semibold">
            EGA
          </div>
          <EGAChart />
        </div>

        <div>
          <div className="text-center bg-secondary rounded-tl-[10px] rounded-tr-[10px] py-1-responsive text-xl-responsive text-white font-semibold">
            Dispatch
          </div>
          <DispatchChart />
        </div>
      </div>
    </div>
  );
}

export default Fifth;

const ProductionComplianceChart = () => {
  const data = [
    { date: "10/21", a: 30, b: 25, c: 20, target: 100 },
    { date: "10/22", a: 28, b: 22, c: 18, target: 100 },
    { date: "10/23", a: 35, b: 18, c: 22, target: 100 },
    { date: "10/24", a: 22, b: 16, c: 14, target: 100 },
    { date: "10/25", a: 38, b: 28, c: 20, target: 100 },
    { date: "10/26", a: 30, b: 22, c: 18, target: 100 },
    { date: "10/27", a: 32, b: 20, c: 18, target: 100 },
  ];

  return (
    <div className="w-full h-[260px] rounded-bl-lg rounded-br-lg bg-[#000B2C] overflow-hidden p-2">
      <ChartLegend
        items={[
          { label: "Shift A", color: "#1E40FF" },
          { label: "Shift B", color: "#C9780C" },
          { label: "Shift C", color: "#0B5B23" },
          { label: "Target", color: "#4ED6D6" },
        ]}
      />
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <CartesianGrid stroke="rgba(255,255,255,0.12)" />

          <XAxis
            height={50}
            dataKey="date"
            tick={{ className: "chart-tick" }}
            stroke="#C7D3EA"
          />
          <YAxis
            width={35}
            tick={{ className: "chart-tick" }}
            stroke="#C7D3EA"
          />

          <Tooltip
            contentStyle={{
              background: "#0A1A35",
              borderRadius: 8,
              border: "1px solid #1E2F4A",
              color: "white",
            }}
          />

          {/* Bars */}
          <Bar barSize={25} dataKey="a" stackId="pv" fill="#1E40FF" />
          <Bar barSize={25} dataKey="b" stackId="pv" fill="#C9780C" />
          <Bar barSize={25} dataKey="c" stackId="pv" fill="#0B5B23" />

          {/* Target Line */}
          <Line
            type="monotone"
            dataKey="target"
            stroke="#4ED6D6"
            strokeWidth={3}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

const EGAChart = () => {
  const data = [
    { date: "10/21", l1: 450, l2: 600, l3: 380 },
    { date: "10/22", l1: 520, l2: 920, l3: 480 },
    { date: "10/23", l1: 680, l2: 880, l3: 600 },
    { date: "10/24", l1: 570, l2: 750, l3: 490 },
    { date: "10/25", l1: 630, l2: 890, l3: 540 },
    { date: "10/26", l1: 490, l2: 760, l3: 470 },
    { date: "10/27", l1: 430, l2: 600, l3: 390 },
  ];

  return (
    <div className="w-full h-[260px] rounded-bl-lg rounded-br-lg bg-[#000B2C] overflow-hidden p-2">
      <ChartLegend
        items={[
          { label: "Line 1", color: "#6EC7FF" },
          { label: "Line 2", color: "#FFA634" },
          { label: "Line 3", color: "#107441" },
        ]}
      />
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="ega1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(110,199,255,0.4)" />
              <stop offset="100%" stopColor="rgba(110,199,255,0)" />
            </linearGradient>
            <linearGradient id="ega2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,166,52,0.4)" />
              <stop offset="100%" stopColor="rgba(255,166,52,0)" />
            </linearGradient>
            <linearGradient id="ega3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(16,116,65,0.4)" />
              <stop offset="100%" stopColor="rgba(16,116,65,0)" />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.12)" />
          <XAxis
            height={50}
            dataKey="date"
            stroke="#C7D3EA"
            tick={{ className: "chart-tick" }}
          />
          <YAxis
            width={35}
            stroke="#C7D3EA"
            tick={{ className: "chart-tick" }}
          />

          <Tooltip
            contentStyle={{
              background: "#0A1A35",
              borderRadius: 8,
              border: "1px solid #1E2F4A",
              color: "white",
            }}
          />

          <Area
            type="monotone"
            dataKey="l1"
            stroke="#6EC7FF"
            fill="url(#ega1)"
          />
          <Area
            type="monotone"
            dataKey="l2"
            stroke="#FFA634"
            fill="url(#ega2)"
          />
          <Area
            type="monotone"
            dataKey="l3"
            stroke="#107441"
            fill="url(#ega3)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const DispatchChart = () => {
  const data = [
    { name: "Marula Oil 5% Face Moisturizer", value: 480 },
    { name: "Minimalist Vitamin B5 10% Moisturizer", value: 340 },
    { name: "Minimalist SPF 50 Sunscreen", value: 260 },
    { name: "Minimalist Anti Dandruff Shampoo 3.5%", value: 180 },
  ];

  return (
    <div className="w-full h-[260px] rounded-bl-lg rounded-br-lg bg-[#000B2C] overflow-hidden p-2">
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          barSize={22}
          barCategoryGap={30}
        >
          <CartesianGrid horizontal stroke="rgba(255,255,255,0.12)" />

          <XAxis
            type="number"
            stroke="#C7D3EA"
            tick={{ className: "chart-tick" }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={130}
            stroke="#C7D3EA"
            tick={<LeftAlignedTick />} // <-- CUSTOM TICK HERE
          />

          <Tooltip
            contentStyle={{
              background: "#0A1A35",
              borderRadius: 8,
              border: "1px solid #1E2F4A",
              color: "white",
            }}
          />

          <Bar dataKey="value" fill="#1439B3" radius={[4, 4, 4, 4]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
const LeftAlignedTick = ({ y, payload }) => {
  const words = payload.value.split(" ");
  const lines = [];
  let current = "";

  words.forEach((w) => {
    if ((current + " " + w).length > 20) {
      lines.push(current);
      current = w;
    } else {
      current += (current ? " " : "") + w;
    }
  });
  lines.push(current);

  const fontSize = window.innerHeight < 750 ? "0.65rem" : "0.80rem";

  return (
    <g transform={`translate(0, ${y - (lines.length - 1) * 7})`}>
      {lines.map((line, i) => (
        <text
          key={i}
          x={10}
          y={i * 14}
          textAnchor="start"
          fill="#C7D3EA"
          style={{
            fontSize,
            fontWeight: 600,
          }}
        >
          {line}
        </text>
      ))}
    </g>
  );
};


const ChartLegend = ({ items }) => (
  <div className="flex gap-4 mb-1 justify-center">
    {items.map((i) => (
      <div key={i.label} className="flex items-center gap-1 text-sm-responsive text-gray-200">
        <span
          className="inline-block w-3 h-3 rounded-[50%]"
          style={{ background: i.color }}
        />
        {i.label}
      </div>
    ))}
  </div>
);

