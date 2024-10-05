import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import geoData from '../geoJson/CNTR_RG_60M_2020_4326.json';

const countryStyle = {
  weight: 2,
  color: 'lightblue',
  fillColor: 'lightblue',
  fillOpacity: 0.2
}

/**
 * Näyttää React Leafletilla tehdyn kartan
 */
const MapComponent = () => {
  const position = [53.00, 10.00]; // Koordinaatit johon kartta keskitetään

  /**
   * Tekee jokaisesta maasta klikattavan  
   */
  const onEachCountry = (country, layer) => {
    layer.on('click', (event) => {
      console.log(country)
      console.log(event)
    })
  }

  return (
    <MapContainer center={position} zoom={4} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
        attribution='©OpenStreetMap, ©CartoDB'
      />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
        attribution='©OpenStreetMap, ©CartoDB'
      />
      <GeoJSON
        data={geoData}
        style={countryStyle}
        onEachFeature={onEachCountry}
      />
    </MapContainer>
  )
}

export default MapComponent;