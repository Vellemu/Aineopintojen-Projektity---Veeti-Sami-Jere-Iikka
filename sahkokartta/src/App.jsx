import { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent'
import './sahkokartta.css'
import CountryData from './components/CountryData';

const App = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryData, setSelectedCountryData] = useState([])

  /**
   * Päivittää valitun maan tiedot
   */
  useEffect(() => {
    if (selectedCountry) {
      console.log('Valittu maa päivittyy:', selectedCountry);
    } 
  },  [selectedCountry]);

  /**
   * Hakee API:n kautta valitun maan dataa 
   * @param {string} countryCode
   */
  function getCountryData(countryCode) {
    const apiKey = import.meta.env.VITE_API_KEY; /* API-avain ympäristömuuttuja */

    fetch('https://api.ember-climate.org/v1/electricity-generation/yearly?' + 
      'entity_code='+ countryCode +
      '&is_aggregate_series=false'+
      '&start_date=2023' +
      '&api_key=' + apiKey)
      .then(response => response.json())
      .then(data => setSelectedCountryData(data.data))
      .catch(error => console.error(error));
  }

  return (
    <>
      <h1>Sähkökartta</h1>
      <MapComponent setSelectedCountry={setSelectedCountry} getCountryData={getCountryData}/>
      {selectedCountry &&
        <CountryData 
        selectedCountry={selectedCountry} 
        setSelectedCountry={setSelectedCountry}
        selectedCountryData={selectedCountryData}
        />
      }
    </>
  )
}

export default App
