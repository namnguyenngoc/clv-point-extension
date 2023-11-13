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
  
export default function DocumentGrid (props) {
  // useEffect(() => {
  //   console.log("use");
  //   // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoList));
  //   setTodoList(props.data);
  // }, [todoList]);


  const columns = [
    {
      name: 'Name',
      with: "150px",
      selector: row => row.name,
      cell: row => (
          <a href={row.info} target="_blank" rel="noopener noreferrer">
            {row.name}
          </a>
      ),
    },
    {
        name: 'info',
        selector: row => row.info,
        // cell: row => (
        //   // <a href={`https://blueprint.cyberlogitec.com.vn/UI_PIM_001_1/${row.reqId}`} target="_blank" rel="noopener noreferrer">
        //   //   {row.seqNo}
        //   // </a>
        // ),
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