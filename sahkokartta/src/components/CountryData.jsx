import { Link } from "react-router-dom";
import { useCountry } from "../hooks/useCountry";
import { useEffect } from "react";
/* eslint-disable react/prop-types */
  const CountryData = () => {
    const { countryElectricityGeneration, selectedCountry, setSelectedCountry } = useCountry()
  /**
   * Sulkee valitun maan tiedot
   */
  const handleClose = () => {
    setSelectedCountry(null);
  };

  useEffect(() => {
    console.log(selectedCountry)
  }, [selectedCountry])

// Kokonaistuotanto 
const totalGeneration = countryElectricityGeneration
? countryElectricityGeneration.reduce((total, country) => total + (country.generation_twh || 0), 0)
: 0;

const netImportData = countryElectricityGeneration.find(
  (data) => data.series === "Net imports"
);
const netImport = netImportData ? netImportData.generation_twh : 0;
// poistaa netImportin
const adjustedTotalGeneration = totalGeneration - netImport;

// uusiutuvat energialähteet
const bioenergyData = countryElectricityGeneration.find(
  (data) => data.series === "Bioenergy"
);
const solarData = countryElectricityGeneration.find(
  (data) => data.series === "Solar"
);
const hydroData = countryElectricityGeneration.find(
  (data) => data.series === "Hydro"
);
const windData = countryElectricityGeneration.find(
  (data) => data.series === "Wind"
);
const OtherData = countryElectricityGeneration.find(
  (data) => data.series === "Other renewables"
);

const bioenergyGeneration = bioenergyData ? bioenergyData.generation_twh : 0;
const solarGeneration = solarData ? solarData.generation_twh : 0;
const HydroGeneration = hydroData ? hydroData.generation_twh : 0;
const WindGeneration = windData ? windData.generation_twh : 0;
const OtherGeneration = OtherData ? OtherData.generation_twh : 0;

const combinedRenewable = bioenergyGeneration + solarGeneration + HydroGeneration + WindGeneration + OtherGeneration;
const combinedRenewablepercentage = adjustedTotalGeneration ? (combinedRenewable/adjustedTotalGeneration)*100 : 0;


  return (
    <>
      {countryElectricityGeneration && <div id="info-container" className="info-container">
        <button className="close-button" onClick={handleClose}>X</button>
        <h2 style={{alignContent: "center"}}>
          {/* {`Information about `}   */}
          <Link
            to={`/countries/${selectedCountry.ISO3_CODE}`}
            title={`Opens a page with charts about energy generation in ${selectedCountry.NAME_ENGL}`}
            >{selectedCountry.NAME_ENGL}
            <img src={`https://flagsapi.com/${selectedCountry.CNTR_ID}/flat/64.png`} className="info-flag" style={{display: "block"}}></img>
          </Link>
          {` Generation by method in 2023:`} 
        </h2>
        <ul>
          {countryElectricityGeneration.map(country => {
            return (
              <li key={country.series}>
                {country.series}: {country.generation_twh} TWh
              </li>
            )
          })}
        </ul>
        <div>
          <strong>Total Generation:</strong> {adjustedTotalGeneration.toFixed(2)} TWh
        </div>
        <div>
          <strong>Net import:</strong> {netImport.toFixed(2)} TWh
        </div>
        <div>
          <strong>Renewable percentage:</strong> {combinedRenewablepercentage.toFixed(2)} %
        </div>
      </div> }
    </>
  )
}

export default CountryData

/*
{Object.entries(selectedCountry).map(([key, value]) => (
            <li key={key}>
              <strong>{key}</strong>: {value}
            </li>
          ))}
*/