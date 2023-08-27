import React, { ReactElement, useEffect, useState } from 'react';
import { APP_COLLAPSE_WIDTH, APP_EXTEND_WIDTH, APP_EXTEND_HEIGHT, APP_COLLAPSE_HEIGHT} from './const';
import Button from './components/Button';
import TaskSearchForm from './components/TaskSearchForm';
import TaskEffortByUser from './components/TaskEffortByUser';
import SearchTask from './components/SearchTask';


export default function Panel({ onWidthChange, initialEnabled }: { onWidthChange: (value: number) => void, initialEnabled: boolean }): ReactElement {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [sidePanelWidth, setSidePanelWidth] = useState(enabled ? APP_EXTEND_WIDTH: APP_COLLAPSE_WIDTH);
  const [sidePanelHeight, setSidePanelHeight] = useState(enabled ? APP_EXTEND_HEIGHT: APP_COLLAPSE_HEIGHT);
  const [tabIndex, setTabIndex] = useState(0);
  const [showWorkList, setShowWorkList] = useState(false);

  function handleOnToggle(enabled: boolean) {
    const value = enabled ? APP_EXTEND_WIDTH : APP_COLLAPSE_WIDTH;
    const valueH = enabled ? APP_EXTEND_HEIGHT : APP_COLLAPSE_HEIGHT;
    setSidePanelWidth(value);
    setSidePanelHeight(valueH);
    onWidthChange(value);

    window['chrome'].storage?.local.set({enabled});
  }

  function openPanel(force?: boolean) {
    const newValue = force || !enabled;
    setEnabled(newValue);
    handleOnToggle(newValue);
    setShowWorkList(!newValue);
  }
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (condition) => {
    // Perform search logic here based on the given condition
    // and update the searchResults state with the result
    setSearchResults([
      { id: 1, title: "Task 1", result: "Result 1" },
      { id: 2, title: "Task 2", result: "Result 2" },
      { id: 3, title: "Task 3", result: "Result 3" },
    ]);
  };
  const openLogWork = (force?: boolean) => {
    setSidePanelWidth(1000); 
    const newValue = force || !enabled;
    setShowWorkList(newValue);
  }
  return (
    <div
      style={{
        width: sidePanelWidth - 5,
        height: sidePanelHeight,
      }}
      className={!enabled ? "absolute bottom-0 z-max bg-[#F5F8FA] ease-in-out duration-300 overflow-hidden grid grid-flow-row gap-1 main-body border-hidden" 
        : "absolute bottom-0 z-max bg-[#F5F8FA] ease-in-out duration-300 overflow-hidden gap-1 main-body"}
    >
      
      <div className='main-layout grid grid-flow-row gap-1'>
        
        <div className={!enabled ? 'hidden' : 'pt-4'}>
          <TaskSearchForm onSearch={handleSearch} />
          
        </div>
      </div>
      <div className={!enabled ? 'hidden' : 'pt-4 ml-4 pb-4 h-250 mr-4'}>
        <SearchTask />
      </div>
      {/* <div className={!enabled ? 'hidden' : 'pt-4'}>
          <TaskEffortByUser />
          
        </div> */}
      <div className="absolute bottom-0 left-0 w-[50px] z-10 flex justify-center items-center p-1 custom-button-expand">
        <Button active={enabled} onClick={() => openPanel()}>
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
                  enabled
                    ? 'M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25'
                    : 'M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15'
                }
              />
            </svg>
          </span>
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <path fill="#57bb6e" d="M39.65 38.35a7.65 7.65 0 1 1-15.3 0 7.65 7.65 0 0 1 15.3 0zm8.07 23.39H16.28C16.28 53.05 23.31 46 32 46c8.69.01 15.72 7.05 15.72 15.74z"/>
            <path fill="#ffd926" d="M35.39 5.65c0 1.87-1.52 3.39-3.39 3.39s-3.39-1.52-3.39-3.39S30.13 2.26 32 2.26s3.39 1.51 3.39 3.39z"/>
            <path fill="#e82327" d="M17.32 9.21c1.07 1.53.7 3.65-.83 4.72-1.53 1.07-3.65.7-4.72-.83-1.07-1.53-.7-3.65.83-4.72a3.378 3.378 0 0 1 4.72.83z"/>
            <path fill="#87d4f2" d="M4.55 22.49c1.76.64 2.67 2.59 2.03 4.35-.64 1.76-2.59 2.67-4.35 2.03S-.44 26.28.2 24.52a3.4 3.4 0 0 1 4.35-2.03z"/>
            <path fill="#e82327" d="M52.24 13.1a3.386 3.386 0 0 1-4.72.83 3.386 3.386 0 0 1-.83-4.72c1.07-1.53 3.19-1.91 4.72-.83s1.9 3.18.83 4.72z"/>
            <path fill="#efefef" d="M32 12.65c-.55 0-1 .45-1 1v9.98c0 .55.45 1 1 1s1-.45 1-1v-9.98c0-.55-.45-1-1-1zm-12.05 4.49c-.32-.45-.94-.56-1.39-.25-.45.32-.56.94-.25 1.39l5.72 8.18a.998.998 0 0 0 1.39.25c.45-.32.56-.94.25-1.39l-5.72-8.18zm.68 13.75-9.38-3.41a.998.998 0 0 0-1.28.6c-.19.52.08 1.09.6 1.28l9.38 3.41a.998.998 0 0 0 1.28-.6.998.998 0 0 0-.6-1.28zm24.82-14a.988.988 0 0 0-1.39.25l-5.73 8.18a.988.988 0 0 0 .25 1.39c.17.12.37.18.57.18.32 0 .63-.15.82-.43l5.73-8.18c.31-.45.2-1.07-.25-1.39zm8.58 11.18a.998.998 0 0 0-1.28-.6l-9.38 3.41c-.52.19-.79.76-.6 1.28a.998.998 0 0 0 1.28.6l9.38-3.41c.52-.18.79-.76.6-1.28z"/>
            <path fill="#87d4f2" d="M61.77 28.87c-1.76.64-3.71-.27-4.35-2.03-.64-1.76.27-3.71 2.03-4.35 1.76-.64 3.71.27 4.35 2.03.64 1.76-.27 3.71-2.03 4.35z"/>
          </svg> */}
        </Button>
       
      </div>
    </div>
  );
}
