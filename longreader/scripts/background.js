
chrome.browserAction.onClicked.addListener(function(tab) {
    /* using this method turns the following scripts into "content scripts" */
  chrome.tabs.executeScript(null, {file: 'scripts/libraries/knockout-3.4.0.js'});
  chrome.tabs.executeScript(null, {file: 'scripts/libraries/jquery-2.2.0.min.js'});
  chrome.tabs.executeScript(null, {file: 'scripts/inject.js'});
  chrome.tabs.insertCSS(null, {file: 'scripts/inject.css'});
  chrome.tabs.executeScript(null, {file: 'scripts/plugins/jqColorPicker.min.js'});
});
