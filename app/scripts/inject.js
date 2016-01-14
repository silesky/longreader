var Module = (function() {
  var key = '7fe8d00774cd51911b4cce37206c0832a42b3348';
  var currentUrl = window.location.href;
  var myApi = 'https://readability.com/api/content/v1/parser?url=' + currentUrl + '&token=' + key;
  var getArticleText = function() {
        $.ajax({
            type: 'Get',
            url: myApi,
            async: false,
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                if (response) {
                    console.log('jsonp call successful: ' + response.url);
                    articleText = response.content;

                } else {
                    console.log('error');
                }
            } //end of success callback
        }); //end of ajax call
        return articleText;
    }; //end of getArticleText()
  var displayContent = function() {
      var text = getArticleText();
      $('body').html(text);
  };
  var bindBackButton = function() {
      $('#handler').on('click', function () {
        var oldContent = $('body').html();
        $('body').html(oldContent);
        $('body').prepend('<a id="handler">BACK BUTTON</a>');
      });
  };
  return {
    init: function() {
      displayContent();
      bindBackButton();
    }
  }; //end of return

})();
Module.init();



