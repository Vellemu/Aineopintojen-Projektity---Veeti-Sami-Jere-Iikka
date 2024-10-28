import { Link } from "react-router-dom";
import { useCountry } from "../hooks/useCountry";

/* eslint-disable react/prop-types */
const CountryData = ({ selectedCountry, setSelectedCountry }) => {
  const { countryElectricityGeneration } = useCountry()
  /**
   * Sulkee valitun maan tiedot
   */
  const handleClose = () => {
    setSelectedCountry(null);
  };

  return (
    <>
      {countryElectricityGeneration && <div id="info-container" className="info-container">
        <button className="close-button" onClick={handleClose}>X</button>
        <h2>
          Information about {selectedCountry.NAME_ENGL}
          <Link to={`/countries/${selectedCountry.ISO3_CODE}`}>Linkki</Link>
        </h2>
        <ul>
          {countryElectricityGeneration.map(country => {
            return (
              <li key={country.series}>
                {country.series}
              </li>
            )
          })}
        </ul>
      </div>}
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