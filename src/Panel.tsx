import React, { ReactElement, useEffect, useState } from 'react';
import { APP_COLLAPSE_MGMT_WIDTH, APP_EXTEND_MGMT_WIDTH, APP_EXTEND_MGMT_HEIGHT, APP_COLLAPSE_MGMT_HEIGHT} from './const';
import Button from './components/Button';
import TaskListAddPoint from './components/TaskListAddPoint';
import ClickupMgmt from './components/ClickupMgmt';


export default function Panel({ onWidthChange, initialEnabled }: { onWidthChange: (value: number) => void, initialEnabled: boolean }): ReactElement {
  const [enabledMgmt, setEnabledMgmt] = useState(initialEnabled);
  const [enabledClickup, setEnabledClickup] = useState(false);

  
  const [sidePanelWidthMgmt, setSidePanelWidthMgmt] = useState(enabledMgmt ? APP_EXTEND_MGMT_WIDTH: APP_COLLAPSE_MGMT_WIDTH);
  const [sidePanelHeightMgmt, setSidePanelHeightMgmt] = useState(enabledMgmt ? APP_EXTEND_MGMT_HEIGHT: APP_COLLAPSE_MGMT_HEIGHT);
 
  function handleOnToggle(enabledMgmt: boolean) {
    const value = enabledMgmt ? APP_EXTEND_MGMT_WIDTH : APP_COLLAPSE_MGMT_WIDTH;
    const valueH = enabledMgmt ? APP_EXTEND_MGMT_HEIGHT : APP_COLLAPSE_MGMT_HEIGHT;
    setSidePanelWidthMgmt(value);
    setSidePanelHeightMgmt(valueH);
    onWidthChange(value);

    window['chrome'].storage?.local.set({enabledMgmt});
  }

  function openPanel(force?: boolean) {
    const newValue = force || !enabledMgmt;
    setEnabledMgmt(newValue);
    handleOnToggle(newValue);
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
  return (
    <div
      style={{
        width: sidePanelWidthMgmt - 5,
        height: sidePanelHeightMgmt,
      }}
      className={(!enabledMgmt || !enabledClickup) ? "absolute bottom-0 z-max bg-[#F5F8FA] ease-in-out duration-300 overflow-hidden grid grid-flow-row gap-1 main-body-mgmt border-hidden" 
        : "absolute bottom-0 z-max bg-[#F5F8FA] ease-in-out duration-300 overflow-hidden grid grid-flow-row gap-1 main-body-mgmt"}
    >
      <div className='main-layout-mgmt'>
       
        <div className={!enabledMgmt ? 'hidden' : 'pt-4'}>
          <TaskListAddPoint onSearch={handleSearch} >
            {/* <TaskDetaillAddPoint text="Hello1333"/> */}
          </TaskListAddPoint>
          
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
      
      <div className="absolute bottom-0 left-0 w-[50px] z-10 flex justify-center items-center custom-button-expand grid grid-flow-row gap-3">
        <Button active={enabledClickup} onClick={() => openClickUp()}>
          ClickUp
        </Button>

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
    </div>
  );
}
