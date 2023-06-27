import React, { useState } from "react";
import axios from "axios";
import myData from '../data.json';
import PointSuggest from './PointSuggest';
import Select, { components } from "react-select";
import { WEB_INFO } from '../const';

export default function SearchTask(props) {
  const url = WEB_INFO.BLUEPRINT.API;
  const pjtId = WEB_INFO.BLUEPRINT.PROJECTS.NEW_FWD.ID;

  let [conditionSearch, setConditionSearch] = useState("");
  let [clickupID, setClickupID] = useState("");

  let [seqNo, setSeqNo] = useState("");
  let [lstReq, setLstReq] = useState([]);
 
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
    var config = {
      method: 'get',
      url: 'https://api.clickup.com/api/v2/task/865byff8t',
      mode: 'no-cors',
      withCredentials: true,
      credentials: 'same-origin',
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'pk_32193054_YQNFO05VHHM9ABEJUTOE8YUPS7RII2JN'
      }
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }
  const searchRequirement = async () => {
   
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
      "reqStsCd": ["REQ_STS_CDPRC", "REQ_STS_CDOPN", "REQ_STS_CDFIN", "REQ_STS_CDCC", "REQ_STS_CDPD"],
      "jbTpCd": "_ALL_",
      "itrtnId": "_ALL_",
      "beginIdx": 0,
      "endIdx": 200,
      "seqNo": seqNo,
      "reqNm": reqNm,
      "isLoadLast": false
    };
    console.log("data", data);
    let requirement = await axios.post(`${url}/uiPim001/searchRequirement`, data
    ).then(res => {
      return res.data;
    });
    console.log("requirement", requirement);
    let newLsReq = [...requirement.lstReq.map(
      function (item){
        let arrTitle = item.reqTitNm.trim().split('][');
        if(arrTitle && arrTitle.length > 1){
          item.PIC = arrTitle[1];

        }
        item.link = item.reqId.substr(item.reqId.length - 5); //Get 5 character last
      }
    )]
    setLstReq(requirement.lstReq);
  }

  const openTask = (newReqId) => {
    const url = `https://blueprint.cyberlogitec.com.vn/UI_PIM_001_1/${newReqId}`;
    window.open(url, "_blank"); //to open new page
  }

  return (
    <div className="grid grid-flow-row">
      <div className="grid grid-flow-col gap-2">
        <div>
          <input
            type="text"
            id="conditionSearch"
            defaultValue={conditionSearch}
            onChange={event => setConditionSearch(event.target.value) }
            onKeyDown={handleKeyDown}
            className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg w-full"
          />
        </div>
        <div>
          <input
            type="text"
            id="clickupID"
            defaultValue={clickupID}
            onChange={event => setClickupID(event.target.value) }
            onKeyDown={handleKeyDownClickup}
            className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg w-full"
          />
        </div>
        <div>
          <button 
            type="button" 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4"
            onClick={searchRequirement}
          >
            Search
          </button>
        </div>
      </div>
      <div className="table-container-search pt-2">
        <table className="w-full border border-gray-500 custom-scroll">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 w-50">ID</th>
              <th className="px-4 py-2 w-250 text-right">Title</th>
              <th className="px-4 py-2 text-center w-100">Reg. PIC</th>
              <th className="px-4 py-2 w-150 text-center w-100">PIC</th>
              <th className="px-4 py-2 w-150 text-center w-100">Phase</th>
            </tr>
          </thead>
          <tbody className="border-t">
            {lstReq.map((item) => (
              <tr key={item.seqNo} className={"border-t"}>
                <td className="px-2 py-2 w-70 text-center text-blue">
                  <a onClick={event => openTask(item.reqId)} className="link">
                    {item.seqNo}
                  </a>
                </td>
                <td className="px-2 py-2">
                  {item.reqTitNm}
                </td>
                <td className="px-2 py-2 text-center w-100">
                  {item.createUser}
                </td>
                <td className="px-2 py-2 w-100 text-center">
                  {item.PIC}
                </td>
                <td className="px-2 py-2 w-100 text-center">
                  {item.reqPhsNm}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}