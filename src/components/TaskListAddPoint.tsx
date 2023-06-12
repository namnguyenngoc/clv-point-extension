import React, { useEffect, useState } from "react";
import axios from "axios";
import myData from '../data.json';
import Moment from 'react-moment';
import 'moment-timezone';
import TaskDetaillAddPoint from './TaskDetaillAddPoint';
import TaskSearchForm from './TaskSearchForm';
import ClickupTableGrid from './ClickupTableGrid';

export default function TaskListAddPoint(props) {
  // Moment.locale('en');
  const [children, setChildren] = useState([]);

  let [picId, setPicId] = React.useState("");
  let [reqId, setReqId] = React.useState("");
  let [seqNo, setSeqNo] = React.useState(0);
  
  let [assignee, setAssignee] = React.useState("");
  let [pointOnHour, setPointOnHour] = useState(25); //Point senior
  let [totalListPoint, setTotalListPoint] = useState(0);
  let [suggestList, setSuggestList] = useState([]);

  let [suggetPrtList, setSuggetPrtList] = useState([]);
  let [taskInfo, setTaskInfo] = useState({});
  let [taskList, setTaskList] = useState([]);
  let [reqDetail, setReqDetail] = useState({});
  let [commentProp, setCommentProp] = useState([]);
  let [countFB, setCountFB] = useState(0);

  const url = 'https://blueprint.cyberlogitec.com.vn/api';
 
  const [stsChecked, setStsChecked] = React.useState(true);
  const [approvalChecked, setApprovalChecked] = React.useState(false);
  const [focalChecked, setFocalChecked] = React.useState(false);

  const [finishChecked, setFinishChecked] = React.useState(false);
  const [lsFb, setLsFb] = React.useState(false);

  
  const [selectAssingee, setSelectAssingee] = React.useState('Nam Ngoc Nguyen');
  const [lsAssingee, setLsAssingee] = React.useState([]);

  const effortPointCategory = myData.effortPointCategory;
  const lsMember = myData.memList;
  const pointDefaultByPharse = myData.pointDefaultByPharse;

  picId = 'namnnguyen';

  const compareFn = (a: string, b: string) => {
    // const startDate = a.createDate;
    // const endDate = b.createDate;
    // const start = new Date(`${startDate.slice(0,4)}-${startDate.slice(4,6)}-${startDate.slice(6,8)} ${startDate.slice(8,10)}:${startDate.slice(10,12)}`);
    // const end = new Date(`${endDate.slice(0,4)}-${endDate.slice(4,6)}-${endDate.slice(6,8)} ${endDate.slice(8,10)}:${endDate.slice(10,12)}`);
    // // console.log("start", start);
    // // const start = Moment (a.createDate); //2023 02 23 10 03
    // // const end = Moment (b.createDate); //2023 02 23 10 03 , "YYYYMMDDHHmm"
    const start = a.reqPhsNm;
    const end = b.reqPhsNm;
    if(start > end) return -1;
    else if (start < end) return 1;
    else return 0;
  }

  function getUnique(arr, index) {
    const unique = arr
         .map(e => e[index])
         // store the keys of the unique objects
         .map((e, i, final) => final.indexOf(e) === i && i)
         // eliminate the dead keys & store unique objects
        .filter(e => arr[e]).map(e => arr[e]);      
  
     return unique;
  }

  const searchRequirement = async () => {

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

    // let countFB = comments(reqId);
    // console.log("requirementDetail", requirementDetail);
    // console.log("requirement", requirement);
    //Sort
    // filter
    const originalArr = [...requirement.lstReq];

    let uniqueNames = getUnique(originalArr, "assignee");
    uniqueNames.push({
      assignee: "ALL",
    })
    setLsAssingee(uniqueNames);
    console.log("uniqueNames", uniqueNames);
    let arrApp = [...originalArr.filter(item => item.reqPhsNm == "Approval")];
    let arrFn = [...originalArr.filter(item => item.reqPhsNm == "Finish")];
    let arrFocal = [...originalArr.filter(item => item.reqPhsNm == "Focal Receiving")];
  
    // requirement.lstReq = originalArr;
    console.log("originalArr", originalArr);
    if(originalArr){
      let lsData = [];
      if(stsChecked) {
        lsData = [...originalArr];
        
      } else {
        if (approvalChecked && finishChecked && focalChecked) {
          lsData = [...arrFocal.concat(arrApp).concat(arrFn)];

        } if(focalChecked && approvalChecked){
          lsData = [...arrApp];

        } else {
          lsData = [...arrFn];

        }
      
      }
    
      if(selectAssingee && selectAssingee != "ALL") {
        lsData = [...lsData.filter(item => item.assignee == selectAssingee)];
      }
      // requirement.lstReq = [...lsData];
      requirement.lstReq = [...lsData.sort(compareFBFn)];
    }
    
    //Update point and fb
    // onClickCheckPoint
    await Promise.all(requirement.lstReq.map(async function(item){
      const pointTask = await searchRequirementDetais(item.reqId); 
      let fb = await comments(item.reqId);
      item.countFb = fb.count;
      item.comments = fb.comments;
      //
      item.actEffort = pointTask.totalPoint;
      //
    })
    );
    let taskList = [...requirement.lstReq];
    if(lsFb){
      taskList = [...requirement.lstReq.filter(item => item.countFb > 0)];
    } 
    setTaskList(taskList);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    //https://blueprint.cyberlogitec.com.vn/api/getUserInfoDetails
    console.log("LOAD", "doc.title");
    searchRequirement();
 
  };

  const linkToSite = (newReqId) => {
    localStorage.setItem("pageData", "Data Retrieved from axios request")
   // route to new page by changing window.location
    const url = `https://blueprint.cyberlogitec.com.vn/UI_PIM_001_1/${newReqId}`;
    window.open(url, "_blank"); //to open new page
  }

  const checkExist = (pointList: Array<Object>, point: any) => {
    let flag = false;
    for(let i = 0; i < pointList.length; i ++) {
      if(pointList[i].utPnt == point) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  const comparePointFn  = (a: any, b: any) => {
    if(a.utPnt > b.utPnt) return -1;
    else if(a.utPnt < b.utPnt) return 1;
    else return 0;
  }
  const compareFBFn  = (a: any, b: any) => {
    if(a.counFb > b.counFb) return -1;
    else if(a.counFb < b.counFb) return 1;
    else return 0;
  }
  const existParent = (dataLs: Array<Object>, item: any) => {
    let flag = false;
    for(let i = 0; i < dataLs.length; i ++) {
      if(dataLs[i].jbId == item.jbId) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  const sumAmtByJbId = (arr: Array<Object>, jbId: any) => {
    let sum = 0;
    for(let i = 0; i < arr.length; i ++) {
      if (jbId == arr[i].jbId) {
        sum += arr[i].itmAmt;
      }
    }
    return sum;
  }

  /**
   * Tim so lon nhat mà tổng chia hết cho nó và còn nhỏ hơn tổng point
   * @param pointList 
   * @param tmpTotalPoint 
   * @returns 
   */
  const findMaxPoint = (pointList: Array<Object>, tmpTotalPoint: Number) => {
    let tmpMax = pointList[0];
    let flag = false;
    // console.log("TIM_POINT CHO MAX:", tmpTotalPoint);
    for(let idx = 0; idx < pointList.length; idx ++) {
      if(pointList[idx].utPnt <= tmpTotalPoint){
        tmpMax = pointList[idx];
        flag = true;
        break;
      }
    }
   
    if(flag) {
      return tmpMax;
    } else {
      return pointList[pointList.length - 1];
    }
  }

  /**unique */
  const unique = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const countInArray = (arr: Array<Object>, jbId: any, isAmt: any) => {
    let count = 0;
    for(let i = 0; i < arr.length; i ++) {
      if (jbId == arr[i].jbId) {
        if(isAmt){
          count += (arr[i].itmAmt || arr[i].itmAmt == 0) ? 1 : arr[i].itmAmt;

        }else {
          count ++;
        }
      }
    }
    return count;
  }


  const genListPoint = (pointList: Array<Object>, actualtotal: any, total: any) => {
    let tmpTotalPoint = actualtotal - total;
    let lsPoint = [];
    //1. Tim point lon nhat ma total%max = 0;
    // let pointMax = findMaxPoint(pointList, tmpTotalPoint);
    while (tmpTotalPoint > 0) {
      const pointMax = findMaxPoint(pointList, tmpTotalPoint);
      lsPoint.push(pointMax);
      tmpTotalPoint = tmpTotalPoint - pointMax.utPnt;
    }
    //Merge List
    let countList = [...lsPoint.filter(unique)];
    
    let subTotal = 0;
    for(let i = 0; i < countList.length; i ++) {
      const count = countInArray(lsPoint, countList[i].jbId, false);
      if(count) {
        countList[i].itmAmt = count;
        countList[i].volumeTotal = count * countList[i].utPnt;
      }
      subTotal += countList[i].volumeTotal;
    }
    // setTotalPoint(subTotal); -- Note -2
  
    return countList;
  }

  const updateStateList = (reqId, actualEffort) => {
    const newState = taskList.map(obj => {
      // 👇️ if id equals 2, update country property
      if(obj.reqId == reqId) {
        return {...obj, actEffort: actualEffort};

      }

      // 👇️ otherwise return the object as is
      return obj;
    });

    setTaskList(newState);
  };
  const searchRequirementDetais = async (reqId) => {
    // https://blueprint.cyberlogitec.com.vn/api/uiPim001/searchRequirement
    //https://blueprint.cyberlogitec.com.vn/api/task-details/get-actual-effort-point?reqId=${lsReq[i].reqId}
    const requirementDetail = await  axios.get(`${url}/searchRequirementDetails?reqId=${reqId}`)
    .then(res => {
      console.log("requirementDetail", res.data);
      setReqDetail(res.data);
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
    
    const result = await axios.get(`${url}/task-details/get-actual-effort-point?reqId=${reqId}`)
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
        if(requirementDetail.detailReqVO) {
          const seqNo = requirementDetail.detailReqVO.seqNo;
          setSeqNo(seqNo);

        }
      setTaskInfo(requirement);
      // setEffortWithMember(tmpResult);
      datasuggestList(requirementDetail.detailReqVO.pjtId,reqId, totalPoint, totalPoint)
      return requirement;
    });

    return result;

  }
  async function onClickCheckPoint(prjId, reqId, total: any, item: any) {
   
    // await datasuggestList(prjId, reqId, actualTotal, total);
    setReqId(reqId);
    setSeqNo(item.seqNo);
    setCommentProp(item.comments.lstUsrCmt);
    setCountFB(item.countFb);
    // const pointTask = await searchRequirementDetais(reqId); 
    // let fb = await comments(reqId);
    // alert("FB:" + fb);
    // console.log("pointTask", pointTask );
    // console.log("totalPoint", pointTask.totalPoint );
   


    // updateStateList(reqId, pointTask.totalPoint);
    // item.actEffort = 999;
  }

  async function onClickTotal(prjId, reqId, total: any, item: any) {
    let actualTotal = 1000;
    console.log("actual total",actualTotal );
    await datasuggestList(prjId, reqId, actualTotal, total);
    
   
    updateStateList(reqId);
    // item.actEffort = 999;
  }
  const comments = async (detailReqId) => {
    let result = {
      count: 0,
      comments: {},
    }
    let count = 0;
    await axios.post(`${url}/searchCommentTask`, {
      "reqId":detailReqId
    }).then(res => {
      let commentList = res.data.lstUsrCmt;
      if(commentList) {
       
        for(let i = 0; i < commentList.length; i ++ ){
          if(commentList[i].cmtCtnt && commentList[i].cmtCtnt.toUpperCase().indexOf('FEEDBACK:') > 0) {
            count ++;
          }
        }
        
      }
      result.count = count;
      result.comments = res.data;
      return result;
      
    });
    return result;
  }

  const datasuggestList = async (prjId, reqId, actualTotal: any, total: any) => {
    console.log("datasuggestList", reqId);
    if(!reqId || !reqId) {
      alert("reqId && prjId is manatory!!!");
      return;
    }
    const reqDetail = await  axios.get(`${url}/searchRequirementDetails?reqId=${reqId}`)
    .then(res => {
      return res.data;
    });

    if(reqDetail){
      const param = {
        "pjtId": prjId,
        "isSearchDeleted":"N",
        "reqId": reqId,
      };
      let parentList = [];
      const listJobDetail = await axios.post(`${url}/searchJobDetailsList`, param)
      .then(async (res) => {
        const result = [...res.data];
        let pointList = [];
        if(result){
          let lsFilter = result.filter(item => (effortPointCategory.includes(item.jbNm)));
          if(lsFilter == undefined || lsFilter == null || lsFilter.length == 0){
            lsFilter = [...res.data];
            
          }
          setSuggetPrtList(lsFilter); 
          
          for(let i = 0; i < lsFilter.length; i ++){
            
            await axios.post(`${url}/searchJobDetailsListByParentJobId`, {
              "reqId":reqId
              ,"prntJobId": lsFilter[i].jbId
            }).then(resDetail => {
              const resItemOfParent = resDetail.data.subJobDtlsLst; 
              parentList.push(lsFilter[i]);
              // pointList.push(lsFilter[i]);
              for(let j = 0; j < resItemOfParent.length; j ++){
                let subItem = resItemOfParent[j];
                // Object.assign(subItem, item[j]); ;
                subItem.prntJbId = lsFilter[i].jbId;
                subItem.category = lsFilter[i].jbNm;
                
                //Check exist in array
                const isExist = checkExist(pointList, subItem.utPnt);
                if(!isExist) {
                  pointList.push(subItem);
                  
                }
              }
            });
          
          }
          

          pointList = pointList.sort(comparePointFn);
          const total = 30;
          const suggestListDate = genListPoint(pointList, actualTotal, total);
          return suggestListDate;
          
        }
      
      });

      //Sort
      let sortJobDetail = [...listJobDetail?.sort(comparePointFn)];

      let lstJbDetails = [...reqDetail.lstJbDetails];
      lstJbDetails.map(function (item) {
        item.isNew = false;
        item.className = "border-t bg-light-green";
      })
    
      let lstParentDetail = [];
      
      for(let i = 0; i < sortJobDetail.length; i ++){
        const parent = parentList.filter(item => item.jbId == sortJobDetail[i].prntJbId);
        
        if(parent && parent.length > 0 
          && !existParent(lstParentDetail, parent[0]) 
          && !existParent(lstJbDetails, parent[0])
          ) {
          lstParentDetail.push(parent[0]);
        }
      }
      

      let lsConcat = lstParentDetail.concat(sortJobDetail).concat(lstJbDetails);
      lsConcat.map(function (item) {
        item.sortPrt = item.prntJbId == "0" ? `${item.jbId}-${item.jbNm}`  : `${item.prntJbId}-${item.jbNm}`,
        item.$parent = item.prntJbId;
      });

      //Merge group
      let tmpList = [];
      for(let i = 0; i < lsConcat.length;  i++){
        let item = lsConcat[i];
        const tmp = existParent(tmpList, item);
        if(!tmp) {
          const sum = sumAmtByJbId(lsConcat, lsConcat[i].jbId);
          item.itmAmt =  sum;

          tmpList.push(item);
        }
        
      }

      //split
      //1. get parent
      let newList = [];
      let newPrt =  [...tmpList.filter(item => item.$parent == "0")];
      let total = 0;
      if(newPrt && newPrt.length > 0){
        for(let k = 0; k < newPrt.length; k ++){
          newList.push(newPrt[k]);
          const newChild = [...tmpList.filter(item => item.prntJbId == newPrt[k].jbId)];
          if(newChild && newChild.length > 0){
            newList = newList.concat(newChild);

            //total
            for(let j = 0; j < newChild.length; j ++){
              total += newChild[j].utPnt * newChild[j].itmAmt;

            }
          }

        }
      }
      
      console.log("newList", newList);
      setTotalListPoint(total);
      setSuggestList(newList);
    } //End request detail

  }

  
  //Insert Point for member 
  function buildComment(cmtVO: any, detailReqVO) {
    let comment = "";
    let prntNm = "";
    switch (cmtVO.type) {
      //add point
      case "addPnt":
          comment += '<div class="system-comment"> • Added Point: </div>  ';
          cmtVO.lstPoint.map(function (item) {
            
              if (item.category == undefined || item.jbNm == item.category) {
                  comment += ' <div style="margin-left: 10px"> <b>&nbsp;' + item.jbNm + ':</b></div> ';
                  // prntNm = item.jbNm;
              } else {
                if (item.utPnt * item.itmAmt > 0) {
                  comment += ' <div style="margin-left: 10px"><i> &nbsp;&nbsp;' + item.jbNm + ': </i>' + item.utPnt * item.itmAmt + ' </div> '
                }
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
      //update start date current phase
    
    }
    return comment;
  } 
  const saveBP = async (suggestList, total, totalPoint) => {
  //     let cmtCtnt = "";
  //     let cmtVO = {};
  //     let lstAdd = [...suggestList];
  //     let lstPrt = [];
  //     for(let j = 0; j < suggestList.length; j ++){
  //       const itemPrt = suggetPrtList.filter(item => item.jbId == suggestList[j].prntJbId);
  //       if(itemPrt){
  //         lstPrt.push(itemPrt[0]);  
  //       }
  //     }
      
  //     // RO
  //     // {"categoryList":[{"utPnt":0,"jbId":"JOB20211125000000139","jbNm":"Inbound","itmAmt":0,"$parent":0},{"utPnt":50,"jbId":"JOB20211125000000144","jbNm":"COARRI","itmAmt":1,"$parent":"JOB20211125000000139","prntNm":"Inbound"},{"utPnt":0,"jbId":"JOB20211125000000086","jbNm":"UI Layout","itmAmt":0,"$parent":0},{"utPnt":5,"jbId":"JOB20211125000000095","jbNm":"Change Label Charater","itmAmt":1,"$parent":"JOB20211125000000086","prntNm":"UI Layout"},{"utPnt":0,"jbId":"JOB20211125000000033","jbNm":"SQL","itmAmt":0,"$parent":0},{"utPnt":50,"jbId":"JOB20211125000000036","jbNm":"Change delete logic","itmAmt":1,"$parent":"JOB20211125000000033"},{"utPnt":0,"jbId":"JOB20211125000000006","jbNm":"Data Correction","itmAmt":0,"$parent":0},{"utPnt":10,"jbId":"JOB20211125000000008","jbNm":"Updated Column","itmAmt":1,"$parent":1677656482208},{"utPnt":5,"jbId":"JOB20211125000000007","jbNm":"Related table","itmAmt":1,"$parent":1677656482208},{"utPnt":0,"jbId":"JOB20211125000000011","jbNm":"UI Logic","itmAmt":0,"$parent":0},{"utPnt":10,"jbId":"JOB20211125000000013","jbNm":"Data Mapping/Unmapping","itmAmt":1,"$parent":1677656482210},{"utPnt":25,"jbId":"JOB20211125000000015","jbNm":"Change component status","itmAmt":1,"$parent":1677656482210},{"utPnt":50,"jbId":"JOB20211125000000018","jbNm":"Change UI Action","itmAmt":1,"$parent":1677656482210},{"utPnt":15,"jbId":"JOB20211125000000019","jbNm":"Recall function","itmAmt":1,"$parent":1677656482210},{"utPnt":0,"jbId":"JOB20211125000000044","jbNm":"Data model","itmAmt":0,"$parent":0},{"utPnt":30,"jbId":"JOB20211125000000045","jbNm":"Change length","itmAmt":1,"$parent":1677656482215,"prntNm":"Data model"},{"utPnt":5,"jbId":"JOB20211125000000046","jbNm":"Add column","itmAmt":1,"$parent":1677656482215}],"totalPoint":285,"reqId":"PRQ20230301000000085","cmtCtnt":"<div class=\\"system-comment\\"> • Added Point: </div>   <div style=\\"margin-left: 10px\\"> <b>&nbsp;Inbound:</b></div>  <div style=\\"margin-left: 10px\\"><i> &nbsp;&nbsp;COARRI: </i>50 </div>  <div style=\\"margin-left: 10px\\"> <b>&nbsp;UI Layout:</b></div>  <div style=\\"margin-left: 10px\\"><i> &nbsp;&nbsp;Change Label Charater: </i>5 </div>  <div style=\\"margin-left: 10px\\"> <b>&nbsp;Data model:</b></div>  <div style=\\"margin-left: 10px\\"><i> &nbsp;&nbsp;Change length: </i>30 </div> ","pjtId":"PJT20211119000000001","subPjtId":"PJT20211119000000001","action":"REQ_WTC_EFRT"}
  // //   //Update category
  //     let parentDetail = [...suggestList.filter(item => item.$parent == "0")];
  //     if(lstAdd.length > 0){
  //         lstAdd.map(function(item){
  //         const prt = parentDetail.filter((prtItm) => prtItm.jbId == item.prntJbId);
  //           if(prt && prt.length > 0 && prt.jbId != item.jbId){
  //             item.category = prt[0].jbNm;

  //           } 
  //         });
  //         cmtVO.lstPoint = [...lstAdd];
  //         cmtVO.type = "addPnt";
  //         cmtCtnt += buildComment(cmtVO);
  //     };
    
  //     if(cmtCtnt != ""){
  //       cmtVO.cmtCtnt = cmtCtnt;
  //       let ro = {
  //           categoryList    : lstAdd,
  //           totalPoint      : Number(props.total + totalPoint),
  //           reqId           : reqDetail.detailReqVO.reqId,
  //           cmtCtnt         : cmtCtnt,
  //           pjtId           : reqDetail.detailReqVO.pjtId,
  //           subPjtId        : reqDetail.detailReqVO.subPjtId,
  //           action          : 'REQ_WTC_EFRT',
  //       };
  //       console.log("RO", ro);

  //       // console.log("reqee", req)
  //       const response = await axios.put(`${url}/save-req-job-detail`, ro).then(async function (response) {
  //         const msg =   response.data.saveFlg;//saveFlg: 'SAVE_SUCCEED', pstId: 'PST20230303000001056'}

  //         alert(msg);
        
  //       });

  //     }

  }

  const assigneeChange = (event) => {

    setSelectAssingee(event.target.value);
 
  };


  /**
   * Communication parent to child
   */
  function communicateWithMe(val) {
    console.log("I am called", val);
  }
  // useEffect(() => {
  //   let _children = React.Children.map(props.children, (child) => {
  //     console.log("Parent child", child);
  //     return {
  //       ...child,
  //       props: {
  //         ...child.props,
  //         callBack: communicateWithMe
  //       }
  //     };
  //   });

  //   console.log("_children", _children);
  //   setChildren(_children);
  // }, []);
  const parentToChild = () => {
    console.log("This is data from Parent Component to the Child Component.");
  }

  
  return (
    <div className="grid grid-flow-col gap-2 px-4">
      <form className="grid grid-flow-row gap-2 col-span-2" 
            onSubmit={handleSubmit}>
        <div className="grid grid-flow-col gap-1">
          <table className="w-full border border-gray-500">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-right w-200">
                    <div className="grid grid-flow-col gap-1 text-left">
                      <label>
                        <input type="checkbox"
                          defaultChecked={stsChecked}
                          onChange={() => setStsChecked(!stsChecked)}
                        />
                        All
                      </label>
                      
                      <label>
                        <input type="checkbox"
                          defaultChecked={focalChecked}
                          onChange={() => setFocalChecked(!focalChecked)}
                        />
                          Focal Receiving
                      </label>
                      <label>
                        <input type="checkbox"
                          defaultChecked={approvalChecked}
                          onChange={() => setApprovalChecked(!approvalChecked)}
                        />
                          Approval
                      </label>
                      <label>
                        <input type="checkbox"
                          defaultChecked={finishChecked}
                          onChange={() => setFinishChecked(!finishChecked)}
                        />
                          Finish
                      </label>
                      <label>
                        <input type="checkbox"
                          defaultChecked={lsFb}
                          onChange={() => setLsFb(!lsFb)}
                        />
                          Feedback
                      </label>
                      <div>
                        {/* <input
                          type="text"
                          id="picId"
                          value={picId}
                          onChange={ () => setPicId(picId) }
                          className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg"
                        /> */}
                      </div>
                    </div>
                    
                  </th>
                
                  <th className="px-4 py-2 text-right">
                    <input
                      type="text"
                      defaultValue={picId}
                      onChange={ () => setPicId(picId) }
                      className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg w-full"
                    />
                  </th>
                  <th className="px-4 py-2 text-right w-100" rowSpan={2}>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg w-100">
                      Search
                    </button>
                  </th>
                  
                </tr>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left w-200">
                    Assignee
                  </th>
                
                  <th className="px-4 py-2 text-right">
                    <select 
                      className="px-4 py-2 border border-gray-500 rounded-lg"
                      value={selectAssingee} 
                      onChange={assigneeChange}>
                    {
                      lsAssingee.map((item) => (
                        <option className="px-4 py-2" value={item.assignee}>
                          {item.assignee}
                        </option>
                      ))
                    }            

                      </select>
                  </th>
                  
                </tr>
              </thead>
            </table>
        </div>
        <div>
          
        </div>
        <div className="table-container-mgmt">
          <table className="w-full border border-gray-500 custom-scroll">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 w-30 text-center">#</th>
                <th className="px-4 py-2 w-40 text-center">B.ID</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2 w-150">Assignee</th>
                <th className="px-4 py-2 w-w-120">Phase</th>
                <th className="px-4 py-2 text-right w-150">Eff. Task/T.Worked</th>
                <th className="px-4 py-2 text-right w-70">
                  FB
                </th>
                <th className="px-4 py-2 text-right w-220">
                  Effort Point
                </th>
              </tr>
            </thead>
            <tbody className="border-t">
              {taskList.map((item, idx) => (
                <tr key={item.reqId} 
                    className={item.countFb > 0 ? "border-t bg-fb" : (item.pntNo >= item.actEffort ? "border-t":"border-t bg-add-point")}>
                  <td className="px-4 py-2 w-30 text-center">{idx + 1}</td>
                  <td className="px-4 py-2 w-40 text-center">{item.seqNo}</td>
                  
                  <td className="px-4 py-2 text-blue">
                    <a onClick={event => linkToSite(item.reqId)}>
                      {item.reqTitNm}
                    </a>
                  </td>
                  <td className="px-4 py-2 w-150">{item.assignee}</td>
                  <td className="px-4 py-2 w-120">{item.reqPhsNm}</td>
                  <td className="px-4 py-2 text-right w-150">{item.pntNo}/{item.actEffort}</td>
                  <td className="px-4 py-2 text-right w-70">{item.countFb}</td>
                  <td className="px-4 py-2 text-right w-150">
                    <div className="grid grid-flow-col gap-1">
                      {/* <button type="button" 
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                        disabled={!item.actEffort || item.actEffort > item.pntNo}
                        onClick={ event => onClickTotal("PJT20211119000000001", item.reqId,item.pntNo, item) }
                        >
                        Task
                      </button>
                      <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                        disabled={!item.actEffort || item.actEffort > item.pntNo}
                      >
                        Pharse
                      </button> */}
                      <button 
                        type="button" 
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                        onClick={ event => onClickCheckPoint("PJT20211119000000001", item.reqId,item.pntNo, item) }>
                        Check CMT
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
      </form>
    <div>
      <TaskSearchForm 
        reqId = { reqId }
        taskInfo = { taskInfo }
        reqDetail = {reqDetail}
        seqNo = { seqNo }
        suggestList = { suggestList }
        comment = { commentProp }
        countFB = { countFB }
      />
    </div>
  </div>

  );
}
