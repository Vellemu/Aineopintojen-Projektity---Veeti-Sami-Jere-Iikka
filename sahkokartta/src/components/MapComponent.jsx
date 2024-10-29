import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import geoData from '../geoJson/CNTR_RG_60M_2020_4326.json';
import '../sahkokartta.css';
import { useCountry } from "../hooks/useCountry";

const defaultCountryStyle = {
  weight: 2,
  color: 'green',
  fillColor: 'green',
  fillOpacity: 0.5
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

const MapComponent = () => {
  const { getCountryData, selectedCountry, setSelectedCountry } = useCountry()
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
        onEachFeature={(country, layer) => onEachCountry(country, layer, setSelectedCountry, getCountryData)}
      />

    </MapContainer>
  );
};

export default MapComponent;