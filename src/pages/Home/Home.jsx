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
} from '@mui/material'
import {
  Lightbulb,
  Map,
  CheckCircle,
  Error,
} from '@mui/icons-material'
import { fetchMarkers } from '../../utils/markers'
import logo from '../../assets/logo.svg'

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

  // Load markers from Supabase
  useEffect(() => {
    const loadMarkers = async () => {
      const { data, error } = await fetchMarkers()

      if (error) {
        console.error('Failed to load markers from Supabase:', error)
        setMarkers([])
        setReportCount(0)
      } else if (data) {
        // Sort by newest first
        const sortedMarkers = data.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        )
        setMarkers(sortedMarkers)
        setReportCount(sortedMarkers.length)
      }
    }

    // Load initially
    loadMarkers()

    // Refresh every 10 seconds to show new reports
    const interval = setInterval(loadMarkers, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static" elevation={1} sx={{ backgroundColor: '#000000' }}>
        <Toolbar sx={{ justifyContent: 'center', py: 1 }}>
          <img
            src={logo}
            alt="svetniChe"
            style={{ height: '60px', width: 'auto' }}
          />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Докладвай повреда на улично осветление
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
            <Stack spacing={1}>
              {markers.map((marker) => (
                <Card key={marker.id} variant="outlined">
                  <CardContent sx={{ py: 1, px: 1, '&:last-child': { pb: 1 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {marker.address || 'Зареждане адрес...'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getRelativeTime(marker.createdAt)}
                        </Typography>
                      </Box>
                      <Chip label="Чака" color="error" size="small" sx={{ flexShrink: 0 }} />
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
