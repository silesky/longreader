var executeScript = function() {
  chrome.tabs.executeScript(null, {file: 'scripts/libraries/knockout-3.4.0.js'});
  chrome.tabs.executeScript(null, {file: 'scripts/libraries/jquery-2.2.0.min.js'});
  chrome.tabs.executeScript(null, {file: 'scripts/inject.js'});
  chrome.tabs.insertCSS(null, {file: 'scripts/inject.css'});
  chrome.tabs.executeScript(null, {file: 'scripts/plugins/jqColorPicker.min.js'});
};

var _createContextMenu = function() {
  chrome.contextMenus.create({title: 'Longreader', id: 'parent', onclick: executeScript() });
};

chrome.runtime.onInstalled.addListener(function() {
  _createContextMenu();
});

chrome.contextMenus.onClicked.addListener(function(tab) {
  executeScript(tab);
});

chrome.browserAction.onClicked.addListener(function(tab) {
  executeScript(tab);
});
