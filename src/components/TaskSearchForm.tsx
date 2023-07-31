import React, {useCallback, useState } from "react";
import axios from "axios";
import myData from '../data.json';
import PointSuggest from './PointSuggest';
import TaskComment from './TaskComment';
import MemberList from "./MemberList";

export default function TaskSearchForm(props, { term }) {
  const [children, setChildren] = useState([]);
  let [reqId, setReqId] = useState("");
  
  let [pointOnHour, setPointOnHour] = useState(25); //Point senior

  let [effortWithMember, setEffortWithMember] = useState([]);
  let [taskInfo, setTaskInfo] = useState({});
  // let [reqDetail, setReqDetail] = useState({});
  const reqDetail  = props.reqDetail;
  
  let [suggetList, setSuggetList] = useState([]);
  let [comment, setComment] = useState("");
  // let [seqNo, setSeqNo] = useState("");

  const prjId = "PJT20211119000000001";

  const url = 'https://blueprint.cyberlogitec.com.vn/api';
  const currentURL = window.location.href // returns the absolute URL of a page
  const pointDefaultByPharse = myData.pointDefaultByPharse;
  const lsMember = myData.memList;
  reqId = props.reqId;
  // let seqNo = 0;
  // console.log("props", props);
  // if(props.reqDetail){
  //   if(props.reqDetail.detailReqVO) {
  //     const seqNo = props.reqDetail.detailReqVO.seqNo;
  //     setSeqNo(seqNo);

  //   }
  // }
  // const arr = currentURL.split("/");
  // if(arr && arr.length > 0){
  //   // const reqId = arr[arr.length-1];
  //   reqId = arr[arr.length-1];
  // }
 
  const handleReqIdChange = (event) => {
    setReqId(event.target.value);
  };

  const handlePointOnHourChange = (event) => {
    setPointOnHour(event.target.value);
  };

  const searchRequirement = async () => {
    // https://blueprint.cyberlogitec.com.vn/api/uiPim001/searchRequirement
    //https://blueprint.cyberlogitec.com.vn/api/task-details/get-actual-effort-point?reqId=${lsReq[i].reqId}
    setEffortWithMember([]);
    const requirementDetail = await  axios.get(`${url}/searchRequirementDetails?reqId=${reqId}`)
    .then(res => {
      // setReqDetail(res.data);
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
        "endIdx": 25,
        "picId": "_ALL_",
        "isLoadLast": false
    };
    let lsPharseMember = requirementDetail.lstSkdUsr;
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    //https://blueprint.cyberlogitec.com.vn/api/getUserInfoDetails
    searchRequirement();

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
      if("PIM_PHS_CDFIN" === item.phsCd ){
        item.newPoint = item.bpAdddpoint;
      } else {
        item.newPoint = item.point;
      }
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
        // if('SAVE_SUCCEED' == msg) {
        //   window.location.reload(false);

        // }
    });
  
    
    let cmtVo = {
      type: "pntProc",
      lstPoint: effortWithMember,
  
    }
    console.log("comment", cmtCtnt);
    setComment(cmtCtnt);
  }
  // useEffect(() => {
  //   let _children = React.Children.map(props.children, (child) => {
  //     console.log("Parent child", child);
  //     return {
  //       ...child,
  //       props: {
  //         ...child.props,
  //         callBack: handleSubmit
  //       }
  //     };
  //   });

  //   console.log("_children", _children);
  //   setChildren(_children);
  // }, []);
  const handleClick = () => {
    console.log('You clicked ',"AAAAAÂ");
  };


  return (
    <div className="grid grid-flow-row ">
      <div>
        <TaskComment
          seqNo = { props.seqNo }
          reqId = { props.reqId }
          comment = { props.comment }
          countFB = { props.countFB }
        />
      </div>
      <div>
        {/* <PointSuggest 
          total = { (props.taskInfo && props.taskInfo.lstReq && props.taskInfo.lstReq.length > 0) ? props.taskInfo.lstReq[0].pntNo : 0}
          actualtotal = {props.taskInfo.totalPoint}
          prjId = { prjId }
          reqId = { props.reqId }
          reqDetail = { reqDetail }
          detailReqVO = { props.taskInfo }
          seqNo =  { props.seqNo }
          suggestList = { props.suggestList }
        /> */}
        <MemberList
          seqNo = { props.seqNo }
          reqId = { props.reqId }
          comment = { props.comment }
          countFB = { props.countFB }
        />
      </div>
      <form className="grid grid-flow-row gap-2" 
            onSubmit={handleSubmit}>
        <div className="grid grid-flow-col gap-1">
          <table className="w-full border border-gray-500">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-right w-100">
                  <input
                    type="text"
                    id="seqNo"
                    value={props.seqNo}
                    className="px-4 py-2 col-span-2 border border-gray-500 px-4 py-2 rounded-lg  w-full"
                  />
                </th>
                <th className="px-4 py-2 text-right ">
                  <input
                    type="text"
                    id="reqId"
                    value={reqId}
                    className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg  w-full"
                  />
                </th>
                <th className="px-4 py-2 text-right">
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white py-2 px-4 rounded-lg">
                    Calc Point
                  </button>
                  <button type="button" className="px-4 py-2 bg-blue-500 text-white py-2 px-4 rounded-lg ml-4" onClick={cfmEditPoint}>
                    Save Point Phase
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
      <div className="comment" dangerouslySetInnerHTML={{__html: comment}}></div>
      
    </div>
  );
}
