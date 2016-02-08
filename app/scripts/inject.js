/*global $:false, ko:false */


(function() {



  'use strict';

  var progressBar = function() {
    console.log("progress bar!");
    $('article').on("scroll", function (e) {
        var horizontal = e.currentTarget.scrollLeft;
        console.log(horizontal);
        var vertical = e.currentTarget.scrollTop;
    });
  };

  var settingsObj = {
    // bgColor: '',
    // fontColor: '',
    // fontFamily: '',
    // fontSize: ''
  };
  var storage = {
    //helpers
      applySettings: function() {
          chrome.storage.local.get(function(result) {
            if (result) {
              settingsObj = result;
              console.log('storage.applySettings(): ' + settingsObj.fontFamily);
              $('body').css('background-color', settingsObj.bgColor);
              $('body').css('color', settingsObj.fontColor);
              $('body').css('font-family', settingsObj.fontFamily);
              $('body').css('font-size', settingsObj.fontSize);

            } else {
              console.log('settingsObj.get() failed...');
            }
          });

        },

      set: function(obj) {
        chrome.storage.local.set(obj);
      }
};

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
  var sizeList = ko.observableArray([
    {
      displayName: 'Select a size...',
      styleString: null
    },
    {
      displayName: 'Extra Tiny',
      styleString: 'xx-small'
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

  ko.extenders.selectedFont = function(target) {
    target.subscribe(function(obj) {
        console.log(obj.styleString);
        var currentFontFamily = obj.styleString;
        settingsObj.fontFamily = currentFontFamily;
        storage.set(settingsObj);

      });
      return target;
    };

  var selectedFont = ko.observable().extend({selectedFont});

  ko.extenders.selectedSize = function(target) {
    target.subscribe(function(obj) {
      console.log(obj.styleString);
      var currentFontSize = obj.styleString;
      settingsObj.fontSize = currentFontSize;
      storage.set(settingsObj);

    });
    return target;
  };
  var selectedSize = ko.observable('large').extend({selectedSize});


  var displayTemplate = function () {
    var templateUri = chrome.extension.getURL('views/template.html');

    return $.ajax({
      url: templateUri,
    })
    .done(function (data) {
      $('html').html(data);
      storage.applySettings();
      progressBar();
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

        settingsObj.bgColor = color;
        storage.set(settingsObj);
      });
    },

    fontColorWidget: function(data, event) {
      var currentId = event.target.id;
      var jqCurrentId = '#' + currentId;
      $(jqCurrentId).colorPicker();
      $('body').on('click', function() {
        var color = $(jqCurrentId).css('background-color');
        $('body').css('color', color);

        settingsObj.fontColor = color;
        storage.set(settingsObj);
      });
    }
  };

  var longreaderVm = {
    init: function() {
        return $.when(displayTemplate()).done(function() {

        });
      },
    fontList: fontList,
    sizeList: sizeList,
    selectedFont: selectedFont,
    selectedSize: selectedSize,

    cogIconUri: chrome.extension.getURL('images/cog.png'),
    backIconUri: chrome.extension.getURL('images/back-white.svg'),
    settingsBar: settingsBar,
    displayContent: displayContent
  };

  longreaderVm.init().done(function() {
    console.log('init done...');
    ko.applyBindings(longreaderVm);



  });

})();
