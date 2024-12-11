import React, { useState,  useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import geoData from '../geoJson/CNTR_RG_60M_2020_4326.json';
import '../sahkokartta.css';
import { useCountry } from "../hooks/useCountry";
import ImportArrow from './ImportArrow';
import importData from '../../data/Electricity_Imports.json';
import * as turf from '@turf/turf';

const defaultCountryStyle = {
  weight: 2,
  color: 'lightblue',
  fillColor: 'green',
  fillOpacity: 0.5
}
/**
* Tekee jokaisesta maasta klikattavan  
*/
const onEachCountry = (country, layer, setSelectedCountry, getCountryData, setArrows, importData) => {
  layer.on('click', () => {
    console.log('Clicked on:', country.properties);
    setSelectedCountry(country.properties);
    getCountryData(country.properties.ISO3_CODE);

    if (!importData) {
      console.error('importData is undefined');
      return;
    }

    const newArrows = [];

    for (const region in importData["2023"]) {
      console.log('Region:', region);

      for (const toCountry in importData["2023"][region]) {
        console.log('To Country:', toCountry);

        if (toCountry === country.properties.NAME_ENGL) {
          for (const fromCountry in importData["2023"][region][toCountry]) {
            console.log('From Country:', fromCountry);
            const fromCoordinates = getCoordinates(fromCountry);
            const toCoordinates = getCoordinates(toCountry);
            const value = importData["2023"][region][toCountry][fromCountry];

            if (fromCoordinates && toCoordinates) {
            newArrows.push({
              from: { lat: fromCoordinates.lat, lng: fromCoordinates.lng },
              to: { lat: toCoordinates.lat, lng: toCoordinates.lng },
              value: value
            });
          } else {
            console.error('Coordinates not found for:', fromCountry, toCountry);
          }
        }
      }
    }
  }

    console.log('newArrows:', newArrows);
    setArrows(newArrows);
  });
};

const getCoordinates = (countryName) => {
  const feature = geoData.features.find( f => f.properties.NAME_ENGL === countryName);
  if (feature) {
    // Ensure we correctly extract the latitude and longitude
    const center = turf.centroid(feature);
    const [lng, lat] = center.geometry.coordinates;
    console.log(`Coordinates for ${countryName}:`, { lat, lng });
    return { lat, lng };
    /*
    const coordinates = feature.geometry.coordinates;
    if (feature.geometry.type === "MultiPolygon") {
        // Use the first point of the first ring of the first polygon as a representative coordinate
        const [lng, lat] = coordinates[0][0][0];
        console.log(`Coordinates for ${countryName}:`, { lat, lng });
        return { lat, lng };
    } else if (feature.geometry.type === "Polygon") {
        // Handle simple Polygon
        const [lng, lat] = coordinates[0][0];
        console.log(`Coordinates for ${countryName}:`, { lat, lng });
        return { lat, lng };
    } else {
        console.error(`Unsupported geometry type: ${feature.geometry.type}`);
        return null;
    }
    */
  }
};

const MapComponent = () => {
  const { getCountryData, selectedCountry, setSelectedCountry } = useCountry()
  const [arrows, setArrows] = useState([]);
  const position = [53.00, 10.00]; // Koordinaatit johon kartta keskitetään

  const getCountryStyle = (country) => {
    if (!selectedCountry) {
      return defaultCountryStyle
    }
    return {
      ...defaultCountryStyle,
      fillColor: country.properties.ISO3_CODE === selectedCountry.ISO3_CODE ? 'black' : 'green'
    };
  };
  return (
    <MapContainer center={position} zoom={4} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        noWrap
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
        attribution='©OpenStreetMap, ©CartoDB, Data: ©Ember'
      />
      <TileLayer
        noWrap
        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
        attribution='©OpenStreetMap, ©CartoDB, Data: ©Ember'
      />
      <GeoJSON
        data={geoData}
        style={getCountryStyle}
        onEachFeature={(country, layer) => onEachCountry(country, layer, setSelectedCountry, getCountryData, setArrows, importData )}
      />
      {arrows.map((arrow, index) => (
        <ImportArrow key={index} from={arrow.from} to={arrow.to} value={arrow.value} />
      ))}
    </MapContainer>
  );
};

export default MapComponent;