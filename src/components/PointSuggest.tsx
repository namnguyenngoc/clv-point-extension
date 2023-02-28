import React, { useState } from "react";
import axios from "axios";
import myData from '../data.json';

export default function PointSuggest(props) {
  const url = 'https://blueprint.cyberlogitec.com.vn/api';
  const currentURL = window.location.href // returns the absolute URL of a page
  const prjId = props.prjId;
  const reqId = props.reqId;
  const effortPointCategory = myData.effortPointCategory;

  let [totalPoint, setTotalPoint] = useState(0);
  let [suggetList, setSuggetList] = useState([]);

  function formatTime (time) {
    let hour = parseInt((time > 59 ? time : 0) / 60);
    let min = time > 0 ? time % 60 : 0;
    return `${hour}h ${min}m`;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const suggestData = dataSuggetList();
   

  };

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
  
  const dataSuggetList = async () => {
    const param = {
      "pjtId": prjId,
      "isSearchDeleted":"N",
      "reqId": reqId,
    };
   
    const listJobDetail = await axios.post(`${url}/searchJobDetailsList`, param)
    .then(async (res) => {
      const result = [...res.data];
      let pointList = [];
      if(result){
        let lsFilter = result.filter(item => (effortPointCategory.includes(item.jbNm)));
        if(lsFilter == undefined || lsFilter == null || lsFilter.length == 0){
          lsFilter = [...res.data];
        }
        for(let i = 0; i < lsFilter.length; i ++){
          await axios.post(`${url}/searchJobDetailsListByParentJobId`, {
            "reqId":reqId
            ,"prntJobId": lsFilter[i].jbId
          }).then(resDetail => {
            const resItemOfParent = resDetail.data.subJobDtlsLst; 
            for(let j = 0; j < resItemOfParent.length; j ++){
              let subItem = resItemOfParent[j];
              // Object.assign(subItem, item[j]); ;
              subItem.prntJobId = lsFilter[i].jbId;
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
    
    setSuggetList(sortJobDetail);
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

  const countInArray = (arr: Array<Object>, jbId: any) => {
    let count = 0;
    for(let i = 0; i < arr.length; i ++) {
      if (jbId == arr[i].jbId) {
        count ++;
      }
    }
    return count;
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
      const count = countInArray(lsPoint, countList[i].jbId);
      if(count) {
        countList[i].volume = count;
        countList[i].volumeTotal = count * countList[i].utPnt;
      }
      subTotal += countList[i].volumeTotal;
    }
    setTotalPoint(subTotal);
    return countList;
  }
  return (
    <form className="grid grid-flow-row gap-2" 
          onSubmit={handleSubmit}>
      <div>
        <table className="w-full border border-gray-500">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-right">
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg" disabled={props.total == 0}>
                  Suggest
                </button>
              </th>
              <th className="px-4 py-2 text-right w-full">
                Total suggest
              </th>
              <th className="px-4 py-2 text-right">
                <input
                  type="text"
                  id="totalPointSuggest"
                  value={totalPoint}
                  className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg w-100 text-right"
                />
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
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-right w-100">Unit Point</th>
              <th className="px-4 py-2 text-right w-100">Volume</th>


            </tr>
          </thead>
          <tbody className="border-t">
            {suggetList.map((result) => (
              <tr key={result.jbId} className="border-t">
                <td className="px-4 py-2 font-bold">{result.category}</td>
                <td className="px-4 py-2 text-left">{result.jbNm}</td>
                <td className="px-4 py-2 text-right">{result.utPnt}</td>
                <td className="px-4 py-2 text-right">{result.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}
