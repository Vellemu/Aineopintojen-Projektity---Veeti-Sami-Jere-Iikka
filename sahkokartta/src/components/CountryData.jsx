/* eslint-disable react/prop-types */
const CountryData = ({ selectedCountry, setSelectedCountry }) => {

  /**
   * Sulkee valitun maan tiedot
   */
  const handleClose = () => {
    setSelectedCountry(null);
  };

  return (
    <>
      <div id="info-container" className="info-container">
        <button className="close-button" onClick={handleClose}>X</button>
        <h2> Information about {selectedCountry.NAME_ENGL}</h2>
        <ul>
          {Object.entries(selectedCountry).map(([key, value]) => (
            <li key={key}>
              <strong>{key}</strong>: {value}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default CountryData