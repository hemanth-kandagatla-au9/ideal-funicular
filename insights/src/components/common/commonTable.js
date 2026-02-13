import React from "react";
import { Table } from "react-bootstrap";
import Classes from "../auth/role/css/taskList.module.css";
import { UI_TEXTS } from "./Constants/label-contants";

const CommonTable = ({ data, columns, classes }) => {
  return (
    <Table className={classes?.table} responsive>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th
              key={index}
              className={classes?.tableText}
              style={{ textAlign: col.align || "left", ...col.style }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      
      <tbody>
        {data?.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr
              key={row._id || rowIndex}
              className={classes?.tableRow}
              style={{
                // borderLeft: row.isVisible
                //   ? "4px solid #0ca85d"
                //   : "4px solid #c4321d",
              }} 
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={classes?.tableCell} style={{}}>
                  {col.render ? col.render(row, rowIndex) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className={classes?.noDataText}>
              {UI_TEXTS.NOT_FOUND.NO_RECORDS_FOUND}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default CommonTable;
