import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import geoData from '../geoJson/CNTR_RG_60M_2020_4326.json';
import { useCountry } from '../hooks/useCountry';
import { getColorHex } from '../utils';
import Legend from './Legend';

import '../sahkokartta.css';
import '../emissionsMap.css';

const defaultCountryStyle = {
  weight: 2,
  color: 'black',
  fillOpacity: 0.8
}

const onEachCountry = (country, layer, setSelectedCountry, getCountryData) => {
  layer.on('click', () => {
    console.log(layer)
    console.log('Clicked on:', country.properties);
    setSelectedCountry(country.properties);
    getCountryData(country.properties.ISO3_CODE);
  });
};

const EmissionsMap = () => {
  const {
    carbonIntensity,
    getCountryData,
    setSelectedCountry,
  } = useCountry()

  const position = [53.00, 10.00]; // Koordinaatit johon kartta keskitetään

  /**
   * Valitsee värin päästöintensiteetin perusteella
   * @param {*} country 
   * @returns Värin hex-koodi
   */
  const getColor = (country) => {
    // TODO: Tarkista a.entity_code
    const countryData = carbonIntensity.find((a) => a.entity_code === country.properties.ISO3_CODE)

    if (!countryData) {
      return "gray"
    }

    const emissionsIntensity = countryData.emissions_intensity_gco2_per_kwh
    const color = getColorHex(emissionsIntensity)

    return color
  }

  const getCountryStyle = (country) => {
    return { ...defaultCountryStyle, fillColor: getColor(country) }
  };

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
        <GeoJSON
          data={geoData}
          style={getCountryStyle}
          onEachFeature={(country, layer) => onEachCountry(country, layer, setSelectedCountry, getCountryData)}
        />
        <Legend />
      </MapContainer>
    </div>
  );
};

export default EmissionsMap;