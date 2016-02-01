  /*global $:false, ko:false */
  (function() {
    'use strict';

  // ko.bindingHandlers.colorPicker = {
  //   init: function (element, valueAccessor) {
  //     $('input.color').colorPicker();
  //   },
  //   update: function(element, valueAccessor) {
  //     var value = valueAccessor();
  //     console.log(value);
  //
  //     var myColors = $(element).colorPicker();
  //     console.log(myColors[0].value);
  //   }
  // };

    // Observables
    var bgColorWidget = ko.observable();
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
      return {
        articleContent: articleContent,
        articleTitle: articleTitle,
        articleAuthor: articleAuthor
      };
    })();

    var settingsBar = {

      slideUpDown: function() {
        console.log('slide up down');
        $('#longreader-option-window').slideToggle('slow');
      },
      reloadPage: function() {
          location.reload();
      },
      bgColorWidget: function(data, event) {
            var currentID = event.target.id;
            console.log(data);
            console.log(event.target.id);
            var currentID = event.target.id;
            $('#' + currentID).colorPicker();

        },

        /* when you click the form input, the pallet opens */
        // bindPallet: function() {
        //   $('#longreader-colorpicker-bg').on('focusin', openColorWidgetGetColor('input#longreader-colorpicker-bg'));
        //   $('#longreader-colorpicker-fontcolor').on('focusin', openColorWidgetGetColor('input#longreader-colorpicker-fontcolor'));
        // }, //end of bindPallet

        /* when you click the pallet widget, grab the color and change the background*/
        // bindClickEvent: function() {
        //   $('.cp-xy-cursor').on('change', function() {
        //     var currentFontColor = openColorWidgetGetColor('input#longreader-colorpicker-fontcolor');
        //     var currentBgColor = openColorWidgetGetColor('input#longreader-colorpicker-bg');
        //     $('body').css('background-color', currentBgColor);
        //     $('body').css('color', currentFontColor);
        //   });
        // }, //end of bindClickEvent

        /* when you enter in data from the from, grab the color */
        bindKeyPressEvent: function() {
          $(this).keypress(function() {
          });
        }
    };

    var longreaderVm = {
      init:
      function() {
        return $.when(displayTemplate()).done(function() {
          console.log("displayTemplate() finished!");
        });
      },

      cogIconUri: chrome.extension.getURL('images/cog.png'),
      backIconUri: chrome.extension.getURL('images/back-white.svg'),
      settingsBar: settingsBar,
      bgColorWidget: settingsBar.bgColorWidget,
      articleContent: displayContent.articleContent,
      articleTitle: displayContent.articleTitle,
      articleAuthor: displayContent.articleAuthor
  };

    longreaderVm
      .init()
      .done(function () {
        console.log("init done");
        ko.applyBindings(longreaderVm);
      });

  })();
