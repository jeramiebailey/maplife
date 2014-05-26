var routes = [
  function latLonZoom(path) {
    var parts = path.split('/'),
        state = {};

    var layer = parts[0],
        lat = parseFloat(parts[1]),
        lng = parseFloat(parts[2]),
        zoom = parseInt(parts[3], 10);

    if (!(isNaN(lat) || isNaN(lng) || isNaN(zoom))) {
      state.center = {
        lat: lat,
        lng: lng
      };
      state.zoom = zoom;
      state.layers = [layer];
      return state;
    }
  },

  function track(path) {
    if (path.match(/^https?:\/\//)) {
      return {
        track: decodeURIComponent(path)
      };
    }
  }
];

module.exports = {
  parse: function(path) {
    for (var i = 0; i < routes.length; i++) {
      var state = routes[i](path);
      if (state) {
        return state;
      }
    }
    return {};
  },

  serialize: function(state) {
    return [
      state.layers[0],
      roundCoordinate(state.center.lat),
      roundCoordinate(state.center.lng),
      state.zoom
    ].join('/');
  },

  get: function() {
    return this.parse(window.location.hash.substring(1));
  },

  set: function(state) {
    window.location.hash = this.serialize(state);
  }
};

function roundCoordinate(coordinate) {
  return Math.round(coordinate * 100000) / 100000;
}
