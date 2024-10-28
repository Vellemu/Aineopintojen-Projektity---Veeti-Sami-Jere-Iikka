import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import geoData from '../geoJson/CNTR_RG_60M_2020_4326.json';
import React, { useState } from 'react';
import '../sahkokartta.css';

const defaultCountryStyle = {
  weight: 2,
  color: 'lightblue',
  fillColor: 'lightblue',
  fillOpacity: 0.5
}

/**
 * Näyttää React Leafletilla tehdyn kartan
 */
// eslint-disable-next-line react/prop-types
const MapComponent = ({ setSelectedCountry, getCountryData }) => {
  const [selectedCountry, setSelectedCountryState] = useState(null);
  const position = [53.00, 10.00]; // Koordinaatit johon kartta keskitetään

  /**
   * Tekee jokaisesta maasta klikattavan  
   */
  const onEachCountry = (country, layer) => {
    layer.on('click', () => {
      console.log('Clicked on:', country.properties);
      setSelectedCountry(country.properties);
      setSelectedCountryState(country.properties.ISO3_CODE);
      getCountryData(country.properties.ISO3_CODE);
    });
  };

  const getCountryStyle = (country) => {
    return {
      ...defaultCountryStyle,
      fillColor: country.properties.ISO3_CODE === selectedCountry ? 'black' : 'green'
    };
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
        style={getCountryStyle}
        onEachFeature={onEachCountry}
      />
    
    </MapContainer>
  );
};

export default MapComponent;