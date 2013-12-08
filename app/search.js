var klass = require('vendor/klass'),
    SearchControl = require('search-control');

module.exports = klass({
  initialize: function(controller, options) {
    this.controller = controller;
    this.options = options;
  },

  setMap: function(map) {
    this.map = map;
    this.control = new SearchControl({
      position: 'topright',
      onInput: this.onInput.bind(this),
      onSelect: this.onSelect.bind(this)
    });
    map.addControl(this.control);
  },

  onInput: function(val) {
    if (val.length) {
      search(val, this.onSuccess, this.onError, this);
    } else {
      this.control.setResults([]);
    }
  },

  onSelect: function() {
  },

  onSuccess: function(results) {
    this.control.setResults(results.map(formatResult));
  },

  onError: function() {
    this.control.setResults(['Search failed :(']);
  }
});

function formatResult(result) {
  return result.display_name;
}

var search = debounce(function(query, success, error, context) {
  var url = 'http://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&q=' + encodeURIComponent(query);
  return get(url, success, error, context);
});

function get(url, success, error, context) {
  var request = new XMLHttpRequest();
  request.timeout = 5000;
  request.onload = function() {
    if (this.status >= 200 && this.status < 300) {
      success.call(context, JSON.parse(request.responseText));
    } else {
      error.call(context, this.status);
    }
  };
  request.onerror = function() {
    error.call(context, this.status);
  };
  request.open('GET', url, true);
  request.send();
}

function debounce(fn) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, 1000);
  };
}
