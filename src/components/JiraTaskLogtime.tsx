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
  const SHEET_ID = "Member_List";
  const RANGE_MEMBER_SHEET = 'A1:AT';
  const SPREADSHEET_ID = "10WPahmoB6Im1PyCdUZ_uda3fYijC8jKtHnRBasnTK3Y";
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#0E71CC");
  let [totalEffort, setTotalEffort] = useState(0);
  let [REWORK_RATE, setREWORK_RATE] = useState(0);
  let [BUG_RATE, setBUG_RATE] = useState(0);
  let [STORY_POINT, setSTORY_POINT] = useState(0);
  
  
  const url = 'https://blueprint.cyberlogitec.com.vn/api';
  const DT_FM = 'YYYYMMDD';
  const defaultMem = null;
  let allMember = [];
  // myData.memList.map(
  //   function (item) {
  //     // console.log("item", item);
  //     if(item.teamLocal.includes("NEWFWD")) {
  //       item.label = item.userId, //`${item.fullName}-${item.pointOnHour.expect}(${item.currentLevel})`;
  //       item.value = item.userId
  //       allMember.push(item);
  //       // return item;
  //     }
  // });
  let [lstMember, setLstMember] = useState(null);

  const [memberSelect, setMemberSelect] = useState(null);
  const [sprintList, setSprintList] = useState([]);
  const [boardList, setBoardList] = useState([]);
  const [BOARD, setBOARD] = useState(null);
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

  const [workday, setWorkday] = useState(0);
  const [monthDay, setMonthDay] = useState(0);

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
      name: 'Total Rework Time',
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
      name: 'Total Rework Time',
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
 
  const formatPrice = (value, tofix) => {
    if (!value) {
      return ''
    }
    const val = (value / 1).toFixed(tofix).replace(',', '.')
    if (!val) {
      return ''
    }

    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  };
  

  // https://blueprint.cyberlogitec.com.vn/api/uiPim026/searchUserInTeam
  async function searchUserInTeam() {
    let ro = {
      "stDt": moment(startDate).format("YYYYMMDD"),
      "endDt": moment(endDate).format("YYYYMMDD"),
      "procFlg": "DF",
      "beginIdx": 0,
      "endIdx": 25,
      "pageChanged": false,
      "coCd": "DOU",
      "lstTeamId": "ATM201705250009,ATM20170515000,ATM202309170005",
      "stsChanged": "N",
      "tskSts": "PR",
      "rsName": ""
  };
  

    // console.log("RO", ro);

    // console.log("reqee", req)
    const response = await axios.post(`${url}/uiPim026/searchUserInTeam`, ro)
      .then(async function (response) {
        return response.data.lstUserInTeam ;
    });

  
    // console.log("response", response);
    return new Promise((resolve, reject) => {
        resolve(response);
    });
  }
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
  


  async function getDailyTasksByUser(item:any) {
    let ro = {
      "usrId": item.userId,
      "fromDt": moment(startDate).format("YYYYMMDD"),
      "toDt": moment(endDate).format("YYYYMMDD")
    };
  
    // console.log("RO", ro);

    // console.log("reqee", req)
    const response = await axios.post(`${url}/uiPim026/getDailyTasksByUser`, ro)
      .then(async function (response) {
        return response.data;
    });

  
    // console.log("response", response);
    return new Promise((resolve, reject) => {
        resolve(response);
    });
  }
  const sumEfrtKnt = (arr) => {
    let sum = 0;
    for(let i = 0; i < arr.length; i ++){
      sum += arr[i].efrtKnt;
    }
    return sum;
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
  const selectMemberList = async () => {
    let arrMember = [];
    //Sheet Start
    // Initialize the sheet - doc ID is the long id in the sheets URL
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID); //script data
    // const doc = new GoogleSpreadsheet('16S2LDwOP3xkkGqXLBb30Pcvvnfui-IPJTXeTOMGCOjk');
  
    
    
    // Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    await doc.useServiceAccountAuth({
      // env var values are copied from service account credentials generated by google
      // see "Authentication" section in docs for more info
      client_email:  ACC_SHEET_API.client_id,
      private_key: ACC_SHEET_API.private_key,
    });
    await doc.loadInfo(); // loads document properties and worksheets
    console.log("LOAD", doc.title);
    const sheet = doc.sheetsByTitle[SHEET_ID]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    
    const range = RANGE_MEMBER_SHEET; //'A1:AB50'
    await sheet.loadCells(range); // loads range of cells into local cache - DOES NOT RETURN THE CELLS
    
    for(let i = 0; i < 18; i ++) {
      const empCode = sheet.getCell(i, 0); // access cells using a zero-based index
      const userId = sheet.getCell(i, 1); // access cells using a zero-based index
      const fullName = sheet.getCell(i, 2); // access cells using a zero-based index
      const leaveTeam = sheet.getCell(i, 26); // access cells using a zero-based index = sheet.getCell(i, 2); // access cells using a zero-based index
      // console.log("leaveTeam.formattedValue", leaveTeam.formattedValue);
      if(empCode.formattedValue != "" 
        && userId.formattedValue != "" 
        && fullName.formattedValue != ""
        && leaveTeam.formattedValue == "N") {
            let mem = {
                "empCode":        sheet.getCell(i, 0).formattedValue,
                "userId":         sheet.getCell(i, 1).formattedValue,
                "fullName":       sheet.getCell(i, 2).formattedValue,
                "currentLevel":   sheet.getCell(i, 3).formattedValue,
                "lvlCode":        sheet.getCell(i, 4).formattedValue,
                "levelRating":    sheet.getCell(i, 5).formattedValue,
                "targetLevel":    sheet.getCell(i, 6).formattedValue,
                "tagartRating":   sheet.getCell(i, 7).formattedValue,
                "pointOnHour": {
                  "standard":   sheet.getCell(i, 38).formattedValue,
                  "timeStandard":   sheet.getCell(i, 39).formattedValue,
                  "expect":     sheet.getCell(i, 9).formattedValue,
                  "description": sheet.getCell(i, 10).formattedValue,
                  "averageEffortPoint":sheet.getCell(i, 39).formattedValue,
                  "minEffortPoint":sheet.getCell(i, 40).formattedValue,
                  "maxEffortPoint":sheet.getCell(i, 41).formattedValue,
                  "effortPointByCurrentLevel":sheet.getCell(i, 42).formattedValue,
                  "effortPointByTargetLevel":sheet.getCell(i, 43).formattedValue,

                },
                "role":           sheet.getCell(i, 11).formattedValue.split(","),
                "workload":       sheet.getCell(i, 12).formattedValue,
                "pointStandard":  sheet.getCell(i, 13).formattedValue, //FINISHE / RECEIVED
                "teamLocal":      sheet.getCell(i, 14).formattedValue.split(","),
                "dedicated":      sheet.getCell(i, 15).formattedValue,
                "blueprint_id":   sheet.getCell(i, 16).formattedValue,
                "blueprint_nm":   sheet.getCell(i, 17).formattedValue,
                "clickup_id":     sheet.getCell(i, 18).formattedValue,
                "clickup_nm":     sheet.getCell(i, 19).formattedValue,
                "effectDateFrom": sheet.getCell(i, 20).formattedValue,
                "effectDateTo":   sheet.getCell(i, 21).formattedValue,
                "preReviewDate":  sheet.getCell(i, 22).formattedValue,
                "nextReviewDate": sheet.getCell(i, 23).formattedValue,
                "phone":          sheet.getCell(i, 24).formattedValue,
                "clvEmail":       sheet.getCell(i, 25).formattedValue,
                "leaveTeam":      sheet.getCell(i, 26).formattedValue,
                "leaveCompany":   sheet.getCell(i, 27).formattedValue,
                "maxLevelTaskGap":sheet.getCell(i, 32).formattedValue,
                "minPoint"        :sheet.getCell(i, 33).formattedValue,
                "maxPoint"        :sheet.getCell(i, 34).formattedValue,
                "target"        :sheet.getCell(i, 36).formattedValue,
            }
            arrMember.push(mem);
      }
      
    }
    // console.log("arrMember", arrMember);
    return new Promise((resolve, reject) => {
      resolve(arrMember);
    });
      
      
    //Sheet End
   
  }
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

  const onRowDoubleClicked = (rowData) => {
    console.log("onRowDoubleClicked", rowData);
    const url = `https://blueprint.cyberlogitec.com.vn/UI_PIM_001_1/${rowData.reqId}`;
    let enabledMgmt = false;
    let enabled = false;
    window['chrome'].storage?.local.set({enabledMgmt});
    window['chrome'].storage?.local.set({enabled});

    window.open(url, "ADD POINT", "width="+screen.availWidth+",height="+screen.availHeight); //to open new page
  }
  const onChangeDate = async (date: any, type: any) => {
    if('START' == type) {
      setStartDate(date);

    } else {
      setEndDate(date)
      
    }
   

    await selectTaskByUser(memberSelect);
  }
  
  const onChangeMember = async (option: any) => {
    console.log("option", option);
    setMemberSelect(option);
    selectTaskByUser();

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
                      return accumulator + current.fields.subtasks?.length;
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
        />
      </div>
      <div className="grid grid-flow-row gap-1 px-2">
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