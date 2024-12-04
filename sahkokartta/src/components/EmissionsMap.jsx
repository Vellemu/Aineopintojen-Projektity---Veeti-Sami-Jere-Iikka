import { MapContainer, TileLayer } from 'react-leaflet';
import Legend from './Legend';

import '../sahkokartta.css';
import '../emissionsMap.css';
import Layers from './Layers';
import useMultiFetch from '../hooks/useMultiFetch';
import { urls } from '../utils';

const EmissionsMap = () => {
  const { data, loading, error } = useMultiFetch(urls)

  const position = [53.00, 10.00]; // Koordinaatit johon kartta keskitetään

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error}</div>
  }

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
        <Layers energyData={data}/>
        <Legend />
      </MapContainer>
    </div>
  );
};


export default EmissionsMap;