  /*global $:false, ko:false */
  (function() {
    'use strict';

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
            console.log("bgColorWidget function click");
            var currentId = event.target.id;
            var jqCurrentId = '#' + currentId;
            $(jqCurrentId).colorPicker();
            $('body').on('click', function() {
              var color = $(jqCurrentId).css('background-color');
              $('body').css('background-color', color);
            });
        },
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
