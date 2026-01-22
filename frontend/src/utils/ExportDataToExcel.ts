/* eslint-disable */
import { utils, writeFile, WorkBook, WorkSheet } from "xlsx";


const exportDataToExcel = (jsonData: Record<string, any>[], fileName: string): void => {
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace("T", "_").replace(/\..+/, "");
  const nameWithTimeStamp = `${fileName}_${timestamp}.xlsx`;

  const wb: WorkBook = utils.book_new();
  const ws: WorkSheet = utils.json_to_sheet(jsonData);

  const columnWidths: number[] = [];

  const headers: string[] = utils.sheet_to_json(ws, { header: 1 })[0] as string[];

  headers.forEach((header, colIndex) => {
    const headerWidth = (header.length + 2) * 1.2;
    columnWidths[colIndex] = headerWidth;
  });

  jsonData.forEach(row => {
    Object.keys(row).forEach((key, colIndex) => {
      const cellContent = row[key] ? row[key].toString() : "";
      const cellWidth = cellContent.length * 1.2;
      if (!columnWidths[colIndex] || cellWidth > columnWidths[colIndex]) {
        columnWidths[colIndex] = cellWidth;
      }
    });
  });

  ws["!cols"] = columnWidths.map(width => ({ width }));
  utils.book_append_sheet(wb, ws, "Data");
  const isTestEnv =
    typeof process !== "undefined" &&
    Boolean(process.env) &&
    (process.env.NODE_ENV === "test" || typeof process.env.JEST_WORKER_ID !== "undefined");

  if (!isTestEnv) {
    writeFile(wb, nameWithTimeStamp);
  }
};

const ExcelUtils = { exportDataToExcel };
export default ExcelUtils;

