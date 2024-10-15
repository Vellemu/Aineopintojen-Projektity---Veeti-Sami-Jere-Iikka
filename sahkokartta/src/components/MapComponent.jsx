import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useState, useEffect } from 'react';
import geoData from '../geoJson/CNTR_RG_60M_2020_4326.json';
import './MapComponent.css';

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
    });
  };

  useEffect(() => {
    if (selectedCountry) {
      console.log('Valittu maa päivittyy:', selectedCountry);
    } 
  },  [selectedCountry]);

  const handleClose = () => {
    setSelectedCountry(null);
  };

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