/*global $:false */
var LONGREADER = (function() {

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

  var VIEW = (function() {
      var displayTemplate = function () {
          var source =
              '<!doctype html>' +
              '<html>' +
              '<body class="longreader">' +
              '<nav>' +
              '<button type="submit" id="longreader-back-btn"></button>' +
              '<button type="submit" id="longreader-option-btn">OPTION</button>' +
              '<div id="longreader-option-window" class="longreader-option">' +
              '<input id="longreader-color-picker" placeholder="Background Color" size="18" class="color"></input>' +
              '<input id="longreader-option-size" placeholder="Font" size="18"></input>' +
              '<input id="longreader-option-size" placeholder="Text Size" size="18"></input>' +
              '</div>' +
              '</nav>' +
              '<article id="content" class="longreader-three-col">' +
              '<h1 id="title"></h1>' +
              '<h2 id="author"></h2>' +
              '</article>' +
              '</body>' +
              '</html>';
          $('html').html(source);
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
          showSettingsBar: function() {
            var cogIcon = chrome.extension.getURL('images/cog.png');
            $('#longreader-option-btn').html('<img src=' + cogIcon + ' style="height:1.5em;width:1.5em" />');
            $('#longreader-option-btn').on('click', function () {
                $('#longreader-option-window').slideToggle('slow');
            });
          },
          showBackButton: function() {
              var backIcon = chrome.extension.getURL('images/back-white.svg');
              $('#longreader-back-btn').html('<img src=' + backIcon + ' style="height:1.5em;width:1.5em" />');
              $('#longreader-back-btn').on('click', function () {
                  location.reload();
              });
          },
          bindColorPicker: function() {
            $('#longreader-color-picker').on('focusin', function () {
              var myColors = $('input.color').colorPicker(); /* grab color pallet */
              var getCurrentColor = function() {
                return myColors[0].value;
              };

              var bindClickEvent  = function() {
                      $(document).on('click', function() {
                        var currentColor = getCurrentColor();
                        console.log('getCurrentColor (onClick): ' + currentColor); /* works */
                  });
              };
              var bindKeyPressEvent = function() {
                  $(this).keypress(function() {
                    console.log('keypress: ' + getCurrentColor());
                  });
              };
              bindKeyPressEvent();
              bindClickEvent();

              });
          } //end of bindColorPicker function
      }; //end of bindColorPicker object literal
      return {
          displayTemplate: displayTemplate,
          displayContent: displayContent,
          displaySettingsBar: function() {
              settingsBar.showSettingsBar();
              settingsBar.showBackButton();
              settingsBar.bindColorPicker();
          }
      };
  })();



  return {
    init: function() {
      MODEL.getArticle();
      VIEW.displayTemplate();
      VIEW.displayContent();
      VIEW.displaySettingsBar();
    }
  }; //end of return

})();
LONGREADER.init();
