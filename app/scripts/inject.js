/*global $:false, ko:false */


(function() {
  'use strict';

  // Observables
  var fontList = ko.observableArray([
    {
      displayName: 'Select a font...',
      styleString: null
    },
    {
      displayName: 'Arial',
      styleString: 'Arial, Helvetica, sans-serif',
    },
    {
      displayName: 'Times New Roman',
      styleString: 'Times New Roman',
    },
    {
      displayName: 'Courier New',
      styleString: 'Courier',
    }
  ]);
  var selectedFont = ko.observable('medium');
  var sizeList = ko.observableArray([
    {
      displayName: 'Select a size...',
      styleString: null
    },
    {
      displayName: 'Tiny',
      styleString: 'x-small',
    },

    {
      displayName: 'Small',
      styleString: 'small',
    },
    {
      displayName: 'Medium',
      styleString: 'medium',
    },
    {
      displayName: 'Large',
      styleString: 'large',
    }
  ]);
  var selectedSize = ko.observable();

  var displayTemplate = function () {
    var templateUri = chrome.extension.getURL('views/template.html');
    return $.ajax({
      url: templateUri,
    })
    .done(function (data) {
      $('html').html(data);
    });
  };

  var getArticle = function() {
    var myApikey = '7fe8d00774cd51911b4cce37206c0832a42b3348';
    var currentUrl = window.location.href;
    var myApi = 'https://readability.com/api/content/v1/parser?url=' + currentUrl + '&token=' + myApikey;
    var article;

    $.ajax({
      type: 'Get',
      url: myApi,
      async: false,
      contentType: 'application/json',
      dataType: 'json',
      success: function (response) {
        if (response) {
          console.log('jsonp call successful: ' + response.url);
          article = response;
        } else {
          console.log('error');
        }
      } //end of success callback
    }); //end of ajax call
    return article;
  };

  var displayContent = (function() {
    var articleObj = getArticle();
    return {
      articleContent: articleObj.content,
      articleTitle: articleObj.title,
      articleAuthor: articleObj.author
    };
  })();

  var settingsBar = {


    slideUpDown: function() {
      console.log('slide up down');
      $('#longreader-option-window').slideToggle('slow');
    },
    slideUp: function() {
      $('#longreader-option-window').slideUp('slow');
    },
    reloadPage: function() {
      location.reload();
    },
    bgColorWidget: function(data, event) {
      console.log('bgColorWidget function click');
      var currentId = event.target.id;
      var jqCurrentId = '#' + currentId;
      $(jqCurrentId).colorPicker();
      $('body').on('click', function() {

        var color = $(jqCurrentId).css('background-color');
        $('body').css('background-color', color);
      });
    },

    fontColorWidget: function(data, event) {
      var currentId = event.target.id;
      var jqCurrentId = '#' + currentId;
      $(jqCurrentId).colorPicker();
      $('body').on('click', function() {
        var color = $(jqCurrentId).css('background-color');
        $('body').css('color', color);
      });
    }
  };
  var storage = {
    get: function() {
      chrome.storage.local.get('testMsg', function(result) {
        var testMsg;
        testMsg = result.testMsg;
        console.log(testMsg);
      });
    },
    apply: function() {

    },
    set: function() {
      chrome.storage.local.set({'testMsg': 'Testing... 123'});
    },
    clear: function() {
      chrome.storage.local.clear();
    },
    test: function() {
      storage.clear();
      storage.set();
      storage.get();
    }
  };

  var longreaderVm = {
    init:
    function() {
      return $.when(displayTemplate()).done(function() {
      });
    },

    sizeList: sizeList,
    selectedSize: selectedSize,
    fontList: fontList,
    selectedFont: selectedFont,
    cogIconUri: chrome.extension.getURL('images/cog.png'),
    backIconUri: chrome.extension.getURL('images/back-white.svg'),
    settingsBar: settingsBar,
    displayContent: displayContent
  };

  longreaderVm
  .init()
  .done(function () {
    console.log('init done');
    ko.applyBindings(longreaderVm);
    storage.test();
  });

})();
