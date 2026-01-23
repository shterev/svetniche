import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Box, Snackbar, Alert } from '@mui/material'
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
// Source: 42.7594788°N, 23.4286263°E - Chepintsi, Sofia City Province
const CHEPINTSI_CENTER = [42.758914, 23.426287]
const DEFAULT_ZOOM = 18
const USER_LOCATION_ZOOM = 18

// Component to handle map control and geolocation
const MapController = ({ userLocation, shouldFlyTo }) => {
  const map = useMap()

  useEffect(() => {
    if (userLocation && shouldFlyTo) {
      map.flyTo(userLocation, USER_LOCATION_ZOOM, {
        duration: 1.5
      })
    }
  }, [map, userLocation, shouldFlyTo])

  return null
}

const MapView = forwardRef((props, ref) => {
  const [userLocation, setUserLocation] = useState(null)
  const [shouldFlyTo, setShouldFlyTo] = useState(false)
  const [error, setError] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Геолокацията не се поддържа от вашия браузър')
      setSnackbarOpen(true)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = [position.coords.latitude, position.coords.longitude]
        setUserLocation(location)
        setShouldFlyTo(true)
        setError(null)
      },
      (error) => {
        let errorMessage = 'Не може да се определи вашата локация'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Моля, разрешете достъп до локацията в настройките на браузъра'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Информацията за местоположение не е налична'
            break
          case error.TIMEOUT:
            errorMessage = 'Заявката за местоположение изтече'
            break
        }
        
        setError(errorMessage)
        setSnackbarOpen(true)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  // Auto-detect location on mount if available
  useEffect(() => {
    if (navigator.geolocation) {
      // Try to get location automatically on load
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude]
          setUserLocation(location)
          setShouldFlyTo(true)
        },
        () => {
          // Silently fail on auto-detect, user can click button manually
          console.log('Auto-location detection skipped')
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 60000 // Accept cached location up to 1 minute old
        }
      )
    }
  }, [])

  // Expose method to parent component via ref
  useImperativeHandle(ref, () => ({
    locateUser: getUserLocation
  }))

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

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
        
        {/* Village center marker */}
        <Marker position={CHEPINTSI_CENTER}>
          <Popup>
            <strong>Село Чепинци, България</strong>
            <br />
            Chepintsi Village, Bulgaria
            <br />
            <em>Начална точка за доклади</em>
          </Popup>
        </Marker>

        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={userLocation}
            icon={L.icon({
              iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                  <circle cx="12" cy="12" r="10" fill="#2196F3" stroke="white" stroke-width="3"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              `),
              iconSize: [32, 32],
              iconAnchor: [16, 16],
              popupAnchor: [0, -16]
            })}
          >
            <Popup>
              <strong>Вашата локация</strong>
              <br />
              Your current location
            </Popup>
          </Marker>
        )}

        <MapController userLocation={userLocation} shouldFlyTo={shouldFlyTo} />
      </MapContainer>

      {/* Error notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
})

MapView.displayName = 'MapView'

export default MapView
