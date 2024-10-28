import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import MapComponent from './components/MapComponent'
import './sahkokartta.css'
import CountryData from './components/CountryData';
import Country from './components/Country';
import { CountryDataProvider } from './CountryContext';

const App = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  /**
   * Päivittää valitun maan tiedot
   */
  useEffect(() => {
    if (selectedCountry) {
      console.log('Valittu maa päivittyy:', selectedCountry);
    }
  }, [selectedCountry]);

  return (
    <CountryDataProvider>
      <Router>
        <h1>Sähkökartta</h1>
        <Routes>
          <Route path='/' element={
            <>
              <MapComponent setSelectedCountry={setSelectedCountry} />
              {selectedCountry &&
                <CountryData
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                />
              }
            </>
          } />
          <Route path='/countries/:countryCode' element={<Country />} />
        </Routes>
      </Router>
    </CountryDataProvider>
  )
}

export default App
