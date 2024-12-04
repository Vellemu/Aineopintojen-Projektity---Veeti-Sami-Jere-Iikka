/**
* Palautta värin hex-koodin arvon suuruuden perusteella
* @param {*} value 
* @returns hex-koodi
*/
export const getColorHex = (data) => {
  const value = data.emissions_intensity_gco2_per_kwh
  return value > 500 ? '#8B0000' :
    value > 300 ? '#B71C1C' :
      value > 200 ? '#FC4E2A' :
        value > 100 ? '#FD8D3C' :
          value > 50 ? '#FEB24C' :
            '#FFEDA0'
}

export const renewablesAndCleanHex = (data) => {
  const pct = data.share_of_generation_pct
  return pct >= 100 ? '#006400' :
    pct > 80 ? '#228B22' :
      pct > 60 ? '#9ACD32' :
        pct > 40 ? '#FFD700' :
          pct > 20 ? '#FF4500' :
            '#8B0000'
}

const apiKey = import.meta.env.VITE_API_KEY
export const urls = [
  { key: 'carbonIntensity', url: `https://api.ember-energy.org/v1/carbon-intensity/yearly?is_aggregate_entity=false&start_date=2023&end_date=2023&include_all_dates_value_range=false&api_key=${apiKey}` },
  { key: 'renewables', url: `https://api.ember-energy.org/v1/electricity-generation/yearly?is_aggregate_entity=false&start_date=2023&end_date=2023&series=Renewables&is_aggregate_series=true&include_all_dates_value_range=false&api_key=${apiKey}` },
  { key: 'clean', url: `https://api.ember-energy.org/v1/electricity-generation/yearly?is_aggregate_entity=false&start_date=2023&end_date=2023&series=clean&is_aggregate_series=true&include_all_dates_value_range=false&api_key=${apiKey}` }
]