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
  const pointDefaultByPharse = myData.pointDefaultByPharse;
  const lsMember = myData.memList;

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
    // console.log("requirementDetail", requirementDetail);
    console.log("myData", myData);
    
    axios.get(`${url}/task-details/get-actual-effort-point?reqId=${reqId}`)
    .then(res => {
      // console.log("lsPharseMember", lsPharseMember);
      // console.log("requeriment", requirement);
      // await setTaskInfo(requirement);
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
          const member = lsMember.find(mem => mem.userId == userid);
          const total = sumEffort(lsReq.lstActEfrtPnt, userid, phsCd);
       
          let totalTask = total;

          for(let idx = 0; idx < pointDefaultByPharse.length; idx ++){
            totalTask += pointDefaultByPharse[idx].mins;
          }


          //Check in default
          let itemPointDefault = pointDefaultByPharse.filter(point => point.code == phsCd);
          let standardPoint = 25;
          let expectPoint = 25;
          if(member){
            expectPoint = member.pointOnHour.expect;
            standardPoint = member.pointOnHour.standard;
          }
          item.standardPoint = standardPoint;
          item.expectPoint = expectPoint;
        
          if(itemPointDefault && itemPointDefault.length > 0){ 
            //Check Neu la point default
            item.effortHours = itemPointDefault[0].mins; //12min = 5 point
            item.bpAdddpoint = itemPointDefault[0].point;
            item.point = itemPointDefault[0].point;
           
          } else {
            item.effortHours = total; 
            item.point = parseInt((total / (60 * 1.0)) * expectPoint);
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
      console.log("requirement", requirement);

      //Check total 
      requirement.lstReq = requirement.lstReq.filter(item => item.reqId == reqId);
      
      const gapPoint = requirement.lstReq[0].pntNo - totalPoint; //pntNo
      console.log("totalPoint", totalPoint);
      console.log("requirement.lstReq[0]", requirement.lstReq[0].pntNo);

      for(let k = 0; k < tmpResult.length; k ++){
        if("PIM_PHS_CDFIN" == tmpResult[k].phsCd){
          tmpResult[k].bpAdddpoint = tmpResult[k].point + gapPoint;
        }
      }
      requirement.totalPoint = totalPoint;
      setTaskInfo(requirement);
      setEffortWithMember(tmpResult);
      
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
              Req ID
            </label>
            <input
              type="text"
              id="reqId"
              value={reqId}
              className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg"
            />
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
          Calc Point
        </button>
      </div>
      <div>
        
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
              <th className="px-4 py-2">Point</th>
              <th className="px-4 py-2">BP Point</th>
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
                <td className="px-4 py-2 text-right text-blue-600">{ "PIM_PHS_CDFIN" === result.phsCd ? result.bpAdddpoint : result.point }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}
