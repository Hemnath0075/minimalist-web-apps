// columns.js
export const generateSectionColumns = () => {
  return [
    {
      title: "CBU Code",
      dataIndex: "cbu",
      key: "cbu",
      align: "center",
    },
    {
      title: "A",
      children: [
        {
          title: "CLD",
          dataIndex: "a_cld",
          key: "a_cld",
          align: "center",
        },
        {
          title: "Tonnage",
          dataIndex: "a_ton",
          key: "a_ton",
          align: "center",
        },
      ],
    },
    {
      title: "B",
      children: [
        {
          title: "CLD",
          dataIndex: "b_cld",
          key: "b_cld",
          align: "center",
        },
        {
          title: "Tonnage",
          dataIndex: "b_ton",
          key: "b_ton",
          align: "center",
        },
      ],
    },
    {
      title: "C",
      children: [
        {
          title: "CLD",
          dataIndex: "c_cld",
          key: "c_cld",
          align: "center",
        },
        {
          title: "Tonnage",
          dataIndex: "c_ton",
          key: "c_ton",
          align: "center",
        },
      ],
    },
  ];
};

// Generate empty rows
export const generateRowsWithTotal = (count = 6) => {
  const rows = Array.from({ length: count }).map((_, i) => ({
    key: i,
    cbu: "-",
    a_cld: "-",
    a_ton: "-",
    b_cld: "-",
    b_ton: "-",
    c_cld: "-",
    c_ton: "-",
  }));

  return [
    ...rows,
    {
      key: "total",
      cbu: "Total",
      a_cld: "-",
      a_ton: "-",
      b_cld: "-",
      b_ton: "-",
      c_cld: "-",
      c_ton: "-",
      isTotal: true,
    },
  ];
};

