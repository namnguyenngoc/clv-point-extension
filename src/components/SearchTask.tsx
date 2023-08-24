import React, { useState,useEffect } from "react";
import axios from "axios";
import myData from '../data.json';
import PointSuggest from './PointSuggest';
import Select, { components } from "react-select";
import { WEB_INFO } from '../const';
import BPTableGrid from "./BPTableGrid";
// "reqStsCd": ["REQ_STS_CDPRC", "REQ_STS_CDOPN", "REQ_STS_CDCC", "REQ_STS_CDPD"],

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
export default function SearchTask(props) {
  const url = WEB_INFO.BLUEPRINT.API;
  const pjtId = WEB_INFO.BLUEPRINT.PROJECTS.NEW_FWD.ID;

  let [conditionSearch, setConditionSearch] = useState("Team B");
  let [clickupID, setClickupID] = useState("");
  let [clickTaskInfo, setClickTaskInfo] = useState(null);
  let [taskList, setTaskList] = React.useState([]);
  let [pharseList, setPharseList] = React.useState([]);
  let [selectedPharses, setSelectedPharses] = React.useState([]);
  let [reqStsCd, setReqStsCd] =  React.useState(['REQ_STS_CDOPN', 'REQ_STS_CDPRC',]);
  let [seqNo, setSeqNo] = useState("");
  let [lstReq, setLstReq] = useState([]);
  
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
      let response = axios.get(`${WEB_INFO.TASK_MEMBER_API}/mergeTaskList`)
      .then(async function (response) {
        alert("merge done");
      });
      
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
    setLstReq([]);
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
      "reqNm": reqNm,
      "isLoadLast": false,
      "picId": "",
      "pageSize": 200
    };
    console.log("data", data);
    let requirement = await axios.post(`${url}/uiPim001/searchRequirement`, data
    ).then(res => {
      return res.data;
    });
    console.log("requirement", requirement);
    // let newLsReq = [...requirement.lstReq.map(
    //   function (item){
    //     let arrTitle = item.reqTitNm.trim().split('][');
    //     if(arrTitle && arrTitle.length > 1){
    //       item.PIC = arrTitle[1];

    //     }
    //     item.link = item.reqId.substr(item.reqId.length - 5); //Get 5 character last
    //   }
    // )]
    if(requirement.lstReq && requirement.lstReq.length > 0) {
      let dataTasks = requirement.lstReq.sort(comparePoint);
      setLstReq(dataTasks);

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

  useEffect(()=>{
    //console.log("Request searchRequirement", refresh_token);
    searchReqDefaultCdLst().then((data) => {
      
    }).then((data) => {
    });
  },[])
  
  return (
    <div className="grid grid-flow-row">
      <div className="grid grid-flow-col gap-2">
        <div>
          <input
            type="text"
            id="conditionSearch"
            defaultValue={conditionSearch}
            onChange={event => setConditionSearch(event.target.value) }
            onKeyDown={handleKeyDown}
            className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg"
          />
        </div>
        <div className="grid grid-flow-col gap-1">
          <input
            type="text"
            id="clickupID"
            defaultValue={clickupID}
            onChange={event => setClickupID(event.target.value) }
            onKeyDown={handleKeyDownClickup}
            className="col-span-1 border border-gray-500 px-4 py-2 rounded-lg"
          />
          <input
            type="text"
            id="clickupStatus"
            value={clickTaskInfo ? clickTaskInfo.status.status : ""}
            style={{
              backgroundColor: clickTaskInfo ? clickTaskInfo.status.color : "#FFFFFF"
            }}
            className="col-span-1 border border-gray-500 px-4 py-2 rounded-lg"
          />
        </div>
        <div>
          <Select
              defaultValue={defaultPharse}
              isMulti
              closeMenuOnSelect={false}
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
        </div>
      </div>
      <div className="table-container-search pt-2">
          <BPTableGrid 
              taskList = {lstReq}
            /> 
        
      </div>
    </div>
  );
}
