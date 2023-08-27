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
  
  export default function BPTableGrid (props) {
    // const [ data, setData ] = useState([
    //   { active: true, firstName: 'Elon', lastName: 'Musk' },
    //   { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    // ])
    const defaultSize = { width: 1};
    const defaultSizeIdx = { width: 30, minWidth: 30};
    const defaultSizeNm = { width: 1, minWidth: 300};
    const defaultSizeFullNm = { width: 300, minWidth: 400};
    const defaultSizePIC = { width: 100, minWidth: 100};
    const defaultSizeNumber = { width: 50, minWidth: 50};
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
        ...keyColumn('seqNo', textColumn),
        title: 'ID',
        cellClassName: "text-[#ff7800]",
        ...defaultSizeIdx,
      },
      {
        ...keyColumn('pntNo', textColumn),
        title: 'Effort Point',
        cellClassName: 'text-right',
        ...defaultSizePIC,
      },
      
      {
        ...keyColumn('reqTitNm', textColumn),
        title: 'Name',
        ...defaultSizeFullNm,
        cellClassName: (data: any, index: any) => {
          const rowData = data.rowData;
          if(rowData) {
            if(rowData.colrVal){
              const classNm = `text-[#${rowData.colrVal}]`;
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
        ...keyColumn('createUser', textColumn),
        title: 'Created User',
        cellClassName: "bg-[#F0FFFF]",
        ...defaultSizePIC,
      },
      {
        ...keyColumn('PIC', textColumn),
        title: 'PIC User',
        cellClassName: "bg-[#F0FFFF]",
        ...defaultSizePIC,
      },
      // // {
      // //   ...keyColumn('dev_point', intColumn),
      // //   title: 'USP',
      // //   ...defaultSizeNumber,
      // // },
      // // {
      // //   ...keyColumn('test_nm', textColumn),
      // //   title: 'PIC TEST',
      // //   ...defaultSizePIC,
      // // },
      // // {
      // //   ...keyColumn('test_point', intColumn),
      // //   title: 'USP',
      // //   ...defaultSizeNumber,

      // // },
      // {
      //   ...keyColumn('USP', intColumn),
      //   ...defaultSize,
      //   title: 'USP DONE',
        
      // },
      {
        ...keyColumn('reqPhsNm', textColumn),
        title: 'Status',
        ...defaultSizePIC,
        cellClassName: (data: any, index: any) => {
          // const rowData = data.rowData;
          // if(rowData) {
          //   if(rowData.status.status){
          //     const classNm = `text-[${rowData.status.color}]`;
          //     return classNm;

          //   } else {
          //     return "";
          //   }
          // } else {
          //   return "";
          // }
        },
      },
      // {
      //   ...keyColumn('due_date_str', textColumn),
      //   title: 'Due Date',
      //   ...defaultSize,
      // },
      // {
      //   ...keyColumn('bp_task_startDateFm', textColumn),
      //   title: 'Start Date',
      //   ...defaultSize,
      // },
      // {
      //   ...keyColumn('bp_task_endDateFm', textColumn),
      //   title: 'End Date',
      //   ...defaultSize,
      // },
      // {
      //   ...keyColumn('bp_task_sumActEfrtMnt', textColumn),
      //   title: 'Act Dev',
      //   ...defaultSize,
      // },
      // {
      //   ...keyColumn('bp_task_test_sumActEfrtMnt', textColumn),
      //   title: 'Act TEST',
      //   ...defaultSize,
      // },
      // {
      //   ...keyColumn('creator_nm', textColumn),
      //   title: 'Created By',
      //   ...defaultSizePIC,
      // },
      
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