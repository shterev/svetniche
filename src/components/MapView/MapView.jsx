import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import { Box, Snackbar, Alert, Button } from '@mui/material'
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

// Component to handle long press events for adding markers
const MapClickHandler = ({ onMapClick }) => {
  const pressTimerRef = useRef(null)
  const pressPositionRef = useRef(null)
  const map = useMap()

  useEffect(() => {
    const mapContainer = map.getContainer()
    
    const handleTouchStart = (e) => {
      // Only handle single touch
      if (e.touches.length !== 1) return
      
      const touch = e.touches[0]
      const point = map.containerPointToLatLng([touch.clientX, touch.clientY])
      
      pressPositionRef.current = {
        latlng: point,
        screenX: touch.clientX,
        screenY: touch.clientY
      }
      
      pressTimerRef.current = setTimeout(() => {
        if (pressPositionRef.current) {
          onMapClick(pressPositionRef.current.latlng)
          // Provide haptic feedback if available
          if (navigator.vibrate) {
            navigator.vibrate(50)
          }
          pressTimerRef.current = null
          pressPositionRef.current = null
        }
      }, 600) // 600ms long press duration
    }
    
    const handleTouchMove = (e) => {
      if (pressTimerRef.current && pressPositionRef.current) {
        const touch = e.touches[0]
        const deltaX = Math.abs(touch.clientX - pressPositionRef.current.screenX)
        const deltaY = Math.abs(touch.clientY - pressPositionRef.current.screenY)
        
        // Cancel if finger moved more than 10 pixels
        if (deltaX > 10 || deltaY > 10) {
          clearTimeout(pressTimerRef.current)
          pressTimerRef.current = null
          pressPositionRef.current = null
        }
      }
    }
    
    const handleTouchEnd = () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current)
        pressTimerRef.current = null
        pressPositionRef.current = null
      }
    }
    
    // Add touch event listeners directly to the map container
    mapContainer.addEventListener('touchstart', handleTouchStart, { passive: true })
    mapContainer.addEventListener('touchmove', handleTouchMove, { passive: true })
    mapContainer.addEventListener('touchend', handleTouchEnd, { passive: true })
    mapContainer.addEventListener('touchcancel', handleTouchEnd, { passive: true })
    
    return () => {
      mapContainer.removeEventListener('touchstart', handleTouchStart)
      mapContainer.removeEventListener('touchmove', handleTouchMove)
      mapContainer.removeEventListener('touchend', handleTouchEnd)
      mapContainer.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [map, onMapClick])

  // Handle desktop long press
  useMapEvents({
    mousedown: (e) => {
      pressPositionRef.current = { latlng: e.latlng }
      pressTimerRef.current = setTimeout(() => {
        onMapClick(e.latlng)
        pressTimerRef.current = null
        pressPositionRef.current = null
      }, 600)
    },
    mouseup: () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current)
        pressTimerRef.current = null
        pressPositionRef.current = null
      }
    },
    mousemove: (e) => {
      if (pressTimerRef.current && pressPositionRef.current) {
        const distance = map.distance(pressPositionRef.current.latlng, e.latlng)
        if (distance > 0.0001) {
          clearTimeout(pressTimerRef.current)
          pressTimerRef.current = null
          pressPositionRef.current = null
        }
      }
    }
  })

  return null
}

const MapView = forwardRef((props, ref) => {
  const [userLocation, setUserLocation] = useState(null)
  const [shouldFlyTo, setShouldFlyTo] = useState(false)
  const [error, setError] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [userMarkers, setUserMarkers] = useState([])

  // Load markers from localStorage on mount
  useEffect(() => {
    const savedMarkers = localStorage.getItem('userMarkers')
    if (savedMarkers) {
      try {
        const markers = JSON.parse(savedMarkers)
        setUserMarkers(markers)
      } catch (error) {
        console.error('Failed to load markers from localStorage:', error)
      }
    }
  }, [])

  // Save markers to localStorage when they change
  useEffect(() => {
    if (userMarkers.length > 0) {
      localStorage.setItem('userMarkers', JSON.stringify(userMarkers))
    }
  }, [userMarkers])

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
            // On mobile, geolocation requires HTTPS (except localhost)
            const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost'
            if (!isSecure) {
              errorMessage = 'Геолокацията изисква HTTPS. Моля, използвайте https:// адреса.'
            } else {
              errorMessage = 'Моля, разрешете достъп до локацията в настройките на браузъра'
            }
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

  // Fetch address from coordinates using reverse geocoding
  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=19&addressdetails=1&accept-language=bg`,
        {
          headers: {
            'User-Agent': 'Svetniche/1.0' // Required by Nominatim
          }
        }
      )
      const data = await response.json()

      // Build address string from components
      const address = data.address || {}

      // Try to build street address with number
      if (address.road || address.street) {
        const streetName = address.road || address.street
        if (address.house_number) {
          return `${streetName} ${address.house_number}`
        } else {
          return streetName
        }
      }

      // If no street info available, show neighbourhood or similar
      if (address.neighbourhood) return address.neighbourhood
      if (address.hamlet) return address.hamlet
      if (address.suburb) return address.suburb

      // Last resort
      return 'Няма адресна информация'
    } catch (error) {
      console.error('Failed to fetch address:', error)
      return 'Грешка при зареждане'
    }
  }

  // Handle map click to add marker
  const handleMapClick = async (latlng) => {
    const markerId = Date.now()

    // Add marker immediately with loading address
    const newMarker = {
      id: markerId,
      lat: latlng.lat,
      lng: latlng.lng,
      createdAt: new Date().toISOString(),
      address: 'Зареждане...'
    }
    setUserMarkers(prev => [...prev, newMarker])

    // Fetch address in background
    const address = await fetchAddress(latlng.lat, latlng.lng)

    // Update marker with fetched address
    setUserMarkers(prev =>
      prev.map(marker =>
        marker.id === markerId
          ? { ...marker, address }
          : marker
      )
    )
  }

  // Remove marker by ID
  const handleRemoveMarker = (markerId) => {
    setUserMarkers(prev => {
      const updated = prev.filter(marker => marker.id !== markerId)
      // Update localStorage immediately when removing
      if (updated.length === 0) {
        localStorage.removeItem('userMarkers')
      } else {
        localStorage.setItem('userMarkers', JSON.stringify(updated))
      }
      return updated
    })
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

        {/* User-added markers */}
        {userMarkers.map(marker => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={L.icon({
              iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                  <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="#FF5722" stroke="white" stroke-width="1"/>
                </svg>
              `),
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32]
            })}
          >
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '150px' }}>
                <strong>Маркер</strong>
                <br />
                {marker.address && (
                  <>
                    <div style={{
                      margin: '8px 0',
                      padding: '4px 8px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '4px',
                      fontSize: '0.9em'
                    }}>
                      {marker.address}
                    </div>
                  </>
                )}
                <small style={{ color: '#666' }}>
                  {new Date(marker.createdAt).toLocaleString('bg-BG')}
                </small>
                <br />
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveMarker(marker.id)
                  }}
                  sx={{ mt: 1 }}
                >
                  Изтрий
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapController userLocation={userLocation} shouldFlyTo={shouldFlyTo} />
        <MapClickHandler onMapClick={handleMapClick} />
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
