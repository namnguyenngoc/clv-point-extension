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
    const defaultSizeNm = { width: 1, minWidth: 300};
    const columns = [
    //   {
    //     ...keyColumn('active', checkboxColumn),
    //     title: 'Active',
    //   },
      {
        ...keyColumn('url', textColumn),
        title: 'Link',
        ...defaultSize,
      },
      {
        ...keyColumn('idx', intColumn),
        title: 'No.',
        ...defaultSize,
      },
      {
        ...keyColumn('id', textColumn),
        title: 'ID',
        ...defaultSize,
      },
      {
        ...keyColumn('module', textColumn),
        title: 'Module',
        ...defaultSize,
      },
      {
        ...keyColumn('clk_parent_nm', textColumn),
        title: 'Parent',
        ...defaultSize,
      },
      {
        ...keyColumn('task_nm', textColumn),
        title: 'Name',
        ...defaultSizeNm,
      },
      {
        ...keyColumn('USP_dev_nm', textColumn),
        title: 'PIC DEV',
        ...defaultSize,
      },
      {
        ...keyColumn('USP_dev_point', intColumn),
        title: 'USP',
        ...defaultSize,
      },
      {
        ...keyColumn('USP_test_nm', textColumn),
        title: 'PIC TEST',
        ...defaultSize,
      },
      {
        ...keyColumn('USP_test_point', intColumn),
        title: 'USP',
        ...defaultSize,

      },
      {
        ...keyColumn('USP_DONE', intColumn),
        title: 'USP DONE',
        ...defaultSize,
      },
      {
        ...keyColumn('lastName', textColumn),
        title: 'Start Date',
        ...defaultSize,
      },
      {
        ...keyColumn('lastName', textColumn),
        title: 'End Date',
        ...defaultSize,
      },
      {
        ...keyColumn('lastName', textColumn),
        title: 'Act Dev',
        ...defaultSize,
      },
      {
        ...keyColumn('lastName', textColumn),
        title: 'Act TEST',
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
        ...keyColumn('creator_nm', textColumn),
        title: 'Created By',
        ...defaultSize,
      },
      {
        ...keyColumn('lastName', intColumn),
        title: 'BP#Seq',
        ...defaultSize,
      },
    ]
  
    return (
      <DataSheetGrid
        value={props.taskList}
        columns={columns} 
      />
    )
  }