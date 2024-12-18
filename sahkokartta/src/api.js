
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

const fetctPieChart = async (countryCode, periodization, params) => {
  const apiKey = import.meta.env.VITE_API_KEY; /* API-avain ympäristömuuttuja */
  let startDate, endDate;

  if (periodization === "monthly") {
    const { year, month } = params;
    startDate = `${year}-${String(month).padStart(2, '0')}`; // Format as YYYY-MM
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}`; // Next month
  } else if (periodization === "yearly") {
    const year = params;
    startDate = `${year}`; // Start of the year
    endDate = `${year}`; // End of the year
  }
  const response = await fetch('https://api.ember-climate.org/v1/electricity-generation/' + 
    periodization+ '?' +
    'entity_code=' + countryCode +
    '&is_aggregate_series=false' +
    '&start_date=' + startDate  +
    '&end_date=' + endDate  +
    '&api_key=' + apiKey)

  const jsonData = await response.json()
  return jsonData.data
}

/**
 * Hakee kaikkien maiden päästöintensiteetin vuonna 2023
 * @returns json data
 */
const fetchEmissionsData = async () => {
  const response = await fetch(`https://api.ember-energy.org/v1/carbon-intensity/yearly?is_aggregate_entity=false&start_date=2023&end_date=2023&include_all_dates_value_range=false&api_key=${apiKey}`)
  const jsonData = await response.json()
  
  return jsonData.data
}

/**
 * Hakee jokaisen maan tiedot uusiutuvan energian tuotannosta
 * @returns json data
 */
const fetchRenewables = async () => {
  const response = await fetch(`https://api.ember-energy.org/v1/electricity-generation/yearly?is_aggregate_entity=false&start_date=2023&end_date=2023&series=Renewables&is_aggregate_series=true&include_all_dates_value_range=false&api_key=${apiKey}`)
  const jsonData = await response.json()

  return jsonData.data
}

/**
 * Hakee jokaisen maan tiedot puhtaan energian tuotannosta
 * @returns json data
 */
const fetchClean = async () => {
  const response = await fetch(`https://api.ember-energy.org/v1/electricity-generation/yearly?is_aggregate_entity=false&start_date=2023&end_date=2023&series=clean&is_aggregate_series=true&include_all_dates_value_range=false&api_key=${apiKey}`)
  const jsonData = await response.json()

  console.log(jsonData.data)

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

export { fetchCountryElectricityData, fetchChartData, fetchEmissionsData, fetchClean, fetchRenewables }

export { fetctPieChart }