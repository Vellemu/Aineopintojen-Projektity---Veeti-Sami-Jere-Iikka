import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';

import geoData from '../geoJson/CNTR_RG_60M_2020_4326.json';

/**
 * TODO: Näyttää yhdestä maasta enemmän dataa
 * TODO: Kaavioita, diagrammeja, yms.
 */
const Country = () => {
  const countryCode = useParams().countryCode.toUpperCase()
  const [country, setCountry] = useState('')

  useEffect(() => {
    // TODO: Parempi tapa?
    // Haetaan maan nimi maakoodin perusteella
    const countryName = geoData.features.filter(
      feature => feature.properties.ISO3_CODE.toUpperCase() === countryCode)[0].properties.NAME_ENGL
    setCountry(countryName)
  }, [countryCode])

  return (
    <div>
      <h1>{country} <Link to='/'>Takaisin karttaan</Link></h1>
    </div>
  )
}

export default Country