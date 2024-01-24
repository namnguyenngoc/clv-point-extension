import React, { useState,CSSProperties,useEffect } from "react";
import axios from "axios";
import myData from '../data.json';
import moment from 'moment';
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ScaleLoader from "react-spinners/ScaleLoader";
import Chart from 'react-apexcharts';
import ReactJson from 'react-json-view'

import { COMMON_HEALTH, WORKDAY, SUM_EFF_KNT, GET_LST_MONTH, USER_IN_TEAM,FORMAT_NUMBER,
   APP_EXTEND_MGMT_HEIGHT, APP_COLLAPSE_MGMT_HEIGHT } from '../const';


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
 
  const [effortChartData, setEffortChartData] = useState([]);
  const [effortChartCategories, setEffortChartCategories] = useState([ ]);
  const [memberInfoJSON, setMemberInfoJSON] = useState({});
  let chartObject = {
    series: [{
      name: 'Blueprint',
      data: effortChartData
    }],
    options: {
      chart: {
        height: 500,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          columnWidth: '60%'
        }
      },
      colors: ['#00E396'],
      dataLabels: {
        enabled: true,
        formatter: function (value) {
          return FORMAT_NUMBER(value, 0);
        }
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ['Blueprint', 'Expected Target Level'],
        markers: {
          fillColors: ['#00E396', '#775DD0']
        }
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return FORMAT_NUMBER(value, 0);
          }
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value;
          }
        }
      }
    },
  };
  let chartOption = chartObject.options;
  let chartSerial = {
    name: 'Effort',
    data: effortChartData,
  };

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
    // await refeshChart(undefined);

    
  }
  const selectTaskByUser = async () => {
    if(!memberSelect){
      return;
    }
    setLoading(true);
    try {
      // setRangeMonthReview (strFrm._i, endFrm._i);
      if (startDate && endDate) {

        // const newList = await getDailyTasksByUser(memberSelect[0]);
        let sheetMember = localStorage.getItem('CLV_MEMBER_LIST');
        if (sheetMember) {
          const arrMember = JSON.parse(sheetMember);
          console.log("sheetMember", arrMember);
          // sheetMember = sheetMember.filter(
          //   mem => memberSelect.filter(memSel => memSel.userId == mem.userId).length > 0
          // );
          const lvlList = myData.levelList;

          if (memberSelect) {
            // let memberEffortItem = arrMember
            //   //Get task
            const effectDateFrom = moment(startDate);
            const effectDateTo = moment(endDate);
            const workday = WORKDAY(effectDateFrom, effectDateTo);
            const lvlList = myData.levelList;
            setWorkday(workday);

            const diffMonth =  moment(effectDateTo._i).diff(moment(effectDateFrom._i), 'months', true);
            setMonthDay(Math.round(diffMonth));

            console.log("selectTaskByUser", diffMonth);

            console.log("sheetMember-item", memberSelect);
            const TASK_USER = await getDailyTasksByUser(memberSelect, undefined).then(async (dailyTaskRes) => {
              //START
              console.log("getDailyTasksByUser-2", dailyTaskRes);
              if (dailyTaskRes) {
                let sum = SUM_EFF_KNT(dailyTaskRes.dailyRsrcLst);
                console.log("getDailyTasksByUser", sum);
                memberSelect.effortPoint = sum;
                memberSelect.effortPointAvg = sum / (monthDay == 0 ? 1 : monthDay);
                console.log("item.effortPointAvg", memberSelect.effortPointAvg);

                const lstUserInTeam: any = await USER_IN_TEAM(startDate, endDate, undefined);

                memberSelect.effortDetailByMonth = [...dailyTaskRes.effortSplit];
                memberSelect.timeWorked = 0;
                console.log("lvlList-2", lvlList);

                let pointStd = lvlList.filter(itm => itm.code.toUpperCase() == memberSelect.lvlCode.toUpperCase());
                if (pointStd && pointStd.length > 0) {
                  memberSelect.pointStd = pointStd[0];

                } else {
                  memberSelect.pointStd = {
                    "min": 0,
                    "max": 0,
                    "gap": 0,
                    "taskLevelMax": 0,
                    "agvDay": 0,
                    "agvMonth": 0
                  }
                }
                let itemTask = lstUserInTeam.filter(itm2 => itm2.usrId == memberSelect.userId);
                memberSelect.countTask = 0;
                if (itemTask && itemTask.length > 0) {
                  let _task = itemTask[0];
                  memberSelect.countTask = _task.pd_knt + _task.op_knt + _task.proc_knt;
                }
              
                console.log("Item User Full", memberSelect);

                await refeshChart(memberSelect);
                // }
                // return item;
                // })

                let newListSrt = await Promise.all(TASK_USER).then((response) => {
                  let newData = [...response];
                  // if(memSelect && memSelect.length > 0) {
                  //   newData = newData.filter(mem => mem.userId == memSelect.userId);
                  // }
                  console.log("newData", newData);
                  // setEffortList(newData);


                });
              }
              // //END
            });
          }
        }
        setLoading(false);


      }
    } catch (error) {
      setLoading(false);
    }
    
  }

  async function refeshChart (memItemFull) {
    console.log("memItemFull", memItemFull);
    // customLegendItems: ['Blueprint', 'Expected Target Level'],
    if(memItemFull){
      let newData = [];
      let newCategory = [];
      memItemFull.effortDetailByMonth.map((item) => {
        newCategory.push(item.key);

        let newItem = {
          // ...item,
          x: item.key,
          y: item.total,
          goals: [
            {
              name: 'Expected Target Level',
              value: parseInt(memItemFull.pointOnHour.effortPointByTargetLevel),
              strokeColor: '#775DD0',
              dataLabels: {
                enabled: true,
                formatter: function (value) {
                  return FORMAT_NUMBER(value, 0);
                }
              }
            }
          ]
        }
        newData.push(newItem);
      })
      try {
        let jsonStr = JSON.stringify(memItemFull);
        setMemberInfoJSON(JSON.parse(jsonStr));
      } catch (error) {
        
      }
      
      console.log("newData", newData  );
    
      setEffortChartData(newData);
      setEffortChartCategories(newCategory);
    }
   
  }

  async function getDailyTasksByUser(item:any, isSplitByMonth: any) {
    
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
  const memberOnChange = async (member) => {
    setMemberSelect(member);
    if(member){
      // effectDateFrom
      // : 
      // "March-2023"
      // effectDateTo
      // : 
      // "February-2024"
      const effectDateFrom = moment(member.effectDateFrom, 'MMMM-YYYY');
      const effectDateTo = moment(member.effectDateTo, 'MMMM-YYYY').endOf('month');

      console.log("Effort from", member.effectDateFrom) ;
      console.log("Effort from", member.effectDateTo);

      setStartDate(effectDateFrom._d);
      setEndDate(effectDateTo._d);

      const workday = WORKDAY(effectDateFrom, effectDateTo);
      // const lvlList = myData.levelList;
      setWorkday(workday);
  
      const diffMonth = effectDateTo.diff(effectDateFrom, 'months', true));
      setMonthDay(Math.round(diffMonth));

    }
  }
  const onChangeDate = async (date: any, type: any) => {
    if('START' == type) {
      setStartDate(date);

    } else {
      setEndDate(date)
      
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
            onChange={(mem) => {
              memberOnChange(mem);
            }
            } 
            options={lstMember}
            components={{
              Option: InputMemberOption
            }}
          />
        </div>
        <div>
          <DatePicker selected={startDate} onChange={(date) => onChangeDate(date, "START")} className="w-150"/>

        </div>
        <div>
          <DatePicker selected={endDate} onChange={(date) => onChangeDate(date, "END")} className="w-150"/>

        </div>
        <div>
          <div> { workday } days </div>
          <div>
            {FORMAT_NUMBER(monthDay,0)} months
          </div>
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
         EMPLOYEE ID | FULL NAME | REVEVIEW DATE: FROM - TO 
      </div>
      <div className="grid grid-flow-col gap-1 px-2">
        <div className="grid grid-flow-row gap-1 px-2">
          <div id="chart">
            <Chart options={chartObject.options} series={chartObject.series} type="bar" height={350} />
          </div>
          <div id="html-dist"></div>
        </div>
        <div className="grid grid-flow-row gap-1 px-2">
          <div id="json"
            style={{
              height: APP_EXTEND_MGMT_HEIGHT - 200,
              overflow: "auto"
            }}
            >
            <ReactJson
              src={memberInfoJSON}
              displayDataTypes = {false}
            />
          </div>
          
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