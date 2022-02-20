// Main Module
var App = (function (app) {
  var isIE = function () {
    if (window.navigator.appName === 'Microsoft Internet Explorer') {
      var re = new RegExp('MSIE ([0-9]{1,}[.0-9]{0,})');
      if (re.exec(navigator.userAgent) != null) {
        return parseFloat(RegExp.$1);
      }
    }
    return -1;
  };

  app.ie = isIE();

  return app;
}(window.App || {}));

// Text
App.text = (function () {
  var text = {};

  text.capitalize = function (text) {
    if (typeof text === 'string') {
      text = text.toLowerCase();
      text = text.split(' ');
      for (var i in text) {
        if (text[i][0]) {
          text[i] = text[i][0].toUpperCase() + text[i].substring(1);
        }
      }
      return text.join(' ');
    }
    return text;
  };

  return text;
}());
