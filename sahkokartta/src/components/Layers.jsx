import { GeoJSON, LayerGroup, LayersControl } from 'react-leaflet';
import geoData from '../geoJson/CNTR_RG_60M_2020_4326.json';
import { useCountry } from '../hooks/useCountry';
import { getColorHex, renewablesHex } from '../utils';

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
 * @param {*} setSelectedCountry 
 * @param {*} getCountryData 
 * @param {*} carbonIntensity 
 */
const onEachCountry = (country, layer, setSelectedCountry, getCountryData, carbonIntensity) => {

  layer.bindTooltip(() => {
    const countryCarbonIntensity = findCountryData(carbonIntensity, country.properties.ISO3_CODE)

    if (!countryCarbonIntensity) {
      return 'No data'
    }

    return createTooltipContent(
      countryCarbonIntensity.entity,
      `${countryCarbonIntensity.emissions_intensity_gco2_per_kwh} gco2/kwh`
    )
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

const onEachCountryRenewables = (country, layer, renewablesGeneration) => {
  layer.bindTooltip(() => {
    const countryRenewables = findCountryData(renewablesGeneration, country.properties.ISO3_CODE)

    if (!countryRenewables) {
      return 'No data'
    }

    return createTooltipContent(
      countryRenewables.entity,
      `${countryRenewables.generation_twh} twh (${countryRenewables.share_of_generation_pct}%)`
    )
  }, { sticky: true, className: 'emissions-tooltip' }
  )

  layer.on('mouseover', (e) => {
    e.target.setStyle({ fillOpacity: 1 })
  })

  layer.on('mouseout', (e) => {
    e.target.setStyle({ fillOpacity: 0.8 })
  })
};


const Layers = () => {
  const {
    carbonIntensity,
    getCountryData,
    setSelectedCountry,
    renewablesGeneration
  } = useCountry()

  return (
    <LayersControl position='topright'>
      <LayersControl.BaseLayer checked name='Carbon intensity'>
        <LayerGroup>
          <GeoJSON
            data={geoData}
            style={(country) => getCountryStyle(country, carbonIntensity, getColorHex) }
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
        </LayerGroup>
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name='Renewable energy generation'>
        <LayerGroup>
          <GeoJSON
            data={geoData}
            style={(country) => getCountryStyle(country, renewablesGeneration, renewablesHex)}
            onEachFeature={(country, layer) =>
              onEachCountryRenewables(
                country,
                layer,
                renewablesGeneration
              )
            }
          />
        </LayerGroup>
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name='Clean energy generation'>
        <LayerGroup>

        </LayerGroup>
      </LayersControl.BaseLayer>
    </LayersControl>
  )
}

export default Layers