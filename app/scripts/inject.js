var getHtmlArticleFromCurrentUrl;
document.body.style.backgroundColor='yellow';
console.log('CONTENT SCRIPT: ' + window.location.href);

var getHtmlArticleFromCurrentUrl = function() {
  var key = '7fe8d00774cd51911b4cce37206c0832a42b3348';
  var currentUrl = window.location.href;
  var myApi = 'https://readability.com/api/content/v1/parser?url=' + currentUrl + '&token=' + key;
  $.ajax({
      type: 'Get',
      url: myApi,
      async: false,
      contentType: 'application/json',
      dataType: 'json',
      success: function(e) {
        if (e) {
          console.log('jsonp call successful: ' + e.url);
          //console.log(e.content);
          console.log(e.content);
        } else {
          console.log('error');
        }
      }
    });
};

getHtmlArticleFromCurrentUrl();
