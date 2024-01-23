import React, { useState,CSSProperties,useEffect } from "react";
import axios from "axios";
import myData from '../data.json';
import moment from 'moment';
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import ACC_SHEET_API from '../credentials.json';
import DataTable, { createTheme } from 'react-data-table-component';
import ScaleLoader from "react-spinners/ScaleLoader";
import Chart from 'react-apexcharts';
import { COMMON_HEALTH, WORKDAY, SUM_EFF_KNT, GET_LST_MONTH } from '../const';


const InputMemberOption = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  // styles
  let bg = "transparent";
  if (isFocused) bg = "#eee";
  if (isActive) bg = "#B2D4FF";

  const style = {
    alignItems: "center",
    backgroundColor: bg,
    color: "inherit",
    display: "flex "
  };

  // prop assignment
  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
    >
      {children}
    </components.Option>
  );
};

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#36d7b7",
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  background: "rgb(255, 255, 255, 0.4)",
  textAlign: "center",
  paddingTop: "21%",
};

export default function PerformanceReview(props) {
  let chartObject = {
    series: [{
      name: 'Inflation',
      data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
    }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "%";
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        position: 'top',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + "%";
          }
        }
      
      },
      title: {
        text: 'Monthly Inflation in Argentina, 2002',
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
          color: '#444'
        }
      }
    },
  };
  let [chartOption, setChartOption] = useState(chartObject.options);
  let [chartSerial, setChartSerial] = useState(chartObject.series);
  const [memberSelect, setMemberSelect] = useState([]);
  let [lstMember, setLstMember] = useState([]);
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#0E71CC");
  const [workday, setWorkday] = useState(0);
  const [monthDay, setMonthDay] = useState(0);
  
  const today = moment(new Date());
  const firstDayOfMonth = today.clone().startOf("month");
  const [startDate, setStartDate] = useState(firstDayOfMonth._d);
  const [endDate, setEndDate] = useState(new Date());
  const url = 'https://blueprint.cyberlogitec.com.vn/api';
  const DT_FM = 'YYYYMMDD';
  const filterOnlySubmit = (onlySubmit) => {
    const isSubmit = !onlySubmit;
    // setShowAllCol(isSubmit);
    // localStorage.setItem('ONLY_SUBMIT',  isSubmit);
  }

  const calcEffort = async () => {
    console.log("calcEffort");
    console.log("common", COMMON_HEALTH());
    await selectTaskByUser();

    
  }
  const selectTaskByUser = async () => {
    setLoading(true);

    const strFrm = moment(startDate);
    const endFrm = moment(endDate);
    const workday = WORKDAY(strFrm, endFrm);
    const lvlList = myData.levelList;
    setWorkday(workday);

    const diffMonth = moment(endFrm._i).diff(moment(strFrm._i), 'months', true);
    setMonthDay(Math.round(diffMonth));

    console.log("selectTaskByUser", strFrm);
    // setRangeMonthReview (strFrm._i, endFrm._i);
    if(startDate && endDate) {

      // const newList = await getDailyTasksByUser(memberSelect[0]);
      let sheetMember =  localStorage.getItem('CLV_MEMBER_LIST');
      if(sheetMember) {
        const arrMember = JSON.parse(sheetMember);
        console.log("sheetMember", arrMember);
        // sheetMember = sheetMember.filter(
        //   mem => memberSelect.filter(memSel => memSel.userId == mem.userId).length > 0
        // );
      
        const newList = arrMember.map(async function (item) {
        //   //Get task
        console.log("sheetMember-item", item);
          const res = await getDailyTasksByUser(item).then((dailyTaskRes) => {
            //START
            console.log("getDailyTasksByUser-2", dailyTaskRes);
            if(dailyTaskRes) {
              let sum = SUM_EFF_KNT (dailyTaskRes.dailyRsrcLst);
              console.log("getDailyTasksByUser", sum);
              item.effortPoint = sum;
              item.effortPointAvg = sum / (monthDay == 0 ? 1: monthDay);
              console.log("item.effortPointAvg", item.effortPointAvg);
              item.effortDetailByMonth = [...dailyTaskRes.effortSplit];
              item.timeWorked = 0;
              let pointStd = lvlList.filter(itm => itm.code.toUpperCase() == item.lvlCode.toUpperCase());
              if(pointStd && pointStd.length > 0){
                item.pointStd = pointStd[0];

              } else {
                item.pointStd = {
                  "min": 0,
                  "max": 0,
                  "gap": 0,
                  "taskLevelMax": 0,
                  "agvDay": 0,
                  "agvMonth": 0
                }
              }
              // console.log("lstUserInTeam", lstUserInTeam);
              // let itemTask = await lstUserInTeam.filter(itm2 => itm2.usrId == item.userId);
              // item.countTask = 0;
              // if(itemTask && itemTask.length > 0){
              //   let _task = itemTask[0];
              //   item.countTask = _task.pd_knt +  _task.op_knt +  _task.proc_knt;
              // }

              // console.log("Item User Full", item);
              //   }
              //   return item;
              // })

              // let newListSrt = await Promise.all(newList).then((response) => {
              //   let newData = [...response];
              //   // if(memSelect && memSelect.length > 0) {
              //   //   newData = newData.filter(mem => mem.userId == memSelect.userId);
              //   // }
              //   console.log("newData", newData);
              //   // setEffortList(newData);
              

            }
            
            // //END
          });
        });
    }
    setLoading(false);
      
      

    }
  }

  async function getDailyTasksByUser(item:any, isSplitByMonth: any) {
    console.log("getDailyTasksByUser", item);
    let ro = {
      "usrId": item.userId,
      "fromDt": moment(startDate).format("YYYYMMDD"),
      "toDt": moment(endDate).format("YYYYMMDD")
    };
  
    const resEffortTotal = axios.post(`${url}/uiPim026/getDailyTasksByUser`, ro)
      .then(function (response) {
        console.log("resEffortTotal", response);
        return response.data;
    }).catch(function (error) {
      console.log("getDailyTasksByUser--eror", error);
    });
    isSplitByMonth = true;
    let arrEffSplit = [];
    console.log("isSplitByMonth", isSplitByMonth);
    if(isSplitByMonth) {
      

      const strFrm = moment(startDate);
      const endFrm = moment(endDate);
   
      let rvStart = strFrm._i;
      let rvEnd = endFrm._i;

      const test = GET_LST_MONTH(rvStart, rvEnd);
      console.log(`tmp test: ${test}`);
      if(rvStart && rvEnd) {
        let tmp = moment(rvStart);
        let arrRoSplit = [];
        let roSplit = { 
          "usrId": item.userId,
        };

        while(tmp < moment(rvEnd)) {
         
          // const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
          // const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD hh:mm');
          let startOfMonth = moment(tmp).startOf('month');
          let endOfMonth   = moment(tmp).endOf('month');
          roSplit = {
            ...roSplit,
            fromDt: startOfMonth.format("YYYYMMDD").toString(),
            toDt: endOfMonth.format("YYYYMMDD").toString()
          };
        
          tmp = tmp.add(1, 'M');
          arrRoSplit.push(roSplit);
          // console.log(`${item.fullName}: ${roSplit}`);
          

          const resEffortSplit = await axios.post(`${url}/uiPim026/getDailyTasksByUser`, roSplit)
            .then(async function (response) {
              let data = response.data;
              return {
                usrId: item.userId,
                key: startOfMonth.format("MMM YYYY").toString(),
                total: SUM_EFF_KNT (data.dailyRsrcLst),
                list: response.data,
              }
          });

          arrEffSplit.push(resEffortSplit);

        }
        
        return Promise.all([resEffortTotal, arrEffSplit])
        .then((response) => {
          console.log("here", response);
          return {
            dailyRsrcLst: [...response[0].dailyRsrcLst],
            effortTotal: response[1],
            effortSplit: arrEffSplit
          };
        });
     
      }
     
    }
  }
  useEffect(()=>{
    let CLV_MEMBER_LIST =  localStorage.getItem('CLV_MEMBER_LIST');
    if(CLV_MEMBER_LIST) {
      setLstMember(JSON.parse(CLV_MEMBER_LIST));
    }

  },[])

  return (
    <div className="grid grid-flow-row gap-2">
      <div className="grid grid-flow-col gap-1 px-2">
        <div className="w-full">
          <Select
            closeMenuOnSelect={true}
            hideSelectedOptions={false}
            isClearable={true}
            isMulti
            onChange={(mem) => {
              setMemberSelect(mem);
              // selectTaskByUser(mem);
            }
            } 
            options={lstMember}
            components={{
              Option: InputMemberOption
            }}
          />
        </div>
        {/* <div>
          <DatePicker selected={startDate} onChange={(date) => onChangeDate(date, "START")} className="w-150"/>

        </div>
        <div>
          <DatePicker selected={endDate} onChange={(date) => onChangeDate(date, "END")} className="w-150"/>

        </div> */}
        <div>
          <div> { 10 } days </div>
          {/* <div>
            {formatPrice(monthDay,0)} months
          </div> */}
        </div>
        <div>
          <label className="pt-3 text-right gap-1">
            {/* <input 
              type="checkbox"
              defaultChecked={inReview}
              onChange={() => 
                inReviewChange(!inReview)
              }
              disabled={ !(memberReviewThisMonth && memberReviewThisMonth.length > 0)}
            /> */}
             <label></label> In Review
          </label>
        </div>
        <div>
          {/* <label className="pt-3 text-right gap-1">
            <input 
              type="checkbox"
              defaultChecked={!isShowAllCol}
              onChange={() => filterOnlySubmit(isShowAllCol) }
            />
             <label></label> All Columns
          </label> */}
        </div>
        <div className="w-70">
          <button 
            type="button" 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4" 
            onClick={event => calcEffort()}>
            Search
          </button>
        </div>
        
      </div>
      <div className="grid grid-flow-col gap-1 px-2">
        PERFORMANCE REVIEW
      </div>
      <div className="grid grid-flow-row gap-1 px-2">
        <div>
          <div id="chart">
            <Chart options={chartOption} series={chartSerial} type="bar" height={350} />
          </div>
          <div id="html-dist"></div>
        </div>
      </div>
      <ScaleLoader
          color={color}
          loading={loading}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
      />
    </div>
  );
}