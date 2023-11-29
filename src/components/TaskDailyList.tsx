import React, { useState, CSSProperties, useRef, useEffect } from "react";

import DataTable, { createTheme } from 'react-data-table-component';
// createTheme creates a new theme named solarized that overrides the build in dark theme
createTheme('solarized', {
  text: {
    primary: '#268bd2',
    secondary: '#2aa198',
  },
  background: {
    default: '#ffffff',
  },
  context: {
    background: '#cb4b16',
    text: '#FFFFFF',
  },
  divider: {
    default: '#dcdcdc',
  },
  action: {
    button: 'rgba(0,0,0,.54)',
    hover: 'rgba(0,0,0,.08)',
    disabled: 'rgba(0,0,0,.12)',
  },
}, 'light');
const customStyles = {
  rows: {
      style: {
          minHeight: '72px', // override the row height,
          border: '1px solid #dcdcdc'
      },
  },
  headCells: {
      style: {
          paddingLeft: '8px', // override the cell padding for head cells
          paddingRight: '8px',
      },
  },
  cells: {
      style: {
          paddingLeft: '8px', // override the cell padding for data cells
          paddingRight: '8px',
          border: '1px solid #dcdcdc'
      },
  },
};
  
export default function TaskDailyList (props) {
  // useEffect(() => {
  //   console.log("use");
  //   // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoList));
  //   setTodoList(props.data);
  // }, [todoList]);


  const columns = [
    {
      name: 'ID',
      with: "100px",
      selector: row => row.id,
      cell: row => row.id,
    },
    {
      name: 'Name',
      selector: row => row.name,
      cell: row => row.name,
    },
    {
      name: 'PIC DEV',
      selector: row => row.pic_dev,
      cell: row => row.pic_dev,
    },
    {
      name: 'DEV TEST',
      selector: row => row.dev_test,
      cell: row => row.dev_test,
    },
    {
      name: 'TESTER',
      selector: row => row.tester,
      cell: row => row.tester,
    },
    {
      name: 'STATUS',
      selector: row => row.status,
      cell: row => row.status,
    },
    {
      name: 'EST END',
      selector: row => row.est_end_date,
      cell: row => row.est_end_date,
    },
  ];

  return (
    <DataTable
          columns = {columns}
          fixedHeader
          data = {
            props.data
          }
          // onRowDoubleClicked = { event => onRowDoubleClicked (event)}
          
          // conditionalRowStyles={conditionalRowStyles}
          theme="default"
      />
    
  )
}