import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material'
import {
  Lightbulb,
  ArrowBack,
  AddLocation,
  MyLocation,
} from '@mui/icons-material'
import MapView from '../../components/MapView'

const Map = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ height: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Lightbulb sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Карта на докладите
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddLocation />}
            onClick={() => alert('Форма за нов доклад (в разработка)')}
          >
            Нов доклад
          </Button>
        </Toolbar>
      </AppBar>

      {/* Map Container */}
      <Box sx={{ height: 'calc(100vh - 64px)', position: 'relative' }}>
        <MapView />

        {/* Floating Action Button for Current Location */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 24,
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
            }}
            onClick={() => alert('Центрирай на моята локация (в разработка)')}
          >
            <MyLocation />
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Map
