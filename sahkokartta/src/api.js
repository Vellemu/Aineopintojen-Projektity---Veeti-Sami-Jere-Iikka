/**
* Hakee API:n kautta valitun maan dataa 
* @param {string} countryCode
* @returns Haettu data
*/
const fetchCountryData = async (countryCode) => {
  const apiKey = import.meta.env.VITE_API_KEY; /* API-avain ympäristömuuttuja */
  const response = await fetch('https://api.ember-climate.org/v1/electricity-generation/yearly?' +
    'entity_code=' + countryCode +
    '&is_aggregate_series=false' +
    '&start_date=2023' +
    '&api_key=' + apiKey)

  const jsonData = await response.json()
  return jsonData.data
}

export { fetchCountryData }