# Leaflet Map Integration Guide

## ✅ What's Been Implemented

### 1. **Packages Installed**
- `leaflet` - Core Leaflet library (v1.9.4)
- `react-leaflet` - React bindings for Leaflet

### 2. **MapView Component Created**
Following cursor architecture rules:
```
src/components/MapView/
├── index.js          # Barrel export
├── MapView.jsx       # Map component implementation
└── MapView.css       # Custom map styles
```

### 3. **Map Configuration**

#### Default Coordinates
- **Village**: Chepintsi 1554, Bulgaria
- **Latitude**: 42.7050
- **Longitude**: 23.7250
- **Default Zoom**: 15 (street level)

#### Tile Layer
- **Provider**: OpenStreetMap
- **URL**: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Max Zoom**: 19
- **Attribution**: OpenStreetMap contributors

### 4. **Features Implemented**

✅ **Interactive Map**
- Pan, zoom, scroll wheel controls
- Touch-friendly on mobile
- Responsive container

✅ **Default Marker**
- Center marker at Chepintsi village
- Popup with village information
- Fixed marker icon display issue

✅ **Proper Styling**
- Full-height map container
- Custom z-index management
- Material UI integration

## 🗺️ Map Component Usage

### Basic Usage
```jsx
import MapView from '../../components/MapView'

<MapView />
```

### Current Implementation
The Map page (`src/pages/Map/Map.jsx`) includes:
- App bar with navigation
- MapView component filling remaining space
- Floating action button for location (placeholder)

## 📍 Coordinates Reference

### Chepintsi Village
```javascript
const CHEPINTSI_CENTER = [42.7050, 23.7250]
```

### Geographic Bounds (from ARCHITECTURE.md)
```javascript
// Validation bounds for Chepintsi area
const CHEPINTSI_BOUNDS = {
  minLat: 42.68,
  maxLat: 42.73,
  minLng: 23.68,
  maxLng: 23.75
}
```

## 🎨 Customization

### Change Map Center
```jsx
<MapContainer
  center={[lat, lng]}
  zoom={15}
/>
```

### Add Custom Markers
```jsx
import { Marker, Popup } from 'react-leaflet'

<Marker position={[42.705, 23.725]}>
  <Popup>
    Custom location info
  </Popup>
</Marker>
```

### Change Tile Layer Style
```jsx
// Dark mode tiles
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  attribution='&copy; OpenStreetMap &copy; CartoDB'
/>

// Satellite imagery (requires API key)
<TileLayer
  url="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token={accessToken}"
  attribution='&copy; Mapbox'
/>
```

## 🔧 Common Tasks

### 1. Add Click Handler to Map
```jsx
import { useMapEvents } from 'react-leaflet'

function MapClickHandler() {
  useMapEvents({
    click: (e) => {
      console.log('Clicked at:', e.latlng)
      // Handle click - e.g., create new report
    },
  })
  return null
}

// In MapView component:
<MapContainer>
  <TileLayer />
  <MapClickHandler />
</MapContainer>
```

### 2. Add Multiple Markers (Reports)
```jsx
const reports = [
  { id: 1, position: [42.705, 23.725], status: 'pending' },
  { id: 2, position: [42.706, 23.726], status: 'fixed' },
]

{reports.map(report => (
  <Marker key={report.id} position={report.position}>
    <Popup>Report #{report.id}</Popup>
  </Marker>
))}
```

### 3. Custom Marker Icons
```jsx
import L from 'leaflet'

const redIcon = L.icon({
  iconUrl: '/markers/red-marker.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

<Marker position={position} icon={redIcon} />
```

### 4. Programmatic Map Control
```jsx
import { useMap } from 'react-leaflet'

function MapController() {
  const map = useMap()
  
  const centerOnChepintsi = () => {
    map.setView([42.7050, 23.7250], 15)
  }
  
  return null
}
```

### 5. Get User's Current Location
```jsx
const handleLocateUser = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      map.setView([latitude, longitude], 16)
    })
  }
}
```

## 🎯 Next Steps for Svetniche

### Phase 1: Basic Report Markers
- [ ] Create custom marker icons (red for pending, green for fixed)
- [ ] Add click handler to place new reports
- [ ] Show all reports as markers on map
- [ ] Color-code markers by status

### Phase 2: Interactive Features
- [ ] Click map to add new report (show form dialog)
- [ ] Click marker to view report details
- [ ] Cluster markers when many in same area
- [ ] Add legend for marker colors

### Phase 3: Advanced Features
- [ ] User location with "Center on Me" button
- [ ] Draw radius around reports
- [ ] Filter markers by status
- [ ] Search for address/location

## 📚 Leaflet Resources

- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [React-Leaflet Documentation](https://react-leaflet.js.org/)
- [Leaflet Tutorials](https://leafletjs.com/examples.html)
- [Free Tile Providers](https://leaflet-extras.github.io/leaflet-providers/preview/)

## 🐛 Troubleshooting

### Markers Not Showing
Already fixed! The default marker icons are configured in `MapView.jsx`:
```jsx
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  // ... configuration
})
```

### Map Not Displaying
Ensure:
1. Leaflet CSS is imported in `main.jsx`
2. Map container has explicit height
3. TileLayer component is present

### Incorrect Coordinates
Leaflet uses `[latitude, longitude]` order (not lng/lat like some APIs):
```jsx
// ✅ Correct
<Marker position={[42.7050, 23.7250]} />

// ❌ Wrong
<Marker position={[23.7250, 42.7050]} />
```

## 🎨 Styling with Material UI

### Map in MUI Paper
```jsx
import { Paper } from '@mui/material'

<Paper elevation={3} sx={{ height: 500 }}>
  <MapView />
</Paper>
```

### Map in MUI Dialog
```jsx
import { Dialog, DialogContent } from '@mui/material'

<Dialog open={open} maxWidth="lg" fullWidth>
  <DialogContent sx={{ height: 600, p: 0 }}>
    <MapView />
  </DialogContent>
</Dialog>
```

## 🚀 Performance Tips

1. **Marker Clustering**: Use `react-leaflet-cluster` for many markers
2. **Lazy Loading**: Load map only when needed (already done with routing)
3. **Debounce Events**: Debounce map move/zoom events
4. **Custom Tile Cache**: Configure tile caching for offline support

## 🔐 Attribution Requirements

**Important**: OpenStreetMap requires attribution. It's automatically included in the TileLayer component:

```jsx
<TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  // ...
/>
```

For other tile providers, check their attribution requirements.

---

**Your map is live and ready!** 🗺️ Visit `/map` to see Chepintsi on the map.
