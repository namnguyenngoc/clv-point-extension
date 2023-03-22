import React, { useState } from "react";
import axios from "axios";
import myData from '../data.json';
import moment from 'moment';
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InputOption = ({
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
      <input type="checkbox" checked={isSelected} />
      {children}
    </components.Option>
  );
};

export default function TaskEffortByUser(props) {
  const url = 'https://blueprint.cyberlogitec.com.vn/api';
  const DT_FM = 'YYYYMMDD';
  const defaultMem = [];
  const allMember = [...myData.memList.map(
    function (item) {
      item.label =   item.userId, //`${item.fullName}-${item.pointOnHour.expect}(${item.currentLevel})`;
      item.value = item.userId
      return item;
    })
  ];

  const [memberSelect, setMemberSelect] = useState([]);
  const today = moment(new Date());
  console.log("today", today);
  const firstDayOfMonth = today.clone().startOf("month");
  // const newFirstDay = new Date(today.year(), today.month(), firstDayOfMonth);
  
  const [startDate, setStartDate] = useState(firstDayOfMonth._d);
  const [endDate, setEndDate] = useState(new Date());
  const [effortList, setEffortList] = useState([]);
  const [workday, setWorkday] = useState(0);
  const [monthDay, setMonthDay] = useState(0);

  async function getDailyTasksByUser(item:any) {
    let ro = {
      "usrId": item.userId,
      "fromDt": moment(startDate).format("YYYYMMDD"),
      "toDt": moment(endDate).format("YYYYMMDD")
    };
  
    // console.log("RO", ro);

    // console.log("reqee", req)
    const response = await axios.post(`${url}/uiPim026/getDailyTasksByUser`, ro)
      .then(async function (response) {
        return response.data;
    });

  
    // console.log("response", response);
    return new Promise((resolve, reject) => {
        resolve(response);
    });
  }
  const sumEfrtKnt = (arr) => {
    let sum = 0;
    for(let i = 0; i < arr.length; i ++){
      sum += arr[i].efrtKnt;
    }
    return sum;
  }

  const workday_count = (start, end) => {
    var first = start.clone().endOf("week"); // end of first week
    var last = end.clone().startOf("week"); // start of last week
    var days = (last.diff(first, "days") * 5) / 7; // this will always multiply of 7
    var wfirst = first.day() - start.day(); // check first week
    if (start.day() == 0) --wfirst; // -1 if start with sunday
    var wlast = end.day() - last.day(); // check last week
    if (end.day() == 6) --wlast; // -1 if end with saturday
    var holidays = count_holiday(start, end);
    return wfirst + Math.floor(days) + wlast - holidays; // get the total
  };   

  const count_holiday = (start, end) => {
    let count = 0;
    while (start <= end) {
      console.log("start", start.format(DT_FM));
      if(myData.workingDay.holidays.find(({ holidayDate }) => holidayDate == start.format(DT_FM))){
        count++;
      }
      start = start.add(1, "days");
     
    }
    return count;
  };

  const selectTaskByUser = async () => {
    const strFrm = moment(startDate);
    const endFrm = moment(endDate);
    const workday = workday_count(strFrm, endFrm);
    console.log("workday", workday);
    setWorkday(workday);

    const diffMonth = moment(endFrm._i).diff(moment(strFrm._i), 'months', true);
    setMonthDay(Math.round(diffMonth));

    if(startDate && endDate) {

      // const newList = await getDailyTasksByUser(memberSelect[0]);
      const newList = allMember.map(async function (item) {
        //Get task
      
        const res = await getDailyTasksByUser(item);
        if(res){

          item.effortPoint = sumEfrtKnt (res.dailyRsrcLst);
          item.timeWorked = 0;
        }
        return item;
      })
      const newListSrt = await Promise.all(newList);
      setEffortList(newListSrt);
    }
  }
  
  const onChangeDate = async (date: any, type: any) => {
    if('START' == type) {
      setStartDate(date);

    } else {
      setEndDate(date)
      
    }
   

    await selectTaskByUser();
  }
  const formatPrice = (value, tofix) => {
    if (!value) {
      return ''
    }
    const val = (value / 1).toFixed(tofix).replace(',', '.')
    if (!val) {
      return ''
    }

    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  };
  
  const onChangeMember = async (option: any) => {
    console.log("option", option);
    setMemberSelect(option);
    selectTaskByUser();

  }
 
  return (
    <div className="grid grid-flow-row gap-2">
      <div className="grid grid-flow-col gap-5 px-2">
        <div>
          <DatePicker selected={startDate} onChange={(date) => onChangeDate(date, "START")} />

        </div>
        <div>
          <DatePicker selected={endDate} onChange={(date) => onChangeDate(date, "END")} />

        </div>
        <div>
          <h5> { workday } days ({formatPrice(monthDay,0)} months)</h5>
        </div>
        <div>
          <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4" onClick={selectTaskByUser}>
            Search
          </button>
        </div>
        
      </div>
      {/* <div className="px-2">
        <Select
          defaultValue={defaultMem}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          onChange={(options) => {
            if (Array.isArray(options)) {
              onChangeMember(options);

            }
          }
          } 
          options={allMember}
          components={{
            Option: InputOption
          }}
        />
      </div> */}
      
      <div className="table-container-10">
        <table className="w-full border border-gray-500 custom-scroll">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 w-150">Name</th>
              <th className="px-4 py-2 text-center w-70">Level</th>
              <th className="px-4 py-2 w-70 text-right">P/H</th>
              <th className="px-4 py-2 w-100 text-right">Effort Point</th>
              <th className="px-4 py-2 text-right w-100">Standard</th>
              <th className="px-4 py-2 text-right w-100">Avg</th>
              <th className="px-4 py-2 text-right w-70">Gap</th>
            </tr>
          </thead>
          <tbody className="border-t">
            {effortList.map((item) => (
              <tr key={item.value} className={(item.pointOnHour.expect * workday * 8 ) > item.effortPoint  ? "border-t bg-misty" : "border-t"}>
                <td className="px-4 py-2 w-150">{item.fullName}</td>
                <td className="px-4 py-2 text-center w-70">{item.currentLevel}</td>
                <td className="px-4 py-2 w-70 text-right">{item.pointOnHour.expect}</td>
                <td className="px-4 py-2 text-right w-100">{formatPrice(item.effortPoint,0)}</td>
                <td className="px-4 py-2 text-right w-100">{formatPrice(item.pointOnHour.expect * workday * 8, 0)}</td>
                <td className="px-4 py-2 text-right w-100">{formatPrice(item.effortPoint / monthDay, 0)}</td>
                <td className="px-4 py-2 text-right w-70">{ formatPrice((item.effortPoint - item.pointOnHour.expect * workday * 8), 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}