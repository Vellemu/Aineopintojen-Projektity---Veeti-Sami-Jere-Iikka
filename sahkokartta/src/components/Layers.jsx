/* eslint-disable react/prop-types */
import { GeoJSON, LayerGroup, LayersControl, useMap } from 'react-leaflet';
import geoData from '../geoJson/CNTR_RG_60M_2020_4326.json';
import { useCountry } from '../hooks/useCountry';
import { getColorHex, renewablesAndCleanHex } from '../utils';

const defaultCountryStyle = {
  weight: 2,
  color: 'gray',
  fillOpacity: 0.8
}

/**
 * Etsii ja palauttaa yhden maan tiedot valitusta datasta
 * @param {*} data Taulukko usean maan tiedoista
 * @param {*} isoCode Minkä maan tiedot etsitään
 * @returns Yhden maan tiedot
 */
const findCountryData = (data, isoCode) => data.find((item) => item.entity_code === isoCode);

/**
 * Palauttaa maalle tyylimääritykset
 * @param {*} country Mikä maa
 * @param {*} data 
 * @param {*} colorFn Funktio värin valintaan
 * @returns 
 */
const getCountryStyle = (country, data, colorFn) => {
  const countryData = findCountryData(data, country.properties.ISO3_CODE)
  const fillColor = countryData ? colorFn(countryData) : 'gray'
  return { ...defaultCountryStyle, fillColor }
}

/**
 * Luo sisällön tooltipille
 * @param {*} entity
 * @param {*} value
 * @returns 
 */
const createTooltipContent = (entity, value) => {
  if (!entity || !value) {
    return 'No data'
  }

  return `
    <div>
    <span class="entity">${entity}</span>
    <br />
    <div>${value}</div>
    </div>`
}

/**
 * 
 * @param {*} country 
 * @param {*} layer 
 * @param {*} param2 
 */
const onEachFeature = (country, layer, { tooltipConfig, handleClick }) => {
  const { data, tooltipCreator } = tooltipConfig
  const countryData = findCountryData(data, country.properties.ISO3_CODE)

  layer.bindTooltip(
    () => tooltipCreator(countryData),
    { sticky: true }
  )

  layer.on('click', handleClick)

  layer.on('mouseover', (e) => {
    e.target.setStyle({ fillOpacity: 1 })
  })

  layer.on('mouseout', (e) => {
    e.target.setStyle({ fillOpacity: 0.8 })
  })
}


const Layers = ({ energyData }) => {
  const {
    getCountryData,
    setSelectedCountry,
    toggleLayer
  } = useCountry()

  const map = useMap()
  map.on('baselayerchange', (e) => {
    toggleLayer(e.name)
  })

  const emissionsTooltipConfig = {
    data: energyData.carbonIntensity.data,
    tooltipCreator: data => {
      return createTooltipContent(data?.entity, `${data?.emissions_intensity_gco2_per_kwh} gco2/kwh`)
    }
  }

  const renewablesTooltipConfig = {
    data: energyData.renewables.data,
    tooltipCreator: data => {
      return createTooltipContent(
        data?.entity,
        `${data?.generation_twh} twh (${data?.share_of_generation_pct}%)`
      )
    }
  }

  const cleanTooltipConfig = {
    data: energyData.clean.data,
    tooltipCreator: data => {
      return createTooltipContent(
        data?.entity,
        `${data?.generation_twh} twh (${data?.share_of_generation_pct}%)`
      )
    }
  }

  const handleCountryClick = country => {
    setSelectedCountry(country.properties);
    getCountryData(country.properties.ISO3_CODE);
  }

  return (
    <LayersControl position='topright'>
      <LayersControl.BaseLayer checked name='Carbon intensity'>
        <LayerGroup>
          <GeoJSON
            data={geoData}
            style={(country) => getCountryStyle(country, energyData.carbonIntensity.data, getColorHex)}
            onEachFeature={(country, layer) =>
              onEachFeature(country, layer, {
                tooltipConfig: emissionsTooltipConfig,
                handleClick: () => handleCountryClick(country)
              })
            }
          />
        </LayerGroup>
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name='Renewable energy generation'>
        <LayerGroup>
          <GeoJSON
            data={geoData}
            style={(country) => getCountryStyle(country, energyData.renewables.data, renewablesAndCleanHex)}
            onEachFeature={(country, layer) =>
              onEachFeature(country, layer, {
                tooltipConfig: renewablesTooltipConfig,
                handleClick: () => handleCountryClick(country)
              })
            }
          />
        </LayerGroup>
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name='Clean energy generation'>
        <LayerGroup>
          <GeoJSON
            data={geoData}
            style={(country) => getCountryStyle(country, energyData.clean.data, renewablesAndCleanHex)}
            onEachFeature={(country, layer) =>
              onEachFeature(country, layer, {
                tooltipConfig: cleanTooltipConfig,
                handleClick: () => handleCountryClick(country)
              })
            }
          />
        </LayerGroup>
      </LayersControl.BaseLayer>
    </LayersControl>
  )
}

export default Layers