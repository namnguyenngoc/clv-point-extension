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
  
export default function CapaList (props) {
  // useEffect(() => {
  //   console.log("use");
  //   // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoList));
  //   setTodoList(props.data);
  // }, [todoList]);


  const columns = [
    {
      name: 'req_clickup_id',
      with: "50px",
      selector: row => row.req_clickup_id,
      cell: row => row.req_clickup_id,
    },
    {
      name: 'req_bp_id',
      with: "50px",

      selector: row => row.req_bp_id,
      cell: row => row.req_bp_id,
    },
    {
      name: 'bug_no',
      with: "50px",

      selector: row => row.bug_no,
      cell: row => row.bug_no,
    },
    {
      name: 'situation',
      selector: row => row.situation,
      cell: row => row.situation,
    },
    {
      name: 'capa_type',
      with: "150px",
      selector: row => row.capa_type,
      cell: row => row.capa_type,
    },
    {
      name: 'team',
      with: "150px",
      selector: row => row.team,
      cell: row => row.team,
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