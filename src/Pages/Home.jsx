import React from "react";
import Header from "../Components/Header";
import { Table } from "antd";
import { 
  generateSectionColumns, 
  generateRowsWithTotal 
} from "../Config/columns";  // <-- IMPORTANT

function Home() {
  const columns = generateSectionColumns();   // <-- FIXED
  const data = generateRowsWithTotal(6);      // <-- FIXED

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
      <Header />

      <div className="main-container w-full mt-1">
        <div className="top-row">
          <div className="box">{renderSection("Line Counter")}</div>
          <div className="box">{renderSection("EOL Counter (Techway)")}</div>
        </div>

        <div className="bottom-row">
          {renderSection("Counter Difference")}
        </div>
      </div>
    </div>
  );
}

export default Home;
