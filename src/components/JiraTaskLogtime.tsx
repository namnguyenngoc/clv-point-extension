import React, { useState,CSSProperties,useEffect } from "react";
import axios from "axios";
import myData from '../data.json';
import moment from 'moment';
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import ACC_SHEET_API from '../credentials.json';
import DataTable, { createTheme } from 'react-data-table-component';
import ScaleLoader from "react-spinners/ScaleLoader";
import { 
  GET_STORY_VIA_SPRINT, 
  convertNumberToTimeString, 
  GET_SPRINT_LIST,
  FORMAT_NUMBER,
  GET_BOARD_LIST } from '../commonPIM';
import { CSVLink, CSVDownload } from "react-csv";


const InputMemberOption = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  // styles
  let bg = "transparent";
  if (isFocused) bg = "#eee";
  if (isActive) bg = "#B2D4FF";

  const style = {
    alignItems: "center",
    backgroundColor: bg,
    color: "inherit",
    display: "flex "
  };

  // prop assignment
  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
    >
      {children}
    </components.Option>
  );
};

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#36d7b7",
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  background: "rgb(255, 255, 255, 0.4)",
  textAlign: "center",
  paddingTop: "21%",
};

export default function JiraTaskLogtime(props) {
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#0E71CC");
  let [totalEffort, setTotalEffort] = useState(0);
  let [REWORK_RATE, setREWORK_RATE] = useState(0);
  let [BUG_RATE, setBUG_RATE] = useState(0);
  let [STORY_POINT, setSTORY_POINT] = useState(0);
  
  
  const url = 'https://blueprint.cyberlogitec.com.vn/api';
  const DT_FM = 'YYYYMMDD';
  const [memberSelect, setMemberSelect] = useState(null);
  const [sprintList, setSprintList] = useState([]);
  const [boardList, setBoardList] = useState([]);
  const [BOARD, setBOARD] = useState([]);
  
  const [SPRINT, setSPRINT] = useState(null);

  const today = moment(new Date());
  console.log("today", today);
  const firstDayOfMonth = today.clone().startOf("month");
  // const newFirstDay = new Date(today.year(), today.month(), firstDayOfMonth);
  
  const [startDate, setStartDate] = useState(firstDayOfMonth._d);
  const [endDate, setEndDate] = useState(new Date());
  const [taskList, setTaskList] = useState([]);
  const [defectList, setDefectList] = useState([]);

  const [excelData, setExcelData] = useState<{ name: string }[]>([]);

  const columns = [
    {
        name: 'key',
        width: "180px",
        selector: row => row.Key,
    },
    {
      name: 'USP',
      width: "80px",
      right: "yes",
      selector: row => row.fields.customfield_10106,
  },
    
    {
      name: 'Progress',
      selector: row =>row.Progress,
    },
    {
      name: 'Assignee',
      selector: row =>row.Assignee
    },
    {
      name: 'Estimate',
      right: "yes",
      selector: row => row.Aggregatetimespent,
      cell: row => (
        convertNumberToTimeString(row.fields.aggregatetimespent)
      )
     
    },
    {
      name: 'Total Log',
      right: "yes",
      // selector: row => row.fields.worklog,
      cell: row => (
        row.fields.worklog ? convertNumberToTimeString(row.fields.worklog.worklogs.reduce((n, {timeSpentSeconds}) => n + timeSpentSeconds, 0)) : 0
      ),
      
    },
    {
      name: 'Rework Time',
      right: "yes",
      selector: row => row.total_rework_time,
      cell: row => (
        convertNumberToTimeString(row.total_rework_time)
      )
    },
    {
      name: 'Reward Rate',
      right: "yes",
      cell: row => (
        row.fields.worklog && row.fields.worklog.worklogs.reduce((n, {timeSpentSeconds}) => n + timeSpentSeconds, 0) > 0 ? FORMAT_NUMBER(row.total_rework_time/row.fields.worklog.worklogs.reduce((n, {timeSpentSeconds}) => n + timeSpentSeconds, 0), 2) : 0
      ),
    },
    {
      name: 'Parent',
      center: "yes",
      cell: row => (
        row.fields.parent?.key
      ),
    },
    
  
  ]
  const columnsDefect = [
    {
        name: 'key',
        width: "180px",
        selector: row => row.Key,
    },
    {
      name: 'USP',
      width: "80px",
      right: "yes",
      selector: row => row.fields.customfield_10106,
  },
    
    {
      name: 'Progress',
      selector: row =>row.Progress,
    },
    {
      name: 'Assignee',
      selector: row =>row.Assignee
    },
    {
      name: 'Estimate',
      right: "yes",
      selector: row => row.Aggregatetimespent,
      cell: row => (
        convertNumberToTimeString(row.fields.aggregatetimespent)
      )
     
    },
    {
      name: 'Total Log',
      right: "yes",
      // selector: row => row.fields.worklog,
      cell: row => (
        row.fields.worklog ? convertNumberToTimeString(row.fields.worklog.worklogs.reduce((n, {timeSpentSeconds}) => n + timeSpentSeconds, 0)) : 0
      ),
      
    },
    {
      name: 'Rework Time',
      right: "yes",
      selector: row => row.total_rework_time,
      cell: row => (
        convertNumberToTimeString(row.total_rework_time)
      )
    },
    {
      name: 'Reward Rate',
      right: "yes",
      cell: row => (
        row.fields.worklog && row.fields.worklog.worklogs.reduce((n, {timeSpentSeconds}) => n + timeSpentSeconds, 0) > 0 ? FORMAT_NUMBER(row.total_rework_time/row.fields.worklog.worklogs.reduce((n, {timeSpentSeconds}) => n + timeSpentSeconds, 0), 2) : 0
      ),
    },
    {
      name: 'Parent',
      center: "yes",
      cell: row => (
        row.fields.parent.key
      ),
    },
   
  
  ]

   async function searchTaskOfUser(item:any) {
    let ro = {
      "usrId": item.userId,
      "stDt": moment(startDate).format("YYYYMMDD"),
      "endDt": moment(endDate).format("YYYYMMDD"),
      "procFlg":"F",
      "beginIdx":0,
      "pageChanged":false,
      "endIdx":200,
    };
  
    // console.log("RO", ro);

    // console.log("reqee", req)
    const response = await axios.post(`${url}/uiPim026/searchTaskOfUser`, ro)
      .then(async function (response) {
        return response.data;
    });

  
    // console.log("response", response);
    return new Promise((resolve, reject) => {
        resolve(response);
    });
  }
  const workday_count = (start, end) => {
    var first = start.clone().endOf("week"); // end of first week
    var last = end.clone().startOf("week"); // start of last week
    var days = (last.diff(first, "days") * 5) / 7; // this will always multiply of 7
    var wfirst = first.day() - start.day(); // check first week
    if (start.day() == 0) --wfirst; // -1 if start with sunday
    var wlast = end.day() - last.day(); // check last week
    if (end.day() == 6) --wlast; // -1 if end with saturday
    var holidays = count_holiday(start, end);
    return wfirst + Math.floor(days) + wlast - holidays; // get the total
  };   

  const count_holiday = (start, end) => {
    let count = 0;
    while (start <= end) {
      console.log("start", start.format(DT_FM));
      if(myData.workingDay.holidays.find(({ holidayDate }) => holidayDate == start.format(DT_FM))){
        count++;
      }
      start = start.add(1, "days");
     
    }
    return count;
  };
  
  const selectTaskByUser = async (memSelect: any) => {
    setLoading(true);

    const strFrm = moment(startDate);
    const endFrm = moment(endDate);
    const workday = workday_count(strFrm, endFrm);
    const lvlList = myData.levelList;
    setWorkday(workday);

    const diffMonth = moment(endFrm._i).diff(moment(strFrm._i), 'months', true);
    setMonthDay(Math.round(diffMonth));

    if(startDate && endDate) {

      const newList = await searchTaskOfUser(memSelect).then(result => {
        let newData =  [...result.lstTaskVO];
        const sum = newData.reduce((accumulator, object) => {
          return accumulator + Number(object.efrtNo);
        }, 0);
        setTotalEffort(sum);
        const grouped = groupBy(newData, task => task.pjtNm);

        let groupTotal = grouped.get("New US FWD");

        const sumFWD = groupTotal.reduce((accumulator, object) => {
          return accumulator + Number(object.efrtNo);
        }, 0);
        setTotalEffortFWD(sumFWD);
        

        console.log("groupTotal", groupTotal);
        setTaskList(result.lstTaskVO);
        setLoading(false);
      }).catch(e => {
        console.log("400", e);
        setLoading(false);
      });
    
     
    }
  }

  /**
   * @description
   * Takes an Array<V>, and a grouping function,
   * and returns a Map of the array grouped by the grouping function.
   *
   * @param list An array of type V.
   * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
   *                  K is generally intended to be a property key of V.
   *
   * @returns Map of the array grouped by the grouping function.
   */
  //export function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
  //    const map = new Map<K, Array<V>>();
  function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
  }

  //formatPrice(item.pointOnHour.expect * workday * 8 ,0)
  useEffect(()=>{
    setLoading(true);
    
    // let BOARD_DEFAULT = localStorage.getItem("BOARD_DEFAULT");

    
    GET_BOARD_LIST().then((_data) => {
      console.log("BOARD_LIST", _data);
      setBoardList(_data);
      setLoading(false);
      return _data;
      
    }).catch(e => {
      setLoading(false);
    });

   
  },[])
  return (
    <div className="grid grid-flow-row gap-2">
      
      <div className="grid grid-flow-col gap-1 px-2 pt-1 pb-2">
        <div>
          <Select
            closeMenuOnSelect={true}
            hideSelectedOptions={false}
            isClearable={true}
            onChange={(mem) => {
              setBOARD(mem);
              console.log("SPRINT_LIST mem", mem);
              if (mem) {
                // GET_SPRINT_LIST(mem.value, 'state=active').then((_data) => {
                GET_SPRINT_LIST(mem.value).then((_data) => {
                  console.log("SPRINT_LIST", _data);
                  setSprintList(_data);
                  // return _data;
                });
              }


            }
            } 
            options={boardList}
            components={{
              Option: InputMemberOption
            }}
          />
        </div>
        <div>
          <Select
            closeMenuOnSelect={true}
            hideSelectedOptions={false}
            isClearable={true}
            onChange={(sprint) => {
              setSPRINT(sprint);
              
            }
            } 
            options={sprintList}
            components={{
              Option: InputMemberOption
            }}
          />
        </div>
        <div  className="grid grid-flow-col gap-1 px-2">
          <button 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4">
            {STORY_POINT}
          </button>
          <button 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4">
            Bug Rate: {BUG_RATE}
          </button>
          <button 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4">
            Rework Rate: {REWORK_RATE}
          </button>
       
          <CSVLink data={excelData}  className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4" >Excel</CSVLink>
          <button 
            type="button" 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4" 
            onClick={event => {
              setLoading(true);
              setTaskList([]);
              setExcelData([]);
              if(SPRINT != undefined && SPRINT.value != undefined) {
                let ARR_DEFECT = [];
                
                GET_STORY_VIA_SPRINT(SPRINT.value).then((_data) => {
                  return Promise.all([..._data]).then(_item => {
                    // setDefectList
                    // update excel list
                    let _excelData: Array<{ name: string }> = [..._item.map((item: any) => {
                      let __item = {
                        "Key": item.key
                        ,"Progress": item.fields.status.name
                        ,"Assignee": item.fields.assignee ? item.fields.assignee.displayName : ""
                        ,"Aggregatetimespent": convertNumberToTimeString(item.fields.aggregatetimespent)
                        ,"TotaLogRow": item.fields.worklog ? convertNumberToTimeString(item.fields.worklog.worklogs.reduce((n, {timeSpentSeconds}) => n + timeSpentSeconds, 0)) : 0
                        ,"TotaLogRowValue": item.fields.worklog ? item.fields.worklog.worklogs.reduce((n, {timeSpentSeconds}) => n + timeSpentSeconds, 0) : 0
                        ,"TotalReworkRate": convertNumberToTimeString(item.total_rework_time)
                        ,"RatioRework":  item.fields.worklog && item.fields.worklog.worklogs.reduce((n, {timeSpentSeconds}) => n + timeSpentSeconds, 0) > 0 ? FORMAT_NUMBER(item.total_rework_time/item.fields.worklog.worklogs.reduce((n, {timeSpentSeconds}) => n + timeSpentSeconds, 0), 2) : 0
                        ,"RatioReworkValue": item.fields.worklog && item.fields.worklog.worklogs.reduce((n, {timeSpentSeconds}) => n + timeSpentSeconds, 0) > 0 ? item.total_rework_time/item.fields.worklog.worklogs.reduce((n, {timeSpentSeconds}) => n + timeSpentSeconds, 0) : 0
                        ,...item
                      };
                      if(item.fields.issuetype?.subtask == true) {
                        ARR_DEFECT.push({...__item});
                      }
                      return  __item;
                    })
                    ];

                    let totalLog = _excelData.reduce((n, {TotaLogRowValue}) => n + TotaLogRowValue, 0);
                    let totalDefect = _excelData.reduce((n, {total_rework_time}) => n + total_rework_time, 0);
                  

                    let totalPoint = _excelData.reduce((accumulator, current) => {
                        return accumulator + current.fields.customfield_10106;
                    }, 0);
                    
                    let RATIO = totalDefect/totalLog;
                    setREWORK_RATE(FORMAT_NUMBER(RATIO, 2));

                    let totalPointSub = _excelData.reduce((accumulator, current) => {
                      if (current.issuetype?.subtask == true) {
                        return accumulator + current.fields.customfield_10106;
                      } else {
                          return accumulator;
                      }
                    }, 0);
                    let countSubTask = _excelData.reduce((accumulator, current) => {
                      let countSubTask = 0;
                      
                      current.fields.subtasks?.forEach(element => {
                        if(element.fields.summary.toUpperCase().includes("[DEFECT]")){
                          countSubTask ++;
                        }
                      });

                      return accumulator +  countSubTask;
                    }, 0);

                    setBUG_RATE(countSubTask);

                    console.log("ARR_DEFECT", ARR_DEFECT);

                    setDefectList(ARR_DEFECT);
                    setSTORY_POINT(totalPoint);
                    setTaskList(_excelData);
                    setExcelData(_excelData);

                    setLoading(false);
            
                  }).catch(e => {
                    setLoading(false);
                  });
                  
                });
              }
            }}>
            Search
          </button>
          
        </div>
        
      </div>
      <div className="grid grid-flow-row gap-1 px-2">
        <DataTable
            columns = {columns}
            theme="default"
            fixedHeader
            fixedHeaderScrollHeight="410px"
            data = {
              taskList
            }
            onRowDoubleClicked = { event => onRowDoubleClicked (event)}
            selectableRows
            selectableRowsHighlight
            className="rdt_Table_custom"
        />
      </div>
      <div className="grid grid-flow-row gap-1 px-2 soild-2p">
        <DataTable
            columns = {columnsDefect}
            theme="default"
            fixedHeader
            fixedHeaderScrollHeight="210px"
            data = {
              defectList
            }
            onRowDoubleClicked = { event => onRowDoubleClicked (event)}
            selectableRows
            selectableRowsHighlight
            className="rdt_Table_custom"
        />
      </div>
      <ScaleLoader
          color={color}
          loading={loading}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
      />
    </div>
  );
}