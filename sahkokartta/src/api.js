
// API kutsut tänne

/**
* Hakee API:n kautta valitun maan dataa 
* @param {string} countryCode
* @returns Haettu data
*/
const fetchCountryElectricityData = async (countryCode) => {
  const apiKey = import.meta.env.VITE_API_KEY; /* API-avain ympäristömuuttuja */
  const response = await fetch('https://api.ember-climate.org/v1/electricity-generation/yearly?' +
    'entity_code=' + countryCode +
    '&is_aggregate_series=false' +
    '&start_date=2023' +
    '&api_key=' + apiKey)

  const jsonData = await response.json()
  return jsonData.data
}

const fetchEmissionsData = async () => {
  const apiKey = import.meta.env.VITE_API_KEY; /* API-avain ympäristömuuttuja */

  const response = await fetch(`https://api.ember-energy.org/v1/power-sector-emissions/yearly?is_aggregate_entity=false&start_date=2023&end_date=2023&series=Total%20generation&is_aggregate_series=true&include_all_dates_value_range=false&api_key=${apiKey}`)
  console.log("response: ", response)
  const jsonData = await response.json()
  return jsonData.data
}

export { fetchCountryElectricityData, fetchEmissionsData }