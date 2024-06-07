export const URLS = [
  {
    name: 'Vince Amaziong',
    url: '/index.html',
    image: 'https://blueprint.cyberlogitec.com.vn/style/images/default/logo-menu-3.png'
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

export const APP_EXTEND_WIDTH = 1250;
export const APP_EXTEND_HEIGHT = 750;
export const APP_COLLAPSE_WIDTH = 55;
export const APP_COLLAPSE_HEIGHT = 55;
export const APP_EXTEND_MGMT_WIDTH = 1900;
export const APP_EXTEND_MGMT_HEIGHT = 900;
export const APP_COLLAPSE_MGMT_WIDTH = 65;
export const APP_COLLAPSE_MGMT_HEIGHT = 60;

export const WEB_INFO = {
  BLUEPRINT: {
    API: 'https://blueprint.cyberlogitec.com.vn/api',
    PROJECTS: {
      NEW_FWD: {
        ID: 'PJT20211119000000001',
        Name: 'CARIS_Enhance_PRD [Internal]',
        Category: "Logistics (CARIS)",
      }
    }
    
   
  },
  PIM: {
    CARIS: {
      API: 'https://pim.cyberlogitec.com',
      INFO: {
        ID: 'CARISDO',
        NAME: 'NEW FWD',
      },
      PER_ACCESS_KEY: {
        NAME: 'CARIS',
        DATE: 'Mar 25, 2024, 11:42:34 AM GMT+7',
        KEY: 'MTIyNDMxMTAyNjI3OohOmIh7OgKKkQiZ05XNXU/7iHvy',
      },
      headers: {
        Authorization: 'Bearer MTIyNDMxMTAyNjI3OohOmIh7OgKKkQiZ05XNXU/7iHvy',
        // 'Authorization': 'Basic bmFtLm5ndXllbm5nb2M6cXdlckAxMjM=',
      }
      
    }
   
  },
  WORKING_API: "http://localhost:81/workingapi/api",
  TASK_MEMBER_API: "http://localhost:81/fapi/working",
  TASK_MEMBER_API_BIZ: "http://anvatchibeo.ddns.net:81/workingapi",

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


export const USER_IN_TEAM = async function (startDate, endDate, lstTeamId) {
  if(startDate && endDate) {
    if(!lstTeamId) {
      lstTeamId = "ATM201705250009,ATM201705150001,ATM202309170005";
    }
    let ro = {
      "stDt": moment(startDate).format("YYYYMMDD"),
      "endDt": moment(endDate).format("YYYYMMDD"),
      "procFlg": "DF",
      "beginIdx": 0,
      "endIdx": 25,
      "pageChanged": false,
      "coCd": "DOU",
      "lstTeamId": lstTeamId,
      "stsChanged": "N",
      "tskSts": "PR",
      "rsName": ""
    };



    // console.log("RO", ro);

    // console.log("reqee", req)
    const response = await axios.post(`${WEB_INFO.BLUEPRINT.API}/uiPim026/searchUserInTeam`, ro)
      .then(async function (response) {
        return response.data.lstUserInTeam ;
    });


    // console.log("response", response);
    return new Promise((resolve, reject) => {
        resolve(response);
    });
  }

}

export const FORMAT_NUMBER = function (value, tofix) {
  if (!value) {
    return ''
  }
  const val = (value / 1).toFixed(tofix).replace(',', '.')
  if (!val) {
    return ''
  }

  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
};

export const GET_START_END_PREVIEW = function (MEMBER_LIST: any, _START, _END) {
  console.log("MEMBER_LIST", MEMBER_LIST);
  console.log("_START", _START);
  console.log("_END", _END);

  let result = {
    startDate: _START, 
    endDate: _END
  }

  if(!MEMBER_LIST) {
    return result;
  } else {
    result.startDate = moment(MEMBER_LIST[0].effectDateFrom)._d;

    result.endDate = moment(MEMBER_LIST[0].effectDateFrom)._d;

  }

  MEMBER_LIST.map(function(item) {
    if(moment(item.effectDateFrom, 'MMMM-YYYY') < moment(result.startDate)) {
      result.startDate = moment(item.effectDateFrom)._d;

    }

    if(moment(item.effectDateTo, 'MMMM-YYYY') > moment(result.endDate)) {
      result.endDate = moment(item.effectDateTo)._d;

    }
  });

  return result;
};