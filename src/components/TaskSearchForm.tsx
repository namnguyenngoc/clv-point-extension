import React, { useState, CSSProperties, useEffect } from "react";
import axios from "axios";
import myData from '../data.json';
import PointSuggest from './PointSuggest';
import Select, { components } from "react-select";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import ACC_SHEET_API from '../credentials.json';
import ScaleLoader from "react-spinners/ScaleLoader";
import Modal from 'react-modal';

const InputTrongSoOption = ({
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
      <input type="checkbox" checked={isSelected} className="mr-4" />
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
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zindex: '-1',
  },
};

export default function TaskSearchForm() {
  let [reqId, setReqId] = useState("");
  let [pointOnHour, setPointOnHour] = useState(25); //Point senior

  let [effortWithMember, setEffortWithMember] = useState([]);
  let [taskInfo, setTaskInfo] = useState({});
  let [reqDetail, setReqDetail] = useState({});
  
  let [suggetList, setSuggetList] = useState([]);
  let [comment, setComment] = useState("");

  const prjId = "PJT20211119000000001";

  const url = 'https://blueprint.cyberlogitec.com.vn/api';
  const currentURL = window.location.href // returns the absolute URL of a page
  // const pointDefaultByPharse = myData.pointDefaultByPharse;
  // const lsMember = myData.memList;

  const taskLevelList = myData.taskLevel;
  const defaultTrongSo = taskLevelList[0];
  const [taskLevel, setTaskLevel] = useState(taskLevelList[0]);
  const SHEET_ID = "Member_List";
  const RANGE_MEMBER_SHEET = 'A1:AQ50';
  const SPREADSHEET_ID = "10WPahmoB6Im1PyCdUZ_uda3fYijC8jKtHnRBasnTK3Y";

  let [docTitle, setDocTitle] = useState();
  let [memList, setMemList] = useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  let subtitle;
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#0E71CC");

  const onChangeLevel = (option: any) => {
    setTaskLevel(option);
  }

  const arr = currentURL.split("/");
  if(arr && arr.length > 0){
    // const reqId = arr[arr.length-1];
    reqId = arr[arr.length-1];
  }
  const handleReqIdChange = (event) => {
    setReqId(event.target.value);
  };

  const handlePointOnHourChange = (event) => {
    setPointOnHour(event.target.value);
  };

  const searchRequirement = async () => {
    // https://blueprint.cyberlogitec.com.vn/api/uiPim001/searchRequirement
    //https://blueprint.cyberlogitec.com.vn/api/task-details/get-actual-effort-point?reqId=${lsReq[i].reqId}
    const requirementDetail = await  axios.get(`${url}/searchRequirementDetails?reqId=${reqId}`)
    .then(res => {
      setReqDetail(res.data);
      // selectMemberList();
      return res.data;
    });

    const data = {
      "pjtId": requirementDetail.detailReqVO.pjtId,
        "reqNm": requirementDetail.detailReqVO.reqTitNm,
        "advFlg": "N",
        "reqStsCd": [
            "REQ_STS_CDPRC",
            "REQ_STS_CDOPN"
        ],
        "jbTpCd": "_ALL_",
        "itrtnId": "_ALL_",
        "beginIdx": 0,
        "endIdx": 200,
        "picId": "_ALL_",
        "isLoadLast": false
    };
    let lsPharseMember = requirementDetail.lstSkdUsr
    let requirement = await axios.post(`${url}/uiPim001/searchRequirement`,   data
    ).then(res => {
      return res.data;
    });
    // console.log("requirementDetail", requirementDetail);
    // console.log("myData", myData);
    let lsMember = await selectMemberList();
    console.log("----------------lsMember");
    await axios.get(`${url}/task-details/get-actual-effort-point?reqId=${reqId}`)
      .then(async (res) => {
        // console.log("lsPharseMember", lsPharseMember);
        // console.log("requeriment", requirement);
        // await setTaskInfo(requirement);
        
        // await Promise.resolve(selectMemberList);
        let lsReq = res.data;
        let tmpResult = new Array();
        if(lsReq.lstActEfrtPnt != undefined && lsReq.lstActEfrtPnt != null && lsReq.lstActEfrtPnt.length > 0) {
          console.log("----------------");
          // let addedPoint = taskInfo.lstReq[0].pntNo;
          let currentTotalPoint = 0;
          for(let idx = 0; idx < lsPharseMember.length; idx ++){
            let item = lsPharseMember[idx];
            const userid = lsPharseMember[idx].usrId;
            const phsCd =  lsPharseMember[idx].phsCd;
            const member =  lsMember.find(mem => mem.userId == userid);
            const total = sumEffort(lsReq.lstActEfrtPnt, userid, phsCd);
            let pointDefaultByPharse = {
                "standard": 25,
                "timeStandard": 0,
                "expect": 19, //Jnr1
                "description": ""
            }
            
           
            if(member) {
              pointDefaultByPharse =  member.pointOnHour;
            }
            let totalTask = total;
            // "standard":   sheet.getCell(i, 38).formattedValue,
            // "timeStandard":  
            // for(let idx = 0; idx < pointDefaultByPharse.length; idx ++){
            //   totalTask += pointDefaultByPharse[idx].timeStandard;
            // }
            totalTask += parseInt(pointDefaultByPharse.timeStandard);

            //Check in default
            // let itemPointDefault = pointDefaultByPharse.filter(point => point.code == phsCd);
            let standardPoint = 25;
            let expectPoint = 25;

            if(member){
              expectPoint = member.pointOnHour.expect;
              standardPoint = member.pointOnHour.standard;
              item.minPoint = member.minPoint;
              item.maxPoint = member.maxPoint;
              item.target = member.target;
            }
            item.standardPoint = standardPoint;
            item.expectPoint = expectPoint;
        
          
            if("PIM_PHS_CDREG" == phsCd){ 
              //Check Neu la point default
              item.effortHours =  parseInt(pointDefaultByPharse.timeStandard); //12min = 5 point
              item.bpAdddpoint =  parseInt(pointDefaultByPharse.standard);
              item.point =  parseInt(pointDefaultByPharse.standard);
            
            } else {
              item.effortHours = total; 
              item.point = parseInt((total / (60 * 1.0)) * expectPoint);
            }


            //Tinh theo level task
            console.log("taskLevel", taskLevel);
            console.log("taskLevelList", taskLevelList);

            // if(taskLevel.value == undefined) {
            //   setTaskLevel(taskLevelList[0]);
            // }
            if(item.bpAdddpoint > 0){
              item.bpAdddpoint = item.bpAdddpoint + (expectPoint * taskLevel.value);

            }
            if(item.point > 0){
              item.point = (item.point == undefined ? 0: item.point) + (expectPoint * taskLevel.value);

            }
            tmpResult.push(item);

          }

          //Update finished pharseeffortHours
          
        }
        // tmpResult.pntNo = lsReq.pntNo;
        let totalPoint = 0;
        for(let k = 0; k < tmpResult.length; k ++){
          totalPoint += tmpResult[k].point;
          // if("PIM_PHS_CDFIN" == tmpResult[k].phsCd){
          //   tmpResult[k].point = 1000;
          // }
        }
      

        //Check total 
        requirement.lstReq = requirement.lstReq.filter(item => item.reqId == reqId);
        
        const gapPoint = requirement.lstReq[0].pntNo - totalPoint; //pntNo
        console.log("totalPoint", totalPoint);
        console.log("requirement.lstReq[0]", requirement.lstReq[0].pntNo);

        for(let k = 0; k < tmpResult.length; k ++){
          if("PIM_PHS_CDFIN" == tmpResult[k].phsCd){
            // const member =  lsMember.find(mem => mem.userId == tmpResult[k].usrId);
            // let FIN_POINT =  tmpResult[k].point + gapPoint;
            // if(member && FIN_POINT < member.pointStandard){
            //   FIN_POINT = member.pointStandard;
            // }
            tmpResult[k].point = tmpResult[k].point + gapPoint;
            // totalPoint += parseInt(FIN_POINT);
          }
        }
        requirement.totalPoint = totalPoint;
        setTaskInfo(requirement);
        setEffortWithMember(tmpResult);
        closeModal();

    })

  }

  function sumEffort (lsData, userid, phsCd) {
    // console.log(lsData);
    // console.log(userName);/
    let sum = 0;
    for (let i = 0; i < lsData.length; i ++) {
      if(userid == lsData[i].usrId && phsCd == lsData[i].phsCd){
        sum += parseInt(lsData[i].actEfrtMnt);
      }
    }
    // if("PIM_PHS_CDREG" == phsCd) {
    //   return 10;
    // } else if ("PIM_PHS_CDIMP" == phsCd){
    //   return sum - 10;
    // }
    return sum;
  }

  function formatTime (time) {
    let hour = parseInt((time > 59 ? time : 0) / 60);
    let min = time > 0 ? time % 60 : 0;
    return `${hour}h ${min}m`;
  }

  const handleSubmit = async (event) => {
    openModal();
    event.preventDefault();
    //https://blueprint.cyberlogitec.com.vn/api/getUserInfoDetails
    await searchRequirement();
    await closeModal();

  };

  const buildComment = (cmtVO: any, detailReqVO) => {
    let comment = "";
    let prntNm = "";
    switch (cmtVO.type) {
      //change point process
      case "pntProc":
          const pointChange = Math.floor(((parseFloat(cmtVO.newPoint) - parseFloat(cmtVO.oldPoint)) * 100) / 100);
          const dispPnt = (pointChange > 0) ? "+" + pointChange : pointChange;
          comment += '<div style="margin-left: 10px"> <i>&nbsp; Phase ' + cmtVO.phsNm + ': </i>' + cmtVO.newPoint + ' <b> (' + dispPnt + ') </b> ' +
              '</div> ';
          break;
      //update start date current phase
     
    }
    return comment;
  } 
  const cfmEditPoint = async ( ) => {
    let lstSkdObj = reqDetail.lstSkdUsr; //searchTaskDetail - line 140 - UI_PIM_001_1 PRQ20230228000000295

    // let lstPhs =  lstSkdObj; //$$("lstPhs").serialize();
    let lstPhsPoint = [];
    let cmtCtnt = '<div class="system-comment"> • Updated Point: </div>';
    let totalPnt = 0;
    console.log("effortWithMember", effortWithMember);
    console.log("lstSkdObj", lstSkdObj);
    for(let i = 0; i < lstSkdObj.length; i ++){
      let item = lstSkdObj[i];
          //For update automatic
      item.oldPoint = (item.efrtNo) ? item.efrtNo : 0;
      // if("PIM_PHS_CDFIN" === item.phsCd ){
      //   item.newPoint = item.bpAdddpoint;
      // } else {
      //   item.newPoint = item.point;
      // }
      item.newPoint = item.point;
      lstPhsPoint.push({
        skdId: item.skdId,
        efrtNo: (item.newPoint) ? item.newPoint : "0"
      });
      if (parseFloat(item.newPoint) != parseFloat(item.oldPoint)) {
        const cmtVO = {
            ...item,
            type: 'pntProc'
        };
        cmtCtnt += buildComment(cmtVO);
      }
    }
    let ro = {
        reqId: reqDetail.detailReqVO.reqId,
        lstPhsPoint: lstPhsPoint,
        cmtCtnt: cmtCtnt,
        pjtId: reqDetail.detailReqVO.pjtId,
        subPjtId: reqDetail.detailReqVO.subPjtId,
        customFlg: true,
        action: 'REQ_WTC_EFRT',
        pstTpCd: 'PST_TP_CDACT',
    };
    // ro.pstTpCd = POST_TYPE_CODE_ACTIVITY;

    console.log("RO", ro);

    let response = axios.put(`${url}/update-point-process-phase`, ro).then(async function (response) {
      const msg =   response.data.saveFlg;//saveFlg: 'SAVE_SUCCEED', pstId: 'PST20230303000001056'}

        alert(msg);
        if('SAVE_SUCCEED' == msg) {
          window.location.reload(false);

        }
    });
  
    
    let cmtVo = {
      type: "pntProc",
      lstPoint: effortWithMember,
  
    }
    console.log("comment", cmtCtnt);
    setComment(cmtCtnt);
  }
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
    setDocTitle(doc.title);

    const sheet = doc.sheetsByTitle[SHEET_ID]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    console.log(sheet.title);
    console.log(sheet.rowCount);
    const range = RANGE_MEMBER_SHEET; //'A1:AB50'
    await sheet.loadCells(range); // loads range of cells into local cache - DOES NOT RETURN THE CELLS
    
    for(let i = 0; i < 50; i ++) {
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
                  "description": sheet.getCell(i, 10).formattedValue
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

  // modal
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  async function closeModal() {
    setIsOpen(false);
  }
  
  useEffect(()=>{
    console.log("Request searchRequirement");
    // handleSubmit();
    const reqRequest = async () => {
      return await searchRequirement();
    };
    reqRequest();
  },[])

  return (
    <div className="grid grid-flow-row sweet-loading">
      <form className="grid grid-flow-row gap-2" 
            onSubmit={handleSubmit}>
        <div className="grid grid-flow-col gap-1">
          <table className="w-full border border-gray-500">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-right">
                  <input
                    type="text"
                    id="reqId"
                    value={reqId}
                    className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg  w-full"
                  />
                </th>
                <th className="px-4 py-2 text-right">
                  <Select
                    defaultValue={defaultTrongSo}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    onChange={(options) => {
                      console.log("options", options);
                      setTaskLevel(options);
                      searchRequirement();
                    }
                    } 
                    options={taskLevelList}
                    components={{
                      Option: InputTrongSoOption
                    }}
                  />
                </th>
                <th className="px-4 py-2 text-right">
                  <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                    Calc Point
                  </button>
                  <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4" onClick={cfmEditPoint}>
                    Save Point Phase
                  </button>
                </th>
                
              </tr>
            </thead>
          </table>
        </div>
        <div>
          <Modal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Example Modal"
          >
              <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
              <button onClick={closeModal}>close</button>
              <div>I am a modal</div>
          </Modal>
          <ScaleLoader
              color={color}
              loading={loading}
              cssOverride={override}
              aria-label="Loading Spinner"
              data-testid="loader"
          />
        </div>
        <div>
          <table className="w-full border border-gray-500">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Effort Point: { (taskInfo && taskInfo.lstReq && taskInfo.lstReq.length > 0) ? taskInfo.lstReq[0].pntNo : 0}</th>
                <th className="px-4 py-2 text-blue-600">Actual Point: {taskInfo.totalPoint}</th>
                <th className="px-4 py-2 c">Gap: {taskInfo.totalPoint - ((taskInfo && taskInfo.lstReq && taskInfo.lstReq.length > 0) ? taskInfo.lstReq[0].pntNo : 0)}</th>
              </tr>
            </thead>
          </table>
          <table className="w-full border border-gray-500">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Member</th>
                <th className="px-4 py-2">Pharse Name</th>
                <th className="px-4 py-2 text-right">Hours</th>
                <th className="px-4 py-2 text-right">Exp P/H</th>
                <th className="px-4 py-2 text-right">Point</th>
                <th className="px-4 py-2 text-right">BP Point</th>
                <th className="px-4 py-2 text-right">Min</th>
                <th className="px-4 py-2 text-right">Max</th>
                <th className="px-4 py-2 text-right">Target</th>
              </tr>
            </thead>
            <tbody>
              {effortWithMember.map((result) => (
                <tr key={result.usrId} className="border-t">
                  <td className="px-4 py-2">{result.usrNm}</td>
                  <td className="px-4 py-2">{result.phsNm}</td>
                  <td className="px-4 py-2 text-right">{formatTime(result.effortHours)}</td>
                  <td className="px-4 py-2 text-right">{result.expectPoint}</td>
                  <td className="px-4 py-2 text-right">{result.point}</td>
                  <td className="px-4 py-2 text-right text-blue-600">{result.point }</td>
                  <td className="px-4 py-2 text-right bg-light-green">{result.minPoint}</td>
                  <td className="px-4 py-2 text-right bg-light-green">{result.maxPoint}</td>
                  <td className="px-4 py-2 text-right bg-light-green">{result.target}</td>
                </tr>
              ))}
             
            </tbody>
          </table>
        </div>
        
      </form>
      <div className="comment" dangerouslySetInnerHTML={{__html: comment}}></div>
      <div className="pt-8">
        <PointSuggest 
          total = { (taskInfo && taskInfo.lstReq && taskInfo.lstReq.length > 0) ? taskInfo.lstReq[0].pntNo : 0}
          actualtotal = {taskInfo.totalPoint}
          prjId = { prjId }
          reqId = { reqId }
          reqDetail = { reqDetail }
          detailReqVO = { taskInfo }
        />
      </div>
    </div>
  );
}
