import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import geoData from '../geoJson/CNTR_RG_60M_2020_4326.json';
import { useCountry } from '../hooks/useCountry';
import { getColorHex } from '../utils';
import Legend from './Legend';

import '../sahkokartta.css';
import '../emissionsMap.css';
import Layers from './Layers';
import { useEffect, useState } from 'react';

const defaultCountryStyle = {
  weight: 2,
  color: 'black',
  fillOpacity: 0.8
}

const onEachCountry = (country, layer, setSelectedCountry, getCountryData, carbonIntensity) => {

  layer.bindTooltip(() => {
    const countryCarbonIntensity = carbonIntensity.find(data => data.entity_code === country.properties.ISO3_CODE)

    if (!countryCarbonIntensity) {
      return 'No data'
    }

    return `
    <div>
    <span class="entity">${countryCarbonIntensity.entity}</span>
    <br />
    ${countryCarbonIntensity.emissions_intensity_gco2_per_kwh} <abbr>gco2/kwh</abbr> 
    </div>`
  }, { sticky: true, className: 'emissions-tooltip' }
  )

  layer.on('click', () => {
    console.log('Clicked on:', country.properties);
    setSelectedCountry(country.properties);
    getCountryData(country.properties.ISO3_CODE);
  });


  layer.on('mouseover', (e) => {
    e.target.setStyle({ fillOpacity: 1 })
  })

  layer.on('mouseout', (e) => {
    e.target.setStyle({ fillOpacity: 0.8 })
  })
};

const EmissionsMap = () => {
  const [loading, setLoading] = useState(true)
  const {
    carbonIntensity,
    getCountryData,
    setSelectedCountry,
  } = useCountry()

  const position = [53.00, 10.00]; // Koordinaatit johon kartta keskitetään

  useEffect(() => {
    setLoading(true)
    if (carbonIntensity && carbonIntensity.length > 0) {
      setLoading(false)
    }
  }, [carbonIntensity])

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

  // TODO: Loading animaatio
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
        {!loading && <GeoJSON
          data={geoData}
          style={getCountryStyle}
          onEachFeature={(country, layer) =>
            onEachCountry(
              country,
              layer,
              setSelectedCountry,
              getCountryData,
              carbonIntensity
            )
          }
        />
        }
        <Legend />
        <Layers />
      </MapContainer>
    </div>
  );
};

export default EmissionsMap;