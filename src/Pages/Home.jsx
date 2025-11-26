import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Table } from "antd";
import {
  generateSectionColumns,
  generateRowsWithTotal,
} from "../Config/columns"; //
import { apiService, Endpoint } from "../Services/apiService";
import dayjs from "dayjs";

const shiftTimings = {
  1: { start: "00:00", end: "23:59" }, // A
  2: { start: "14:00", end: "22:00" }, // B
  3: { start: "22:00", end: "06:00" }, // C
};

function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const columns = generateSectionColumns(); // <-- FIXED
  const data = generateRowsWithTotal(6); // <-- FIXED
  const [selectedDate, setSelectedDate] = useState(null);

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
    const getSessionEndpoint = Endpoint.GET_SESSION_DATA?.replace(
      "{start_time}",
      start_time
    )?.replace("{end_time}", end_time);
    const res = await apiService.get(getSessionEndpoint);

    console.log(res.status);
    // console.log(res.data?.data[0]?.outputs);
    if (res.status === 200) {
      const outputs = res.data?.data[0]?.outputs || [];
      console.log(res.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(selectedDate);
    const timestamps = getShiftEpochs(data, { value: 1 });
    getSessionData(timestamps.startEpoch, timestamps.endEpoch);
  }, [selectedDate]);

  const renderSection = (title) => (
    <div className="section-box">
      <div className="section-title">{title}</div>

      <Table
        bordered
        columns={columns}
        dataSource={data}
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
