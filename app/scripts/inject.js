/*global $:false */
(function() {
  'use strict';

  var key = '7fe8d00774cd51911b4cce37206c0832a42b3348';
  var currentUrl = window.location.href;
  var myApi = 'https://readability.com/api/content/v1/parser?url=' + currentUrl + '&token=' + key;
  var article;
  var MODEL = (function() {
    var getArticle = function () {
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
    return {
      getArticle: getArticle
    }; //end of getArticle()
  })();

  var displayTemplate = function () {
    var templateUri = chrome.extension.getURL('views/template.html');
    return $.ajax({
      url: templateUri,
    })
    .done(function (data) {
      $('html').html(data);
    });
  };

  var displayContent = function() {
    var articleObj = MODEL.getArticle();
    var content = articleObj.content;
    var author = articleObj.author;
    // var url = articleObj.url;
    var title = articleObj.title;
    $('#title').append(title);
    $('#author').append(author);
    $('#content').append(content);
  };
  var settingsBar = {
    init: function () {
      var cogIcon = chrome.extension.getURL('images/cog.png');
      $('#longreader-option-btn').html('<img src=' + cogIcon + ' style="height:1.5em;width:1.5em" />');

      var backIcon = chrome.extension.getURL('images/back-white.svg');
      $('#longreader-back-btn').html('<img src=' + backIcon + ' style="height:1.5em;width:1.5em" />');
    },
    slideUpDown: function() {
      console.log('slide up down');
      $('#longreader-option-window').slideToggle('slow');
    },
    reloadPage: function() {
        location.reload();
    },
    bindColorPicker: function() {

      /* callback */


      var openColorWidgetGetColor = function(selector) {
        // var fontColors = $('input#longreader-colorpicker-fontcolor').colorPicker();
        var colors = $(selector).colorPicker();
        console.log('success: ' + colors[0].value);
        return colors[0].value;
      };

      /* when you click the form input, the pallet opens */
      var bindPallet = function() {
        $('#longreader-colorpicker-bg').on('focusin', openColorWidgetGetColor('input#longreader-colorpicker-bg'));
        $('#longreader-colorpicker-fontcolor').on('focusin', openColorWidgetGetColor('input#longreader-colorpicker-fontcolor'));
      }; //end of bindPallet


      /* when you click the pallet widget, grab the color and change the background*/
      var bindClickEvent  = function() {
        $(document).on('click', function() {
          var currentFontColor = openColorWidgetGetColor('input#longreader-colorpicker-fontcolor');
          var currentBgColor = openColorWidgetGetColor('input#longreader-colorpicker-bg');
          $('body').css('background-color', currentBgColor);
          $('body').css('color', currentFontColor);
        });
      }; //end of bindClickEvent

      /* when you enter in data from the from, grab the color */
      var bindKeyPressEvent = function() {
        $(this).keypress(function() {
        });
      };

      bindPallet();
      bindClickEvent();
      bindKeyPressEvent();

    }
  }; //end of bindColorPicker function

  var longreaderVm = {
    init: function() {
      console.log('initializing view model');
      return $.when(displayTemplate())
        .done(function () {
          displayContent();
          settingsBar.init();
        });

    },
    settingsBar: settingsBar,
  };

  longreaderVm
    .init()
    .done(function () {
      ko.applyBindings(longreaderVm);
    });

})();
