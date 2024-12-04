import { useEffect } from "react"
import { useMap } from "react-leaflet"
import L from 'leaflet'
//import { useCountry } from "../hooks/useCountry"


/**
 * Lisää karttaan selitteen väriskaalalle
 * TODO: Kaikille karttatasoille oma legend
 */
const Legend = () => {
  const map = useMap()
  //const { layer } = useCountry()

  useEffect(() => {
    //console.log(map.layer.name)
    const legend = L.control({ position: 'bottomleft' })

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend')
      const grades = [0, 50, 100, 200, 500]

      const x = L.DomUtil.create('p', 'yksikko')
      x.textContent = '(gco2/kwh)'
      div.appendChild(x)

      grades.forEach((grade, i) => {
        const colorBox = L.DomUtil.create('i', 'colorBox', div)
        const g = grade + 1
        colorBox.style.backgroundColor = g > 500 ? '#B71C1C' :
          g > 200 ? '#FC4E2A' :
            g > 100 ? '#FD8D3C' :
              g > 50 ? '#FEB24C' :
                '#FFEDA0'

        const text = document.createTextNode(
          `${grade}${grades[i + 1] ? ` - ${grades[i + 1]}` : '+'}`
        )

        div.appendChild(colorBox)
        div.appendChild(text)

        if (i < grades.length - 1) {
          div.appendChild(document.createElement('br'))
        }
      })

      return div
    }

    legend.addTo(map)

    return () => legend.remove()
  }, [map])
}

export default Legend