import 'leaflet-routing-machine';
import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Control {
    export class Fullscreen extends L.Control {
      public constructor(options?: L.ControlOptions)
    }
  }
}
