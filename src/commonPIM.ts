import axios from "axios";
const payload = 'NjEwMzM2NDIxNTY0OqSozRKOmUFaE9a0OGT1HkQA5wsZ'; // bmFtLm5ndXllbm5nb2M6cXdlckAxMjM=

const REQ_PIM_HEADER = {
  headers: {
     'Authorization': 'Bearer '  + payload,
  }
}

const PIM_CONFIG = {
  headers:  REQ_PIM_HEADER.headers,
  muteHttpExceptions: true,
  delayed: false  // use this custom option to allow overrides
};

const API_PIM = 'https://pim.cyberlogitec.com';


export const GET_STORY_VIA_SPRINT = async function (SPRINT_ID: any, _START?: any, _END?: any) {
  console.log("MEMBER_LIST", SPRINT_ID);
  console.log("_START", _START);
  console.log("_END", _END);

  let _CONFIG = {
    ...PIM_CONFIG,
    method: 'get',
  }
  const config2 = {
    method: 'get',
    headers:  REQ_PIM_HEADER.headers,
    muteHttpExceptions: true,
    delayed: false  // use this custom option to allow overrides
  };


  const data = axios.get(`${API_PIM}/jira/rest/agile/1.0/sprint/${SPRINT_ID}/issue`).then(async (res) => {
    console.log("-------res.data 1-------",res.data);
    const newData = res.data.issues.map(async function (item: any) {
      let total_rework_time = 0;
      console.log("-------item-------",item)
      if(item.fields.subtasks != undefined && item.fields.subtasks != null && item.fields.subtasks.length > 0) {
        for (const task of item.fields.subtasks) {
          console.log("-------task-------",task)
          total_rework_time += await TOTAL_WORKLOG_VIA_TICKET(task.key);
       
        }
      }
    
      console.log("-------Newitem-------",total_rework_time)
      return {
        ...item,
        "total_rework_time": total_rework_time
      }
    });
    return newData;
  });
  return data;
};

export const GET_WORKLOG_VIA_TICKET = function (KEY: any) {

  let data = axios.get(`${API_PIM}/rest/api/2/issue/${KEY}/worklog`).then(async (res) => {
    return res.data;
  });
  return data;

};

export const TOTAL_WORKLOG_VIA_TICKET = function (KEY: any) {

  return GET_WORKLOG_VIA_TICKET(KEY).then((_data: any) => {
    console.log("GET_WORKLOG_VIA_TICKET",_data)
    console.log("GET_WORKLOG_VIA_TICKET",_data.worklogs)
    return _data.worklogs.reduce((accumulator, object) => {
      return accumulator + object.timeSpentSeconds;
    }, 0);

  });

};


export const convertNumberToTimeString = function(number: any) {
  // Calculate days, hours and minutes
  const days = Math.floor(number / 86400);
  const hours = Math.floor((number % 86400) / 3600);
  const minutes = Math.floor((number % 3600) / 60);

  // Return the time string in DD:HH:MM format
  return `${days.toString().padStart(2, '0')} days ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}


export const GET_SPRINT_LIST = function (BOARD_ID: any, PARAMS?: any) {
  let data = axios.get(`${API_PIM}/rest/agile/1.0/board/${BOARD_ID}/sprint?${PARAMS}`).then(async (res) => {
    let ls: { value: any, label: any }[] = [];
    if(res.data != undefined 
      && res.data.values != undefined && res.data.values.length > 0){
      ls = [...res.data.values.map((item: any) => {
        return {
          ...item,
          value: item.id,
          label: `${item.name} - ${item.state}`
        }
      })];
    }
    return ls;
  });
  return data;

};
export const GET_BOARD_LIST = function (BOARD_DEFAULT?: any) {
  let data = axios.get(`${API_PIM}/rest/agile/latest/board`).then(async (res) => {
    let ls: { value: any, label: any }[] = [];
    if(res.data != undefined 
      && res.data.values != undefined && res.data.values.length > 0){
      ls = [...res.data.values.map((item: any) => {
        return {
          value: item.id,
          label: item.name
        }
      })];
    }
    
    return ls;
  });
  return data;

};
export const FORMAT_NUMBER = function (value, decimals) {
  return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
  }).format(value);
}

