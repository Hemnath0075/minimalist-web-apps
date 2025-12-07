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

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
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

function Home() {
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
      <Header
        selectedDate={selectedDate}
        onDateChange={(date) => setSelectedDate(date)}
      />
      {/* ========= TOP KPI ROWS ========= */}
      <div className="w-full rounded-[10px] bg-secondary p-4 mt-4 flex flex-col gap-4">
        {/* KPI CARD */}
        <div className="text-white flex-row w-full justify-center items-center text-center font-[600] text-xl-responsive">
          KPIs (YTD)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-responsive">
          <div className="bg-[#000B2C] rounded-xl p-responsive flex flex-col justify-center items-center gap-responsive shadow-[4px_4px_20px_0px_#004AF640]">
            <div className="text-gray-300 font-[600] text-responsive">
              Cost Budget (Actual/Target)
            </div>
            <div className="text-green font-semibold text-xl-responsive">
              1,280 Cr. <span className="text-white">/</span>{" "}
              <span className="text-yellow">1,320 Cr.</span>
            </div>
          </div>

          <div className="bg-[#000B2C] rounded-xl p-responsive flex flex-col justify-center items-center gap-responsive shadow-[4px_4px_20px_0px_#004AF640]">
            <div className="text-gray-300 font-[600] text-responsive">
              MOQ Concerns
            </div>
            <div className="text-white text-xl-responsive font-semibold">
              20
            </div>
          </div>

          <div className="bg-[#000B2C] rounded-xl p-responsive flex flex-col justify-center items-center gap-responsive shadow-[4px_4px_20px_0px_#004AF640]">
            <div className="text-gray-300 font-[600] text-responsive">
              Inventory + NMSM
            </div>
            <div className="text-red text-xl-responsive font-semibold">
              1,380 Cr. / 1,320 Cr.
            </div>
          </div>

          <div className="bg-[#000B2C] rounded-xl p-responsive flex flex-col justify-center items-center gap-responsive shadow-[4px_4px_20px_0px_#004AF640]">
            <div className="text-gray-300 font-[600] text-responsive">DPMU</div>
            <div className="text-green font-semibold text-xl-responsive">
              6,000 / 8000
            </div>
          </div>

          <div className="bg-[#000B2C] rounded-xl p-responsive flex flex-col justify-center items-center gap-responsive shadow-[4px_4px_20px_0px_#004AF640]">
            <div className="text-gray-300 font-[600] text-responsive">
              OR + Prod vs Booking Gap
            </div>
            <div className="text-red text-xl-responsive font-semibold">
              64% / 80%
            </div>
          </div>

          <div className="bg-[#000B2C] rounded-xl p-responsive flex flex-col justify-center items-center gap-responsive shadow-[4px_4px_20px_0px_#004AF640]">
            <div className="text-gray-300 font-[600] text-responsive">
              No. of launches
            </div>
            <div className="text-white text-xl-responsive font-semibold">
              154
            </div>
          </div>
        </div>
      </div>

      {/* ========= COMPLIANCE (3 blocks) ========= */}
      {/* ========= COMPLIANCE (YTD) SECTION ========= */}
      <div className="flex flex-row justify-between items-center gap-2 w-full h-[24vh]">
        <div className="equal-block w-full max-w-[1800px] bg-containergreen px-4 py-2 rounded-[10px] mt-6">
          <div className="text-gray-200 text-xl-responsive font-semibold mb-2 text-center">
            Compliance (YTD)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PLAN */}
            <div className="bg-[#08252B] shadow-[4px_4px_20px_0px_#134C58] flex flex-col w-full justify-between items-center rounded-xl py-2 px-4 ">
              <div className="text-gray-300 text-lg-responsive-compliance font-semibold mb-3-responsive-responsive">
                Plan
              </div>
              <div className="flex flex-row text-white text-sm-responsive justify-between w-full items-center">
                <p> No. of Sites</p>
                <p>(Overall - 70%)</p>
              </div>

              <div className="flex flex-row gap-2 w-full items-center justify-between text-white font-semibold">
                {/* >90% */}
                <div className="flex flex-1 flex-col gap-1 justify-center items-center">
                  <div className="flex-1 w-full mx-1 bg-cardgreen rounded-lg text-center p-2-responsive">
                    <div className="text-xxl-responsive">5</div>
                  </div>
                  <div className="text-sm-responsive">{">90%"}</div>
                </div>

                <div className="flex flex-1 flex-col gap-1 justify-center items-center">
                  <div className="flex-1 w-full mx-1 bg-cardorange rounded-lg text-center p-2-responsive">
                    <div className="text-xxl-responsive">4</div>
                  </div>
                  <div className="text-sm-responsive">{"80-90%"}</div>
                </div>
                <div className="flex flex-1 flex-col gap-1 justify-center items-center">
                  <div className="flex-1 w-full mx-1 bg-cardred rounded-lg text-center p-2-responsive">
                    <div className="text-xxl-responsive">3</div>
                  </div>
                  <div className="text-sm-responsive">{"<80%"}</div>
                </div>
              </div>
            </div>

            {/* QUALITY */}
            <div className="bg-[#08252B] shadow-[4px_4px_20px_0px_#134C58] flex flex-col w-full justify-between items-center rounded-xl py-2 px-4">
              <div className="text-gray-300 text-lg-responsive-compliance font-semibold mb-3-responsive">
                Priority
              </div>
              <div className="flex flex-row text-white text-sm-responsive justify-between w-full items-center">
                <p> No. of Sites</p>
                <p>(Overall - 70%)</p>
              </div>

              <div className="flex flex-row gap-2 w-full items-center justify-between text-white font-semibold">
                {/* >90% */}
                <div className="flex flex-1 flex-col gap-1 justify-center items-center">
                  <div className="flex-1 w-full mx-1 bg-cardgreen rounded-lg text-center p-2-responsive">
                    <div className="text-xxl-responsive">5</div>
                  </div>
                  <div className="text-sm-responsive">{">90%"}</div>
                </div>

                <div className="flex flex-1 flex-col gap-1 justify-center items-center">
                  <div className="flex-1 w-full mx-1 bg-cardorange rounded-lg text-center p-2-responsive">
                    <div className="text-xxl-responsive">4</div>
                  </div>
                  <div className="text-sm-responsive">{"80-90%"}</div>
                </div>
                <div className="flex flex-1 flex-col gap-1 justify-center items-center">
                  <div className="flex-1 w-full mx-1 bg-cardred rounded-lg text-center p-2-responsive">
                    <div className="text-xxl-responsive">3</div>
                  </div>
                  <div className="text-sm-responsive">{"<80%"}</div>
                </div>
              </div>
            </div>

            {/* PRIORITY PACK */}
            <div className="bg-[#08252B] shadow-[4px_4px_20px_0px_#134C58] flex flex-col w-full justify-between items-center rounded-xl py-2 px-4 ">
              <div className="text-gray-300 text-lg-responsive-compliance font-semibold mb-3-responsive">
                Quality
              </div>
              <div className="flex flex-row text-white text-sm-responsive justify-between w-full items-center">
                <p> No. of Sites</p>
                <p>(Overall - 70%)</p>
              </div>

              <div className="flex flex-row gap-2 w-full items-center justify-between text-white font-semibold">
                {/* >90% */}
                <div className="flex flex-1 flex-col gap-1 justify-center items-center">
                  <div className="flex-1 w-full mx-1 bg-cardgreen rounded-lg text-center p-2-responsive">
                    <div className="text-xxl-responsive">5</div>
                  </div>
                  <div className="text-sm-responsive">{">90%"}</div>
                </div>

                <div className="flex flex-1 flex-col gap-1 justify-center items-center">
                  <div className="flex-1 w-full mx-1 bg-cardorange rounded-lg text-center p-2-responsive">
                    <div className="text-xxl-responsive">4</div>
                  </div>
                  <div className="text-sm-responsive">{"80-90%"}</div>
                </div>
                <div className="flex flex-1 flex-col gap-1 justify-center items-center">
                  <div className="flex-1 w-full mx-1 bg-cardred rounded-lg text-center p-2-responsive">
                    <div className="text-xxl-responsive">3</div>
                  </div>
                  <div className="text-sm-responsive">{"<80%"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========= DEEP DIVES ========= */}
        <div className="w-full equal-block max-w-[1800px] bg-containergreen px-4 py-2 rounded-[10px] mt-6">
          <div className="text-gray-200 text-xl-responsive font-semibold mb-2 text-center">
            Deep Dives
          </div>

          <div className="flex flex-row justify-between items-center gap-6">
            {/* Image Blocks */}
            {[1, 2, 3, 4].map((n, index) => (
              <div
                key={n}
                className="bg-[#08252B] py-2-responsive shadow-[4px_4px_20px_0px_#134C58] py-2 px-2 rounded-xl flex flex-col items-center justify-between text-gray-300 text-sm-responsive"
              >
                <div className="deep-dive-img ">
                  <img
                    src={ImageItems[index]}
                    alt=""
                    className="deep-dive-img-inner"
                  />
                </div>

                <p className="text-md-responsive font-[600] mt-3-responsive">
                  Minimalist | Nano | Lotus
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========= TWO TABLES (SIDE-BY-SIDE) ========= */}
      <div className="w-full mt-6 grid grid-cols-1 xl:grid-cols-2 gap-2">
        <div className="flex flex-col gap-[2px] w-full rounded-xl">
          <div className="text-gray-200 bg-secondary py-2 text-center rounded-[10px] text-lg font-semibold mb-2">
            Non - Sachet CMs (WTD)
          </div>
          <div className="w-full h-full">
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              bordered={false}
              size="small"
              className="custom-kpi-table"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full rounded-xl">
          <div className="text-gray-200 bg-secondary py-2 text-center rounded-[10px] text-lg font-semibold mb-2">
            Sachet CMs (WTD)
          </div>
          <div className="w-full h-full">
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              bordered={false}
              size="small"
              className="custom-kpi-table"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
