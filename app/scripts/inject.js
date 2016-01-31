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
              '<input id="longreader-colorpicker-bg" placeholder="Background Color" size="18" class="color"></input>' +
              '<input id="longreader-colorpicker-fontcolor" placeholder="Font Color" size="18" class="color"></input>' +
              '<input id="longreader-fontsize" placeholder="Font" size="18"></input>' +
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

            /* callback */

            var createColorPalletAndGetColor = function() {
               var myColors = $('input.color').colorPicker(); //this needs to grab the currentCOlor of the id
               console.log("createColorPalletAndGetColor(): " + myColors[0].value);
               return myColors[0].value;
             };

             var createColorPalletAndGetFontColor = function() {
               var fontColors = $('input#longreader-colorpicker-fontcolor').colorPicker();
               console.log("createColorPalletAndGetFontColor(): " + fontColors[0].value);
               return fontColors[0].value;
             }
             /* when you click the form input, the pallet opens */
            var bindPallet = function() {
              $('#longreader-colorpicker-bg').on('focusin', createColorPalletAndGetColor());
              $('#longreader-colorpicker-fontcolor').on('focusin', createColorPalletAndGetFontColor());
            }; //end of bindPallet


            /* when you click the pallet widget, grab the color and change the background*/
              var bindClickEvent  = function() {
                $(document).on('click', function() {
                  var currentColor = createColorPalletAndGetColor();
                  var currentFontColor = createColorPalletAndGetFontColor();
                  $('body').css('background-color', currentColor);
                  $('body').css('color', currentFontColor);
                  });
              }; //end of bindClickEvent

              /* when you enter in data from the from, grab the color */
              var bindKeyPressEvent = function() {
                  $(this).keypress(function() {
                    console.log('keypress: ' + getCurrentColor());
                  });
              };

              bindPallet();
              bindClickEvent();
              bindKeyPressEvent();

              }
          }; //end of bindColorPicker function
       //end of bindColorPicker object literal
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
