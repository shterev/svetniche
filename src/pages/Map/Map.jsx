import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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

const Map = () => {
  const navigate = useNavigate()
  const mapRef = useRef(null)

  const handleLocateMe = () => {
    if (mapRef.current) {
      mapRef.current.locateUser()
    }
  }

  return (
    <Box sx={{ height: '100dvh', fallbacks: [{ height: '100vh' }] }}>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar sx={{ minHeight: 48, height: 48 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            size="small"
          >
            <ArrowBack />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: 'calc(100dvh - 48px)', fallbacks: [{ height: 'calc(100vh - 48px)' }], position: 'relative' }}>
        <MapView ref={mapRef} />

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
