/**
* Palautta värin hex-koodin arvon suuruuden perusteella
* @param {*} value 
* @returns hex-koodi
*/
export const getColorHex = (value) => {
    return value > 500 ? '#B71C1C' :
      value > 200 ? '#FC4E2A' :
        value > 100 ? '#FD8D3C' :
          value > 50 ? '#FEB24C' :
            '#FFEDA0'
  }