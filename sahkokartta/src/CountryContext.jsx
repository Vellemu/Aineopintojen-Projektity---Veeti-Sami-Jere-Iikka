import { createContext, useState } from 'react';
import { fetchCountryElectricityData, fetchEmissionsData } from './api';

export const CountryContext = createContext({
  selectedMap: 'energyTrade',
  selectedCountry: null,
  emissionsData: []
})
export const CountryDispatchContext = createContext(null)

// eslint-disable-next-line react/prop-types
export const CountryDataProvider = ({ children }) => {
  const [countryElectricityGeneration, setCountryElectricityGeneration] = useState([])
  const [carbonIntensity, setCarbonIntensity] = useState([])
  const [selectedCountry, setCountry] = useState(null)
  const [selectedMap, setSelectedMap] = useState('energyTrade')

  const setSelectedCountry = (country) => {
    setCountry(country)
  }

  const toggleMap = () => {
    console.log(selectedMap)
    if (selectedMap === 'energyTrade') {
      console.log('setting map to emissions')
      setSelectedMap('emissions')
    } else {
      console.log('setting map to trade')
      setSelectedMap('energyTrade')
    }
  }

  const getCarbonIntensityData = async () => {
    try {
      const data = await fetchEmissionsData()
      console.log(data)
      setCarbonIntensity(data)
    } catch (error) {
      console.error(error)
    }
  }

  const getCountryData = async (countryCode) => {
    try {
      const data = await fetchCountryElectricityData(countryCode)
      console.log(data)
      setCountryElectricityGeneration(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <CountryContext.Provider
      value={{
        getCountryData,
        countryElectricityGeneration,
        selectedCountry,
        setSelectedCountry,
        getCarbonIntensityData,
        carbonIntensity,
        toggleMap,
        selectedMap
      }}>
      {children}
    </CountryContext.Provider>
  )
}