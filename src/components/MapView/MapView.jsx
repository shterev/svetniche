import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Box } from '@mui/material'
import L from 'leaflet'
import './MapView.css'

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

// Chepintsi village coordinates (Chepintsi 1554, Bulgaria)
const CHEPINTSI_CENTER = [42.7050, 23.7250]
const DEFAULT_ZOOM = 15

const MapView = () => {
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={CHEPINTSI_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <Marker position={CHEPINTSI_CENTER}>
          <Popup>
            <strong>Село Чепинци, България</strong>
            <br />
            Chepintsi Village, Bulgaria
            <br />
            <em>Начална точка за доклади</em>
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  )
}

export default MapView
