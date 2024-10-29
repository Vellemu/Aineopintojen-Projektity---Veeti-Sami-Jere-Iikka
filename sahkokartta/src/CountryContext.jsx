import { createContext, useState } from 'react';
import { fetchCountryElectricityData } from './api';

export const CountryContext = createContext({
  selectedCountry: null
})
export const CountryDispatchContext = createContext(null)

// eslint-disable-next-line react/prop-types
export const CountryDataProvider = ({ children }) => {
  const [countryElectricityGeneration, setCountryElectricityGeneration] = useState([])
  const [selectedCountry, setCountry] = useState(null)

  const setSelectedCountry = (country) => {
    setCountry(country)
  }

  const getCountryData = async (countryCode) => {
    try {
      const data = await fetchCountryElectricityData(countryCode)
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
        setSelectedCountry
      }}>
      {children}
    </CountryContext.Provider>
  )
}