/**
* Palautta värin hex-koodin arvon suuruuden perusteella
* @param {*} value 
* @returns hex-koodi
*/
export const getColorHex = (data) => {
  const value = data.emissions_intensity_gco2_per_kwh
  return value > 500 ? '#B71C1C' :
    value > 200 ? '#FC4E2A' :
      value > 100 ? '#FD8D3C' :
        value > 50 ? '#FEB24C' :
          '#FFEDA0'
}

export const renewablesAndCleanHex = (data) => {
  const pct = data.share_of_generation_pct
  return pct >= 100 ? '#006400' :
    pct > 80 ? '#228B22' :
      pct > 60 ? '#9ACD32' :
        pct > 40 ? '#FFD700' :
          pct > 20 ? '#FF4500' :
            '#8B0000'
}