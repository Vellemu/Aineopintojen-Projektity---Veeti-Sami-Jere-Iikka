import { LayerGroup, LayersControl } from 'react-leaflet'

const Layers = () => {
  return (
    <LayersControl position='topright'>
      <LayersControl.BaseLayer checked name='testi'>
        <LayerGroup>

        </LayerGroup>
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name='aaaaaaaa'>
        <LayerGroup>

        </LayerGroup>
      </LayersControl.BaseLayer>
    </LayersControl>
  )
}

export default Layers