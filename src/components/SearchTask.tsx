import React, { useState,useEffect, CSSProperties } from "react";
import axios from "axios";
import Select, { components } from "react-select";
import { WEB_INFO } from '../const';
import BPTableGrid from "./BPTableGrid";
import BPTableGridNew from "./BPTableGridNew";
import ScaleLoader from "react-spinners/ScaleLoader";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TaskEffortByUserTable from "./TaskEffortByUserTable";
import TaskByUser from "./TaskByUser";


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
export default function SearchTask(props) {
  const url = WEB_INFO.BLUEPRINT.API;
  const pjtId = WEB_INFO.BLUEPRINT.PROJECTS.NEW_FWD.ID;

  let [conditionSearch, setConditionSearch] = useState("");
  let [clickupID, setClickupID] = useState("");
  let [clickTaskInfo, setClickTaskInfo] = useState(null);
  let [taskList, setTaskList] = React.useState([]);
  let [pharseList, setPharseList] = React.useState([]);
  let [selectedPharses, setSelectedPharses] = React.useState([]);
  let [reqStsCd, setReqStsCd] =  React.useState(['REQ_STS_CDOPN', 'REQ_STS_CDPRC',]);
  let [seqNo, setSeqNo] = useState("");
  let [lstReq, setLstReq] = useState([]);
  let [totalEffort, setTotalEffort] = useState("");
  let [pic, setPic] = useState("namnnguyen");
  let [pharse, setPharse] = useState({});
  let [lstPhs, setLstPhs] = React.useState([]);
  let [loading, setLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  let [color, setColor] = useState("#0E71CC");

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

  async function searchRequirementCallBack() {
    await searchRequirement();
  }
  const searchRequirement = async () => {
    setLoading(true);
    setLstReq([]);
    localStorage.setItem('BP_TASK_LIST', JSON.stringify([]));
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
      "picId": pic,
      "pageSize": 200
    };

    if(pharse && pharse.value){
      data = {
        "pjtId": pjtId,
        "advFlg": "Y",
        "reqStsCd": reqStsCd,
        "jbTpCd": "_ALL_",
        "itrtnId": "_ALL_",
        "beginIdx": 0,
        "endIdx": 200,
        "isLoadLast": false,
        "picId": pic,
        "pageSize": 200,
        "creUsrId": "",
        "assiUsrId": "",
        "stDt": "",
        "endDt": "",
        "reqPhsCd": pharse.value,
        "regstStDt": "",
        "regstEndDt": "",
        "finStDt": "",
        "finEndDt": "",
        "imptCd": "_ALL_",
        "rltIssCd": "_ALL_"
      }
    }
    console.log("data", data);
    let requirement = await axios.post(`${url}/uiPim001/searchRequirement`, data
    ).then(res => {
      return res.data;
    });
   
    
    if(requirement.lstReq && requirement.lstReq.length > 0) {
      //Tinh total effort
      let dataTasks = requirement.lstReq.sort(comparePoint);
      // set index
      let idx = 0;
      dataTasks.map(function(item) {
        item.index = idx++;
      });

      const sum = dataTasks.reduce((accumulator, object) => {
        return accumulator + Number(object.pntNo);
      }, 0);

      setTotalEffort(formatNumber(sum, 0));

      localStorage.setItem('BP_TASK_LIST', JSON.stringify(dataTasks));
      setLoading(false);

    }
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
  const formatNumber = (value: any, tofix: any, isInt: boolean) => {
    if (!value)
      return ''

    const val = (value / 1).toFixed(tofix).replace(',', '.')
    if (!val)
      return ''

    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  const comparePoint  = (a: any, b: any) => {
    let isSubmit = localStorage.getItem('ONLY_SUBMIT');
    if(isSubmit) {
      return sortDesc(a, b);
    }
    return sortAsc(a, b);
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
      let lstPhs = data.lstPhs;
      if(lstPhs) {
        lstPhs.map(function(item) {
          item.value = item.phsCd;
          item.label = item.phsNm;
        })
        setLstPhs(lstPhs);
      }

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
  const handleClick = (event, num) => {
    // 👇️ take the parameter passed from the Child component
    // setCount(current => current + num);

    console.log('argument from Child: ', num);
  };
  useEffect(()=>{
    //console.log("Request searchRequirement", refresh_token);
    searchReqDefaultCdLst().then((data) => {
      
    }).then((data) => {
    });

    

  },[])
  
  return (
    <div className="grid grid-flow-row">
      <Tabs>
        <TabList>
          <Tab>Tasks</Tab>
          <Tab>Task By User</Tab>
          <Tab>Effort Member</Tab>
        </TabList>

        <TabPanel>
          <div className="grid grid-flow-col gap-2">
            <div className="grid grid-flow-col gap-1">
              <input
                type="text"
                id="conditionSearch"
                defaultValue={conditionSearch}
                onChange={event => setConditionSearch(event.target.value) }
                onKeyDown={handleKeyDown}
                placeholder="Task name or #SeqNo"
                className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg w-full"
              />
              <input
                type="text"
                value={totalEffort}
                readOnly={true}
                placeholder="Total Effort"
                className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg w-100 text-right"
              />
            </div>
            
            <div className="grid grid-flow-col gap-1">
              <input
                type="text"
                id="clickupID"
                defaultValue={clickupID}
                onChange={event => setClickupID(event.target.value) }
                onKeyDown={handleKeyDownClickup}
                placeholder="Clickup ID"
                className="col-span-1 border border-gray-500 px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                id="clickupStatus"
                placeholder="Clickup Status"
                value={clickTaskInfo ? clickTaskInfo.status.status : ""}
                style={{
                  backgroundColor: clickTaskInfo ? clickTaskInfo.status.color : "#FFFFFF"
                }}
                className="col-span-1 border border-gray-500 px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                id="pic"
                defaultValue={pic}
                value={pic}
                onChange={event => setPic(event.target.value) }
                placeholder="PIC ID"
                className="col-span-1 border border-gray-500 px-4 py-2 rounded-lg"
              />
              <Select
                  defaultValue={pharse}
                  closeMenuOnSelect={true}
                  hideSelectedOptions={false}
                  isClearable={true}
                  onChange={(options) => {
                    setPharse(options);
                          
                      }
                  } 
                  options={lstPhs}
                  components={{
                      Option: InputOption
                  }}
              />
            </div>
            <div className="grid grid-flow-col gap-1">
              <Select
                  defaultValue={defaultPharse}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  onChange={(options) => {
                          if (Array.isArray(options)) {
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
          <div className="table-container-mgmt">
            
            <div style={{height: 695}} >
                {/* <BPTableGrid 
                  taskList = {lstReq}
                  handleClick={handleClick}
                    
                />  */}
                <BPTableGridNew
                  taskList = {lstReq}
                    
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
        </TabPanel>
        <TabPanel>
          <TaskEffortByUserTable />
        </TabPanel>
        <TabPanel>
          <TaskByUser />
        </TabPanel>

      </Tabs>
      
    </div>
  );
}
