import { createContext, useState } from 'react';
import { fetchCountryElectricityData, fetchEmissionsData } from './api';

export const CountryContext = createContext({
  selectedCountry: null
})
export const CountryDispatchContext = createContext(null)

// eslint-disable-next-line react/prop-types
export const CountryDataProvider = ({ children }) => {
  const [countryElectricityGeneration, setCountryElectricityGeneration] = useState([])
  const [emissionsData, setEmissionsData] = useState([])
  const [selectedCountry, setCountry] = useState(null)

  const setSelectedCountry = (country) => {
    setCountry(country)
  }

  const getEmissionsData = async () => {
    try {
      const data = await fetchEmissionsData()
      console.log(data)
      setEmissionsData(data)
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
        getEmissionsData,
        emissionsData
      }}>
      {children}
    </CountryContext.Provider>
  )
}