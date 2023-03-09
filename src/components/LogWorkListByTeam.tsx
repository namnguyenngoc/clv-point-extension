import React, { useState } from "react";
import axios from "axios";
import myData from '../data.json';
import Moment from 'react-moment';
import 'moment-timezone';

export default function LogWorkListByTeam() {
  // Moment.locale('en');
  let [picId, setPicId] = useState("");

  let [pointOnHour, setPointOnHour] = useState(25); //Point senior

  let [effortWithMember, setEffortWithMember] = useState([]);
  let [taskList, setTaskList] = useState([]);
 
  let memLs= "";
 
  
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
  const searchEffortTeam = async () => {
    if(myData){
      memLs = myData.memList.map(item => `${item.userId}`).join(',');
    }
    const data = {
      "strPjt": "PJT20211119000000001",
      "strUsr": memLs,
      "frmDt": "20230201",
      "toDt": "20230306",
      "condTxt": ""
    };
    // let lsPharseMember = requirementDetail.lstSkdUsr
    let requirement = await axios.post(`${url}/actual-effort/search-task-with-condition`,   data
    ).then(res => {
      return res.data;
    });
    // console.log("requirementDetail", requirementDetail);
    console.log("requirement", requirement);
    //Sort
    if(requirement.lstActEfrt){
      requirement.lstActEfrt = [...requirement.lstActEfrt];
    }
    
    setTaskList(requirement.lstActEfrt);

  }

  const handleSubmit = (event) => {
    event.preventDefault();
    //https://blueprint.cyberlogitec.com.vn/api/getUserInfoDetails
    searchEffortTeam();
 
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
        <table className="w-full border border-gray-500">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-right w-full">
                  TIME WOKRED
                </th>
                <th className="px-4 py-2 text-right">
                  <input
                    type="text"
                    id="picId"
                    value={picId}
                    onChange={event => setPicId(event.target.value) }
                    className="col-span-2 border border-gray-500 px-4 py-2 rounded-lg"
                  />
                </th>
                <th className="px-4 py-2 text-right w-100">
                  <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg w-100">
                    Search
                  </button>
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
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2 w-100">Time</th>
              <th className="px-4 py-2 text-right w-100">Work Date</th>
              <th className="px-4 py-2 text-right ">Comment</th>
              <th className="px-4 py-2 text-right ">Insert Point</th>
            </tr>
          </thead>
          <tbody className="border-t">
            {taskList.map((item) => (
              <tr key={item.reqSeqNo} className="border-t">
                <td className="px-4 py-2 text-blue">
                  <a onClick={event => linkToSite(item.reqSeqNo)}>
                    {item.usrNm}
                  </a>
                </td>
                <td className="px-4 py-2 w-100">{item.actEfrtMnt}</td>
                <td className="px-4 py-2 text-right w-100">{item.wrkDt}</td>
                <td className="px-4 py-2 text-right">{item.cmt}</td>
                <td className="px-4 py-2 text-right">
                  <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                    Total
                  </button>
                  <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                    Pharse
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}
