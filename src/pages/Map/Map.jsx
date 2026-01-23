import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
} from '@mui/material'
import {
  Lightbulb,
  ArrowBack,
  AddLocation,
  MyLocation,
} from '@mui/icons-material'

const Map = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
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
      <Box sx={{ flex: 1, position: 'relative', bgcolor: 'background.default' }}>
        {/* Placeholder for map - will add Leaflet/Mapbox here */}
        <Paper
          elevation={0}
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#e0e0e0',
            backgroundImage: `
              repeating-linear-gradient(0deg, #d0d0d0, #d0d0d0 1px, transparent 1px, transparent 50px),
              repeating-linear-gradient(90deg, #d0d0d0, #d0d0d0 1px, transparent 1px, transparent 50px)
            `,
          }}
        >
          <Stack spacing={3} alignItems="center" sx={{ maxWidth: 600, p: 4 }}>
            <MyLocation sx={{ fontSize: 64, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" textAlign="center">
              Интерактивна карта
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Тук ще се покаже картата на Чепинци с маркери за всички доклади.
              Потребителите ще могат да кликнат на картата за да добавят нов доклад.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'error.main',
                    mb: 1,
                    mx: 'auto',
                  }}
                />
                <Typography variant="caption">Чака поправка</Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    mb: 1,
                    mx: 'auto',
                  }}
                />
                <Typography variant="caption">Поправено</Typography>
              </Paper>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              За следващата фаза: Leaflet.js / Mapbox GL JS интеграция
            </Typography>
          </Stack>
        </Paper>

        {/* Floating Action Button for Current Location */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 24,
            right: 24,
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
