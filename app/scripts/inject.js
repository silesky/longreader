
document.body.style.backgroundColor='yellow';
console.log('CONTENT SCRIPT: ' + window.location.href);

var Module = (function() {
  var key = '7fe8d00774cd51911b4cce37206c0832a42b3348';
  var currentUrl = window.location.href;
  var myApi = 'https://readability.com/api/content/v1/parser?url=' + currentUrl + '&token=' + key;

  return {
   getArticleText: function() {
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
      } //end of success callback
     }); //end of ajax call
   } //end of callAjax
  }; //end of return
})();

Module.getArticleText();
