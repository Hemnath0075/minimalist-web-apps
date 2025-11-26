import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Table } from "antd";
import {
  generateSectionColumns,
  generateRowsWithTotal,
} from "../Config/columns"; //
import { apiService, Endpoint } from "../Services/apiService";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const shiftTimings = {
  1: { start: "00:00", end: "23:59" }, // A
  2: { start: "14:00", end: "22:00" }, // B
  3: { start: "22:00", end: "06:00" }, // C
};

function Home() {
  const classifyShift = (epochSec, dateStr) => {
  const ts = dayjs.unix(epochSec);
  const dayStart = dayjs(dateStr, "DD-MM-YYYY");

  const shift1_start = dayStart.hour(6).minute(0);
  const shift1_end   = dayStart.hour(14).minute(0);

  const shift2_start = dayStart.hour(14).minute(0);
  const shift2_end   = dayStart.hour(22).minute(0);

  const shift3_start = dayStart.hour(22).minute(0);
  const shift3_end   = dayStart.add(1, "day").hour(6).minute(0);

  if (ts.isBetween(shift1_start, shift1_end, null, "[)")) return "A";
  if (ts.isBetween(shift2_start, shift2_end, null, "[)")) return "B";
  if (ts.isBetween(shift3_start, shift3_end, null, "[)")) return "C";

  return null;
};


  const [isLoading, setIsLoading] = useState(false);

  const [cbuStats, setCbuStats] = useState([]); // <-- store grouped CBU counts

  const CBU_REGEX = /^[A-Z0-9]{6,8}$/; 

  const columns = generateSectionColumns(); // <-- FIXED
  const data = generateRowsWithTotal(6); // <-- FIXED
  const [selectedDate, setSelectedDate] = useState(null);

  const authenticateSession = async () => {
    let payload = {
      username: "tester",
      password: "admin_password",
    };
    const loginRes = await apiService.login(payload.username,payload.password);
    console.log(loginRes);
  };

  const getShiftEpochs = ({ selectedDate, shift }) => {
    const { start, end } = shiftTimings[1];

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

  const getSessionData = async (start_time, end_time) => {
  const getSessionEndpoint = Endpoint.GET_SESSION_DATA
    .replace("{start_time}", start_time)
    .replace("{end_time}", end_time);

  const res = await apiService.get(getSessionEndpoint);

  if (res.status !== 200) return;

  const outputs = res.data?.data?.[0]?.outputs || [];

  const rowMap = {}; // { FALD3R3: { A: number, B: number, C: number } }

  outputs.forEach(out => {
    const detectedUnit = out.units?.find(u => u.output_key === "detected");
    const detected = detectedUnit?.output_value;

    if (!detected || !CBU_REGEX.test(detected)) return;

    const shift = classifyShift(out.created_at, selectedDate);
    if (!shift) return;

    if (!rowMap[detected]) {
      rowMap[detected] = { A: 0, B: 0, C: 0 };
    }

    rowMap[detected][shift] += 1;
  });

  // Convert map → table rows
  const tableRows = Object.entries(rowMap).map(([code, shifts], idx) => ({
    key: idx,
    cbu: code,
    a_cld: shifts.A,
    a_ton: "-",
    b_cld: shifts.B,
    b_ton: "-",
    c_cld: shifts.C,
    c_ton: "-",
  }));

  // Add total row
  const totalRow = {
    key: "total",
    cbu: "Total",
    a_cld: tableRows.reduce((s, r) => s + r.a_cld, 0),
    a_ton: "-",
    b_cld: tableRows.reduce((s, r) => s + r.b_cld, 0),
    b_ton: "-",
    c_cld: tableRows.reduce((s, r) => s + r.c_cld, 0),
    c_ton: "-",
    isTotal: true,
  };

  setCbuStats([...tableRows, totalRow]);
};


  useEffect(() => {
    if (!selectedDate) return;

    const timestamps = getShiftEpochs({
      selectedDate,
      shift: 1,
    });

    getSessionData(timestamps.startEpoch, timestamps.endEpoch);
  }, [selectedDate]);

  useEffect(() => {
    const getData = async () => {
      await authenticateSession();
    };
    getData();
  }, []);

  const renderSection = (title) => (
    <div className="section-box">
      <div className="section-title">{title}</div>

      <Table
  bordered
  columns={columns}
  dataSource={cbuStats}   // <-- use final processed rows
  pagination={false}
  rowClassName={(record) => (record.isTotal ? "total-row" : "")}
  size="small"
  className="custom-table"
/>

    </div>
  );

  return (
    <div className="flex p-4 flex-col bg-primary items-center w-full min-h-screen">
      <Header onDateChange={(date) => setSelectedDate(date)} />

      <div className="main-container w-full mt-1">
        <div className="top-row">
          <div className="box">{renderSection("Line Counter")}</div>
          <div className="box">{renderSection("EOL Counter (Techway)")}</div>
        </div>

        <div className="bottom-row">{renderSection("Counter Difference")}</div>
      </div>
    </div>
  );
}

export default Home;
