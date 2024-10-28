import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import MapComponent from './components/MapComponent'
import './sahkokartta.css'
import CountryData from './components/CountryData';
import Country from './components/Country';
import { fetchCountryData } from './api';

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
  }, [selectedCountry]);

  const getCountryData = async (countryCode) => {
    try {
      const data = await fetchCountryData(countryCode)
      setSelectedCountryData(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Router>
      <h1>Sähkökartta</h1>
      <Routes>
        <Route path='/' element={
          <>
          <MapComponent setSelectedCountry={setSelectedCountry} getCountryData={getCountryData} />
          {selectedCountry &&
            <CountryData
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedCountryData={selectedCountryData}
            />
          }
          </>
        }/>
        <Route path='/countries/:countryCode' element={<Country />}/>
      </Routes>
    </Router>
  )
}

export default App
