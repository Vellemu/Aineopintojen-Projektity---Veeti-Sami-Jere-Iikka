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
 * Näyttää React Leafletilla tehdyn kartan
 */
// eslint-disable-next-line react/prop-types
const MapComponent = ({ setSelectedCountry }) => {
  const position = [53.00, 10.00]; // Koordinaatit johon kartta keskitetään

  /**
   * Tekee jokaisesta maasta klikattavan  
   */
  const onEachCountry = (country, layer) => {
    layer.on('click', (event) => {
      console.log('Clicked on:', country.properties);
      setSelectedCountry(country.properties);
      getCountryData(country.properties.ISO3_CODE);
    });
  };

  /**
   * Hakee API:n kautta valitun maan dataa 
   * @param {string} countryCode
   */
  function getCountryData(countryCode) {
    const apiKey = import.meta.env.VITE_API_KEY; /* API-avain ympäristömuuttuja */

    fetch('https://api.ember-climate.org/v1/electricity-generation/yearly?' + 
      'entity_code='+ countryCode +
      '&is_aggregate_series=false'+
      '&start_date=2023' +
      '&api_key=' + apiKey)
      .then(response => response.json())
      .then(data => console.log(data)) // TODO
      .catch(error => console.error(error));
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
  );
};

export default MapComponent;