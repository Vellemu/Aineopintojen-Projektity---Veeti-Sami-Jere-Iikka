import { useEffect } from "react"
import { getColorHex } from "../utils"
import { useMap } from "react-leaflet"
import L from 'leaflet'

/**
 * Lisää karttaan selitteen väriskaalalle
 */
const Legend = () => {
  const map = useMap()

  useEffect(() => {
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
        colorBox.style.backgroundColor = getColorHex(g)

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