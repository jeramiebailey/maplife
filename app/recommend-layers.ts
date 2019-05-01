import Layers, { LayerMapType } from './layers';
import Map from './map';
import StateStore from './state-store';
import { LatLng } from 'leaflet';

export default function(controller: Map, options: StateStore) {
  if (!options.get('layers') && options.get('center')) {
    var recommended = recommend('hiking', options.get('center'));
    if (recommended) {
      options.set('layers', [recommended]);
    }
  }
}

export function recommend(mapType: LayerMapType, position: LatLng) {
  var layers = Layers.keys(mapType);
  if (layers.length > 1) {
    // if we have more than one layer available for the given
    // map type, try to find the first that contains our position
    var containsPosition = layers.filter(function(layer) {
      return layer.bounds && layer.bounds.contains(position);
    });
    if (containsPosition.length > 0) {
      return containsPosition[0].id;
    }
    // if none of them contains our position, return the last
    // that is global (has no bounds)
    var globals = layers.filter(function(layer) {
      return !layer.bounds;
    });
    return globals[0].id;
  }
  return layers[0] ? layers[0].id : undefined;
}
