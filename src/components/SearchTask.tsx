import React, { useState,useEffect } from "react";
import axios from "axios";
import myData from '../data.json';
import PointSuggest from './PointSuggest';
import Select, { components } from "react-select";
import { WEB_INFO } from '../const';
import BPTableGrid from "./BPTableGrid";
import DocumentGrid from "./DocumentGrid";
import TaskDailyList from "./TaskDailyList";

import { GoogleSpreadsheet } from 'google-spreadsheet';
// "reqStsCd": ["REQ_STS_CDPRC", "REQ_STS_CDOPN", "REQ_STS_CDCC", "REQ_STS_CDPD"],
import Modal from 'react-modal';
import ACC_SHEET_API from '../credentials.json';
import CapaList from "./CapaList";
const customStylesModal = {
  content: {
    top: '20%',
    left: '30%',
    right: 'auto',
    bottom: 'auto',
    border: '1px',
    // marginRight: '-50%',
    // transform: 'translate(-50%, -50%)',
    background: 'green',
   
  
  },
};
let defaultPharse = [
  {
    "value": "REQ_STS_CDPRC",
    "label": "In Processing",
   
  },
  {
      "value": "REQ_STS_CDOPN",
      "label": "Open",
  },
];

const InputOption = ({
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
         {children}
    </components.Option>
  );
};

const DOC_SHEET_INFO = {
  SPREADSHEET_ID: "1FBmXZfNkLTNJhLo1uS9dE0V20V5uNT99UvV4xah1dGE",
  SHEET_ID: "Information",
  RANGE_LIMIT: "A1:Z50",

}

const Daily_Report_Info = {
  SPREADSHEET_ID: "1jsBbrJZ8AYuNTRiBMLfcngHi0f6vCF1XocbvvpJDBAM",
  SHEET_ID: "Daily_Report_Filter",
  RANGE_LIMIT: "A1:U200",

}
const _Tasks_Pharse3 = {
  SPREADSHEET_ID: "1jsBbrJZ8AYuNTRiBMLfcngHi0f6vCF1XocbvvpJDBAM",
  SHEET_ID: "Tasks_Pharse3",
  RANGE_LIMIT: "A2:BB1000",

}

const _CAPA_list = {
  SPREADSHEET_ID: "1qku7AHB9T-xz5GvjgZ7cinDxpldbbJFR8OjmNUVo6YE",
  SHEET_ID: "CAPA list",
  RANGE_LIMIT: "A1:S",

}


export default function SearchTask(props) {
  const url = WEB_INFO.BLUEPRINT.API;
  const pjtId = WEB_INFO.BLUEPRINT.PROJECTS.NEW_FWD.ID;

  let [conditionSearch, setConditionSearch] = useState("Team B");
  let [clkID, setClkID] = useState("");
  let [clickTaskInfo, setClickTaskInfo] = useState(null);
  let [taskList, setTaskList] = React.useState([]);
  let [documentList, setDocumentList] = React.useState([]);
  let [taskDailyList, setTaskDailyList] = React.useState([]);
  let [capaList, setCapaList] = React.useState([]);

  let [pharseList, setPharseList] = React.useState([]);
  let [selectedPharses, setSelectedPharses] = React.useState([]);
  let [reqStsCd, setReqStsCd] =  React.useState(['REQ_STS_CDOPN', 'REQ_STS_CDPRC',]);
  let [seqNo, setSeqNo] = useState("");
  let [splitEffort, setSplitEffort] = useState(false);
  let [reqDetail, setReqDetail] = useState({});
  let [sprintNumber, setSprintNumber] = useState("");
  const [prefixID, setPrefixID] = useState("86");
  const [modalIsOpen, setIsOpen] = React.useState(false);

  let [TASK_INF_REPORT, setTASK_INF_REPORT] = useState({
    PIC_REPORT: "",
    SPRINT: "",
    TOTAL_TASK: 0
  });


  const currentURL = window.location.href // returns the absolute URL of a page
  let [reqId, setReqID] = useState("");
  const arr = currentURL.split("/");
  if(arr && arr.length > 0){
    // const reqId = arr[arr.length-1];
    reqId = arr[arr.length-1];
  }

  //   const response = await axios.post(requestURL + "searchRequirement", ro);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      searchRequirement();
    }
  }

  const handleKeyDownClickup = (event) => {
    if (event.key === 'Enter') {
      clickupGetTask();
    }
  }

  const clickupGetTask = async () => {
    if(clickupID){
      let response = axios.get(`${WEB_INFO.WORKING_API}/clickup/getTask/${clickupID}`)
      .then(async function (response) {
        const data =  response.data
        console.log("Data", data);
        setClickTaskInfo(data.data);
      });
    }
    
  }

  const mergeTaskList = async () => {
    if (confirm("Bạn có muốn merge task google sheet không, có thể phải chờ lâu?") == true) {
      let response = await axios.get(`${WEB_INFO.TASK_MEMBER_API}/mergeTaskList`)
      .then(async function (res) {
        console.log("merge", res);
        return res;
      });
      alert(`Merged ${response.data.count} task`);
      
    }

   
  }

  const syncMember = async () => {
    if (confirm("Bạn có muốn sync member không, có thể phải chờ lâu?") == true) {
      let response = axios.get(`${WEB_INFO.TASK_MEMBER_API}/syncMemberSheet`)
      .then(async function (response) {
        alert("syncMember done");
      });
      
    }

   
  }
  const searchRequirement = async () => {
    setTaskList([]);
    let seqNo;
    let reqNm;
    if(conditionSearch != ""  && conditionSearch.length > 0){
      let arrReqNm = conditionSearch.trim().split(" ");
      if (arrReqNm.length > 0) {
        if (arrReqNm[0].substring(0, 1) !== "#") {
          //check format [#...]
          reqNm = conditionSearch;
        } else if (arrReqNm[0].substring(0, 1) === "#") {
          //check format #...
          if (
            !isNaN(Number(arrReqNm[0].substring(1, arrReqNm[0].length))) &&
            arrReqNm[0].substring(1, arrReqNm[0].length) !== "" &&
            arrReqNm.length === 1
          )
            seqNo = arrReqNm[0].substring(1, arrReqNm[0].length);
          else reqNm = conditionSearch;
        } else reqNm = conditionSearch;
      }
    }
    let data = {
      "pjtId": pjtId,
      "advFlg": "N",
      "reqStsCd": reqStsCd,
      "jbTpCd": "_ALL_",
      "itrtnId": "_ALL_",
      "beginIdx": 0,
      "endIdx": 200,
      "seqNo": seqNo,
      "reqNm": clkID ? clkID : reqNm,
      "isLoadLast": false,
      "picId": "",
      "pageSize": 200
    };
    let requirement = await axios.post(`${url}/uiPim001/searchRequirement`, data
    ).then(res => {
      return res.data;
    });
    if(requirement.lstReq && requirement.lstReq.length > 0) {
      let dataTasks = requirement.lstReq.sort(comparePoint);
      let isSubmit = localStorage.getItem('ONLY_SUBMIT');
      dataTasks = dataTasks.sort(isSubmit == "true" ? sortDesc : sortAsc);
      let pms = await splitPointByPharse([...dataTasks], splitEffort).then((itm)=> {
        setTaskList(itm);
      });
      const newList = new Promise((resolve, reject) => {
        resolve(pms);
      });

    }
  }
  const sortDesc  = (a: any, b: any) => {
    if(a.pntNo < b.pntNo) return 1;
    else if(a.pntNo > b.pntNo) return -1;
    else return 0;
  }

  const sortAsc  = (a: any, b: any) => {
    if(a.pntNo > b.pntNo) return 1;
    else if(a.pntNo < b.pntNo) return -1;
    else return 0;
  }
  const splitPointByPharse  = async (taskList: any, isSplit) => {
    if(taskList && taskList.length > 0) {
      let newTaskList = await taskList.map(async function (itm, idx) {
        let newItem = {
          ...itm,
          "index": idx + 1,
          "impl_effort": 0,
          "test_effort": 0,
        }

        if(isSplit){
          const detail = await axios.get(`${url}/searchRequirementDetails?reqId=${itm.reqId}`)
          .then(async (res) => {
            return res.data;
          });
          let effortLst = await new Promise((resolve, reject) => {
            resolve(detail.lstSkdUsr);
          });

          let keyImpl = "PIM_PHS_CDIMP";
          let keyTest = "PIM_PHS_CDTSD";
          
          let impl_effort = effortLst.filter(itm2 => itm2.phsCd == keyImpl);
          let impl_test = effortLst.filter(itm2 => itm2.phsCd == keyTest);

          console.log("isSplit", effortLst);
          newItem.impl_effort = impl_effort && impl_effort.length > 0 ? parseFloat(impl_effort[0].efrtNo) : 0;
          newItem.impl_test =  impl_test && impl_test.length ? parseFloat(impl_test[0].efrtNo) : 0;
          return newItem;
        } else {
          return newItem;

        }
        
      })

      const data = await Promise.all([...newTaskList]).then((result) => {
        return result;
      });
      return data;
      
    }
    
  }
  const comparePoint  = (a: any, b: any) => {
    if(a.pntNo > b.pntNo) return 1;
    else if(a.pntNo < b.pntNo) return -1;
    else return 0;
  }
  
  const openTask = (newReqId) => {
    const url = `https://blueprint.cyberlogitec.com.vn/UI_PIM_001_1/${newReqId}`;
    window.open(url, "_blank"); //to open new page
  }
  const punchInOut = (newReqId) => {
    const url = `https://blueprint.cyberlogitec.com.vn/UI_TAT_028`;
    window.open(url, "_blank"); //to open new page
  }

  //https://api.clickup.com/api/v2/space/26265831/folder
  async function searchReqDefaultCdLst() {
    let itemTask = {};
    // setAllSprint([]);
   
    const config2 = {
        method: 'get',
        url: `https://blueprint.cyberlogitec.com.vn/api/uiPim001/searchReqDefaultCdLst`,
    };
    //console.log("config2", config2);
    const response = await axios(config2).then((res2) => {
      console.log("res2", res2);
      let data = res2.data;
      let lstComCd = data.lstComCd;
      let REQ_STS_CD_LIST = lstComCd.filter(item => item.prntCd == "REQ_STS_CD");
      if(REQ_STS_CD_LIST) {
        // "value": "subcat152185323_subcat24726670_subcat24726295_subcat67371792_subcat40246481_subcat38252924_subcat27722344_subcat27722322_subcat23647187_subcat23599212_subcat23564660_subcat23564619_sc23553590_Vy1k3mmq",
        // "label": "to do",
        REQ_STS_CD_LIST.map(function(item) {
          item.value = item.comCd;
          item.label = item.cdNm;
        })
      }
      setPharseList(REQ_STS_CD_LIST);
    });
    return new Promise((resolve, reject) => {
        resolve(response);
    });
  };

  const reqClickupIinfoSplit = (req) => {
    let clickupId = "";
    let sprint:any;
    if(req){
      
      let reqName = req.reqTitNm;

      var chuoi = reqName;
      var pattern = /\[(.*?)\]/g;
      var ketQua = chuoi.match(pattern);
      let newArr:any = [];
      ketQua.forEach((item) => {
        let str:any = item.replace(/[\[\]']+/g,'');
        newArr.push(str);
      });
      if (ketQua) {
        console.log("newArr", ketQua); // ["New US FWD", "Thuan Lai", "Team B", "DEV-TEST:5P-2P", "865cg6601", "Sprint 27"]
      } else {
        console.log("Không tìm thấy chuỗi nằm trong dấu [ ] trong đoạn văn bản.");
      }
      //Find clickup ID
      let clickupIDByLength:any = "";
      newArr.forEach((item) => {
        if(item.replace(/ /g, "").length == 9) {
          clickupIDByLength = item.replace(/ /g, "");
          return;
        }
      });

      if(reqName) {
        if(ketQua && ketQua.length > 4) {
          let id = newArr[4].replace(/ /g, "");
          if(id.includes(prefixID)) {
            clickupId = id;

          } else {
            if(clickupIDByLength.includes(prefixID)) {
              clickupId = clickupIDByLength;
            } else {
              console.log("KHÔNG TÌM DC CLICKUP");
              // alert("KHÔNG TÌM DC CLICKUP ID: ", newArr.join("_"));
            }
          }
          
          // for(let i = 0; i < newArr.length; i ++) {
          //   if(newArr[i].contains)
          // }
          
          let findSprint = newArr.filter(e => e.includes("Sprint"));
         
          if(findSprint && findSprint.length > 0) {
            let arr = findSprint[0].split(" ");
            if(arr.length > 1) {
              sprint = arr[1];

            } else {
              sprint = findSprint[0].replace(/[^0-9]+/g, '');
            }
          }
          setSprintNumber(sprint);
          console.log("clickupID", clickupId);
          if(clickupId) {
            setClkID(clickupId);
            defaultPharse.push(
            {
              "value": "REQ_STS_CDFIN",
              "label": "Finished",
            });
            let newReqSts = [...reqStsCd];
            newReqSts.push("REQ_STS_CDFIN");
            setReqStsCd(newReqSts);
          }
        }
      }
      
      return {
        clickupId: clickupId,
        sprint: sprint
      }
    }
  }
  const getClickupId = async () => {
    const requirementDetail = await  axios.get(`${url}/searchRequirementDetails?reqId=${reqId}`)
    .then(async(res) => {
      console.log("res", res);
      let detailReqVO = res.data.detailReqVO;
      let param = reqClickupIinfoSplit(detailReqVO);

    }).catch((error) => {
      console.log("getClickupId", error);

    });
  } //End get clickupID
  function openModal() {
    setIsOpen(true);
  }

  const loadDocumentList = async () => {
    let DOC_SHEET_STORAGE = localStorage.getItem('DOC_SHEET_INFO');
    if(DOC_SHEET_STORAGE == undefined || DOC_SHEET_STORAGE == null) {
      localStorage.setItem('DOC_SHEET_INFO',  JSON.stringify(DOC_SHEET_INFO));
      DOC_SHEET_STORAGE = localStorage.getItem('DOC_SHEET_INFO');
      
    } 
    
    console.log("DOC_SHEET_STORAGE", DOC_SHEET_STORAGE);
    let DOC_SHEET_INFO_JSON = JSON.parse(DOC_SHEET_STORAGE?.toString());
    console.log("DOC_SHEET_INFO_JSON", DOC_SHEET_INFO_JSON);
    if(DOC_SHEET_INFO_JSON) {
      //Read Sheet 
      // Initialize the sheet - doc ID is the long id in the sheets URL
      const doc = new GoogleSpreadsheet(DOC_SHEET_INFO_JSON.SPREADSHEET_ID); //script data
      // Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
      await doc.useServiceAccountAuth({
        // env var values are copied from service account credentials generated by google
        // see "Authentication" section in docs for more info
        client_email:  ACC_SHEET_API.client_id,
        private_key: ACC_SHEET_API.private_key,
      });
      await doc.loadInfo(); // loads document properties and worksheets
      console.log("LOAD", doc.title);

      const INFO_LIST = doc.sheetsByTitle[DOC_SHEET_INFO_JSON.SHEET_ID]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
      await INFO_LIST.loadCells(DOC_SHEET_INFO_JSON.RANGE_LIMIT); // loads range of cells into local cache - DOES NOT RETURN THE CELLS

      let arrDOC = [];
      for(let i = 0; i < 50; i ++) {
        console.log("INFO_LIST", INFO_LIST);
        const nameRule = INFO_LIST.getCell(i, 2).formattedValue; 
        const infoRule = INFO_LIST.getCell(i, 3).formattedValue; 
        const isShow = INFO_LIST.getCell(i, 8).formattedValue; 
        if(nameRule && (isShow && "Y" == isShow.toString().toUpperCase())) {
          console.log(nameRule.formattedValue);
          const object = {
            name: nameRule,
            info: infoRule,

          }
          arrDOC.push(object);
        

        }
        console.log("arrDOC", arrDOC);
        setDocumentList(arrDOC);
      }
    }
  }

  const loadCAPA = async () => {
    let CAPA_list = localStorage.getItem('CAPA_list');
    if(CAPA_list == undefined || CAPA_list == null) {
      localStorage.setItem('CAPA_list',  JSON.stringify(_CAPA_list));
      CAPA_list = localStorage.getItem('CAPA_list');
      
    } 
    
    console.log("CAPA_list", CAPA_list);
    let _CAPA_list_JSON = JSON.parse(CAPA_list?.toString());
    console.log("_CAPA_list", _CAPA_list_JSON);
    if(_CAPA_list_JSON) {
      //Read Sheet 
      // Initialize the sheet - doc ID is the long id in the sheets URL
      const doc = new GoogleSpreadsheet(_CAPA_list_JSON.SPREADSHEET_ID); //script data
      // Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
      await doc.useServiceAccountAuth({
        // env var values are copied from service account credentials generated by google
        // see "Authentication" section in docs for more info
        client_email:  ACC_SHEET_API.client_id,
        private_key: ACC_SHEET_API.private_key,
      });
      await doc.loadInfo(); // loads document properties and worksheets
      console.log("LOAD", doc.title);

      const INFO_LIST = doc.sheetsByTitle[_CAPA_list_JSON.SHEET_ID]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
      await INFO_LIST.loadCells(_CAPA_list_JSON.RANGE_LIMIT); // loads range of cells into local cache - DOES NOT RETURN THE CELLS

      let arrDOC = [];
      for(let i = 1; i < 200; i ++) {
        console.log("INFO_LIST", INFO_LIST);
        const req_clickup_id = INFO_LIST.getCell(i, 1).formattedValue; 
        const req_bp_id = INFO_LIST.getCell(i, 2).formattedValue; 
        const bug_no = INFO_LIST.getCell(i, 4).formattedValue; 
        const situation = INFO_LIST.getCell(i, 5).formattedValue; 
        const capa_type = INFO_LIST.getCell(i, 8).formattedValue; 
        const team = INFO_LIST.getCell(i, 11).formattedValue; 

        
        const isShow = INFO_LIST.getCell(i, 8).formattedValue; 
        if(team && team != null && team != "") {
        //   console.log(nameRule.formattedValue);
          if("Scrum B" == team) {
            const object = {
              req_clickup_id: req_clickup_id,
              req_bp_id: req_bp_id,
              bug_no: bug_no,
              situation: situation,
              capa_type: capa_type,
              team: team
            }

            arrDOC.push(object);
          }

        }
        console.log("arrDOC", arrDOC);
        setCapaList(arrDOC);
      }
    }
  }

  const loadTaskList = async () => {
    let Tasks_Pharse3 = localStorage.getItem('Tasks_Pharse3');
    if(Tasks_Pharse3 == undefined || Tasks_Pharse3 == null) {
      localStorage.setItem('Tasks_Pharse3',  JSON.stringify(_Tasks_Pharse3));
      Tasks_Pharse3 = localStorage.getItem('Tasks_Pharse3');
      
    } 
    
    console.log("Tasks_Pharse3", Tasks_Pharse3);
    let DOC_SHEET_INFO_JSON = JSON.parse(Tasks_Pharse3?.toString());
    console.log("DOC_SHEET_INFO_JSON", DOC_SHEET_INFO_JSON);
    if(DOC_SHEET_INFO_JSON) {
      //Read Sheet 
      // Initialize the sheet - doc ID is the long id in the sheets URL
      const doc = new GoogleSpreadsheet(DOC_SHEET_INFO_JSON.SPREADSHEET_ID); //script data
      // Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
      await doc.useServiceAccountAuth({
        // env var values are copied from service account credentials generated by google
        // see "Authentication" section in docs for more info
        client_email:  ACC_SHEET_API.client_id,
        private_key: ACC_SHEET_API.private_key,
      });
      await doc.loadInfo(); // loads document properties and worksheets
      console.log("LOAD", doc.title);

      const INFO_LIST = doc.sheetsByTitle[DOC_SHEET_INFO_JSON.SHEET_ID]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
      await INFO_LIST.loadCells(DOC_SHEET_INFO_JSON.RANGE_LIMIT); // loads range of cells into local cache - DOES NOT RETURN THE CELLS

      let arrTask = [];

      let PIC_REPORT = INFO_LIST.getCell(1, 4).formattedValue; 
      let SPRINT = INFO_LIST.getCell(1, 5).formattedValue; 
      let TOTAL_TASK = INFO_LIST.getCell(1, 9).formattedValue; 

      let TASK_INF_REPORT  = {
        PIC_REPORT: PIC_REPORT,
        SPRINT: SPRINT,
        TOTAL_TASK: TOTAL_TASK
      }
      setTASK_INF_REPORT(TASK_INF_REPORT);

      let arrValidTask = INFO_LIST._cells.filter(item => 
                                        item[0] != undefined 
                                        && item[0].formattedValue != null 
                                        && item[0].formattedValue == "38");
      console.log("INFO_LIST", arrValidTask);
      for(let i = 3; i < arrValidTask.length; i ++) {
        let newItem = arrValidTask[i];
        const id = newItem[2].formattedValue; 
        const name = `${newItem[4].formattedValue} ${newItem[5].formattedValue}`; 

        const pic_dev = newItem[12].formattedValue; 
        const dev_test = newItem[13].formattedValue; 
        const tester = newItem[14].formattedValue; 
        const status = newItem[15].formattedValue; 
        const est_end_date = newItem[22].formattedValue; 

        if(id && name) {
          const object = {
            id: id,
            name: name,
            pic_dev: pic_dev,
            dev_test: dev_test,
            tester: tester,
            status: status,
            est_end_date: est_end_date
          }
          arrTask.push(object);
        

        }
        // console.log("arrDOC", arrDOC);
        setTaskDailyList(arrTask);
      }
    }
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }
  useEffect(()=>{
    //console.log("Request searchRequirement", refresh_token);
    searchReqDefaultCdLst().then((data) => {
      getClickupId();
    }).then((data) => {
    });
  },[])
  
  return (
    <div className="grid grid-flow-row">
      <div className="grid grid-flow-col gap-1">
        <div className="grid grid-flow-col">
          <input
            type="text"
            id="conditionSearch"
            defaultValue={conditionSearch}
            onChange={event => setConditionSearch(event.target.value) }
            onKeyDown={handleKeyDown}
            className="col-span-1 border border-gray-500 px-4 py-2 rounded-lg w-300"
          />
        </div>
        <div className="grid grid-flow-col">
          <input
            type="text"
            id="clickupID"
            defaultValue={clkID}
            onChange={event => setClkID(event.target.value) }
            onKeyDown={handleKeyDownClickup}
            className="col-span-1 border border-gray-500 px-4 py-2 rounded-lg w-100"
          />
          <input
            type="text"
            id="clickupStatus"
            value={clickTaskInfo ? clickTaskInfo.status.status : ""}
            style={{
              backgroundColor: clickTaskInfo ? clickTaskInfo.status.color : "#FFFFFF"
            }}
            className="col-span-1 border border-gray-500 px-4 py-2 rounded-lg w-100"
          />
        </div>
        <div>
          <label className="pt-3 text-right">
            <input 
              type="checkbox"
              defaultChecked={splitEffort}
              onChange={() => setSplitEffort(!splitEffort) }
            />
            Split Eff.
          </label>
        </div>
        <div className="grid grid-flow-col gap-1 w-full">
          <Select
              defaultValue={defaultPharse}
              isMulti
              closeMenuOnSelect={true}
              hideSelectedOptions={false}
              onChange={(options) => {
                      if (Array.isArray(options)) {
                        console.log("Test");
                        var code = options.map(function(item) {
                          return item['value'];
                        });
                        setSelectedPharses(options);
                        setReqStsCd(code);
                      }
                  }
              } 
              options={pharseList}
              components={{
                  Option: InputOption
              }}
          />
          <button 
            type="button" 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4"
            onClick={searchRequirement}
          >
            Search
          </button>
          <button 
            type="button" 
            className="bg-green text-white py-2 px-4 rounded-lg ml-4"
            onClick={syncMember}
          >
            Sync Mem
          </button>
          <button 
            type="button" 
            className="bg-green text-white py-2 px-4 rounded-lg ml-4"
            onClick={mergeTaskList}
          >
            Sync Task
          </button>

          <button 
            type="button" 
            className="bg-green text-white py-2 px-4 rounded-lg ml-4"
            onClick={punchInOut}
          >
            PUNCH
          </button>
          <button type="button" 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4" 
            onClick={openModal}>
            DOC
          </button>
        </div>
      </div>
      <div className="table-container-search pt-2">
          <BPTableGrid
            data = {taskList}
            height="190"
          /> 
        
      </div>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="document_list"
      >
        <div className="grid grid-flow-row gap-2 mb-1 w-full">
          <div className="grid grid-flow-col gap-3 mb-2 w-full col-span-2">
            <p className="text-4xl w-full" ref={(_subtitle) => (subtitle = _subtitle)}>
              Summary Team B
            </p>
            <button 
              style={{
                backgroundColor: '#F08080'
              }}
              className="text-white py-2 px-4 rounded-lg ml-4 w-50"
              onClick={closeModal}>
                x
            </button>
          </div>
          <div className="grid grid-flow-col gap-2 mb-1 w-full">
            <div className="grid grid-flow-row gap-2 mb-1 w-full">
              <div className="grid grid-flow-col gap-1">
                  <button 
                    className="bg-green text-white py-2 px-4 rounded-lg w-150" 
                    onClick={loadTaskList}
                  >
                    Load Task
                  </button>
                  <button 
                    className="bg-green text-white py-2 px-4 rounded-lg w-150 ml-1" 
                    onClick={loadDocumentList}
                  >
                    Load DOC
                  </button>
                  <button 
                    className="bg-green text-white py-2 px-4 rounded-lg w-150 ml-1" 
                    onClick={loadCAPA}
                    style={{
                      backgroundColor: '#F08080'
                    }}
                  >
                    CAPA LIST
                  </button>
              </div>
              <div className="grid grid-flow-row gap-1 col-span-3">
                <div className="grid grid-flow-col gap-2">
                  <p className="text-2xl w-full">
                    Daily Task List
                  </p>
                  <div className="grid grid-flow-col gap-2">
                    <span>
                      <h3>{TASK_INF_REPORT.PIC_REPORT}  -  {TASK_INF_REPORT.SPRINT} ({TASK_INF_REPORT.TOTAL_TASK}) </h3>
                    </span>
                  
                  </div>
                </div>
                
                <div className="rdt_Table_custom rdt_Table_custom_task">
                  <TaskDailyList
                    data = {taskDailyList}
                    height="190"
                  /> 
                </div>
              </div>
              <div className="grid grid-flow-row gap-1 col-span-3">
                <div className="grid grid-flow-col gap-2">
                  <p className="text-2xl w-full">
                    CAPA LIST
                  </p>
                </div>
                <div className="rdt_Table_custom rdt_Table_custom_task">
                  <CapaList
                    data = {capaList}
                    height="190"
                  /> 
                </div>
              </div>
            </div>
           
          </div>
          <h3>
            Document List
          </h3>
          <div className="rdt_Table_custom rdt_Table_custom_doc">
            <DocumentGrid
              data = {documentList}
              height="190"
            /> 
          </div>
          
        </div>
      </Modal>
    </div>
  );
}
