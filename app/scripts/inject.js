var Module = (function() {
  var key = '7fe8d00774cd51911b4cce37206c0832a42b3348';
  var currentUrl = window.location.href;
  var myApi = 'https://readability.com/api/content/v1/parser?url=' + currentUrl + '&token=' + key;
  var articleText;

  var displayTemplate = function() {
    var source =
            '<!doctype html>' +
            '<html>' +
            '<body>' +
            '<nav></nav>' +
            '<article id="content">'+
              '<h1 id="title"></h1>' +
              '<h2 id="author">by </h2>' +
            '</article>' +
            '</body>' +
            '</html>';

  $('html').html(source);
 }
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
  var bindBackButton = function() {
      $('body').prepend('<a href="" id="handler">BACK BUTTON</a>'); //doesn't work bc of message passing
      $('#handler').on('click', function () {
        var oldContent = $('body').html();
        $('body').html(oldContent);

      });
  };
  return {
    init: function() {
      displayTemplate()
      displayContent();
      bindBackButton();
    }
  }; //end of return

})();
Module.init();