import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import geoData from '../geoJson/CNTR_RG_60M_2020_4326.json';
import '../sahkokartta.css';

const countryStyle = {
  weight: 2,
  color: 'lightblue',
  fillColor: 'lightblue',
  fillOpacity: 0.2
}
/**
   * Tekee jokaisesta maasta klikattavan  
   */
const onEachCountry = (country, layer, setSelectedCountry, getCountryData) => {
  layer.on('click', () => {
    console.log('Clicked on:', country.properties);
    setSelectedCountry(country.properties);
    getCountryData(country.properties.ISO3_CODE);
  });
};

/**
 * Näyttää React Leafletilla tehdyn kartan
 */
// eslint-disable-next-line react/prop-types
const MapComponent = ({ setSelectedCountry, getCountryData }) => {
  const position = [53.00, 10.00]; // Koordinaatit johon kartta keskitetään

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
        onEachFeature={(country, layer) => onEachCountry(country, layer, setSelectedCountry, getCountryData)}
      />

    </MapContainer>
  );
};

export default MapComponent;