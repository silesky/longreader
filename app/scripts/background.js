'use strict';

chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Turning ' + tab.url + ' yellow!');

  chrome.tabs.executeScript(null, {file: 'scripts/inject.js'});

  function getTabUrl() {
    console.log('Tab URL is: ' + tab.url);
  }

  getTabUrl();
  var key = '7fe8d00774cd51911b4cce37206c0832a42b3348';

  var testUrl = 'https://en.wikipedia.org/wiki/Igneous_rock';

  var myApi = 'https://readability.com/api/content/v1/parser?url=' + testUrl + '&token=' + key;
  $('document').ready(function(){
    $.ajax({
      type: 'Get',
      url: myApi,
      async: false,
      contentType: 'application/json',
      dataType: 'jsonp',
      success: function(e) {
        if (e) {
          console.log('jsonp call successful: ' + e.url);
          // console.log(e.content);
        } else {
          console.log('error');
        }
      }
    });
  });
});

/* this is like the controller */
