import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { useCountry } from './hooks/useCountry';
//import CountryData from './components/CountryData';
//import MapComponent from './components/MapComponent'
import Country from './components/Country';
import EmissionsMap from './components/EmissionsMap';

import './sahkokartta.css'

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
            <EmissionsMap />
            {/*<MapComponent />
            {selectedCountry &&
              <CountryData />
            }*/}
          </>
        } />
        <Route path='/countries/:countryCode' element={<Country />} />
      </Routes>
    </Router>
  )
}

export default App
