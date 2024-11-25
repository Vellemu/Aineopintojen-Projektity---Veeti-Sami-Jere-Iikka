
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

const fetchChartData = async (countryCode, periodization, year) => {
  const apiKey = import.meta.env.VITE_API_KEY; /* API-avain ympäristömuuttuja */
  var startYear = 2000;
  var endYear = 2024;
  if(periodization === "monthly") {
    startYear = year;
    endYear = startYear + 1;
  }
  const response = await fetch('https://api.ember-climate.org/v1/electricity-generation/' + 
    periodization+ '?' +
    'entity_code=' + countryCode +
    '&is_aggregate_series=false' +
    '&start_date=' + startYear  +
    '&end_date=' + endYear  +
    '&api_key=' + apiKey)

  const jsonData = await response.json()
  return jsonData.data
}

export { fetchCountryElectricityData }
export { fetchChartData }