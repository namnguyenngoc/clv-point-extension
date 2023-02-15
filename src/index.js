import axios from "axios";
const api = "http://anvatchibeo.ddns.net:3000";
const bluapi = "https://blueprint.cyberlogitec.com.vn/api";
const errors = document.querySelector(".errors");
const loading = document.querySelector(".loading");
const cases = document.querySelector(".cases");
const recovered = document.querySelector(".recovered");
const deaths = document.querySelector(".deaths");
const results = document.querySelector(".result-container");
const layout61 = document.querySelector('[view_id="$layout61"]');

const txtTotal = document.getElementById('txtTotal');
const txtTotalAdd = document.getElementById('txtTotalAdd');

results.style.display = "none";
loading.style.display = "none";
errors.textContent = "";
// grab the form
const form = document.querySelector(".form-data");
const formSelect = document.querySelector(".form-data-select");

const addPoint = document.querySelector(".add-point");

// grab the country name
const country = document.querySelector(".country-name");

// declare a method to search by country name
const searchForCountry = async countryName => {
  
  loading.style.display = "block";
  errors.textContent = "";
  try {
    // const response = await axios.get(`${api}`); //appsuckhoe/getChamSocList
    const response = await axios.get(`${api}/appsuckhoe/getChamSocList`); //appsuckhoe/getChamSocList
    console.log("response", response);
  } catch (error) {
    console.log("error", error);
    loading.style.display = "none";
    results.style.display = "none";
    errors.textContent = "We have no data for the country you have requested.";
  }
};

function addPointFun(obj) {
  console.log("addPoint", obj);
};

function splitArray (arr) {
  let arr1000 = [];
  let arr100 = [];
  let arr10 = [];
  let arr1 = [];
  for(let i = 0; i < arr.length; i ++){
    switch(true) {
      case (arr[i].utPnt >=1000):
        arr1000.push(arr[i]);
        break;
      case (arr[i].utPnt >= 100):
        arr100.push(arr[i]);
        break;
      case (arr[i].utPnt >= 10):
        arr10.push(arr[i]);
        break;
      default:
        arr1.push(arr[i]); 
        break
    }
  }

  const result = {
    arrFrom1000ToMax: arr1000,
    arrFrom100To999: arr100,
    arrFrom10To99: arr10,
    arrFrom1To10: arr1
  }
  return result;
}

//
function lstDataTotal (total, arrPoint){
  let arr = [];
  let flag = 0;
  for(let i = 0; i < arrPoint.length; i ++){
    if(flag + arrPoint[i].utPnt <= total) {
      arr.push(arrPoint[i]);
    }
  }
  return arr;
}

function splitNumberToNum (value, arryNum) {
  if(value <= 0) return [];
  
  let arrPoint = [];
  let range = 1;
  if(value >= 1000) {
    const lsPoint = lstDataTotal(value, arryNum.arrFrom1000ToMax);
    // console.log("arrPoint>1000", lsPoint);
    arrPoint = [...arrPoint, ...lsPoint];
    value = value / 1000;
    range = 1000;

  } else if(value >= 100) {
    //From 10->100
    const lsPoint = lstDataTotal(value, arryNum.arrFrom100To999);
    // console.log("arrPoint-1000", lsPoint);
    arrPoint = [...arrPoint, ...lsPoint];
    value = value / 100;
    range = 100;

  } else if(value >= 10) {
    const lsPoint = lstDataTotal(value, arryNum.arrFrom10To99);
    // console.log("arrPoint-100", lsPoint);
    arrPoint = [...arrPoint, ...lsPoint];
    value = value / 10;
    range = 10;
    //From 100->1000
  } else {
    //<1000
    const lsPoint = lstDataTotal(value, arryNum.arrFrom1To10);
    // console.log("arrPoint-1", lsPoint);
    arrPoint = [...arrPoint, ...lsPoint];
  }

  return {
    range: range,
    data: arrPoint,
  };
}

const searchJobDetailsList = async searchJobDetailsList => {
  document.getElementById('showData').innerHTML = "";
  try {
    // const response = await axios.get(`${api}`); //appsuckhoe/getChamSocList
    const response = await axios.post(`${bluapi}/searchJobDetailsList`, {
      "pjtId":"PJT20211119000000001",
      "isSearchDeleted":"N",
      "reqId":"PRQ20230103000000047"
    })
    .then(async function (response) {
      // console.log("searchJobDetailsList", response.data);
      let pointList = [];
      if(response.data){
        for(let i = 0; i < response.data.length; i ++){
          const reposonsePoint = await axios.post(`${bluapi}/searchJobDetailsListByParentJobId`, {
            "reqId":"PRQ20230103000000047"
            ,"prntJobId": response.data[i].jbId
          })

          let item = reposonsePoint.data.subJobDtlsLst; 
          for(let j = 0; j < item.length; j ++){
            let subItem = item[j];
            // Object.assign(subItem, item[j]); ;
            subItem.prntJobId = response.data[i].jbId;
            subItem.category = response.data[i].jbNm;
            pointList.push(subItem);
          }
        }
      }

      //Sort point
      const newPointSort = [...pointList.sort(compare)];
      
      const pointSplit = splitArray(newPointSort);
      let tmpTotal = 0;
      const total = txtTotal.value - 30;
      let deltaTotal = total;
      let pointSuggestList = [];
      let pointSuggest1 = null;
      do {
          pointSuggest1 = null;
          pointSuggest1 = splitNumberToNum(deltaTotal < 5 ? 5 : deltaTotal, pointSplit);
          let unitSize = deltaTotal < pointSuggest1.range ? deltaTotal : parseInt(deltaTotal / pointSuggest1.range);
          console.log("deltaTotal-pre", deltaTotal);
          deltaTotal = deltaTotal % pointSuggest1.range;
          console.log("deltaTotal-next", deltaTotal);
          console.log("deltaTotal", pointSuggest1.range);

          //if(unitSize < pointSuggest1.range && unitSize < 10);

          console.log("pointSuggest1", pointSuggest1);
          
          if(pointSuggest1 != undefined && pointSuggest1 != null && pointSuggest1.data != undefined && pointSuggest1.data.length > 0){
            let tmp = pointSuggest1.data[pointSuggest1.data.length - 1];
            console.log("tmp", tmp);
            
            if(tmp != undefined){
              console.log("unitSize", unitSize);
              // for(let i = 0; i < unitSize; i ++){
              //   tmpTotal += tmp.utPnt;
              //   // tmp.volPoint = unitSize;
              //   // pointSuggestList.push(tmp);
              //   if(tmpTotal >= total){
              //     break;
              //   }
              //   // console.log("pointSuggestList-tmp", pointSuggestList);
              // }
              tmpTotal += unitSize * tmp.utPnt;
              tmp.volPoint = unitSize;
              pointSuggestList.push(tmp);
              
            }
          }
          console.log("tmpTotal", tmpTotal);
          console.log("txtTotal.value", txtTotal.value);

      } while (tmpTotal < total && pointSuggest1 != undefined && pointSuggest1 != null && (pointSuggest1.data != undefined && pointSuggest1.data.length > 0));
      console.log("splitArray", pointSplit);
      console.log("pointSuggestList", pointSuggestList);
      
      let suggestList = [];

      //group data
      for(let i = 0; i < pointSuggestList.length; i ++){

      }
      suggestList = [...pointSuggestList];
   
      // let actualPointHTML = document.getElementById('actualPoint');
      txtTotalAdd.value = tmpTotal.toString();
      // actualPointHTML.innerHTML = 'Acual point: ' + actualPoint.toString();
      
      // Create table.
      const table = document.getElementById('tblShowData');
      // Create table header row using the extracted headers above.
      let tr = table.insertRow(-1);                   // table row.

      let colTemp = ["id", "category", "jbNm", "utPnt",  "volPoint", "add"];
      const divShowData = document.getElementById('showData');
      for (let i = 0; i < suggestList.length; i++) {

        tr = table.insertRow(-1);

        for (let j = 0; j < colTemp.length; j++) {
          let tabCell = tr.insertCell(-1);
          if(j == 0){
            tabCell.innerHTML = (i + 1).toString();
          } else if(j == colTemp.length-1) {
            // const btn = '<button class="btn btn-outline-secondary search-btn add-point">+</button>';
            // btn.onclick = function() { addPointFun }; 
            tabCell.innerHTML = `<input type="checkbox" name="POINT" value="${ suggestList[i]["jbId"] }">
                      <input type="hidden" id="${suggestList[i]["jbId"]}" value="${ suggestList[i]["utPnt"] }">
                      <input type="hidden" id="${suggestList[i]["jbId"]}_VOL" value="${ suggestList[i]["volPoint"] }">`;
          } else {
            tabCell.innerHTML = suggestList[i][colTemp[j]];

          }
        }
        divShowData.appendChild(tr);
      }

    })
    .catch(function (error) {
      console.log(error);
    });

   
  } catch (error) {
    console.log("error-searchJobDetailsList", error);
  }
};

function compare( a, b ) {
  if ( a.utPnt > b.utPnt ){
    return -1;
  }
  if ( a.utPnt < b.utPnt ){
    return 1;
  }
  return 0;
}


function compareDelta( a, b ) {
  if ( a.delta < b.delta ){
    return -1;
  }
  if ( a.delta > b.delta ){
    return 1;
  }
  return 0;
}


// declare a function to handle form submission
const handleSubmit = async e => {
    e.preventDefault();
    searchJobDetailsList();
    // searchJobDetailsListByParentJobId();
  
    // console.log(country.value);
    // document.body.insertAdjacentHTML('beforeend', "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      console.log(tabs[0].url);
  });
};

// const addPointClick = async (obj) => {
//   e.preventDefault();
//   console.log('obj', obj);
// };

form.addEventListener("submit", e => handleSubmit(e));

const handleAddPoint = async e => {
  e.preventDefault();
  console.log('handleAddPoint');
  var checkboxes = 
        document.getElementsByName('POINT');

    var result = "";
    let categoryList = [
      
    ]
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            // result += checkboxes[i].value + ",";
            const point = checkboxes[i].value;
            const hidden = document.getElementById(point);
            const hidden_vol = document.getElementById(`${point}_VOL`);

            const item = {
                "utPnt": parseInt(hidden.value),
                "jbId": point,
                "jbNm": "",
                "itmAmt": hidden_vol == undefined ? 1 : parseInt(hidden_vol.value),
                "$parent": 0
            }
            categoryList.push(item);
        }
    }
    
    // document.write("<p> You have selected : "
    //         + result + "</p>");

   
    // await chrome.tabs.query({currentWindow: true, active: true}, async function(tabs){
    //   const url = tabs[0].url.split("/");
    //   const reqId = url[url.length-1];
    //     console.log("reqId", reqId);
    //     const req = {
    //       "categoryList": categoryList,
    //       "totalPoint": 10,
    //       "reqId": reqId,
    //       "cmtCtnt": "<div class=\"system-comment\"> • Added Point: </div>   <div style=\"margin-left: 10px\"> <b>&nbsp;Business Logic:</b></div>  <div style=\"margin-left: 10px\"><i> &nbsp;&nbsp;Set order: </i>20 </div> <div class=\"system-comment\"> • Update Point: </div>  ",
    //       "pjtId": "PJT20211119000000001",
    //       "subPjtId": "PJT20211119000000001",
    //       "action": "REQ_WTC_EFRT"
    //   };
    //   console.log("reqee", req)
    //   const response = await axios.put(`${bluapi}/save-req-job-detail`, req).then(async function (response) {
    //     // console.log("searchJobDetailsList", response.data);
    //     let pointList = [];
    //     if("SAVE_SUCCEED" == response.saveFlg){
    //       alert("Đã add point thành công");
    //     }
    //   });
    // });
    


};

formSelect.addEventListener("submit", e => handleAddPoint(e));

// addPoint.addEventListener("onClick", e => addPointClick(e));




// // const addPoint = document.querySelector(".add-point");
// addPoint.addEventListener("click", handleAddPoint);  
