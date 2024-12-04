import { MapContainer, TileLayer } from 'react-leaflet';
import { useCountry } from '../hooks/useCountry';
import Legend from './Legend';

import '../sahkokartta.css';
import '../emissionsMap.css';
import { useEffect, useState } from 'react';
import Layers from './Layers';

const EmissionsMap = () => {
  const [loading, setLoading] = useState(true)
  const { carbonIntensity, renewablesGeneration, cleanGeneration, layer } = useCountry()

  const position = [53.00, 10.00]; // Koordinaatit johon kartta keskitetään

  useEffect(() => {
    setLoading(true)
    if (carbonIntensity && carbonIntensity.length > 0 && renewablesGeneration.length > 0 && cleanGeneration) {
      setLoading(false)
    }

  }, [carbonIntensity, renewablesGeneration, cleanGeneration])

  // TODO: Loading animaatio
  // TODO: Legend korjaus
  return (
    <div>
      <MapContainer center={position} zoom={4} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
          attribution='©OpenStreetMap, ©CartoDB'
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
          attribution='©OpenStreetMap, ©CartoDB'
        />
        {!loading && <Layers />}
        {layer === 'Carbon intensity' && <Legend />}
      </MapContainer>
    </div>
  );
};


export default EmissionsMap;