var $ = require('util'),
    L = require('vendor/leaflet');

module.exports = L.Control.extend({
  onAdd: function() {
    var control = $.create('div', 'search-control');
    var input = $.create('input', 'search-input', control);
    input.type = 'search';
    input.placeholder = 'Search';
    this.results = $.create('ul', 'search-results', control);
    L.DomEvent.disableClickPropagation(control);
    $.on(input, 'input', this.onInput, this);
    return control;
  },

  onInput: function(event) {
    var val = event.target.value.trim();
    this.options.onInput(val);
  },

  setResults: function(results) {
    this.results.innerHTML = '';
    results.map(function(result, i) {
      var res = $.create('li', 'search-result');
      res.innerHTML = result;
      $.on(res, 'click', this.options.onSelect.bind(null, i));
      this.results.appendChild(res);
    }, this);
  }
});
