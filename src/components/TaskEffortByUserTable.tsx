  import React, { useState, useEffect, CSSProperties } from "react";
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
      <input type="checkbox" checked={isSelected} />
        <label> </label> {children}
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

export default function TaskEffortByUser(props) {
  const SHEET_ID = "Member_List";
  const RANGE_MEMBER_SHEET = 'A1:AW';
  const SPREADSHEET_ID = "10WPahmoB6Im1PyCdUZ_uda3fYijC8jKtHnRBasnTK3Y";
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#0E71CC");


  const url = 'https://blueprint.cyberlogitec.com.vn/api';
  const DT_FM = 'YYYYMMDD';
 
  // let [defaultMem, setDefaultMem] = useState([]);
  let defaultMem = [];
  // let memberReviewThisMonth = [];
  let [lstMember, setLstMember] = useState([]);
  let [lstDefault, setLstDefault] = useState([]);
  const [inReview, setInReview] = useState(false);
  let [memberReviewThisMonth, setMemberReviewThisMonth] = useState([]);


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

  const [memberSelect, setMemberSelect] = useState([]);
  const today = moment(new Date());
  console.log("today", today);
  const firstDayOfMonth = today.clone().startOf("month");
  // const newFirstDay = new Date(today.year(), today.month(), firstDayOfMonth);
  
  const [startDate, setStartDate] = useState(firstDayOfMonth._d);
  const [endDate, setEndDate] = useState(new Date());
  const [effortList, setEffortList] = useState([]);
  const [workday, setWorkday] = useState(0);
  const [monthDay, setMonthDay] = useState(0);
  const [isShowAllCol, setShowAllCol] = useState(true);
  const [headerReview, setHeaderReview] = useState(
      [
        {
          label: moment(new Date()).format("YYYY MMM"),
          value: new Date(),
          effort: 0,
        },
        {
          label: moment(new Date()).format("YYYY MMM"),
          value: new Date(),
          effort: 0,
        },
        {
          label: moment(new Date()).format("YYYY MMM"),
          value: new Date(),
          effort: 0,
        },
        {
          label: moment(new Date()).format("YYYY MMM"),
          value: new Date(),
          effort: 0,
        },
        {
          label: moment(new Date()).format("YYYY MMM"),
          value: new Date(),
          effort: 0,
        },
        {
          label: moment(new Date()).format("YYYY MMM"),
          value: new Date(),
          effort: 0,
        }
      ]
    );
  const columns = [
    {
        name: 'Name',
        width: "170px",
        selector: row => row.fullName,
    },
    {
      name: 'Level',
      selector: row => `${row.currentLevel} - ${row.levelRating}`,
    },
    {
      name: 'Rate',
      width: "100px",
      center: "yes",
      selector: row => row.currentLvl,
    },
    
    {
      name: 'Task',
      width: "80px",
      center: "yes",
      selector: row => row.countTask,
      conditionalCellStyles: [
        {
          when: row => 1 == 1,
          style: {
            backgroundColor: 'rgba(63, 195, 128, 0.3)',
            color: 'white',
            '&:hover': {
              cursor: 'pointer',
            },
            'font-weight': 'bold',
          },
        },
      ]
    },
    {
      name: 'Effort',
      width: "80px",
      center: "yes",
      selector: row => formatPrice(row.effortPoint / (monthDay == 0 ? 1: monthDay), 0),
      conditionalCellStyles: [
        {
          when: row => 1 == 1,
          style: {
            backgroundColor: 'rgba(63, 195, 128, 0.3)',
            color: 'white',
            '&:hover': {
              cursor: 'pointer',
            },
            'font-weight': 'bold',
          },
        },
      ]
    },
    {
      name: 'Std Days',
      width: "100px",
      center: "yes",
      omit: isShowAllCol,
      selector: item => formatPrice(item.pointOnHour.expect * (workday > 22  ? 22 : workday) * 8 ,0),
      conditionalCellStyles: [
        {
          when: row => 1 == 1,
          style: {
            backgroundColor: 'rgba(63, 195, 128, 0.3)',
            color: 'white',
            '&:hover': {
              cursor: 'pointer',
            },
            'font-weight': 'bold',
          },
        },
      ]
    },
    {
      name: 'Std Month',
      width: "100px",
      center: "yes",
      selector: item => formatPrice(item.pointOnHour.effortPointByCurrentLevel * item.workload, 0),
      conditionalCellStyles: [
        {
          when: row => 1 == 1,
          style: {
            backgroundColor: 'rgba(63, 195, 128, 0.3)',
            color: 'white',
            '&:hover': {
              cursor: 'pointer',
            },
            'font-weight': 'bold',
          },
        },
      ]
    },
    {
      name: 'Gap STD',
      width: "100px",
      center: "yes",
      selector: item => formatPrice(item.pointOnHour.effortPointByCurrentLevel - (item.effortPoint / (monthDay == 0 ? 1: monthDay)), 0),
      
    },
    {
      name: 'Target Eff.',
      width: "100px",
      center: "yes",
      omit: isShowAllCol,
      selector: item => formatPrice(item.pointOnHour.effortPointByTargetLevel, 0),
    },
    {
      name: 'Gap Target',
      width: "100px",
      center: "yes",
      selector: item => formatPrice(item.pointOnHour.effortPointByTargetLevel - (item.effortPoint / (monthDay == 0 ? 1: monthDay)), 0),
     
    },
    {
      name: 'Min',
      width: "100px",
      center: "yes",
      omit: isShowAllCol,
      selector: item => formatPrice(item.pointOnHour.minEffortPoint, 0),
    },
    {
      name: 'Mean',
      width: "100px",
      center: "yes",
      selector: item => formatPrice(item.pointOnHour.averageEffortPoint, 0),
    },
    {
      name: 'Max',
      width: "100px",
      center: "yes",
      omit: isShowAllCol,
      selector: item => formatPrice(item.pointOnHour.maxEffortPoint, 0),
    },
    {
      name: 'Start Review',
      width: "120px",
      center: "yes",
      selector: item => item.effectDateFrom,
    },
    {
      name: 'End Review',
      width: "120px",
      center: "yes",
      selector: item => item.effectDateTo,
    },
    {
      name: headerReview[0].label,
      width: "100px",
      center: "yes",
      omit: isShowAllCol,
      selector: item => item.effectDateTo,
    },
    {
      name: headerReview[1].label,
      width: "100px",
      center: "yes",
      omit: isShowAllCol,
      selector: item => item.effectDateTo,
    },
    {
      name: headerReview[2].label,
      width: "100px",
      center: "yes",
      omit: isShowAllCol,
      selector: item => item.effectDateTo,
    },
    {
      name: headerReview[3].label,
      width: "100px",
      center: "yes",
      omit: isShowAllCol,
      selector: item => item.effectDateTo,
    },
    {
      name: headerReview[4].label,
      width: "100px",
      center: "yes",
      omit: isShowAllCol,
      selector: item => item.effectDateTo,
    },
    {
      name: headerReview[5].label,
      width: "100px",
      center: "yes",
      omit: isShowAllCol,
      selector: item => item.effectDateTo,
    },
    // {
    //   name: 'workday',
    //   width: "100px",
    //   center: "yes",
    //   selector: item => workday,
    // },

    // {
    //   name: 'effortPoint',
    //   width: "100px",
    //   center: "yes",
    //   selector: item => item.effortPoint,
    // },

    // {
    //   name: 'expect',
    //   width: "100px",
    //   center: "yes",
    //   selector: item => item.pointOnHour.expect,
    // },
  
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
      "lstTeamId": "ATM201705250009,ATM201705150001",
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

  async function getDailyTasksByUser(item:any, isSplitByMonth: any) {
    let ro = {
      "usrId": item.userId,
      "fromDt": moment(startDate).format("YYYYMMDD"),
      "toDt": moment(endDate).format("YYYYMMDD")
    };
  
    const resEffortTotal = await axios.post(`${url}/uiPim026/getDailyTasksByUser`, ro)
      .then(async function (response) {
        return response.data;
    });
    isSplitByMonth = true;
    if(isSplitByMonth) {
      let arrEffSplit = [];

      let rvStart = item.effectDateFrom;
      let rvEnd = item.effectDateTo;
      if(rvStart && rvEnd) {
        let tmp = moment(rvStart);
        let arrRoSplit = [];
        let roSplit = { 
          "usrId": item.userId,
        };

        while(tmp < moment(rvEnd)) {
          // console.log(`tmp: ${tmp}`);
          // const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
          // const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD hh:mm');
          let startOfMonth = moment(tmp).startOf('month');
          let endOfMonth   = moment(tmp).endOf('month');
          roSplit = {
            ...roSplit,
            "fromDt": startOfMonth.format("YYYYMMDD").toString(),
            "toDt": endOfMonth.format("YYYYMMDD").toString()
          };

          tmp = tmp.add(1, 'M');
          arrRoSplit.push(roSplit);
          // console.log(`${item.fullName}: ${roSplit}`);
          const resEffortSplit = await axios.post(`${url}/uiPim026/getDailyTasksByUser`, roSplit)
            .then(async function (response) {
              return response.data;
          });

          arrEffSplit.push(resEffortSplit);
        }

        console.log(`arrRoSplit: ${JSON.stringify(arrRoSplit)}`);

      }
     
    }
    // let newListSrt = await Promise.all(newList).then((response) => {
    // console.log("response", response);
    return await Promise.all([resEffortTotal]).then((response) => {
      return {
        effortTotal: response[0],
        effortSplit: []
      };
    });
    // return new Promise((resolve, reject) => {
    //     resolve(response);
    // });
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
    
    for(let i = 0; i < 23; i ++) {
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
                "currentLvl"        : sheet.getCell(i, 4).formattedValue.concat(" (").concat(sheet.getCell(i, 45).formattedValue).concat(")"),
                "monthReview" :sheet.getCell(i, 47).formattedValue,
                "defaultList":sheet.getCell(i, 48).formattedValue.split(","),
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

  const setRangeMonthReview = (start:any, end:any) => {
    let arr = [];
    console.log("setRangeMonthReview", start);
    if(start && end) {
      if(start < end){
        let tmp = start;
        arr.push({
          label: moment(tmp).format('YYYY MMM'),
          value: futureMonth,
          effort: 0,
        });

        while(tmp < end) {
          var futureMonth = moment(tmp).add(1, 'M');
          arr.push({
            label: futureMonth.format('YYYY MMM'),
            value: futureMonth,
            effort: 0,
          });
          tmp = futureMonth;
        }
        
        setHeaderReview(arr);
      }
    }
  }
  const selectTaskByUser = async () => {
    setLoading(true);

    const strFrm = moment(startDate);
    const endFrm = moment(endDate);
    const workday = workday_count(strFrm, endFrm);
    const lvlList = myData.levelList;
    setWorkday(workday);

    const diffMonth = moment(endFrm._i).diff(moment(strFrm._i), 'months', true);
    setMonthDay(Math.round(diffMonth));

    console.log("selectTaskByUser", strFrm);
    // setRangeMonthReview (strFrm._i, endFrm._i);
    if(startDate && endDate) {

      // const newList = await getDailyTasksByUser(memberSelect[0]);
      let sheetMember = await selectMemberList();
      const lstUserInTeam = await searchUserInTeam();
      //Filter Memeber
      console.log("sheetMember", sheetMember);

      console.log("memSelect", memberSelect);
      if(memberSelect && memberSelect.length > 0) {
        // people.filter(person => id_filter.includes(person.id))
        sheetMember = sheetMember.filter(
          mem => memberSelect.filter(memSel => memSel.userId == mem.userId).length > 0
        );
        console.log("memSelect2", sheetMember);

        // sheetMember = sheetMember.filter(mem => mem.userId == memSelect.userId);
      }

      const newList = sheetMember.map(async function (item) {
        //Get task
      
        const res = await getDailyTasksByUser(item);
        if(res){

          item.effortPoint = sumEfrtKnt (res.effortTotal.dailyRsrcLst);
          item.timeWorked = 0;
          let pointStd = lvlList.filter(itm => itm.code.toUpperCase() == item.lvlCode.toUpperCase());
          if(pointStd && pointStd.length > 0){
            item.pointStd = pointStd[0];

          } else {
            item.pointStd = {
              "min": 0,
              "max": 0,
              "gap": 0,
              "taskLevelMax": 0,
              "agvDay": 0,
              "agvMonth": 0
            }
          }
          // console.log("lstUserInTeam", lstUserInTeam);
          let itemTask = lstUserInTeam.filter(itm2 => itm2.usrId == item.userId);
          item.countTask = 0;
          if(itemTask && itemTask.length > 0){
            let _task = itemTask[0];
            item.countTask = _task.pd_knt +  _task.op_knt +  _task.proc_knt;
          }
        }
        return item;
      })
      let newListSrt = await Promise.all(newList).then((response) => {
        let newData = [...response];
        // if(memSelect && memSelect.length > 0) {
        //   newData = newData.filter(mem => mem.userId == memSelect.userId);
        // }
        setEffortList(newData);
        setLoading(false);
      });
      

    }
  }
  
  const onChangeDate = async (date: any, type: any) => {
    if('START' == type) {
      setStartDate(date);

    } else {
      setEndDate(date)
      
    }
   

    // await selectTaskByUser(memberSelect);
  }

  const filterOnlySubmit = (onlySubmit) => {
    const isSubmit = !onlySubmit;
    // let data = [...localStorage.getItem('BP_TASK_LIST') ? JSON.parse(localStorage.getItem('BP_TASK_LIST')) : []];
    
    // if(data && data.length > 0) {
    //   let dataTasks = data.sort(onlySubmit ? sortAsc : sortDesc);
    //   // set index
    //   let idx = 0;
    //   dataTasks.map(function(item) {
    //     item.index = idx++;
    //   });
      
    //   localStorage.setItem('BP_TASK_LIST', JSON.stringify([]));
    //   localStorage.setItem('BP_TASK_LIST',  JSON.stringify(dataTasks));

    // }
    setShowAllCol(isSubmit);

    localStorage.setItem('ONLY_SUBMIT',  isSubmit);
  }
  
  const onChangeMember = async (option: any) => {
    console.log("option", option);
    setMemberSelect(option);
    selectTaskByUser();

  }
  //formatPrice(item.pointOnHour.expect * workday * 8 ,0)
  // selector: item => formatPrice(item.pointOnHour.minEffortPoint, 0),
  const conditionalRowStyles = [
    {
      when: row =>  
        parseFloat(row.effortPoint) < parseFloat(row.pointOnHour.minEffortPoint)
        || parseFloat(row.effortPoint) > parseFloat(row.pointOnHour.maxEffortPoint),
      style: row => ({ backgroundColor:'rgba(251, 231, 239,0.6)' }),
    },
    {
      when: row =>  
        parseFloat(row.effortPoint) < parseFloat(row.pointOnHour.effortPointByCurrentLevel),
      style: row => ({ backgroundColor: 'rgba(0,255,0,0.3)' }),
    },
  ];
  const inReviewChange = async (option: any) => {
    //
    console.log("setMemberSelect option", option);
   
    if(option == true){
      // const firstDayOfMonth = today.clone().startOf("month");
      // setStartDate(firstDayOfMonth._d);
      // setEndDate(new Date());
      if(memberReviewThisMonth && memberReviewThisMonth.length > 0) {
        console.log("setMemberSelect option", option);
        let item = memberReviewThisMonth[0];
        let _start = moment(item.effectDateFrom);
        let _end = moment(item.effectDateTo);
        console.log("setMemberSelect option", _start);
        console.log("setMemberSelect option", _end);
        // let start =  moment(moment(item.effectDateFrom)._d);
        // let end =  moment(moment(item.effectDateTo)._d);
        const _start_firstDayOfMonth = _start.clone().startOf("month");
        setStartDate(_start_firstDayOfMonth._d);
        setEndDate(_end._d);
         console.log("setEndDate option", option);
        setMemberSelect(...[memberReviewThisMonth]);
      }
     
    } else {
      setMemberSelect(...[lstDefault]); 
    }
    
    // console.log("setMemberSelect", memberSelect);
   
    setInReview(option);
  }
  useEffect(()=>{
    setLoading(true);
    // let sheetMember = await selectMemberList();
    // const lstUserInTeam = await searchUserInTeam(); 
    setLstMember([]);
    setMemberSelect([]);
    selectMemberList().then(async (data) => {
      console.log("useEffect data", data);
      let lstInReview = [];
      let lst = await data.map(
        function (item) {
          // console.log("item", item);
          if(item.teamLocal.includes("NEWFWD")) {
            if(item.defaultList.includes("Y")) {
              let defaultItem = {
                ...item,
                label: item.userId,
                value: item.userId
              };

              defaultMem.push(defaultItem);
            }

            if(item.defaultList.includes("IN_REVIEW")) {
              let defaultItem = {
                ...item,
                label: item.userId,
                value: item.userId
              };

              lstInReview.push(defaultItem);
            
            }


            return {
              ...item,
              label: item.userId,
              value: item.userId
            }

          }
      })
      console.log("useEffect LST", lst);
      setMemberSelect(defaultMem);
      setLstDefault(defaultMem);
      setMemberReviewThisMonth(lstInReview);
      setLstMember(lst);
      setLoading(false);
    }).catch((err) => {
      console.log("useEffect", err);
      setLoading(false);
    });
  },[])
  return (
    <div className="grid grid-flow-row gap-2">
      <div className="grid grid-flow-col gap-1 px-2">
        <div className="w-full">
          <Select
            defaultValue={ inReview ? memberReviewThisMonth : defaultMem }
            closeMenuOnSelect={true}
            hideSelectedOptions={false}
            isClearable={true}
            isMulti
            onChange={(mem) => {
              setMemberSelect(mem);
              // selectTaskByUser(mem);
            }
            } 
            options={lstMember}
            components={{
              Option: InputMemberOption
            }}
          />
        </div>
        <div>
          <DatePicker selected={startDate} onChange={(date) => onChangeDate(date, "START")} className="w-150"/>

        </div>
        <div>
          <DatePicker selected={endDate} onChange={(date) => onChangeDate(date, "END")} className="w-150"/>

        </div>
        <div>
          <div> { workday } days </div>
          <div>
            {formatPrice(monthDay,0)} months
          </div>
        </div>
        <div>
          <label className="pt-3 text-right gap-1">
            <input 
              type="checkbox"
              defaultChecked={inReview}
              onChange={() => 
                inReviewChange(!inReview)
              }
              disabled={ !(memberReviewThisMonth && memberReviewThisMonth.length > 0)}
            />
             <label></label> In Review
          </label>
        </div>
        <div>
          <label className="pt-3 text-right gap-1">
            <input 
              type="checkbox"
              defaultChecked={!isShowAllCol}
              onChange={() => filterOnlySubmit(isShowAllCol) }
            />
             <label></label> All Columns
          </label>
        </div>
        <div className="w-70">
          <button 
            type="button" 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4" 
            onClick={event => selectTaskByUser()}>
            Search
          </button>
        </div>
        
      </div>
      <div className="grid grid-flow-row gap-1 px-2">
        <DataTable
            columns = {columns}
            theme="default"
            fixedHeader
            fixedHeaderScrollHeight="730px"
            data = {
              effortList
            }
            // onRowDoubleClicked = { event => onRowDoubleClicked (event)}
            
            conditionalRowStyles={conditionalRowStyles}
            // customStyles={customStyles} 
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