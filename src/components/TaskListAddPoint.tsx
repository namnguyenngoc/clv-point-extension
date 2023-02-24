import React, { useState } from "react";
import axios from "axios";
import myData from '../data.json';
import Moment from 'react-moment';
import 'moment-timezone';

export default function TaskSearchForm() {
  // Moment.locale('en');
  let [picId, setPicId] = useState("");
  let [pointOnHour, setPointOnHour] = useState(25); //Point senior

  let [effortWithMember, setEffortWithMember] = useState([]);
  let [taskList, setTaskList] = useState([]);
  
  const url = 'https://blueprint.cyberlogitec.com.vn/api';
  const currentURL = window.location.href // returns the absolute URL of a page
  const pointDefaultByPharse = myData.pointDefaultByPharse;
  const lsMember = myData.memList;

  picId = 'namnnguyen';

  const handlepicIdChange = (event) => {
    setPicId(event.target.value);
  };

  const handlePointOnHourChange = (event) => {
    setPointOnHour(event.target.value);
  };
  const compareFn = (a: string, b: string) => {
    const startDate = a.createDate;
    const endDate = b.createDate;
    const start = new Date(`${startDate.slice(0,4)}-${startDate.slice(4,6)}-${startDate.slice(6,8)} ${startDate.slice(8,10)}:${startDate.slice(10,12)}`);
    const end = new Date(`${endDate.slice(0,4)}-${endDate.slice(4,6)}-${endDate.slice(6,8)} ${endDate.slice(8,10)}:${endDate.slice(10,12)}`);
    console.log("start", start);
    // const start = Moment (a.createDate); //2023 02 23 10 03
    // const end = Moment (b.createDate); //2023 02 23 10 03 , "YYYYMMDDHHmm"
    if(start > end) return -1;
    else if (start < end) return 1;
    else return 0;
  }
  const searchRequirement = async () => {
    // https://blueprint.cyberlogitec.com.vn/api/uiPim001/searchRequirement
    //https://blueprint.cyberlogitec.com.vn/api/task-details/get-actual-effort-point?picId=${lsReq[i].picId}
    // const requirementDetail = await  axios.get(`${url}/searchRequirementDetails?picId=${picId}`)
    // .then(res => {
    //   return res.data;
    // });

    const data = {
        "pjtId": "PJT20211119000000001",
        "advFlg": "N",
        "reqStsCd": [
            "REQ_STS_CDPRC",
            "REQ_STS_CDOPN"
        ],
        "picId": picId,
        "jbTpCd": "_ALL_",
        "itrtnId": "_ALL_",
        "beginIdx": 0,
        "endIdx": 200,
    };
    // let lsPharseMember = requirementDetail.lstSkdUsr
    let requirement = await axios.post(`${url}/uiPim001/searchRequirement`,   data
    ).then(res => {
      return res.data;
    });
    // console.log("requirementDetail", requirementDetail);
    console.log("requirement", requirement);
    //Sort
    if(requirement.lstReq){
      requirement.lstReq = [...requirement.lstReq.sort(compareFn)];
    }
    
    setTaskList(requirement.lstReq);
  //   axios.get(`${url}/task-details/get-actual-effort-point?picId=${picId}`)
  //   .then(res => {
  //     let lsReq = res.data;
  //     let tmpResult = new Array();
  //     if(lsReq.lstActEfrtPnt != undefined && lsReq.lstActEfrtPnt != null && lsReq.lstActEfrtPnt.length > 0) {
  //       console.log("----------------");
  //       // let addedPoint = taskInfo.lstReq[0].pntNo;
  //       let currentTotalPoint = 0;
  //       for(let idx = 0; idx < lsPharseMember.length; idx ++){
  //         let item = lsPharseMember[idx];
  //         const userid = lsPharseMember[idx].usrId;
  //         const phsCd =  lsPharseMember[idx].phsCd;
  //         const member = lsMember.find(mem => mem.userId == userid);
  //         const total = sumEffort(lsReq.lstActEfrtPnt, userid, phsCd);
       
  //         let totalTask = total;

  //         for(let idx = 0; idx < pointDefaultByPharse.length; idx ++){
  //           totalTask += pointDefaultByPharse[idx].mins;
  //         }


  //         //Check in default
  //         let itemPointDefault = pointDefaultByPharse.filter(point => point.code == phsCd);
  //         let standardPoint = 25;
  //         let expectPoint = 25;
  //         if(member){
  //           expectPoint = member.pointOnHour.expect;
  //           standardPoint = member.pointOnHour.standard;
  //         }
  //         item.standardPoint = standardPoint;
  //         item.expectPoint = expectPoint;
        
  //         if(itemPointDefault && itemPointDefault.length > 0){ 
  //           //Check Neu la point default
  //           item.effortHours = itemPointDefault[0].mins; //12min = 5 point
  //           item.bpAdddpoint = itemPointDefault[0].point;
  //           item.point = itemPointDefault[0].point;
           
  //         } else {
  //           item.effortHours = total; 
  //           item.point = parseInt((total / (60 * 1.0)) * expectPoint);
  //         }
  //         tmpResult.push(item);

  //       }

  //     }
  //     // tmpResult.pntNo = lsReq.pntNo;
  //     let totalPoint = 0;
  //     for(let k = 0; k < tmpResult.length; k ++){
  //       totalPoint += tmpResult[k].point;
  //     }
  //     console.log("requirement", requirement);

  //     //Check total 
  //     requirement.lstReq = requirement.lstReq.filter(item => item.picId == picId);
      
  //     const gapPoint = requirement.lstReq[0].pntNo - totalPoint; //pntNo
  //     console.log("totalPoint", totalPoint);
  //     console.log("requirement.lstReq[0]", requirement.lstReq[0].pntNo);

  //     for(let k = 0; k < tmpResult.length; k ++){
  //       if("PIM_PHS_CDFIN" == tmpResult[k].phsCd){
  //         tmpResult[k].bpAdddpoint = tmpResult[k].point + gapPoint;
  //       }
  //     }
  //     requirement.totalPoint = totalPoint;
  //     setTaskInfo(requirement);
  //     setEffortWithMember(tmpResult);
      
  //   })

  }

  function sumEffort (lsData, userid, phsCd) {
    let sum = 0;
    for (let i = 0; i < lsData.length; i ++) {
      if(userid == lsData[i].usrId && phsCd == lsData[i].phsCd){
        sum += parseInt(lsData[i].actEfrtMnt);
      }
    }
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

  const linkToSite = (newReqId) => {
    localStorage.setItem("pageData", "Data Retrieved from axios request")
   // route to new page by changing window.location
    const url = `https://blueprint.cyberlogitec.com.vn/UI_PIM_001_1/${newReqId}`;
    window.open(url, "_blank"); //to open new page
  }
  

  return (
    <form className="grid grid-flow-row gap-2" 
          onSubmit={handleSubmit}>
      <div className="grid grid-flow-col gap-1">
        <div className="grid grid-flow-row gap-1">
          <div className="grid grid-cols-3 gap-1">
            <label htmlFor="picId" className="text-lg font-bold px-4">
              PIC
            </label>
            <input
              type="text"
              id="picId"
              value={picId}
              onChange={event => setPicId(event.target.value) }
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
      <div className="table-container">
        <table className="w-full border border-gray-500 custom-scroll">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2 w-170">Assignee</th>
              <th className="px-4 py-2 text-right w-100">Effort Point</th>
            </tr>
          </thead>
          <tbody className="border-t">
            {taskList.map((item) => (
              <tr key={item.reqId} className="border-t">
                <td className="px-4 py-2 text-blue">
                  <a onClick={event => linkToSite(item.reqId)}>
                    {item.reqTitNm}
                  </a>
                </td>
                <td className="px-4 py-2 w-170">{item.assignee}</td>
                <td className="px-4 py-2 text-right w-100">{item.pntNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}
