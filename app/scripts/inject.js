  /*global $:false, ko:false */
  (function() {
    'use strict';

  ko.bindingHandlers.colorPicker = {
    init: function (element, valueAccessor) {
      var $el = $(element);
      $el.colorPicker();

    },
  };

    // Observables
    var bgColor = ko.observable();
    var fontColor = ko.observable();

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
        console.log(data);
      });
    };

    var displayContent = (function() {
      var articleObj = MODEL.getArticle();
      var articleContent = articleObj.content;
      var articleTitle = articleObj.title;
      var articleAuthor = articleObj.author;
      var speak = function() {
        console.log("THE TITLE:" + articleObj.title);
      }
      // var url = articleObj.url;
      //$('#title').append(title);
       // $('#author').append(author);
      // $('#content').append(content);
      return {

        articleContent: articleContent,
        articleTitle: articleTitle,
        articleAuthor: articleAuthor,
        speak: speak
      }
    })();

    var settingsBar = {
      slideUpDown: function() {
        console.log('slide up down');
        $('#longreader-option-window').slideToggle('slow');
      },
      reloadPage: function() {
          location.reload();
      },
      bindColorPicker: function() {

        var openColorWidgetGetColor = function(selector) {
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

        // bindPallet();
        // bindClickEvent();
        // bindKeyPressEvent();

      },
    }; //end of bindColorPicker function

    var longreaderVm = {
      init: function() {
        return $.when(displayTemplate()).done(function() {
          console.log("displayTemplate() finished!");
        });
      },

      cogIconUri: chrome.extension.getURL('images/cog.png'),
      backIconUri: chrome.extension.getURL('images/back-white.svg'),
      settingsBar: settingsBar,
      bgColor: bgColor,
      fontColor: fontColor,
      articleContent: displayContent.articleContent,
      articleTitle: displayContent.articleTitle,
      articleAuthor: displayContent.articleAuthor
    };

    longreaderVm
      .init()
      .done(function () {
        console.log("init done");
        displayContent.speak();
        ko.applyBindings(longreaderVm);
      });

  })();
