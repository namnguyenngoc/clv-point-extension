import React, { useState } from "react";
import axios from "axios";
import myData from '../data.json';

export default function TaskSearchForm() {
  let [reqId, setReqId] = useState("");
  let [pointOnHour, setPointOnHour] = useState(25); //Point senior

  let [effortWithMember, setEffortWithMember] = useState([]);
  let [taskInfo, setTaskInfo] = useState({});
  

  const url = 'https://blueprint.cyberlogitec.com.vn/api';
  const currentURL = window.location.href // returns the absolute URL of a page

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

  // const loadPrivateData = () => {
  //   // const REACT_APP_GOOGLE_API_KEY10WPahmoB6Im1PyCdUZ_uda3fYijC8jKtHnRBasnTK3Y
  //   const API_KEY = 'AIzaSyB5w2g5uiHeOFplu6-IZdVcd6rkjVrFEqA';
  //   const shareUrl = 'https://docs.google.com/spreadsheets/d/10WPahmoB6Im1PyCdUZ_uda3fYijC8jKtHnRBasnTK3Y/edit?usp=sharing';
  //   const sheetsOptions = [{ id: 'Member', headerRowIndex: 1 }];

  //   // const { data, loading, error } = useGoogleSheets({
  //   //   apiKey: REACT_APP_GOOGLE_API_KEY,
  //   //   sheetId: REACT_APP_GOOGLE_SHEETS_ID,
  //   //   sheetsOptions,
  //   // });

  //   const { data, loading, error } = useGoogleSpreadsheet(shareUrl, API_KEY, sheetsOptions);
  //   console.log("rows", rows);
  // }

  const searchRequirement = async () => {
    // https://blueprint.cyberlogitec.com.vn/api/uiPim001/searchRequirement
    //https://blueprint.cyberlogitec.com.vn/api/task-details/get-actual-effort-point?reqId=${lsReq[i].reqId}
    const requirementDetail = await  axios.get(`${url}/searchRequirementDetails?reqId=${reqId}`)
    .then(res => {
      return res.data;
    });

    const data = {
      "pjtId": "PJT20211119000000001",
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
        "picId": "_ALL_"
    };
    let lsPharseMember = requirementDetail.lstSkdUsr
    let requirement = await axios.post(`${url}/uiPim001/searchRequirement`,   data
    ).then(res => {
      return res.data;
    });
    console.log("requirementDetail", requirementDetail);
    console.log("myData", myData);
    
    axios.get(`${url}/task-details/get-actual-effort-point?reqId=${reqId}`)
    .then(res => {
      console.log("lsPharseMember", lsPharseMember);
      console.log("requeriment", requirement);
      
      let lsReq = res.data;
      let tmpResult = new Array();
      if(lsReq.lstActEfrtPnt != undefined && lsReq.lstActEfrtPnt != null && lsReq.lstActEfrtPnt.length > 0) {
        console.log("----------------");
        for(let idx = 0; idx < lsPharseMember.length; idx ++){
          const userid = lsPharseMember[idx].usrId;
          const phsCd =  lsPharseMember[idx].phsCd;
          const total = sumEffort(lsReq.lstActEfrtPnt, userid, phsCd);
          // const pointInHour = 25;
          // setPointOnHour()
          console.log("total:", total);
          let item = lsPharseMember[idx];
          if("PIM_PHS_CDREG" == phsCd) {
            item.effortHours = 10;
          } else if ("PIM_PHS_CDIMP" == phsCd){
            item.effortHours = total - 10;
          } else if ("PIM_PHS_CDFIN" == phsCd){
            item.effortHours = 5;
          } else {
            item.effortHours = total;
          }

          let standardPoint = 25;
          if(myData != undefined && myData != null) {
            const obj = myData.find(mem => mem.userId == userid);
            if(obj){
              standardPoint = obj.pointOnHour.expect;
            }
          }
          item.standardPoint = standardPoint;
          item.point = parseInt((total / (60 * 1.0)) * standardPoint);
          tmpResult.push(item);
        }
      }
      // tmpResult.pntNo = lsReq.pntNo;
      let totalPoint = 0;
      for(let k = 0; k < tmpResult.length; k ++){
        totalPoint += tmpResult[k].point;
      }
      requirement.totalPoint = totalPoint;

      setTaskInfo(requirement);
      setEffortWithMember(tmpResult);
      console.log("----------------");
      console.log(lsReq); 
      console.log(effortWithMember);
      console.log(taskInfo);
      // console.log(uniqueArray);
    })

  }

  function sumEffort (lsData, userid, phsCd) {
    // console.log(lsData);
    // console.log(userName);/
    let sum = 0;
    for (let i = 0; i < lsData.length; i ++) {
      if(userid == lsData[i].usrId && phsCd == lsData[i].phsCd){
        sum += parseInt(lsData[i].actEfrtMnt)
      }
    }
    if("PIM_PHS_CDREG" == phsCd) {
      return 10;
    } else if ("PIM_PHS_CDIMP" == phsCd){
      return sum - 10;
    }
    return sum;
  }

  function formatTime (time) {
    let hour = parseInt((time > 59 ? time : 0) / 60);
    let min = time % 60;
    return `${hour}h ${min}m`
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    //https://blueprint.cyberlogitec.com.vn/api/getUserInfoDetails
    searchRequirement();
 
  };

  return (
    <form className="grid grid-flow-row gap-2" 
          onSubmit={handleSubmit}>
      <div className="grid grid-flow-col gap-1">
        <div className="grid grid-flow-row gap-1">
          <div className="grid grid-cols-3 gap-1">
            <label htmlFor="reqId" className="text-lg font-bold px-4">
              Task description
            </label>
            <input
              type="text"
              id="reqId"
              value={reqId}
              onChange={handleReqIdChange}
              className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-3 gap-1">
            <label htmlFor="pointOnHour" className="text-lg font-bold px-4">
              Point In Hour
            </label>
            <input
              type="text"
              id="pointOnHour"
              value={pointOnHour}
              onChange={handlePointOnHourChange}
              className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg"
            />
          </div>
        </div>
        
        
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
          Search
        </button>
      </div>
      <div>
        
      </div>
      <div>
        <table className="w-full border border-gray-500">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Added: { (taskInfo && taskInfo.lstReq && taskInfo.lstReq.length > 0) ? taskInfo.lstReq[0].pntNo : 0}</th>
              <th className="px-4 py-2 text-blue-600">Total Point: {taskInfo.totalPoint}</th>
              <th className="px-4 py-2 text-blue-600">Gap: {taskInfo.totalPoint - ((taskInfo && taskInfo.lstReq && taskInfo.lstReq.length > 0) ? taskInfo.lstReq[0].pntNo : 0)}</th>
            </tr>
          </thead>
        </table>
        <table className="w-full border border-gray-500">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Member</th>
              <th className="px-4 py-2">Pharse Name</th>
              <th className="px-4 py-2">Standard Point</th>
              <th className="px-4 py-2">Hours</th>
              <th className="px-4 py-2">Point</th>
            </tr>
          </thead>
          <tbody>
            {effortWithMember.map((result) => (
              <tr key={result.usrId} className="border-t">
                <td className="px-4 py-2">{result.usrNm}</td>
                <td className="px-4 py-2">{result.phsNm}</td>
                <td className="px-4 py-2">{result.standardPoint}</td>
                <td className="px-4 py-2 text-right">{formatTime(result.effortHours)}</td>
                <td className="px-4 py-2">{result.point}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}
