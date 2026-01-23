import { useState } from 'react'
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
  AddLocation,
  AdminPanelSettings,
  CheckCircle,
  Error,
} from '@mui/icons-material'

const Home = () => {
  const navigate = useNavigate()
  const [reportCount, setReportCount] = useState(3)

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
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<AddLocation />}
              onClick={() => setReportCount(reportCount + 1)}
            >
              Нов доклад
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Map />}
              onClick={() => navigate('/map')}
            >
              Виж картата
            </Button>
          </Stack>
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

        {/* Demo Report Cards */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Последни доклади
        </Typography>
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" component="div" gutterBottom>
                    Главна улица до кметството
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Уличната лампа не работи от 3 дни. Тъмно е вечер и е опасно.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Докладвано преди 2 часа
                  </Typography>
                </Box>
                <Chip label="Чака" color="error" size="small" />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" component="div" gutterBottom>
                    До автобусната спирка
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Мигаща лампа, вероятно проблем с контактора.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Докладвано преди 1 ден
                  </Typography>
                </Box>
                <Chip label="Поправено" color="success" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Stack>

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
                ✓ Опишете проблема (незадължително качете снимка)
              </Typography>
              <Typography variant="body2">
                ✓ Получавате код за редакция на доклада си
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
