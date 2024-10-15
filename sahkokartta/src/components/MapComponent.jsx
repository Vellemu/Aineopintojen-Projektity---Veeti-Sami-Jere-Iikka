import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useState, useEffect } from 'react';
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
const MapComponent = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const position = [53.00, 10.00]; // Koordinaatit johon kartta keskitetään

  /**
   * Tekee jokaisesta maasta klikattavan  
   */
  const onEachCountry = (country, layer) => {
    layer.on('click', (event) => {
      console.log('Clicked on:', country.properties);
      setSelectedCountry(country.properties);
      getCountryData(country);
    });
  };
  /**
   * Päivittää valitun maan tiedot
   */
  useEffect(() => {
    if (selectedCountry) {
      console.log('Valittu maa päivittyy:', selectedCountry);
    } 
  },  [selectedCountry]);

  /**
   * Sulkee valitun maan tiedot
   */
  const handleClose = () => {
    setSelectedCountry(null);
  };

  /**
   * Hakee API:n kautta valitun maan dataa
   * @param {klikattu maa} country 
   */
  function getCountryData(country) {
    
    const apiKey = "0168eed5-2b8e-4d18-aebb-9c1e3ff8ab45"; //TODO: API-avain ympäristömuuttujaksi (?)
    fetch('https://api.ember-climate.org/v1/electricity-generation/yearly?' + 
      'entity_code='+ country.properties.ISO3_CODE +
      '&is_aggregate_series=false'+
      '&start_date=2023' +
      '&api_key=' + apiKey)
      .then(response => response.json())
      .then(data => showCountryData(data))
      .catch(error => console.error(error));
  }

  /**
   * TODO: Käsittelee maan dataa
   * @param {data} countryData 
   */
  function showCountryData(countryData) {
    console.log(countryData)
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
    {selectedCountry && (
      <>
        <div id="info-container" className="info-container">
          <button className="close-button" onClick={handleClose}>X</button>
          <h2> Information about {selectedCountry.NAME_ENGL}</h2>
          <ul>
            {Object.entries(selectedCountry).map(([key, value]) => (
              <li key={key}>
                <strong>{key}</strong>: {value}
              </li>
            ))}
          </ul>
        </div>
      </>
    )}
    </MapContainer>
  );
};

export default MapComponent;