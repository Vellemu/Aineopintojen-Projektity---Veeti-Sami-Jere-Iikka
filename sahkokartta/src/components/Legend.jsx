import { useEffect } from "react"
import { useMap } from "react-leaflet"
import L from 'leaflet'
import { useCountry } from "../hooks/useCountry"


const percentageLegend = () => {
  const div = L.DomUtil.create('div', 'info legend')
  const grades = [0, 20, 40, 60, 80]

  grades.forEach((grade, i) => {
    const colorBox = L.DomUtil.create('i', 'colorBox', div)
    const g = grade + 1
    colorBox.style.backgroundColor = 
      g > 80 ? '#228B22' :
        g > 60 ? '#9ACD32' :
          g > 40 ? '#FFD700' :
            g > 20 ? '#FF4500' :
              '#8B0000'
    const text = document.createTextNode(
      `${grade}${grades[i + 1] ? ` - ${grades[i + 1]}` : ' - 100'}`
    )

    div.appendChild(colorBox)
    div.appendChild(text)

    if (i < grades.length - 1) {
      div.appendChild(document.createElement('br'))
    }
  })

  return div
}

/**
 * Lisää karttaan selitteen väriskaalalle
 * TODO: Kaikille karttatasoille oma legend
 */
const Legend = () => {
  const map = useMap()
  const { layer } = useCountry()

  useEffect(() => {
    console.log(map)
    console.log(layer)

    const legend = L.control({ position: 'bottomleft' })

    legend.onAdd = () => {
      if (layer !== 'Carbon intensity') {
        return percentageLegend()
      }

      const div = L.DomUtil.create('div', 'info legend')
      const grades = [0, 50, 100, 200, 300, 500]

      const x = L.DomUtil.create('p', 'yksikko')
      x.textContent = '(gco2/kwh)'
      div.appendChild(x)

      grades.forEach((grade, i) => {
        const colorBox = L.DomUtil.create('i', 'colorBox', div)
        const g = grade + 1
        colorBox.style.backgroundColor = g > 500 ? '#8B0000' :
        g > 300 ? '#B71C1C':
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
  }, [map, layer])
}

export default Legend