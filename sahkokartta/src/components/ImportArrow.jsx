import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import '@elfalem/leaflet-curve'
// Piirtää nuolet klikatusta maasta jokaiseen maahan josta klikattu maa tuo sähköä. Data Electricity_Imports.json kansiosta, minkä sisältä on täältä https://wits.worldbank.org/trade/comtrade/en/country/SWE/year/2023/tradeflow/Imports/partner/ALL/product/271600
const ImportArrow = ({ from, to, value }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !from || !to) return;

    const latlngs = [];

    // Seuraavan koodin laskutoimitukset ovat peräisin https://ryancatalani.medium.com/creating-consistently-curved-lines-on-leaflet-b59bc03fa9dc
    // Koordinaatit klikatusta maasta sen kauppakumppaniin. Koordinaattien haku on tehty MapComponent.jsx:ssä.
    const latlng1 = [from.lat, from.lng];
    const latlng2 = [to.lat, to.lng];

    // Lasketaan kaareva reitti kahden pisteen välille
    const offsetX = latlng2[1] - latlng1[1];
    const offsetY = latlng2[0] - latlng1[0];
    const r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
    const theta = Math.atan2(offsetY, offsetX);
    const thetaOffset = Math.PI / 10;
    const r2 = r / 2 / Math.cos(thetaOffset);
    const theta2 = theta + thetaOffset;
    const midpointX = r2 * Math.cos(theta2) + latlng1[1];
    const midpointY = r2 * Math.sin(theta2) + latlng1[0];
    const midpointLatLng = [midpointY, midpointX];

    // Piirtää reitin ja varmistaa, että 
    latlngs.push(latlng1, midpointLatLng, latlng2);

    const pathOptions = {
      color: 'black',
      weight: 5,
      opacity: 0.5,
    };

    // Lisää kaareva reitti kartalle
    const curvedPath = L.curve(
      [
        'M', latlng1,
        'Q', midpointLatLng,
        latlng2,
      ],
      pathOptions
    ).addTo(map);

    // Ikoni, joka näyttää sähkön määrän
    const valueIcon = L.divIcon({
      className: 'value-icon',
      html: `<div style="background: none; padding: 2px 5px;">${value + "TWh"}</div>`,
    });

    const valueMarker = L.marker(midpointLatLng, { icon: valueIcon }).addTo(map);

    // Muistihuoltoo
    return () => {
      map.removeLayer(curvedPath);
      map.removeLayer(valueMarker);
    };
  }, [map, from, to, value]);

  return null;
};

export default ImportArrow;
