# Geolocation Integration Guide

## 📍 Overview

The map now includes automatic user location detection with a manual "locate me" button. This feature helps users report issues at their current location.

## ✨ Features

### 1. **Automatic Location Detection**
- On map load, automatically requests user's location
- If permission is granted, smoothly flies to user's location
- Fails silently if permission is denied (user can click button manually)
- Uses cached location (up to 1 minute old) for faster initial load

### 2. **Manual Location Button**
- Floating action button at bottom-right corner
- Blue location icon (`MyLocation`)
- Tooltip on hover: "Моята локация"
- Click to request current location

### 3. **Visual Feedback**
- **User Location Marker**: Blue circle with white center
- **Village Center Marker**: Default red pin
- **Smooth Animation**: Map flies to location with 1.5s duration
- **Error Messages**: Bulgarian error messages via Snackbar

## 🔧 Technical Implementation

### Components

#### `MapView.jsx`
Main map component with geolocation logic:

```javascript
// Key features:
- forwardRef for parent control
- useState for location and error management
- useEffect for auto-detection on mount
- useImperativeHandle to expose locateUser method
```

#### `MapController.jsx` (Internal)
Helper component using `useMap` hook to control map position:

```javascript
const MapController = ({ userLocation, shouldFlyTo }) => {
  const map = useMap()
  // Triggers flyTo animation when location changes
}
```

### Geolocation API Configuration

```javascript
{
  enableHighAccuracy: true,  // Use GPS if available
  timeout: 10000,            // 10 second timeout
  maximumAge: 0              // Always get fresh position
}
```

### Auto-Detection Configuration (on mount)

```javascript
{
  enableHighAccuracy: true,
  timeout: 5000,             // Shorter timeout for auto-detect
  maximumAge: 60000          // Accept cached location (1 min)
}
```

## 🎨 User Location Marker

Custom SVG marker for user location:

```javascript
L.icon({
  iconUrl: 'data:image/svg+xml;base64,...',
  // Blue circle with white center
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
})
```

## 🚨 Error Handling

### Error Messages (Bulgarian)

| Error Code | Message |
|------------|---------|
| `PERMISSION_DENIED` | Моля, разрешете достъп до локацията в настройките на браузъра |
| `POSITION_UNAVAILABLE` | Информацията за местоположение не е налична |
| `TIMEOUT` | Заявката за местоположение изтече |
| Not Supported | Геолокацията не се поддържа от вашия браузър |

### Error Display
- **Snackbar**: Top-center position
- **Auto-hide**: 6 seconds
- **Severity**: Error (red)
- **Dismissible**: Yes (X button)

## 📱 Browser Permissions

### Chrome/Edge
1. Click lock icon in address bar
2. Enable "Location"
3. Refresh page

### Firefox
1. Click shield/lock icon
2. Enable "Location Access"
3. Refresh page

### Safari (iOS)
1. Settings → Safari → Location
2. Enable "While Using the App"

### Mobile Browsers
- First click triggers permission prompt
- Some browsers block auto-location without user interaction
- Always provide manual button as fallback

## 🔒 Security & Privacy

### HTTPS Requirement
- Geolocation API requires HTTPS in production
- Works on `http://localhost` for development
- Will fail on `http://` production domains

### User Consent
- Browser shows permission prompt
- Location only requested with user action or consent
- No location data is stored or sent to server (yet)

## 🧪 Testing

### Development Testing

```bash
npm run dev
```

#### Test Scenarios:

1. **Allow Location**:
   - Grant permission when prompted
   - Map should fly to your location
   - Blue marker appears at your position

2. **Deny Location**:
   - Deny permission
   - Error message appears
   - Map stays at Chepintsi center
   - Can retry by clicking button

3. **No HTTPS** (production):
   - Deploy to HTTP site
   - Geolocation will fail
   - Error message appears

4. **Slow Connection**:
   - Throttle network in DevTools
   - Timeout error may appear after 10s

## 🚀 Future Enhancements

### Planned Features:
1. **Continuous Tracking**: Update user position as they move
2. **Accuracy Circle**: Show position accuracy radius
3. **Nearest Reports**: Find reports near user location
4. **Distance Calculation**: Show distance to reports
5. **Report at Location**: Pre-fill form with current coordinates
6. **Location History**: Remember last known position
7. **Offline Support**: Cache last position for offline mode

### Code Locations:
- **MapView Component**: `/src/components/MapView/MapView.jsx`
- **Map Page**: `/src/pages/Map/Map.jsx`
- **Styles**: `/src/components/MapView/MapView.css`

## 📖 Usage Example

### From Parent Component:

```javascript
import { useRef } from 'react'
import MapView from './components/MapView'

const ParentComponent = () => {
  const mapRef = useRef(null)
  
  const handleLocateClick = () => {
    if (mapRef.current) {
      mapRef.current.locateUser()
    }
  }
  
  return (
    <>
      <MapView ref={mapRef} />
      <button onClick={handleLocateClick}>
        Find Me
      </button>
    </>
  )
}
```

## 🐛 Troubleshooting

### Location Not Working?

1. **Check Browser Permissions**
   - Open browser settings
   - Search for "location"
   - Ensure site is allowed

2. **Check HTTPS**
   - Geolocation requires HTTPS
   - Exception: localhost

3. **Check GPS/Location Services**
   - Enable location services on device
   - Check if other apps can access location

4. **Clear Site Data**
   - Sometimes cached permissions cause issues
   - Clear site data and try again

5. **Try Different Browser**
   - Some browsers have stricter policies
   - Test in Chrome, Firefox, Safari

### Common Issues:

**"Геолокацията не се поддържа"**
- Browser too old
- Update browser or use modern alternative

**"Моля, разрешете достъп"**
- Permission denied
- Check browser location settings
- Refresh page and allow when prompted

**"Информацията за местоположение не е налична"**
- GPS/location services disabled
- Enable location services on device
- Move to area with better GPS signal

**"Заявката за местоположение изтече"**
- Poor GPS signal
- Network connectivity issues
- Try again in different location

## 📚 References

- [MDN: Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [React-Leaflet: useMap Hook](https://react-leaflet.js.org/docs/api-map/#usemap)
- [Leaflet: Map Methods](https://leafletjs.com/reference.html#map-flyto)
- [Can I Use: Geolocation](https://caniuse.com/geolocation)
