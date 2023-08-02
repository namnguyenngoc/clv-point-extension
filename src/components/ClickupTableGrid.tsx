import React, { useState, CSSProperties } from "react";

import {
    DataSheetGrid,
    checkboxColumn,
    textColumn,
    keyColumn,
    intColumn,
    floatColumn,
    dateColumn
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
        ...defaultSize,
      },
      {
        ...keyColumn('module', textColumn),
        title: 'Module',
        frozen: true,
        ...defaultSize,
      },
      {
        ...keyColumn('clk_parent_nm', textColumn),
        title: 'Story',
        frozen: true,
        ...defaultSizeNm,
      },
      {
        ...keyColumn('task_nm', textColumn),
        title: 'Name',
        frozen: true,
        ...defaultSizeFullNm,
      },
      {
        ...keyColumn('assignees_full', textColumn),
        title: 'PIC(s)',
        ...defaultSizeNm,
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
        ...keyColumn('USP', intColumn),
        title: 'USP DONE',
        ...defaultSize,
      },
      {
        ...keyColumn('status_nm', textColumn),
        title: 'Status',
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
  
    return (
      <DataSheetGrid
        value={props.taskList}
        columns={columns} 
      />
    )
  }