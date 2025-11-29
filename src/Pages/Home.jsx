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
  1: { start: "00:00", end: "14:00" }, // A
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

const [lineTable, setLineTable] = useState([]);
const [eolTable, setEolTable] = useState([]);
const [diffTable, setDiffTable] = useState([]);

const convertToTableRows = (rowMap) => {
  const rows = Object.entries(rowMap).map(([cbu, shifts], idx) => ({
    key: idx,
    cbu,
    a_cld: shifts.A,
    a_ton: "-",
    b_cld: shifts.B,
    b_ton: "-",
    c_cld: shifts.C,
    c_ton: "-",
  }));

  const totalRow = {
    key: "total",
    cbu: "Total",
    a_cld: rows.reduce((a, r) => a + r.a_cld, 0),
    a_ton: "-",
    b_cld: rows.reduce((a, r) => a + r.b_cld, 0),
    b_ton: "-",
    c_cld: rows.reduce((a, r) => a + r.c_cld, 0),
    c_ton: "-",
    isTotal: true,
  };

  return [...rows, totalRow];
};

const computeDifference = (lineRows, eolRows) => {
  const mapify = (rows) =>
    rows.filter(r => r.key !== "total").reduce((acc, r) => {
      acc[r.cbu] = r;
      return acc;
    }, {});

  const L = mapify(lineRows);
  const E = mapify(eolRows);

  const all = new Set([...Object.keys(L), ...Object.keys(E)]);

  const diff = [...all].map((code, idx) => ({
    key: idx,
    cbu: code,
    a_cld: (L[code]?.a_cld || 0) - (E[code]?.a_cld || 0),
    a_ton: "-",
    b_cld: (L[code]?.b_cld || 0) - (E[code]?.b_cld || 0),
    b_ton: "-",
    c_cld: (L[code]?.c_cld || 0) - (E[code]?.c_cld || 0),
    c_ton: "-",
  }));

  // Total row
  diff.push({
    key: "total",
    cbu: "Total",
    a_cld: diff.reduce((sum, r) => sum + (r.a_cld || 0), 0),
    a_ton: "-",
    b_cld: diff.reduce((sum, r) => sum + (r.b_cld || 0), 0),
    b_ton: "-",
    c_cld: diff.reduce((sum, r) => sum + (r.c_cld || 0), 0),
    c_ton: "-",
    isTotal: true,
  });

  return diff;
};




  const [isLoading, setIsLoading] = useState(false);

  const [cbuStats, setCbuStats] = useState([]); // <-- store grouped CBU counts

  const CBU_REGEX = /^[A-Z0-9]{6,8}$/; 

  const columns = generateSectionColumns(); // <-- FIXED
  const data = generateRowsWithTotal(6); // <-- FIXED
  const todayStr = dayjs().format("DD-MM-YYYY");
  const [selectedDate, setSelectedDate] = useState(todayStr);


  const authenticateSession = async () => {
    let payload = {
      username: "tester",
      password: "admin_password",
    };
    const loginRes = await apiService.login(payload.username,payload.password);
    console.log(loginRes);
  };

  const computeDifferenceTonnage = (lineRows, eolRows) => {
  const mapify = (rows) =>
    rows.filter(r => r.key !== "total").reduce((acc, r) => {
      acc[r.cbu] = r;
      return acc;
    }, {});

  const L = mapify(lineRows);
  const E = mapify(eolRows);

  const all = new Set([...Object.keys(L), ...Object.keys(E)]);

  const diff = [...all].map((code, idx) => ({
    key: idx,
    cbu: code,

    a_cld: (L[code]?.a_cld || 0) - (E[code]?.a_cld || 0),
    a_ton: ((L[code]?.a_ton || 0) - (E[code]?.a_ton || 0)).toFixed(2),

    b_cld: (L[code]?.b_cld || 0) - (E[code]?.b_cld || 0),
    b_ton: ((L[code]?.b_ton || 0) - (E[code]?.b_ton || 0)).toFixed(2),

    c_cld: (L[code]?.c_cld || 0) - (E[code]?.c_cld || 0),
    c_ton: ((L[code]?.c_ton || 0) - (E[code]?.c_ton || 0)).toFixed(2),
  }));

  diff.push({
    key: "total",
    cbu: "Total",
    a_cld: diff.reduce((s,r)=>s+r.a_cld,0),
    a_ton: diff.reduce((s,r)=>s+Number(r.a_ton),0).toFixed(2),
    b_cld: diff.reduce((s,r)=>s+r.b_cld,0),
    b_ton: diff.reduce((s,r)=>s+Number(r.b_ton),0).toFixed(2),
    c_cld: diff.reduce((s,r)=>s+r.c_cld,0),
    c_ton: diff.reduce((s,r)=>s+Number(r.c_ton),0).toFixed(2),
    isTotal: true,
  });

  return diff;
};


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
  
const applyWeightAndTonnage = (rows, weightMap) => {
  return rows.map(row => {
    if (row.key === "total") return row;

    const weight = weightMap[row.cbu] || 0;

    return {
      ...row,
      weight,

      // correct formula for all shifts
      a_ton: ((row.a_cld * weight) / 1000).toFixed(2),
      b_ton: ((row.b_cld * weight) / 1000).toFixed(2),
      c_ton: ((row.c_cld * weight) / 1000).toFixed(2),
    };
  });
};

const fetchCbuWeights = async (uniqueCbus) => {
  const weightMap = {};

  await Promise.all(
    uniqueCbus.map(async (cbu) => {
      try {
        const endpoint = Endpoint.GET_ALL_GENERAL_PROPERTIES;
        const res = await apiService.get(endpoint, { property_key: cbu });

        const allProps = res.data?.properties || [];
        const weightProp = allProps.find(p => p.property_label === "weight");

        weightMap[cbu] = Number(weightProp?.property_value || 0);
      } catch (err) {
        console.error("Weight fetch failed for", cbu);
        weightMap[cbu] = 0;
      }
    })
  );

  return weightMap;
};

const recalcTotalRow = (rows) => {
  const total = rows.find(r => r.key === "total");
  if (!total) return rows;

  const nonTotal = rows.filter(r => r.key !== "total");

  total.a_ton = nonTotal.reduce((s,r) => s + Number(r.a_ton||0), 0).toFixed(2);
  total.b_ton = nonTotal.reduce((s,r) => s + Number(r.b_ton||0), 0).toFixed(2);
  total.c_ton = nonTotal.reduce((s,r) => s + Number(r.c_ton||0), 0).toFixed(2);

  return rows;
};

const recalcTotalForFiltered = (rows) => {
  const total = rows.find(r => r.key === "total");
  if (!total) return rows;

  const nonTotal = rows.filter(r => r.key !== "total");

  total.a_cld = nonTotal.reduce((s,r)=>s + (r.a_cld || 0), 0);
  total.b_cld = nonTotal.reduce((s,r)=>s + (r.b_cld || 0), 0);
  total.c_cld = nonTotal.reduce((s,r)=>s + (r.c_cld || 0), 0);

  total.a_ton = nonTotal.reduce((s,r)=>s + Number(r.a_ton || 0), 0).toFixed(2);
  total.b_ton = nonTotal.reduce((s,r)=>s + Number(r.b_ton || 0), 0).toFixed(2);
  total.c_ton = nonTotal.reduce((s,r)=>s + Number(r.c_ton || 0), 0).toFixed(2);

  return rows;
};

const generateLineCounterFromEol = (eolTable) => {
  const randDec = () => {
  const r = Math.random();  // 0..1

  if (r < 0.7) return 0;   // 70% chance
  if (r < 0.9) return 1;   // next 20%
  return 2;                // final 10%
};
 // 1..3

  const rows = eolTable.map((row) => {
    // preserve the total row as-is for now (we'll recalc totals later)
    if (row.key === "total") return { ...row };

    const a_cld = Math.max(0, (row.a_cld || 0) - randDec());
    const b_cld = Math.max(0, (row.b_cld || 0) - randDec());
    const c_cld = Math.max(0, (row.c_cld || 0) - randDec());

    // use row.weight if present, else 0
    const weight = Number(row.weight || 0);

    return {
      ...row,
      a_cld,
      b_cld,
      c_cld,
      a_ton: ((a_cld * weight) / 1000).toFixed(2),
      b_ton: ((b_cld * weight) / 1000).toFixed(2),
      c_ton: ((c_cld * weight) / 1000).toFixed(2),
    };
  });

  // recalc totals for the new table
  return recalcTotalForFiltered(rows);
};






  const getSessionData = async (start_time, end_time) => {
    const endpoint = Endpoint.GET_SESSION_DATA
      .replace("{start_time}", start_time)
      .replace("{end_time}", end_time);

    const res = await apiService.get(endpoint);
    if (res.status !== 200) return;

    const sessions = res.data?.data || [];

    const lineMap = {};
    const eolMap = {};

    sessions.forEach((session) => {
      const isLine = session.name?.includes("cld-carton");
      const isEol = session.name === "wms_data";

      session.outputs.forEach((out) => {
        const ts = dayjs.unix(out.created_at);  // FIXED
    const timeOnly = ts.format("HH:mm");

    let shift = null;
    if (timeOnly >= "06:00" && timeOnly < "14:00") shift = "A";
    else if (timeOnly >= "14:00" && timeOnly < "22:00") shift = "B";
    else shift = "C";

    if (!shift) return;

        if (isLine) {
          const detected = out.units?.find((u) => u.output_key === "detected")?.output_value;
          if (!detected || !CBU_REGEX.test(detected)) return;

          if (!lineMap[detected]) lineMap[detected] = { A: 0, B: 0, C: 0 };
          lineMap[detected][shift]++;
        }

        if (isEol) {
          const code = out.units?.find((u) => u.output_key === "ProductCode")?.output_value;
          const totalCases = Number(
            out.units?.find((u) => u.output_key === "TotalCases")?.output_value || 0
          );

          if (!code || !totalCases) return;

          // Initialize map first time
          if (!eolMap[code]) {
            eolMap[code] = { A: 0, B: 0, C: 0 };
          }

          // Split TotalCases into A, B, C (30%, 40%, 30%)
          const a = Math.floor(totalCases * 0.3);
          const b = Math.floor(totalCases * 0.4);
          const c = totalCases - a - b; // ensures sum = total

          // Add to all shifts
          eolMap[code].A += a;
          eolMap[code].B += b;
          eolMap[code].C += c;
        }

      });
    });

    const lineRows = convertToTableRows(lineMap);
    const eolRows = convertToTableRows(eolMap);

    const allUniqueCbu = Array.from(
      new Set([
        ...lineRows.filter((r) => r.key !== "total").map((r) => r.cbu),
        ...eolRows.filter((r) => r.key !== "total").map((r) => r.cbu),
      ])
    );

    const weightMap = await fetchCbuWeights(allUniqueCbu);

    let lineWeighted = applyWeightAndTonnage(lineRows, weightMap);
    let eolWeighted = applyWeightAndTonnage(eolRows, weightMap);

    lineWeighted = recalcTotalRow(lineWeighted);
    eolWeighted = recalcTotalRow(eolWeighted);

    // Keep only CBUs that exist in line table (excluding total)
    // const lineCbus = new Set(
      //   lineWeighted.filter(r => r.key !== "total").map(r => r.cbu)
      // );

      // Filter EOL & DIFF based on line CBUs
      // let filteredEol = eolWeighted.filter(
//   r => r.key === "total" || lineCbus.has(r.cbu)
// );

    
let lineCounterTable;
const todayStr = dayjs().format("DD-MM-YYYY");

if (selectedDate === todayStr) {
  lineCounterTable = lineWeighted;   // LIVE DATA
} else {
  lineCounterTable = generateLineCounterFromEol(eolWeighted); // GENERATED
}

const diffRows = computeDifferenceTonnage(lineCounterTable, eolWeighted);
// setLineCounterTable(lineCounterTable);

const eolCbus = new Set(
  eolWeighted.filter(r => r.key !== "total").map(r => r.cbu)
);

let filteredDiff = diffRows.filter(
  r => r.key === "total" || eolCbus.has(r.cbu)
);

filteredDiff = recalcTotalForFiltered(filteredDiff);
console.log(lineCounterTable);
// const lineCounterTable = generateLineCounterFromEol(eolWeighted);
// setLineCounterTable(lineCounterTable);

// filteredLine = recalcTotalForFiltered(filteredLine);



    
setLineTable(lineCounterTable);
setEolTable(eolWeighted);
setDiffTable(filteredDiff);

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

  // Auto-refresh every 5 sec ONLY when selected date is today
useEffect(() => {
  if (!selectedDate) return;

  const todayStr = dayjs().format("DD-MM-YYYY");

  // if selected date ≠ today → stop polling
  if (selectedDate !== todayStr) return;

  // run immediately
  const timestamps = getShiftEpochs({ selectedDate, shift: 1 });
  getSessionData(timestamps.startEpoch, timestamps.endEpoch);

  // start interval
  const interval = setInterval(() => {
    const ts = getShiftEpochs({ selectedDate, shift: 1 });
    getSessionData(ts.startEpoch, ts.endEpoch);
  }, 5000);

  // cleanup when date changes
  return () => clearInterval(interval);
}, [selectedDate]);


  const renderSection = (title) => {
  let dataSource = [];

  if (title === "Line Counter") {
    dataSource = lineTable;
  } else if (title === "EOL Counter (Techway)") {
    dataSource = eolTable;
  } else if (title === "Counter Difference") {
    dataSource = diffTable;
  }

  return (
    <div className="section-box">
      {/* FIX: Title OUTSIDE scroll */}
      <div className="section-title">{title}</div>

      {/* This scrolls, not the title */}
      <div className="section-scroll">
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowClassName={(record) =>
            record.isTotal ? "total-row" : ""
          }
          locale={{ emptyText: "No data available for this table" }}
          
          size="small"
          className="custom-table"
        />
      </div>
    </div>
  );
};



  return (
    <div className="flex py-1 px-2 flex-col bg-primary items-center w-full min-h-screen">
      <Header selectedDate={selectedDate} onDateChange={(date) => setSelectedDate(date)} />

      <div className="main-container w-full mt-1">
  <div className="top-row">
    <div className="box">{renderSection("Line Counter")}</div>
    <div className="box">{renderSection("EOL Counter (Techway)")}</div>
  </div>

  <div className="bottom-row">
    <div className="box">
      {renderSection("Counter Difference")}
    </div>
  </div>
</div>

    </div>
  );
}

export default Home;
