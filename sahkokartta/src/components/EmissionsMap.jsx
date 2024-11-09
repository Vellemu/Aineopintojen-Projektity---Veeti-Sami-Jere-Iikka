import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import geoData from '../geoJson/CNTR_RG_60M_2020_4326.json';
import '../sahkokartta.css';
//import { useEffect } from 'react';
import { useCountry } from '../hooks/useCountry';

const defaultCountryStyle = {
  weight: 2,
  color: 'black',
  fillOpacity: 1
}

const EmissionsMap = () => {
  const { getCarbonIntensityData, carbonIntensity } = useCountry()
  const position = [53.00, 10.00]; // Koordinaatit johon kartta keskitetään

  const getColor = (country) => {
    const countryData = carbonIntensity.find((a) => a.entity_code === country.properties.ISO3_CODE)

    if (!countryData) {
      return "gray"
    }

    const emissionsIntensity = countryData.emissions_intensity_gco2_per_kwh

    const color =
      emissionsIntensity > 500 ? '#B71C1C' :
        emissionsIntensity > 200 ? '#FC4E2A' :
          emissionsIntensity > 100 ? '#FD8D3C' :
            emissionsIntensity > 50 ? '#FEB24C' :
              '#FFEDA0'

    return color

  }

  const getCountryStyle = (country) => {
    return { ...defaultCountryStyle, fillColor: getColor(country) }
  };

  return (
    <div>
      <button onClick={() => getCarbonIntensityData()}>hae Data</button>
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
        />
      </MapContainer>
    </div>
  );
};

export default EmissionsMap;