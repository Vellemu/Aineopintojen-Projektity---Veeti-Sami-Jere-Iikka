import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import geoData from '../geoJson/CNTR_RG_60M_2020_4326.json';
import '../sahkokartta.css';
import { useEffect } from 'react';
import { useCountry } from '../hooks/useCountry';

const defaultCountryStyle = {
  weight: 2,
  color: 'green',
  fillColor: 'green',
  fillOpacity: 0.5
}

let emissions = []

const EmissionsMap = () => {
  const { getEmissionsData, emissionsData } = useCountry()
  const position = [53.00, 10.00]; // Koordinaatit johon kartta keskitetään

  useEffect(() => {
    emissions = emissionsData.map((object) => {
      return (
        {
          country: object.entity_code,
          emissions: object.emissions_mtco2
        }
      )
    })
  }, [emissionsData])

  //const getColor = (country) => {
    //console.log(country)
    //const x = emissions.find((a) => a.country === country.properties.CNTR_ID)

    //console.log(x)
  //}

  /*
const getCountryStyle = (country) => {
    if (!selectedCountry) {
      return defaultCountryStyle
    }
    return {
      ...defaultCountryStyle,
      fillColor: country.properties.ISO3_CODE === selectedCountry.ISO3_CODE ? 'black' : 'green'
    };
  };
  */

  const getCountryStyle = (country) => {
    //getColor(country)
    return defaultCountryStyle
  };

  return (
    <div>
      <button onClick={() => getEmissionsData()}>hae Data</button>
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
      {console.log(emissions)}
    </div>
  );
};

export default EmissionsMap;