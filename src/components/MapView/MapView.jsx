import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import { Box, Snackbar, Alert, Button, TextField, CircularProgress } from '@mui/material'
import L from 'leaflet'
import { fetchMarkers, createMarker, deleteMarker } from '../../utils/markers'
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

// Define boundaries for Chepintsi village with comfortable margin
const CHEPINTSI_BOUNDS = [
  [42.745, 23.410],  // Southwest corner
  [42.773, 23.443]   // Northeast corner
]

// Maximum distance from center in kilometers (1.5km comfortable radius)
const MAX_DISTANCE_KM = 1.5

// Calculate distance between two coordinates in kilometers
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

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

// Component to handle click/tap events for adding markers
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng)
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
  const [editingMarkerId, setEditingMarkerId] = useState(null)
  const [editingAddress, setEditingAddress] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Load markers from Supabase on mount
  useEffect(() => {
    const loadMarkers = async () => {
      const { data, error } = await fetchMarkers()
      if (error) {
        console.error('Failed to load markers from Supabase:', error)
        setError('Грешка при зареждане на маркерите')
        setSnackbarOpen(true)
      } else if (data) {
        // Mark all loaded markers as saved
        const savedMarkers = data.map(marker => ({ ...marker, isSaved: true }))
        setUserMarkers(savedMarkers)
      }
    }

    loadMarkers()
  }, [])

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

  // Handle map click to add marker (not saved yet)
  const handleMapClick = async (latlng) => {
    // Check if the marker is within allowed area
    const distance = calculateDistance(
      latlng.lat,
      latlng.lng,
      CHEPINTSI_CENTER[0],
      CHEPINTSI_CENTER[1]
    )

    if (distance > MAX_DISTANCE_KM) {
      setError(`Маркерът трябва да е в района на Чепинци (в радиус от ${MAX_DISTANCE_KM} км)`)
      setSnackbarOpen(true)
      return
    }

    const tempId = `temp-${Date.now()}`

    // Add unsaved marker to UI with loading address
    const tempMarker = {
      id: tempId,
      lat: latlng.lat,
      lng: latlng.lng,
      createdAt: new Date().toISOString(),
      address: 'Зареждане...',
      isSaved: false // Not saved to database yet
    }
    setUserMarkers(prev => [...prev, tempMarker])

    // Automatically open editing mode for the new marker
    setEditingMarkerId(tempId)
    setEditingAddress('Зареждане...')

    // Fetch address in background
    const address = await fetchAddress(latlng.lat, latlng.lng)

    // Update marker with fetched address (still not saved to DB)
    setUserMarkers(prev =>
      prev.map(marker =>
        marker.id === tempId
          ? { ...marker, address }
          : marker
      )
    )

    // Also update the editing address if this marker is still being edited
    setEditingAddress(address)
  }

  // Handle marker drag end - fetch new address
  const handleMarkerDragEnd = async (markerId, newPosition) => {
    // Update position and set loading address
    setUserMarkers(prev =>
      prev.map(marker =>
        marker.id === markerId
          ? { ...marker, lat: newPosition.lat, lng: newPosition.lng, address: 'Зареждане...' }
          : marker
      )
    )

    // If this marker is being edited, update the editing address too
    if (editingMarkerId === markerId) {
      setEditingAddress('Зареждане...')
    }

    // Fetch new address for the new position
    const address = await fetchAddress(newPosition.lat, newPosition.lng)

    setUserMarkers(prev =>
      prev.map(marker =>
        marker.id === markerId
          ? { ...marker, address }
          : marker
      )
    )

    // Update editing address if this marker is still being edited
    if (editingMarkerId === markerId) {
      setEditingAddress(address)
    }
  }

  // Save marker to Supabase
  const handleSaveMarker = async (marker) => {
    // Validate marker is still within bounds before saving
    const distance = calculateDistance(
      marker.lat,
      marker.lng,
      CHEPINTSI_CENTER[0],
      CHEPINTSI_CENTER[1]
    )

    if (distance > MAX_DISTANCE_KM) {
      setError(`Маркерът е твърде далеч от Чепинци. Моля, преместете го в района на селото.`)
      setSnackbarOpen(true)
      return
    }

    setIsSaving(true)

    const { data: savedMarker, error: saveError } = await createMarker({
      lat: marker.lat,
      lng: marker.lng,
      address: editingAddress || marker.address
    })

    setIsSaving(false)

    if (saveError) {
      console.error('Failed to save marker:', saveError)
      setError('Грешка при запазване на маркер')
      setSnackbarOpen(true)
      return
    }

    // Replace unsaved marker with saved one
    setUserMarkers(prev =>
      prev.map(m =>
        m.id === marker.id
          ? { ...savedMarker, isSaved: true }
          : m
      )
    )

    // Clear editing state
    setEditingMarkerId(null)
    setEditingAddress('')
  }

  // Remove marker by ID
  const handleRemoveMarker = async (marker) => {
    // If marker is not saved yet, just remove from state
    if (!marker.isSaved) {
      setUserMarkers(prev => prev.filter(m => m.id !== marker.id))
      setEditingMarkerId(null)
      setEditingAddress('')
      return
    }

    // If marker is saved, delete from Supabase
    const { success, error } = await deleteMarker(marker.id)

    if (error) {
      console.error('Failed to delete marker:', error)
      setError('Грешка при изтриване на маркер')
      setSnackbarOpen(true)
      return
    }

    if (success) {
      setUserMarkers(prev => prev.filter(m => m.id !== marker.id))
    }
  }

  // Handle popup open for editing
  const handleMarkerClick = (marker) => {
    if (!marker.isSaved) {
      setEditingMarkerId(marker.id)
      setEditingAddress(marker.address)
    }
  }

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={CHEPINTSI_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        maxBounds={CHEPINTSI_BOUNDS}
        maxBoundsViscosity={0.7}
        minZoom={15}
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
            draggable={!marker.isSaved}
            eventHandlers={{
              click: () => handleMarkerClick(marker),
              dragend: (e) => {
                if (!marker.isSaved) {
                  const newPos = e.target.getLatLng()
                  handleMarkerDragEnd(marker.id, newPos)
                }
              }
            }}
            icon={L.icon({
              iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                <svg fill="${marker.isSaved ? '#F44336' : '#FF9800'}" height="77" width="77" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M375.1,157.988c-4.599-17.701-19.224-32.168-38.458-39.895V104c0-14.908-10.248-27.466-24.069-31.004 c0.041-0.327,0.069-0.658,0.069-0.996c0-39.701-32.299-72-72-72s-72,32.299-72,72v81.376c-9.311,3.303-16,12.195-16,22.624v320h-8 c-4.418,0-8,3.582-8,8s3.582,8,8,8h64c4.418,0,8-3.582,8-8s-3.582-8-8-8h-8V176c0-10.429-6.689-19.321-16-22.624V72 c0-30.878,25.122-56,56-56s56,25.122,56,56c0,0.338,0.028,0.669,0.069,0.996C282.89,76.534,272.643,89.092,272.643,104v14.094 c-19.234,7.726-33.858,22.194-38.458,39.895c-0.623,2.396-0.101,4.947,1.415,6.906c1.515,1.959,3.852,3.106,6.328,3.106h30.715 c0,17.645,14.355,32,32,32s32-14.355,32-32h30.715c2.477,0,4.813-1.147,6.328-3.106C375.201,162.935,375.723,160.385,375.1,157.988z M176.643,168c4.411,0,8,3.589,8,8v256h-16V176C168.643,171.589,172.231,168,176.643,168z M168.643,496v-48h16v48H168.643z M288.643,104c0-8.822,7.178-16,16-16s16,7.178,16,16v9.468c-5.171-0.957-10.529-1.468-16-1.468s-10.829,0.511-16,1.468V104z M304.643,184c-8.822,0-16-7.178-16-16h32C320.643,176.822,313.465,184,304.643,184z M254.068,152c9.116-14.357,28.628-24,50.575-24 s41.458,9.643,50.575,24H254.068z" stroke="white" stroke-width="8"/>
                </svg>
              `),
              iconSize: [77, 77],
              iconAnchor: [39, 72],
              popupAnchor: [0, -72]
            })}
          >
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '200px' }}>
                <strong>{marker.isSaved ? 'Доклад за проблем' : 'Нов доклад'}</strong>
                <br />

                {!marker.isSaved && editingMarkerId === marker.id ? (
                  // Editable mode for unsaved markers
                  <>
                    <TextField
                      fullWidth
                      size="small"
                      label="Адрес"
                      value={editingAddress}
                      onChange={(e) => setEditingAddress(e.target.value)}
                      sx={{ mt: 1, mb: 1 }}
                      multiline
                      rows={2}
                    />
                    <small style={{ color: '#666', display: 'block', marginBottom: '8px' }}>
                      {marker.address === 'Зареждане...' ? 'Зареждане на адрес...' : 'Можете да редактирате адреса'}
                    </small>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSaveMarker(marker)
                        }}
                        disabled={isSaving || marker.address === 'Зареждане...'}
                        startIcon={isSaving ? <CircularProgress size={16} /> : null}
                      >
                        {isSaving ? 'Запазване...' : 'Запази'}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveMarker(marker)
                        }}
                        disabled={isSaving}
                      >
                        Откажи
                      </Button>
                    </Box>
                    <small style={{ color: '#999', display: 'block', marginTop: '8px', fontSize: '0.75em' }}>
                      Може да преместите маркера
                    </small>
                  </>
                ) : (
                  // Read-only mode for saved markers
                  <>
                    {marker.address && (
                      <div style={{
                        margin: '8px 0',
                        padding: '8px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        fontSize: '0.9em'
                      }}>
                        {marker.address}
                      </div>
                    )}
                    {marker.createdAt && (
                      <small style={{ color: '#666', display: 'block', marginBottom: '8px' }}>
                        {new Date(marker.createdAt).toLocaleString('bg-BG')}
                      </small>
                    )}
                    {marker.isSaved && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveMarker(marker)
                        }}
                        sx={{ mt: 1 }}
                      >
                        Изтрий
                      </Button>
                    )}
                  </>
                )}
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
