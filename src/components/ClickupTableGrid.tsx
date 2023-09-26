import React, { useState, CSSProperties } from "react";

import {
    DataSheetGrid,
    checkboxColumn,
    textColumn,
    keyColumn,
    intColumn,
    floatColumn,
    dateColumn,
  } from 'react-datasheet-grid'
  
  // Import the style only once in your app!
  import 'react-datasheet-grid/dist/style.css'
  
  export default function ClickupTableGrid (props) {
    // const [ data, setData ] = useState([
    //   { active: true, firstName: 'Elon', lastName: 'Musk' },
    //   { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    // ])
    const defaultSize = { width: 1};
    const defaultSizeIdx = { width: 1, minWidth: 30};
    const defaultSizeNm = { width: 1, minWidth: 300};
    const defaultSizeFullNm = { width: 1, minWidth: 400};
    const defaultSizePIC = { width: 1, minWidth: 100};
    const defaultSizeNumber = { width: 1, minWidth: 50};
    let [totalEffort, setTotalEffort] = useState("");

    const columns = [
    //   {
    //     ...keyColumn('active', checkboxColumn),
    //     title: 'Active',
    //   },
      // {
      //   ...keyColumn('url', textColumn),
      //   title: 'Link',
      //   frozen: true,
      //   ...defaultSize,
      // },
      {
        ...keyColumn('id', textColumn),
        title: 'ID',
        cellClassName: "text-[#ff7800]",
        ...defaultSize,
      },
      {
        ...keyColumn('module', textColumn),
        title: 'Module',
        frozen: true,
        ...defaultSize,
        cellClassName: "text-[#02BCD4]",
      },
      {
        ...keyColumn('clk_parent_nm', textColumn),
        title: 'Story',
        cellClassName: (data: any, index: any) => {
          const rowData = data.rowData;
          if(rowData) {
            if(rowData.status.status){
              const classNm = `text-[${rowData.status.color}]`;
              return classNm;

            } else {
              return "";
            }
          } else {
            return "";
          }
        },
        ...defaultSizeNm,
      },
      {
        ...keyColumn('task_nm', textColumn),
        ...defaultSizeFullNm,
        title: 'Name',
        cellClassName: (data: any, index: any) => {
          const rowData = data.rowData;
          if(rowData) {
            if(rowData.status.status){
              const classNm = `text-[${rowData.status.color}]`;
              return classNm;

            } else {
              return "";
            }
          } else {
            return "";
          }
        },
      },
      {
        ...keyColumn('assignees_full', textColumn),
        ...defaultSizeNm,
        title: 'PIC(s)',
        cellClassName: "bg-[#F0FFFF]"
      },
      // {
      //   ...keyColumn('dev_point', intColumn),
      //   title: 'USP',
      //   ...defaultSizeNumber,
      // },
      // {
      //   ...keyColumn('test_nm', textColumn),
      //   title: 'PIC TEST',
      //   ...defaultSizePIC,
      // },
      // {
      //   ...keyColumn('test_point', intColumn),
      //   title: 'USP',
      //   ...defaultSizeNumber,

      // },
      {
        ...keyColumn('total_est', intColumn),
        ...defaultSize,
        title: 'USP',
        cellClassName: (data: any, index: any) => {
          const rowData = data.rowData;
          if(rowData) {
            if(rowData.clk_parent_nm){
              const classNm = "text-bold bg-[#F0FFFF]";
              return classNm;

            } else {
              return "";
            }
          } else {
            return "";
          }
        },
        
      },
      {
        ...keyColumn('status_nm', textColumn),
        title: 'Status',
        cellClassName: (data: any, index: any) => {
          const rowData = data.rowData;
          if(rowData) {
            if(rowData.status.status){
              const classNm = `text-[${rowData.status.color}]`;
              return classNm;

            } else {
              return "";
            }
          } else {
            return "";
          }
        },
        ...defaultSize,
      },
      {
        ...keyColumn('due_date_str', textColumn),
        title: 'Due Date',
        ...defaultSize,
      },
      {
        ...keyColumn('bp_task_startDateFm', textColumn),
        title: 'Start Date',
        ...defaultSize,
      },
      {
        ...keyColumn('bp_task_endDateFm', textColumn),
        title: 'End Date',
        ...defaultSize,
      },
      {
        ...keyColumn('bp_task_sumActEfrtMnt', textColumn),
        title: 'Act Dev',
        ...defaultSize,
      },
      {
        ...keyColumn('bp_task_test_sumActEfrtMnt', textColumn),
        title: 'Act TEST',
        ...defaultSize,
      },
      {
        ...keyColumn('creator_nm', textColumn),
        title: 'Created By',
        ...defaultSizePIC,
      },
      {
        ...keyColumn('seqNo', intColumn),
        title: 'BP#Seq',
        ...defaultSizeNumber,
      },
    ]

    const rowClassName = {
      rowData: "x",
      rowIndex: 1,
    }
  
    return (
      <DataSheetGrid
        value={props.taskList}
        columns={ columns } 
      />
    )
  }