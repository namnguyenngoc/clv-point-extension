import React, { useState } from "react";
import axios from "axios";
import myData from '../data.json';
import PointSuggest from './PointSuggest';

export default function TaskSearchForm() {
  let [reqId, setReqId] = useState("");
  let [pointOnHour, setPointOnHour] = useState(25); //Point senior

  let [effortWithMember, setEffortWithMember] = useState([]);
  let [taskInfo, setTaskInfo] = useState({});
  
  let [suggetList, setSuggetList] = useState([]);
  let [comment, setComment] = useState("");

  const prjId = "PJT20211119000000001";

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

      let cmtVo = {
        type: "pntProc",
        lstPoint: tmpResult,
    
      }
      const comment = buildComment (cmtVo, null)
      
      console.log("comment", comment);
      setComment(comment);
      
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
    event.preventDefault();
    //https://blueprint.cyberlogitec.com.vn/api/getUserInfoDetails
    searchRequirement();
   

  };
  function buildComment(cmtVO: any, detailReqVO) {
    let comment = "";
    let prntNm = "";
    switch (cmtVO.type) {
      case "addRef": //add related requirement
          comment += '<div class="system-comment"> • Add Related Requirement: </div>  ' +
              ' <div style="margin-left: 10px"> <b> &nbsp; #' + cmtVO.seqNo + ' : </b> ' + cmtVO.reqTitNm + ' </div> ';
          break;
      case "rmvRef": //remove related requirement
          comment += '<div class="system-comment"> • Remove Related Requirement: </div>  ' +
              ' <div style="margin-left: 10px"> <b> &nbsp; #' + cmtVO.seqNo + ' : </b> ' + cmtVO.reqTitNm + ' </div> ';
          break;
      case "addPgm": //add related UI
          comment += '<div class="system-comment"> • Added Related UI: </div>  ' +
              ' <div style="margin-left: 10px"> &nbsp; ' + cmtVO.pgmNm + ' </div> ';
          break;
      case "delPgm": //deleted related UI
          comment += '<div class="system-comment"> • Remove Related UI: </div>  ' +
              ' <div style="margin-left: 10px"> &nbsp; ' + cmtVO.pgmNm + ' </div> ';
          break;
      case "itrtn": //change iteration
          comment += '<div class="system-comment"> • Changed: </div>  ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; Iteration: </i> </b></div> ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; From: </i>' + cmtVO.itrtnNm + ' </div> ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; To: </i>' + detailReqVO.itrtnNm + ' </div> ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; Process: </i> </b></div> ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; From: </i> ' + cmtVO.bizProcNm + ' </div> ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; To: </i>' + detailReqVO.bizProcNm + ' </div> ';
          break;
      case "biz": //only change process
          comment += '<div class="system-comment"> • Changed Process: </div>  ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; From: </i> </b> ' + cmtVO.bizProcNm + ' </div> ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; To: </i> </b>' + detailReqVO.bizProcNm + ' </div> ';
          break;
      case "dueDt": //chane due date
          comment += '<div class="system-comment"> • Changed Due Date: </div>  ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; From: </i> </b> ' + detailReqVO.dispPlnDueDt + ' </div> ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; To: </i> </b>' + cmtVO.dispPlnDueDt + ' </div> ';
          break;
      case "reqTitNm": //edit title name requirement
          comment += ' <div class="system-comment"> • Changed Title: </div> ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; From: </i> </b> ' + detailReqVO.reqTitNm + ' </div> ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; To: </i> </b>' + cmtVO.reqTitNm.trim() + ' </div> ';
          break;
      case "reqCtnt": //edit content requirement
          comment += '<div class="system-comment"> • Changed Content: </div>  ';
          break;
      case "jbTp": //change job type
          comment += '<div class="system-comment"> • Changed Job Type: </div>  ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; From: </i> </b> ' + detailReqVO.jbTpNm + ' </div> ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; To: </i> </b>' + cmtVO.jbTpNm + ' </div> ';
          break;
      case "cate": //change category
          comment += '<div class="system-comment"> • Changed Category: </div>  ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; From: </i> </b> ' + detailReqVO.path + ' </div> ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; To: </i> </b>' + cmtVO.path + ' </div> ';
          break;
      case "usrProc": //change user process
          comment += '<div class="system-comment"> • Changed : </div>  ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; Resource :</i> </b>  ' + cmtVO.phsNm + ' phase </div> ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; From: </i>' + cmtVO.oldUsrNm + ' </div> ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; To: </i>' + cmtVO.newUsrNm + ' </div> ';
          break;
      case "classify": //change classify
          comment += '<div class="system-comment"> • Changed : </div>  ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; Classify :</i></b></div> ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; From: </i>' + (cmtVO.oldClassify === "Y" ? "Confidential" : "Public") + ' </div> ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; To: </i>' + (cmtVO.newClassify === "Y" ? "Confidential" : "Public") + ' </div> ';
          break;
      case "feedback":
          comment += '<div class="system-comment"> • Feedback: </div>  ';
          break;
      case "submit":
          comment += '<div class="system-comment"> • Submitted: </div>  ';
          break;
      //change priority
      case "impt":
          comment += '<div class="system-comment"> • Changed Priority: </div>  ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; From: </i> </b> ' + detailReqVO.imptNm + ' </div> ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; To: </i> </b>' + cmtVO.imptNm + ' </div> ';
          break;
      //add point
      case "addPnt":
          comment += '<div class="system-comment"> • Added Point: </div>  ';
          cmtVO.lstPoint.map(function (item) {
              if (item.utPnt * item.itmAmt > 0) {
                  if (prntNm != item.prntNm) {
                      comment += ' <div style="margin-left: 10px"> <b>&nbsp;' + item.prntNm + ':</b></div> ';
                      prntNm = item.prntNm;
                  }
                  comment += ' <div style="margin-left: 10px"><i> &nbsp;&nbsp;' + item.jbNm + ': </i>' + item.utPnt * item.itmAmt + ' </div> '
              }
          });
          break;
      //remove point
      case "rmvPnt":
          comment += '<div class="system-comment"> • Removed Point: </div>  ';
          cmtVO.lstPoint.map(function (item) {
              if (item.utPnt * item.itmAmt > 0) {
                  if (prntNm != item.prntNm) {
                      comment += ' <div style="margin-left: 10px"> <b>&nbsp;' + item.prntNm + ':</b></div> ';
                      prntNm = item.prntNm;
                  }
                  comment += ' <div style="margin-left: 10px"><i> &nbsp;&nbsp;' + item.jbNm + ': </i>' + item.utPnt * item.itmAmt + ' </div> '
              }
          });
          break;
      //update point
      case "updPnt":
          comment += '<div class="system-comment"> • Update Point: </div>  ';
          cmtVO.lstPoint.map(function (item) {
              if (item.utPnt * item.itmAmt > 0) {
                  if (prntNm != item.prntNm) {
                      comment += ' <div style="margin-left: 10px"> <b>&nbsp;' + item.prntNm + ':</b></div> ';
                      prntNm = item.prntNm;
                  }
                  comment += ' <div style="margin-left: 10px"><i> &nbsp;&nbsp;' + item.jbNm + ': </i>' + item.utPnt * item.itmAmt + ' </div> '
              }
          });
          break;
      //change point process
      case "pntProc":
          const pointChange = Math.floor((cmtVO.effort - cmtVO.oldEfrtNo) * 100) / 100;
          const dispPnt = (pointChange > 0) ? "+" + pointChange : pointChange;
          comment += '<div style="margin-left: 10px"> <i>&nbsp; Phase ' + cmtVO.phsNm + ': </i>' + cmtVO.effort + ' <b> (' + dispPnt + ') </b> ' +
              '</div> ';
          break;
      //update attachment file
      case "imgAttch":
          let flgAdd = false;
          let flgRmv = false;
          comment += '<div class="system-comment"> • Updated Attach File: </div>';
          let strAdd = '<div style="margin-left: 10px"><b>&nbsp; Add : </b></div>';
          let strRmv = '<div style="margin-left: 10px"><b>&nbsp; Remove: </b></div>';
          cmtVO.lstFilesCmt.map(function (item) {
              if (item.statusMode == UPLOAD_NEW) {
                  flgAdd = true;
                  strAdd += '<div style="margin-left: 20px"> ' + item.fileNm + ' </div>';
              } else if (item.statusMode == UPLOAD_DELETE) {
                  flgRmv = true;
                  strRmv += '<div style="margin-left: 20px"> ' + item.fileNm + ' </div>';
              }
          });
          if (flgAdd)
              comment += strAdd;

          if (flgRmv)
              comment += strRmv;
          break;
      //update start date current phase
      case "stDtPhs":
          comment += '<div class="system-comment"> • Changed : </div>  ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; Start Date :</i> </b>  ' + cmtVO.phsNm + ' phase </div> ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; From: </i> ' + cmtVO.oldDt + ' ' + cmtVO.oldHr + ' </div> ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; To: </i> ' + cmtVO.newDt + ' ' + cmtVO.newHr + ' </div> ';
          break;
      //update due date current phase
      case "dueDtPhs":
          comment += '<div class="system-comment"> • Changed : </div>  ' +
              ' <div style="margin-left: 10px"> <b> <i> &nbsp; Due Date :</i> </b>  ' + cmtVO.phsNm + ' phase </div> ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; From: </i> ' + cmtVO.oldDt + ' ' + cmtVO.oldHr + ' </div> ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; To: </i> ' + cmtVO.newDt + ' ' + cmtVO.newHr + ' </div> ';
          break;
      //update due status
      case "status":
          comment += '<div class="system-comment"> • Changed Status: </div>  ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; From: </i> ' + cmtVO.oldStt + ' </div> ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; To: </i> ' + cmtVO.newStt + ' </div> ' +
              ' <div style="margin-left: 10px"> <b><i> &nbsp; Reason: </i></b> ' + cmtVO.rsn + ' </div> ';
          break;
      //update status open -> in process
      case "statusOPN":
          comment += '<div class="system-comment"> • Changed Status: </div>  ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; From: </i> ' + cmtVO.oldStt + ' </div> ' +
              ' <div style="margin-left: 10px"> <i> &nbsp; To: </i> ' + cmtVO.newStt + ' </div> '
          break;
      //update due status
      case "watcher":
          const actionView = (cmtVO.addSts) ? "Add" : "Remove";
          const lstUsrPick = cmtVO.lstUsrPick.map(item => '<div style="margin-left: 20px"> ' + item.usrNm + ' </div>').join(" ");
          comment += '<div class="system-comment"> • ' + actionView + ' Watcher User: </div> ' + lstUsrPick;
          break;
      case "actual":
          comment = '<div class="system-comment">' + (cmtVO.addSts ? "Added" : "Removed") + ' time worked:</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Phase Name: </i></b>' + cmtVO.phsNm + '</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Job Category: </i></b>' + cmtVO.jbNm + '</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Time Worked : </i></b>' + cmtVO.wrkTm + '</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Date: </i></b>' + cmtVO.dt + '</div>';
          break;
      case "updActEffPnt":
          comment = '<div class="system-comment">' + (cmtVO.addSts ? "Updated" : "Removed") + ' time worked:</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Phase Name: </i></b>' + cmtVO.phsNm + '</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Job Category: </i></b>' + cmtVO.jbNm + '</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Time Worked : </i></b>' + cmtVO.wrkTm + '</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Date: </i></b>' + cmtVO.dt + '</div>';
          break;
      case "addEstEffPnt":
          comment = '<div class="system-comment">' + (cmtVO.addSts ? "Added" : "Removed") + ' effort estimation:</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Phase Name: </i></b>' + cmtVO.phsNm + '</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Job Category: </i></b>' + cmtVO.jbCateNm + '</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Job Details: </i></b>' + cmtVO.jbDtNm + '</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Hour: </i></b>' + cmtVO.estEfrtMnt + '</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Point: </i></b>' + cmtVO.efrtPnt + '</div>';
          break;
      case "updEstEffPnt":
          comment = '<div class="system-comment">' + (cmtVO.addSts ? "Updated" : "Removed") + ' effort estimation:</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Phase Name: </i></b>' + cmtVO.phsNm + '</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Job Category: </i></b>' + cmtVO.jbCateNm + '</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Job Details: </i></b>' + cmtVO.jbDtNm + '</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Hour: </i></b>' + cmtVO.estEfrtMnt + '</div>' +
              '<div style="margin-left: 10px"> <b><i> &nbsp; Point: </i></b>' + cmtVO.efrtPnt + '</div>';
          break;
    }
    return comment;
  } 
  
  return (
    <div className="grid grid-flow-row ">
      <form className="grid grid-flow-row gap-2" 
            onSubmit={handleSubmit}>
        <div className="grid grid-flow-col gap-1">
          <table className="w-full border border-gray-500">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-right">
                  Req ID
                </th>
                <th className="px-4 py-2 text-right">
                  <input
                    type="text"
                    id="reqId"
                    value={reqId}
                    className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg  w-full"
                  />
                </th>
                <th className="px-4 py-2 text-right w-150">
                  <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                    Calc Point
                  </button>
                </th>
                
              </tr>
            </thead>
          </table>
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
      <div className="pt-8">
        <PointSuggest 
          total = { (taskInfo && taskInfo.lstReq && taskInfo.lstReq.length > 0) ? taskInfo.lstReq[0].pntNo : 0}
          actualtotal = {taskInfo.totalPoint}
          prjId = { prjId }
          reqId = { reqId }
        />
      </div>
      <div>
        {comment}
      </div>
    </div>
  );
}
