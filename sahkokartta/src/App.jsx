import { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent'
import './sahkokartta.css'
import CountryData from './components/CountryData';

const App = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  /**
   * Päivittää valitun maan tiedot
   */
  useEffect(() => {
    if (selectedCountry) {
      console.log('Valittu maa päivittyy:', selectedCountry);
    } 
  },  [selectedCountry]);

  return (
    <>
      <h1>Sähkökartta</h1>
      <MapComponent setSelectedCountry={setSelectedCountry}/>
      {selectedCountry &&
        <CountryData selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}/>
      }
    </>
  )
}

export default App
