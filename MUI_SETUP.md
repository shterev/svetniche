# Material UI Setup Guide

## ✅ What's Installed

### Core Packages
- `@mui/material` (v7.3.7) - Core Material UI components
- `@emotion/react` (v11.14.0) - Styling engine
- `@emotion/styled` (v11.14.1) - Styled components API
- `@mui/icons-material` (v7.3.7) - Material Design icons

## 🎨 Custom Theme

Located at `src/theme/theme.js`, the custom theme is designed specifically for Svetniche:

### Color Palette
- **Primary (Amber)**: `#f59e0b` - Represents street light glow
- **Secondary (Blue)**: `#3b82f6` - Represents night sky
- **Success (Green)**: `#10b981` - For fixed reports
- **Error (Red)**: `#ef4444` - For pending/broken reports

### Typography
- System font stack for best performance
- Button text is NOT uppercased (better for Bulgarian)
- Consistent font weights and line heights

### Custom Component Styles
- **Buttons**: Rounded corners (8px), no shadow by default
- **Cards**: Slightly more rounded (12px), subtle shadows
- **Text Fields**: Rounded corners (8px)
- **Chips**: Rounded corners (6px), medium weight text

## 📦 Available Components

### Layout
- `Container` - Responsive container with max-width
- `Box` - Flexible wrapper with sx prop
- `Stack` - Flexbox layout helper
- `Grid` - Responsive grid system

### Navigation
- `AppBar` - Application bar
- `Toolbar` - Toolbar inside AppBar
- `Drawer` - Side drawer/navigation
- `Tabs` - Tab navigation

### Data Display
- `Card`, `CardContent`, `CardActions` - Card components
- `Chip` - Compact status/label chips
- `Typography` - Text with semantic variants (h1-h6, body1, body2, etc.)
- `Divider` - Visual separator
- `List`, `ListItem`, `ListItemText` - List components

### Inputs
- `Button` - Primary, secondary, outlined, text variants
- `TextField` - Text input with validation
- `Select`, `MenuItem` - Dropdown selection
- `Checkbox`, `Radio` - Selection controls
- `Switch` - Toggle switch
- `Slider` - Value slider

### Feedback
- `Dialog` - Modal dialogs
- `Snackbar` - Toast notifications
- `Alert` - Alert messages
- `CircularProgress`, `LinearProgress` - Loading indicators
- `Backdrop` - Overlay backdrop

### Icons
Import from `@mui/icons-material`:
- `Lightbulb` - Light bulb icon
- `Map`, `AddLocation` - Map-related icons
- `AdminPanelSettings` - Admin icon
- `CheckCircle`, `Error` - Status icons
- Thousands more available at [mui.com/material-ui/material-icons](https://mui.com/material-ui/material-icons/)

## 🚀 Usage Examples

### Basic Button
```jsx
import { Button } from '@mui/material';
import { AddLocation } from '@mui/icons-material';

<Button 
  variant="contained" 
  color="primary"
  startIcon={<AddLocation />}
  onClick={handleClick}
>
  Нов доклад
</Button>
```

### Card with Status Chip
```jsx
import { Card, CardContent, Typography, Chip } from '@mui/material';

<Card>
  <CardContent>
    <Typography variant="h6">Report Title</Typography>
    <Typography variant="body2" color="text.secondary">
      Description here
    </Typography>
    <Chip label="Pending" color="error" size="small" />
  </CardContent>
</Card>
```

### Responsive Layout
```jsx
import { Container, Stack } from '@mui/material';

<Container maxWidth="lg">
  <Stack 
    direction={{ xs: 'column', md: 'row' }} 
    spacing={3}
  >
    <Box sx={{ flex: 1 }}>Content 1</Box>
    <Box sx={{ flex: 1 }}>Content 2</Box>
  </Stack>
</Container>
```

### Using sx Prop for Custom Styles
```jsx
<Box 
  sx={{ 
    mt: 4,           // margin-top: theme.spacing(4)
    p: 2,            // padding: theme.spacing(2)
    bgcolor: 'primary.main',
    color: 'white',
    borderRadius: 2,
    '&:hover': {
      bgcolor: 'primary.dark',
    }
  }}
>
  Custom styled box
</Box>
```

## 🎯 Theme Usage

### Accessing Theme in Components
```jsx
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <div style={{ color: theme.palette.primary.main }}>
      Uses theme color
    </div>
  );
}
```

### Responsive Breakpoints
```jsx
<Box 
  sx={{
    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
    // xs: 0px+
    // sm: 600px+
    // md: 900px+
    // lg: 1200px+
    // xl: 1536px+
  }}
>
  Responsive text
</Box>
```

## 📱 Mobile-First Design

Material UI is mobile-first by default:
- All components are touch-friendly
- Responsive breakpoints built-in
- Use `Stack` with `direction={{ xs: 'column', md: 'row' }}`
- Use `Container` for consistent padding and max-width

## 🎨 Color Reference

### Status Colors for Reports
```jsx
// Pending report
<Chip label="Чака" color="error" />

// Fixed report
<Chip label="Поправено" color="success" />

// In progress
<Chip label="В процес" color="warning" />
```

### Background Colors
```jsx
// Default page background
sx={{ bgcolor: 'background.default' }}

// Paper/card background
sx={{ bgcolor: 'background.paper' }}

// Colored backgrounds
sx={{ bgcolor: 'primary.main' }}
sx={{ bgcolor: 'success.light' }}
```

## 🔧 Customizing the Theme

To modify the theme, edit `src/theme/theme.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#your-color',
    },
  },
  typography: {
    fontSize: 16,
  },
  // ... more customization
});
```

## 📚 Resources

- [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- [Component API Reference](https://mui.com/material-ui/api/button/)
- [Icons Search](https://mui.com/material-ui/material-icons/)
- [sx Prop Documentation](https://mui.com/system/getting-started/the-sx-prop/)
- [Customization Guide](https://mui.com/material-ui/customization/how-to-customize/)

## 🎯 Next Steps for Svetniche

1. **Create Map Component** - Use MUI Paper/Card to wrap Leaflet map
2. **Report Form Dialog** - Use MUI Dialog + TextField + Button
3. **Admin Panel** - Use MUI DataGrid or custom Table
4. **Status Indicators** - Use MUI Chips for pending/fixed status
5. **Mobile Bottom Sheet** - Use MUI Drawer with anchor="bottom"

## 💡 Tips

- Use `CssBaseline` for consistent baseline styles (already added)
- Prefer `sx` prop over inline styles for theme integration
- Use semantic color names (primary, error, success) over hardcoded colors
- Leverage `Stack` and `Box` instead of custom divs
- Material UI tree-shakes unused components automatically
