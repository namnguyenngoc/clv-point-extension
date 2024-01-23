import moment from 'moment';

export const URLS = [
  {
    name: 'Vince Amaziong',
    url: '/index.html',
    image: ''
  },
  // {
  //   name: 'Wikipedia',
  //   url: '//wikipedia.com/',
  //   image: '//upload.wikimedia.org/wikipedia/commons/thumb/7/75/Wikipedia_mobile_app_logo.png/64px-Wikipedia_mobile_app_logo.png'
  // },
  // {
  //   name: 'Gitlab',
  //   url: '//gitlab.com',
  //   image: '//about.gitlab.com/images/press/press-kit-icon.svg'
  // },
  // {
  //   name: 'React',
  //   url: '//reactjs.org/',
  //   image: '//upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'
  // },
  // {
  //   name: 'Parcel',
  //   url: '//parceljs.org/',
  //   image: '//parceljs.org/avatar.733335a8.avif'
  // },
] as const;

export const APP_EXTEND_MGMT_WIDTH = 1900;
export const APP_EXTEND_MGMT_HEIGHT = 900;
export const APP_COLLAPSE_MGMT_WIDTH = 65;
export const APP_COLLAPSE_MGMT_HEIGHT = 60;

export const CLICKUP_INFO = {
  SPACE_ID: 26265831,
  CLICKUP_TOKEN: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjozMjE5MzA1NCwidmFsaWRhdGVkIjp0cnVlLCJ3c19rZXkiOjcyMDU5ODY2OTIsInNlc3Npb25fdG9rZW4iOnRydWUsImlhdCI6MTY5MDc3MzczNCwiZXhwIjoxNjkwOTQ2NTM0fQ.UTHt4CURDiUzm3xlE8-1HTqVnnvf7oMemn-zuknmi10`

}
export const REQ_HEADER = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'pk_32193054_YQNFO05VHHM9ABEJUTOE8YUPS7RII2JN'
  },
  headersBear: { 
    headers: {
      Authorization: `Bearer ${CLICKUP_INFO.CLICKUP_TOKEN}` 

    }
  }
}


export const WEB_INFO = {
  BLUEPRINT: {
    API: 'https://blueprint.cyberlogitec.com.vn/api',
    PROJECTS: {
      NEW_FWD: {
        ID: 'PJT20211119000000001',
        NAME: 'NEW FWD',
      }
    }
   
  },
  WORKING_API: "http://localhost:81/workingapi/api",
  TASK_MEMBER_API: "http://localhost:81/fapi/working",
  CLICKUP: {
    SPACE_ID: 26265831,
    
  }
}

export const COMMON_HEALTH = function() {
  return "WORKING_GOOD"
};

export const WORKDAY = function (start: any, end: any) {
  var first = start.clone().endOf("week"); // end of first week
  var last = end.clone().startOf("week"); // start of last week
  var days = (last.diff(first, "days") * 5) / 7; // this will always multiply of 7
  var wfirst = first.day() - start.day(); // check first week
  if (start.day() == 0) --wfirst; // -1 if start with sunday
  var wlast = end.day() - last.day(); // check last week
  if (end.day() == 6) --wlast; // -1 if end with saturday
  var holidays = 0;
  return wfirst + Math.floor(days) + wlast - holidays; // get the total
};   



export const SUM_EFF_KNT = function (arr) {
  let sum = 0;
  if(!arr || arr.length == 0) return 0;
  for(let i = 0; i < arr.length; i ++){
    sum += arr[i].efrtKnt;
  }
  return sum;
}

export const GET_LST_MONTH = function (rvStart, rvEnd) {
  if(rvStart && rvEnd) {
    let tmp = moment(rvStart);
    let arrRoSplit = [];
    let roSplit = { 
    };

    while(tmp < moment(rvEnd)) {
     
      // const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
      // const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD hh:mm');
      let startOfMonth = moment(tmp).startOf('month');
      let endOfMonth   = moment(tmp).endOf('month');
      roSplit = {
        key: startOfMonth.format("YYYYMMDD").toString(),
        fromDt: startOfMonth.format("YYYYMMDD").toString(),
        toDt: endOfMonth.format("YYYYMMDD").toString()
      };
      tmp = tmp.add(1, 'M');
      if(roSplit){
        arrRoSplit.push(roSplit);

      }
    }
    return arrRoSplit;
    
  }
  return [];
}
