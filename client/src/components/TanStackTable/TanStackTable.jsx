import React from "react";
import { useTable } from "@tanstack/react-table";
import { Table } from "antd";

const TanStackTable = ({ role }) => {
  // Example column definitions for TanStack Table
  const columns = React.useMemo(
    () => [
      {
        header: "ID", // Changed 'Header' to 'header' per v8+ API
        accessorKey: "id", // Changed 'accessor' to 'accessorKey' per v8+ API
      },
      {
        header: "Name", // Changed 'Header' to 'header' per v8+ API
        accessorKey: "name", // Changed 'accessor' to 'accessorKey' per v8+ API
      },
      {
        header: "Status", // Changed 'Header' to 'header' per v8+ API
        accessorKey: "status", // Changed 'accessor' to 'accessorKey' per v8+ API
      },
    ],
    []
  );

  const data = React.useMemo(
    () => [
      { id: 1, name: "John Doe", status: "Active" },
      { id: 2, name: "Jane Smith", status: "Inactive" },
      { id: 3, name: "Sam Wilson", status: "Active" },
    ],
    []
  );

  const { getHeaderGroups, getRowModel, getTableProps, getTableBodyProps } =
    useTable({
      columns,
      data,
    });

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Sample Table for {role}</h3>
      <Table
        {...getTableProps()}
        bordered
        pagination={{ pageSize: 5 }}
        dataSource={data}
        columns={columns.map((col) => ({
          title: col.header,
          dataIndex: col.accessorKey, // 'accessorKey' instead of 'accessor'
        }))}
        rowKey="id"
      />
    </div>
  );
};

export default TanStackTable;
