import React, { useState } from "react";
import axios from "axios";
import myData from '../data.json';

export default function PointSuggest(props) {
  const url = 'https://blueprint.cyberlogitec.com.vn/api';
  const currentURL = window.location.href // returns the absolute URL of a page
  const prjId = props.prjId;
  const reqId = props.reqId;
  const reqDetail = props.reqDetail;
  const detailReqVO = props.detailReqVO;
  const effortPointCategory = myData.effortPointCategory;

  let [actPoint, setActPoint] = useState(0);
  let [totalListPoint, setTotalListPoint] = useState(0);
  let [suggetPrtList, setSuggetPrtList] = useState([]);
  let [suggestList, setSuggestList] = useState([]);
  let [commentPoint, setCommentPoint] = useState("");

  // if(props.suggestList){
  //   setSuggestList(props.suggestList);

  // }
  const comparePointFn  = (a: any, b: any) => {
    if(a.utPnt > b.utPnt) return -1;
    else if(a.utPnt < b.utPnt) return 1;
    else return 0;
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

  const datasuggestList = async () => {
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
        const suggestListDate = genListPoint(pointList);
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
    // const lsConcatSrt = [...tmpList.sort(compareParentFn)];

    
    setTotalListPoint(total);
    setSuggestList(newList);

    // let lsNewPoint = [...listJobDetail];
    // const lstAddAll  = lsNewPoint.concat(reqDetail.lstJbDetails);

    // let sortJobDetail = [...lstAddAll?.sort(comparePointFn)];
    // console.log("sortJobDetail", sortJobDetail);
    // setsuggestList(sortJobDetail);
  }

  const saveBP = async () => {
    let cmtCtnt = "";
    let cmtVO = {};
    let lstAdd = [...suggestList];
    let lstPrt = [];
    for(let j = 0; j < suggestList.length; j ++){
      const itemPrt = suggetPrtList.filter(item => item.jbId == suggestList[j].prntJbId);
      if(itemPrt){
        lstPrt.push(itemPrt[0]);  
      }
    }
    
    // RO
    // {"categoryList":[{"utPnt":0,"jbId":"JOB20211125000000139","jbNm":"Inbound","itmAmt":0,"$parent":0},{"utPnt":50,"jbId":"JOB20211125000000144","jbNm":"COARRI","itmAmt":1,"$parent":"JOB20211125000000139","prntNm":"Inbound"},{"utPnt":0,"jbId":"JOB20211125000000086","jbNm":"UI Layout","itmAmt":0,"$parent":0},{"utPnt":5,"jbId":"JOB20211125000000095","jbNm":"Change Label Charater","itmAmt":1,"$parent":"JOB20211125000000086","prntNm":"UI Layout"},{"utPnt":0,"jbId":"JOB20211125000000033","jbNm":"SQL","itmAmt":0,"$parent":0},{"utPnt":50,"jbId":"JOB20211125000000036","jbNm":"Change delete logic","itmAmt":1,"$parent":"JOB20211125000000033"},{"utPnt":0,"jbId":"JOB20211125000000006","jbNm":"Data Correction","itmAmt":0,"$parent":0},{"utPnt":10,"jbId":"JOB20211125000000008","jbNm":"Updated Column","itmAmt":1,"$parent":1677656482208},{"utPnt":5,"jbId":"JOB20211125000000007","jbNm":"Related table","itmAmt":1,"$parent":1677656482208},{"utPnt":0,"jbId":"JOB20211125000000011","jbNm":"UI Logic","itmAmt":0,"$parent":0},{"utPnt":10,"jbId":"JOB20211125000000013","jbNm":"Data Mapping/Unmapping","itmAmt":1,"$parent":1677656482210},{"utPnt":25,"jbId":"JOB20211125000000015","jbNm":"Change component status","itmAmt":1,"$parent":1677656482210},{"utPnt":50,"jbId":"JOB20211125000000018","jbNm":"Change UI Action","itmAmt":1,"$parent":1677656482210},{"utPnt":15,"jbId":"JOB20211125000000019","jbNm":"Recall function","itmAmt":1,"$parent":1677656482210},{"utPnt":0,"jbId":"JOB20211125000000044","jbNm":"Data model","itmAmt":0,"$parent":0},{"utPnt":30,"jbId":"JOB20211125000000045","jbNm":"Change length","itmAmt":1,"$parent":1677656482215,"prntNm":"Data model"},{"utPnt":5,"jbId":"JOB20211125000000046","jbNm":"Add column","itmAmt":1,"$parent":1677656482215}],"actPoint":285,"reqId":"PRQ20230301000000085","cmtCtnt":"<div class=\\"system-comment\\"> • Added Point: </div>   <div style=\\"margin-left: 10px\\"> <b>&nbsp;Inbound:</b></div>  <div style=\\"margin-left: 10px\\"><i> &nbsp;&nbsp;COARRI: </i>50 </div>  <div style=\\"margin-left: 10px\\"> <b>&nbsp;UI Layout:</b></div>  <div style=\\"margin-left: 10px\\"><i> &nbsp;&nbsp;Change Label Charater: </i>5 </div>  <div style=\\"margin-left: 10px\\"> <b>&nbsp;Data model:</b></div>  <div style=\\"margin-left: 10px\\"><i> &nbsp;&nbsp;Change length: </i>30 </div> ","pjtId":"PJT20211119000000001","subPjtId":"PJT20211119000000001","action":"REQ_WTC_EFRT"}
//   //Update category
    let parentDetail = [...suggestList.filter(item => item.$parent == "0")];
    if(lstAdd.length > 0){
        lstAdd.map(function(item){
        const prt = parentDetail.filter((prtItm) => prtItm.jbId == item.prntJbId);
          if(prt && prt.length > 0 && prt.jbId != item.jbId){
            item.category = prt[0].jbNm;

          } 
        });
        cmtVO.lstPoint = [...lstAdd];
        cmtVO.type = "addPnt";
        cmtCtnt += buildComment(cmtVO);
    };
   
    if(cmtCtnt != ""){
      setCommentPoint(cmtCtnt);
      cmtVO.cmtCtnt = cmtCtnt;
      // cmtVO.pstTpCd = POST_TYPE_CODE_ACTIVITY;

      //Merge
      // let lstJbDetails = [...reqDetail.lstJbDetails];
      // const lstAddAll  = lstAdd.concat(lstJbDetails);
      let ro = {
          categoryList    : lstAdd,
          actPoint      : Number(props.total + actPoint),
          reqId           : reqDetail.detailReqVO.reqId,
          cmtCtnt         : cmtCtnt,
          pjtId           : reqDetail.detailReqVO.pjtId,
          subPjtId        : reqDetail.detailReqVO.subPjtId,
          action          : 'REQ_WTC_EFRT',
      };
      console.log("RO", ro);

      // console.log("reqee", req)
      const response = await axios.put(`${url}/save-req-job-detail`, ro).then(async function (response) {
        const msg =   response.data.saveFlg;//saveFlg: 'SAVE_SUCCEED', pstId: 'PST20230303000001056'}

        alert(msg);
        if('SAVE_SUCCEED' == msg) {
          
          // window.location.reload(false);

        }
      });

  }

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

  const sumAmtByJbId = (arr: Array<Object>, jbId: any) => {
    let sum = 0;
    for(let i = 0; i < arr.length; i ++) {
      if (jbId == arr[i].jbId) {
        sum += arr[i].itmAmt;
      }
    }
    return sum;
  }

  const genListPoint = (pointList: Array<Object>) => {
    let tmpTotalPoint = props.actualtotal - props.total;
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
    setActPoint(subTotal);
  
    return countList;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    // props.callBack("child : ");
    datasuggestList();

    // cfmEditPoint(true, true);

  };


  return (
    <form className="grid grid-flow-row gap-2" 
          onSubmit={handleSubmit}>
      <div>
        <table className="w-full border border-gray-500">
          <thead>
            <tr className="bg-gray-200 ">
              <th className="px-4 py-2 text-left">
                Seq#Id
              </th>
              <th className="px-4 py-2 text-right">
                Act. Point
              </th>
              <th className="px-4 py-2 text-right">
                Est. Point
              </th>
              <th className="px-4 py-2 text-right">
               
              </th>
              
            </tr>

            <tr className="bg-gray-200">
              <th className="text-right x-4 py-2 w-120">
                  <input
                    type="text"
                    id="seqNo"
                    defaultValue={props.reqId}
                    onChange={handleSubmit}
                    className="px-4 py-2 col-span-2 border border-gray-500 rounded-lg text-right  w-full"
                  />
                
              </th>
              <th className="text-right w-100 px-4 py-2">
                <input
                    type="text"
                    id="actPointSuggest"
                    defaultValue={actPoint}
                    onChange={handleSubmit}
                    className="px-4 py-2 col-span-2 border border-gray-500 rounded-lg w-100 text-right  w-full"
                  />
             
              </th>
              <th className="text-left w-100 px-4 py-2">
                <input
                    type="text"
                    id="totalListPoint"
                    value={totalListPoint}
                    className="px-4 py-2 col-span-2 border border-gray-500 rounded-lg w-100 text-right  w-full"
                  />
               
              </th>
              <th className="px-4 py-2 text-right w-250">
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg w-100" 
                    disabled={props.total == 0}>
                    Suggest
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-4 w-130" disabled={actPoint == 0}  onClick={saveBP}>
                  Save Point Task
                </button>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="table-container-10">
        <table className="w-full border border-gray-500 custom-scroll">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 w-170">Category</th>
              <th className="px-4 py-2 text-left w-full">Title</th>
              <th className="px-4 py-2 text-right w-100">Unit Point</th>
              <th className="px-4 py-2 text-right w-100">Volume</th>
              <th className="px-4 py-2 text-right w-100">Total</th>

            </tr>
          </thead>
          <tbody className="border-t">
            {
              suggestList.map((result) => (
                <tr key={result.jbId} className={result.className}>
                   {result.prntJbId == "0" ? 
                    (
                      <td className="px-4 py-2 font-bold text-left w-full" colSpan="4">
                        {result.jbNm}
                      </td>
                    ):
                    (
                      <>
                        <td className="px-4 px-6 text-left" colSpan={2}>{ result.isNew != false ? "(*)" : ""} {result.jbNm}</td>
                        <td className="px-4 py-2 text-right">{result.prntJbId != "0" ? result.utPnt : ""}</td>
                        <td className="px-4 py-2 text-right">{result.prntJbId != "0" ? result.itmAmt : ""}</td>
                        <td className="px-4 py-2 text-right">{result.prntJbId != "0" ? result.utPnt * result.itmAmt : ""}</td>
                      </>
                    )
                  }
                  </tr>
                  )
                )
            }
          </tbody>
        </table>
      </div>
      <div className="comment" dangerouslySetInnerHTML={{__html: commentPoint}}></div>
    </form>
  );
}
