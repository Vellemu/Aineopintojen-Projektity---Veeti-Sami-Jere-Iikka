import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useCountry } from '../hooks/useCountry';
import React, { PureComponent } from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import geoData from '../geoJson/CNTR_RG_60M_2020_4326.json';
import PercentAreaChart from './PercentAreaChart';
import { useCountry } from "../hooks/useCountry";
import PieChartComponent from './PieChartComponent';

/**
 * TODO: Näyttää yhdestä maasta enemmän dataa
 * TODO: Kaavioita, diagrammeja, yms.
 */
const Country = () => {
  const countryCode = useParams().countryCode.toUpperCase()
  const [country, setCountry] = useState('')
  const { selectedCountry, countryElectricityGeneration ,getCountryData} = useCountry()

  useEffect(() => {

    // TODO: Parempi tapa?
    // Haetaan maan nimi maakoodin perusteella
    const countryName = geoData.features.filter(
      feature => feature.properties.ISO3_CODE.toUpperCase() === countryCode)[0].properties.NAME_ENGL

      const getData = async() => {
      await getCountryData(countryName)
    }
    
    if (!countryElectricityGeneration || countryElectricityGeneration.lenght < 1){
      getData()
    }

    setCountry(countryName)

    console.log(selectedCountry)
    console.log(countryElectricityGeneration)
    
  }, [countryCode, getCountryData, countryElectricityGeneration])

const dataElectric = countryElectricityGeneration.map((item) => {
  return {
    name: item.series,
    value: item.generation_twh,
  };
});
  
  return (
    <>
      <>
    <div>
        <h1>{country} <Link to='/'>Takaisin karttaan</Link></h1>
      
    </div>
    <div className="piechart-container">
      <PieChartComponent countryCode={countryCode} />
    </div>
      <div className='areachart-container'>
        <PercentAreaChart countryCode={countryCode} />
      </div>
    </>
    </>
    
  )
}

export default Country