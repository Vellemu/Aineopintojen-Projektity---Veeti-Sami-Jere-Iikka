import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import MapComponent from './components/MapComponent'
import './sahkokartta.css'
import CountryData from './components/CountryData';
import Country from './components/Country';
import { useCountry } from './hooks/useCountry';

const App = () => {
  const { selectedCountry } = useCountry()

  /**
   * Päivittää valitun maan tiedot
   */
  useEffect(() => {
    if (selectedCountry) {
      console.log('Valittu maa päivittyy:', selectedCountry);
    }
  }, [selectedCountry]);

  return (
    <Router>
      <h1>Sähkökartta</h1>
      <Routes>
        <Route path='/' element={
          <>
            <MapComponent />
            {selectedCountry &&
              <CountryData />
            }
          </>
        } />
        <Route path='/countries/:countryCode' element={<Country />} />
      </Routes>
    </Router>
  )
}

export default App
