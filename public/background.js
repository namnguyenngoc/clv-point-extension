chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension Installed')
});
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    console.log("chrome", tabs[0].url);
});

const key = 'myKey';
const value = { name: 'my value' };
chrome.storage.local.set({key: value}, () => {
  console.log('Stored name: ' + value.name);
});

const key2 = 'myKey';
chrome.storage.local.get([key2], (result) => {
  console.log('Retrieved name: ' + result.myKey.name);
});