import { useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  ArrowBack,
  MyLocation,
} from '@mui/icons-material'
import MapView from '../../components/MapView'
import logo from '../../assets/logo.svg'

const Map = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const mapRef = useRef(null)
  const focusState = location.state
  const focusCoordinates =
    focusState?.focusLat != null && focusState?.focusLng != null
      ? { lat: focusState.focusLat, lng: focusState.focusLng }
      : null
  const focusMarkerId = focusState?.focusMarkerId ?? null

  const handleLocateMe = () => {
    if (mapRef.current) {
      mapRef.current.locateUser()
    }
  }

  return (
    <Box sx={{ height: '100dvh', fallbacks: [{ height: '100vh' }] }}>
      <AppBar position="static" elevation={1} sx={{ backgroundColor: '#000000' }}>
        <Toolbar sx={{ minHeight: 48, height: 48 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            size="small"
          >
            <ArrowBack />
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              ml: -6,
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              padding: 0
            }}
            component="button"
            onClick={() => navigate('/')}
            aria-label="Начало"
          >
            <img
              src={logo}
              alt="svetniChe"
              style={{ height: '40px', width: 'auto' }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: 'calc(100dvh - 48px)', fallbacks: [{ height: 'calc(100vh - 48px)' }], position: 'relative' }}>
        <MapView
          ref={mapRef}
          focusCoordinates={focusCoordinates}
          focusMarkerId={focusMarkerId}
        />

        {/* Floating Action Button for Current Location */}
        <Tooltip title="Моята локация" placement="left">
          <Box
            sx={{
              position: 'absolute',
              bottom: 'max(24px, env(safe-area-inset-bottom))',
              right: 24,
              zIndex: 1000,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{
                minWidth: 56,
                minHeight: 56,
                borderRadius: '50%',
                p: 0,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                }
              }}
              onClick={handleLocateMe}
              aria-label="Център на моята локация"
            >
              <MyLocation />
            </Button>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default Map
