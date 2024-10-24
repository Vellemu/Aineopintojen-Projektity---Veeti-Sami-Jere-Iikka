/* eslint-disable react/prop-types */
const CountryData = ({ selectedCountry, setSelectedCountry, selectedCountryData }) => {

  /**
   * Sulkee valitun maan tiedot
   */
  const handleClose = () => {
    setSelectedCountry(null);
  };

  console.log(selectedCountryData)

  return (
    <>
      <div id="info-container" className="info-container">
        <button className="close-button" onClick={handleClose}>X</button>
        <h2> Information about {selectedCountry.NAME_ENGL}</h2>
        <ul>
          <li>
            <div> {/*<div> {selectedCountryData.tuotantomäärä} </div>*/}  </div>
            <div>  </div>
          </li>
        </ul>
      </div>
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