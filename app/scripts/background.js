chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Turning ' + tab.url + ' yellow!');
  /* using this method turns the following scripts into "content scripts" */
  chrome.tabs.executeScript(null, {file: 'scripts/libraries/handlebars.min.js'});
  chrome.tabs.executeScript(null, {file: 'scripts/libraries/jquery-2.2.0.min.js'});
  chrome.tabs.executeScript(null, {file: 'scripts/inject.js'});
  chrome.tabs.insertCSS(null, {file: 'scripts/inject.css'});
  function getTabUrl() {
      console.log('Tab URL is: ' + tab.url);
  }

  getTabUrl();


});

/* this is like the controller */
