
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

export { fetchCountryElectricityData }
export { fetctPieChart }