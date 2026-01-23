import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material'
import {
  Lightbulb,
  Map,
  AdminPanelSettings,
  CheckCircle,
  Error,
} from '@mui/icons-material'

const Home = () => {
  const navigate = useNavigate()
  const [reportCount, setReportCount] = useState(0)
  const [markers, setMarkers] = useState([])

  // Helper function to format relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Преди малко'
    if (diffMins < 60) return `Преди ${diffMins} ${diffMins === 1 ? 'минута' : 'минути'}`
    if (diffHours < 24) return `Преди ${diffHours} ${diffHours === 1 ? 'час' : 'часа'}`
    return `Преди ${diffDays} ${diffDays === 1 ? 'ден' : 'дни'}`
  }

  // Load markers from localStorage
  useEffect(() => {
    const loadMarkers = () => {
      const savedMarkers = localStorage.getItem('userMarkers')
      if (savedMarkers) {
        try {
          const parsedMarkers = JSON.parse(savedMarkers)
          // Sort by newest first
          const sortedMarkers = parsedMarkers.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          )
          setMarkers(sortedMarkers)
          setReportCount(sortedMarkers.length)
        } catch (error) {
          console.error('Failed to load markers from localStorage:', error)
          setMarkers([])
          setReportCount(0)
        }
      } else {
        setMarkers([])
        setReportCount(0)
      }
    }

    // Load initially
    loadMarkers()

    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', loadMarkers)

    // Poll for changes every second (in case MapView updates in same tab)
    const interval = setInterval(loadMarkers, 1000)

    return () => {
      window.removeEventListener('storage', loadMarkers)
      clearInterval(interval)
    }
  }, [])

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Lightbulb sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Светнички - Chepintsi
          </Typography>
          <IconButton color="inherit">
            <AdminPanelSettings />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Докладвай повреда на улично осветление
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Report Broken Street Lights in Chepintsi, Bulgaria
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Map />}
              onClick={() => navigate('/map')}
            >
              Виж картата
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{ mb: 4 }}
        >
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Error color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Активни доклади
                </Typography>
              </Box>
              <Typography variant="h3" component="div" color="error.main">
                {reportCount}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Чакащи поправка
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Поправени
                </Typography>
              </Box>
              <Typography variant="h3" component="div" color="success.main">
                27
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Този месец
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Lightbulb color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Общо
                </Typography>
              </Box>
              <Typography variant="h3" component="div" color="warning.main">
                {reportCount + 27}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Всички доклади
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* Recent Reports - Show only if there are markers */}
        {markers.length > 0 && (
          <>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Последни доклади
            </Typography>
            <Stack spacing={2}>
              {markers.map((marker) => (
                <Card key={marker.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                          {marker.address || 'Зареждане адрес...'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Координати: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Докладвано {getRelativeTime(marker.createdAt)}
                        </Typography>
                      </Box>
                      <Chip label="Чака" color="error" size="small" />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </>
        )}

        {/* Info Box */}
        <Card sx={{ mt: 4, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Как работи системата?
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                ✓ Натиснете на картата за да маркирате местоположението
              </Typography>
              <Typography variant="body2">
                ✓ Изтрийте маркера ако е грешен, като натиснете на него и после бутона "Изтрий"
              </Typography>
              <Typography variant="body2">
                ✓ Администраторът маркира когато е поправено
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Home
