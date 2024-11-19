import { createContext, useState } from 'react';
import { fetchCountryElectricityData, fetchEmissionsData, fetchRenewables } from './api';

export const CountryContext = createContext({
  selectedMap: 'energyTrade',
  selectedCountry: null,
  emissionsData: [],
  renewablesGeneration: []
})
export const CountryDispatchContext = createContext(null)

// eslint-disable-next-line react/prop-types
export const CountryDataProvider = ({ children }) => {
  const [countryElectricityGeneration, setCountryElectricityGeneration] = useState([])
  const [carbonIntensity, setCarbonIntensity] = useState([])
  const [renewablesGeneration, setRenewablesGeneration] = useState([])
  const [selectedCountry, setCountry] = useState(null)
  const [selectedMap, setSelectedMap] = useState('energyTrade')
  const [layer, setLayer] = useState('Carbon intensity')

  const toggleLayer = (layer) => {
    setLayer(layer)
  }

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

  const fetchRenewableGenerationData = async () => {
    try {
      const data = await fetchRenewables()
      console.log(data)
      setRenewablesGeneration(data)
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
        selectedMap,
        fetchRenewableGenerationData,
        renewablesGeneration,
        layer,
        toggleLayer
      }}>
      {children}
    </CountryContext.Provider>
  )
}