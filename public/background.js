chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension Installed')
});
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    console.log("chrome", tabs[0].url);
});

if (!this.Chrome_getValue || (this.Chrome_getValue.toString && this.Chrome_getValue.toString().indexOf("not supported") > -1)) {
  this.Chrome_getValue = function (key, def) {
      var dfrd = $.Deferred();
      chrome.storage.local.get(key, function (result) {
          dfrd.resolve(result[key]);
      });
      return dfrd.promise();
  };
  this.Chrome_setValue = function (key, value) {
      var dfrd = $.Deferred();
      var obj = {};
      obj[key] = value;
      var listen = function(changes, namespace) {
          dfrd.resolve(changes[key]);
          chrome.storage.onChanged.removeListener(listen);//remove, to prevent accumulation of listeners
      }
      chrome.storage.onChanged.addListener(listen);
      chrome.storage.local.set(obj);
      return dfrd.promise()
  }
}
