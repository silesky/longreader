/*global $:false */
var Module = (function() {

  var key = '7fe8d00774cd51911b4cce37206c0832a42b3348';
  var currentUrl = window.location.href;
  var myApi = 'https://readability.com/api/content/v1/parser?url=' + currentUrl + '&token=' + key;
  var oldContent = $('html').html();
  var displayTemplate = function() {
    var source =
      '<!doctype html>' +
        '<html>' +
          '<body class="longreader">' +
            '<nav>' +
              '<button type="submit" id="longreader-back-btn" onClick="history.go(0);"></button>' +
              '<button type="submit" id="longreader-option-btn">OPTION</button>' +
              '<div id="longreader-option-window" class="longreader-option">' +
                '<button id="longreader-option-color">Color</button>' +
                '<input type="text" class="color"></input>' +
                '<button id="longreader-option-size">Font Size</button>' +
              '</div>' +
            '</nav>' +
            '<article id="content" class="longreader-three-col">'+
              '<h1 id="title"></h1>' +
              '<h2 id="author"></h2>' +
            '</article>' +
          '</body>' +
        '</html>';
    $('html').html(source);
  };
  var getArticle = function() {
        $.ajax({
            type: 'Get',
            url: myApi,
            async: false,
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                if (response) {
                    console.log('jsonp call successful: ' + response.url);
                  article = response;
                } else {
                    console.log('error');
                }
            } //end of success callback
        }); //end of ajax call
        return article;
    }; //end of getArticle()
  var displayContent = function() {
      var articleObj = getArticle();
      var content = articleObj.content;
      var author = articleObj.author;
      var url = articleObj.url;
      var title = articleObj.title;
      $('#title').append(title);
      $('#author').append(author);
      $('#content').append(content);
  };
  var bindSettings = function() {
      var displaySettings = function() {
        $('#longreader-option-btn').on('click', function() {
          $('#longreader-option-window').slideToggle('slow');
        });
      };
      var displayColorPicker = function() {
        $('#longreader-option-color').on('click', function() {
          $('input.color').colorPicker();
        });
      };
      displayColorPicker();
    displaySettings();
  };

  var bindBackButton = function() {
      $('#longreader-back-btn').html('BACK'); //doesn't work bc of message passing
  };

  return {
    init: function() {
      displayTemplate();
      displayContent();
      bindBackButton();
      bindSettings();
    }
  }; //end of return

})();
Module.init();
