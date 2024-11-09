
// API kutsut tänne

const apiKey = import.meta.env.VITE_API_KEY; /* API-avain ympäristömuuttuja */

/**
* Hakee API:n kautta valitun maan dataa 
* @param {string} countryCode
* @returns Haettu data
*/
const fetchCountryElectricityData = async (countryCode) => {
  const response = await fetch('https://api.ember-climate.org/v1/electricity-generation/yearly?' +
    'entity_code=' + countryCode +
    '&is_aggregate_series=false' +
    '&start_date=2023' +
    '&api_key=' + apiKey)

  const jsonData = await response.json()
  return jsonData.data
}

const fetchEmissionsData = async () => {
  const response = await fetch(`https://api.ember-energy.org/v1/carbon-intensity/yearly?is_aggregate_entity=false&start_date=2023&end_date=2023&include_all_dates_value_range=false&api_key=${apiKey}`)
  const jsonData = await response.json()
  
  return jsonData.data
}

export { fetchCountryElectricityData, fetchEmissionsData }