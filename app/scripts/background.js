
chrome.browserAction.onClicked.addListener(function(tab) {
    /* using this method turns the following scripts into "content scripts" */
  chrome.tabs.executeScript(null, {file: '/node_modules/knockout/build/output/knockout-latest.js'});
  chrome.tabs.executeScript(null, {file: 'scripts/libraries/jquery-2.2.0.min.js'});
  chrome.tabs.executeScript(null, {file: 'scripts/plugins/tinyColorPicker/jqColorPicker.min.js'});
  chrome.tabs.executeScript(null, {file: 'scripts/inject.js'});
  chrome.tabs.insertCSS(null, {file: 'scripts/inject.css'});
  });
});

/* this is like the controller */
