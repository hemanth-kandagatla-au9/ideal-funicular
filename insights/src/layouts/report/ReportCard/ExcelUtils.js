import { utils, writeFile } from "xlsx";
import * as XLSX from "xlsx";

const exportDataToExcel = (jsonData, fileName) => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace("T", "_")
    .replace(/\..+/, "");
  const nameWithTimeStamp = `${fileName}_${timestamp}.xlsx`;

  const wb = utils.book_new();
  const ws = utils.json_to_sheet(jsonData);
  const columnWidths = [];

  const headers = utils.sheet_to_json(ws, { header: 1 })[0];
  headers.forEach((header, colIndex) => {
    const headerWidth = (header.length + 2) * 1.2;
    columnWidths[colIndex] = headerWidth;
  });

  jsonData.forEach((row) => {
    Object.keys(row).forEach((key, colIndex) => {
      const cellContent = row[key] ? row[key]?.toString() : "";
      const cellWidth = cellContent.length * 1.2;
      if (!columnWidths[colIndex] || cellWidth > columnWidths[colIndex]) {
        columnWidths[colIndex] = cellWidth;
      }
    });
  });

  ws["!cols"] = columnWidths.map((width) => ({ width }));
  utils.book_append_sheet(wb, ws, "Data");
  writeFile(wb, nameWithTimeStamp);
};

const exportToExcel = (headers, data, fileName) => {
  const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");

  const worksheetData = data.map((row) =>
    headers.reduce((acc, header) => {
      acc[header.label] = row[header.key];
      return acc;
    }, {})
  );

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`);
};

const ExcelUtils = { exportDataToExcel, exportToExcel };

export default ExcelUtils;
