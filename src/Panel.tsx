import React, { ReactElement, useEffect, useState, CSSProperties } from 'react';
import { APP_COLLAPSE_MGMT_WIDTH, APP_EXTEND_MGMT_WIDTH, APP_EXTEND_MGMT_HEIGHT, APP_COLLAPSE_MGMT_HEIGHT} from './const';
import Button from './components/Button';
import SearchTaskBluePrint from './components/SearchTask';
import ClickupMgmt from './components/ClickupMgmt';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import ACC_SHEET_API from './credentials.json';
import ScaleLoader from "react-spinners/ScaleLoader";
import Select, { components } from "react-select";



export default function Panel({ onWidthChange, initialEnabled }: { onWidthChange: (value: number) => void, initialEnabled: boolean }): ReactElement {
  const [enabledMgmt, setEnabledMgmt] = useState(initialEnabled);
  const [enabledClickup, setEnabledClickup] = useState(false);
  const [classPnl, setClassPnl] = useState("absolute bottom-2 z-max bg-[#F5F8FA] ease-in-out duration-300 overflow-hidden grid grid-flow-row gap-1 main-body-mgmt");

  
  const [sidePanelWidthMgmt, setSidePanelWidthMgmt] = useState(enabledMgmt ? APP_EXTEND_MGMT_WIDTH: APP_COLLAPSE_MGMT_WIDTH);
  const [sidePanelHeightMgmt, setSidePanelHeightMgmt] = useState(enabledMgmt ? APP_EXTEND_MGMT_HEIGHT: APP_COLLAPSE_MGMT_HEIGHT);
  let [color, setColor] = useState("#0E71CC");
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
        <input type="checkbox" checked={isSelected} />
          <label> </label> {children}
      </components.Option>
    );
  };

  //Google sheet
  const SHEET_ID = "Member_List";
  const RANGE_MEMBER_SHEET = 'A1:AW';
  const SPREADSHEET_ID = "10WPahmoB6Im1PyCdUZ_uda3fYijC8jKtHnRBasnTK3Y";
  let [loading, setLoading] = useState(false);
  
  function handleOnToggle(enabledMgmt: boolean) {
    const value = enabledMgmt ? APP_EXTEND_MGMT_WIDTH : APP_COLLAPSE_MGMT_WIDTH;
    const valueH = enabledMgmt ? APP_EXTEND_MGMT_HEIGHT : APP_COLLAPSE_MGMT_HEIGHT;
    setSidePanelWidthMgmt(value);
    setSidePanelHeightMgmt(valueH);
    onWidthChange(value);

    window['chrome'].storage?.local.set({enabledMgmt});
  }

  function openPanel(force?: boolean) {
    const domain = window.location.hostname;
    if(domain) {
      if ("BLUEPRINT.CYBERLOGITEC.COM.VN" == domain.toUpperCase()) {
        const newValue = force || !enabledMgmt;
        setEnabledMgmt(newValue);
        handleOnToggle(newValue);
        
      } else if ("APP.CLICKUP.COM" == domain.toUpperCase()) {
        setEnabledMgmt(false);
   
        const newValue = force || !enabledClickup;
        console.log("openClickUp");
        handleOnToggle(newValue);
        setEnabledClickup(newValue); 
      }
    }

    if(!enabledMgmt || !enabledClickup) {
      setClassPnl("absolute bottom-2 z-max bg-[#F5F8FA] ease-in-out duration-300 overflow-hidden grid grid-flow-row gap-1 main-body-mgmt");
    } else {
      setClassPnl("absolute bottom-2 z-max bg-transparent ease-in-out duration-300 overflow-hidden grid grid-flow-row gap-1 main-body-mgmt");
      
    }

  }
  
  function openClickUp(force?: boolean) {
    setEnabledMgmt(false);
   
    const newValue = force || !enabledClickup;
    console.log("openClickUp");
    handleOnToggle(newValue);
    setEnabledClickup(newValue); 
  }

  
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (condition) => {
    // Perform search logic here based on the given condition
    // and update the searchResults state with the result
    
  };
  const openLogWork = (force?: boolean) => {
    setSidePanelWidthMgmt(1000); 
    const newValue = force || !enabledMgmt;
  }

  const selectMemberList = async () => {
    let arrMember = [];
    //Sheet Start
    // Initialize the sheet - doc ID is the long id in the sheets URL
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID); //script data
    // const doc = new GoogleSpreadsheet('16S2LDwOP3xkkGqXLBb30Pcvvnfui-IPJTXeTOMGCOjk');
  
    
    
    // Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    await doc.useServiceAccountAuth({
      // env var values are copied from service account credentials generated by google
      // see "Authentication" section in docs for more info
      client_email:  ACC_SHEET_API.client_id,
      private_key: ACC_SHEET_API.private_key,
    });
    await doc.loadInfo(); // loads document properties and worksheets
    console.log("LOAD", doc.title);
    const sheet = doc.sheetsByTitle[SHEET_ID]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    
    const range = RANGE_MEMBER_SHEET; //'A1:AB50'
    await sheet.loadCells(range); // loads range of cells into local cache - DOES NOT RETURN THE CELLS
    
    for(let i = 0; i < 23; i ++) {
      const empCode = sheet.getCell(i, 0); // access cells using a zero-based index
      const userId = sheet.getCell(i, 1); // access cells using a zero-based index
      const fullName = sheet.getCell(i, 2); // access cells using a zero-based index
      const leaveTeam = sheet.getCell(i, 26); // access cells using a zero-based index = sheet.getCell(i, 2); // access cells using a zero-based index
      // console.log("leaveTeam.formattedValue", leaveTeam.formattedValue);
      if(empCode.formattedValue != "" 
        && userId.formattedValue != "" 
        && fullName.formattedValue != ""
        && leaveTeam.formattedValue == "N") {
            let mem = {
                "empCode":        sheet.getCell(i, 0).formattedValue,
                "userId":         sheet.getCell(i, 1).formattedValue,
                "fullName":       sheet.getCell(i, 2).formattedValue,
                "currentLevel":   sheet.getCell(i, 3).formattedValue,
                "lvlCode":        sheet.getCell(i, 4).formattedValue,
                "levelRating":    sheet.getCell(i, 5).formattedValue,
                "targetLevel":    sheet.getCell(i, 6).formattedValue,
                "tagartRating":   sheet.getCell(i, 7).formattedValue,
                "pointOnHour": {
                  "standard":   sheet.getCell(i, 38).formattedValue,
                  "timeStandard":   sheet.getCell(i, 39).formattedValue,
                  "expect":     sheet.getCell(i, 9).formattedValue,
                  "description": sheet.getCell(i, 10).formattedValue,
                  "averageEffortPoint":sheet.getCell(i, 39).formattedValue,
                  "minEffortPoint":sheet.getCell(i, 40).formattedValue,
                  "maxEffortPoint":sheet.getCell(i, 41).formattedValue,
                  "effortPointByCurrentLevel":sheet.getCell(i, 42).formattedValue,
                  "effortPointByTargetLevel":sheet.getCell(i, 43).formattedValue,

                },
                "role":           sheet.getCell(i, 11).formattedValue.split(","),
                "workload":       sheet.getCell(i, 12).formattedValue,
                "pointStandard":  sheet.getCell(i, 13).formattedValue, //FINISHE / RECEIVED
                "teamLocal":      sheet.getCell(i, 14).formattedValue.split(","),
                "dedicated":      sheet.getCell(i, 15).formattedValue,
                "blueprint_id":   sheet.getCell(i, 16).formattedValue,
                "blueprint_nm":   sheet.getCell(i, 17).formattedValue,
                "clickup_id":     sheet.getCell(i, 18).formattedValue,
                "clickup_nm":     sheet.getCell(i, 19).formattedValue,
                "effectDateFrom": sheet.getCell(i, 20).formattedValue,
                "effectDateTo":   sheet.getCell(i, 21).formattedValue,
                "preReviewDate":  sheet.getCell(i, 22).formattedValue,
                "nextReviewDate": sheet.getCell(i, 23).formattedValue,
                "phone":          sheet.getCell(i, 24).formattedValue,
                "clvEmail":       sheet.getCell(i, 25).formattedValue,
                "leaveTeam":      sheet.getCell(i, 26).formattedValue,
                "leaveCompany":   sheet.getCell(i, 27).formattedValue,
                "maxLevelTaskGap":sheet.getCell(i, 32).formattedValue,
                "minPoint"        :sheet.getCell(i, 33).formattedValue,
                "maxPoint"        :sheet.getCell(i, 34).formattedValue,
                "target"        :sheet.getCell(i, 36).formattedValue,
                "currentLvl"        : sheet.getCell(i, 4).formattedValue.concat(" (").concat(sheet.getCell(i, 45).formattedValue).concat(")"),
                "monthReview" :sheet.getCell(i, 47).formattedValue,
                "defaultList":sheet.getCell(i, 48).formattedValue.split(","),
                "levelRatingType":sheet.getCell(i, 45).formattedValue,
                "targetLevelType":sheet.getCell(i, 46).formattedValue,
            }
            arrMember.push(mem);
      }
      
    }
    // console.log("arrMember", arrMember);
    return new Promise((resolve, reject) => {
      resolve(arrMember);
    });
      
      
    //Sheet End
   
  }

  useEffect(()=>{
    //Start
    let isLoadMemberList = localStorage.getItem('CLV_MEMBER_LIST');
    if(!isLoadMemberList) {
      setLoading(false);
      selectMemberList().then(async (data) => {
          let lstInReview = [];
          let defaultMem = [];
          let lst = await data.map(
            function (item) {
              // console.log("item", item);
              if(item.teamLocal.includes("NEWFWD")) {
                if(item.defaultList.includes("Y")) {
                  let defaultItem = {
                    ...item,
                    label: item.userId,
                    value: item.userId
                  };

                  defaultMem.push(defaultItem);
                }

                if(item.defaultList.includes("IN_REVIEW")) {
                  let defaultItem = {
                    ...item,
                    label: item.userId,
                    value: item.userId
                  };

                  lstInReview.push(defaultItem);
                
                } else {

                }


                return {
                  ...item,
                  label: item.userId,
                  value: item.userId
                }

              }
          })
        
          // setMemberSelect(defaultMem);
          // setLstDefault(defaultMem);
          // setMemberReviewThisMonth(lstInReview);
          // setLstMember(lst);
          console.log("lst", lst);
          localStorage.setItem('CLV_MEMBER_LIST', JSON.stringify(defaultMem));


          setLoading(false);
        }).catch((err) => {
          console.log("useEffect", err);
          setLoading(false);
        });
    }
  },[])
  // End
  return (
    <div
      style={{
        width: sidePanelWidthMgmt - 5,
        height: sidePanelHeightMgmt,
      }}
      className={classPnl}
    >
      <div className='main-layout-mgmt'>
       
        <div className={!enabledMgmt ? 'hidden' : 'pt-4'}>
          <SearchTaskBluePrint onSearch={handleSearch} >
            {/* <TaskDetaillAddPoint text="Hello1333"/> */}
          </SearchTaskBluePrint>
          
        </div>
        <div className={!enabledClickup ? 'hidden' : 'pt-4'}>
          <ClickupMgmt>
            {/* <TaskDetaillAddPoint text="Hello1333"/> */}
          </ClickupMgmt>
          
        </div>
        {/* <div className={!enabledMgmt ? 'hidden' : 'pt-4'}>
          <TaskDetaillAddPoint />
          
        </div> */}
      </div>
      
      <div className="absolute bottom-2 left-0 w-[50px] z-10 flex justify-center items-center custom-button-expand grid grid-flow-row gap-3">
        <Button active={enabledMgmt} onClick={() => openPanel()}>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  enabledMgmt
                    ? 'M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25'
                    : 'M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15'
                }
              />
            </svg>
          </span>
         
        </Button>
       
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
