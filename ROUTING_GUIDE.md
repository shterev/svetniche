# React Router Setup Guide

## ✅ What's Been Implemented

### 1. **React Router Installation**
- Package: `react-router-dom` (latest version)
- Provides client-side navigation without page reloads

### 2. **Page Structure**
Following the cursor component architecture rules, pages are organized as:

```
src/pages/
├── Home/
│   ├── index.js          # Barrel export
│   └── Home.jsx          # Home page component
└── Map/
    ├── index.js          # Barrel export
    └── Map.jsx           # Map page component
```

### 3. **Routes Configured**

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home` | Landing page with statistics and recent reports |
| `/map` | `Map` | Interactive map view (placeholder for Leaflet integration) |

### 4. **Navigation Implementation**

#### Button Navigation
The "Виж картата" button uses `useNavigate` hook:

```jsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

<Button 
  onClick={() => navigate('/map')}
>
  Виж картата
</Button>
```

#### Back Navigation
The Map page includes a back button in the AppBar:

```jsx
<IconButton onClick={() => navigate('/')}>
  <ArrowBack />
</IconButton>
```

## 🚀 How to Use

### Development
```bash
npm run dev
```

Navigate between pages:
- Home: `http://localhost:5173/`
- Map: `http://localhost:5173/map`

**Refresh works on any route** - no blank pages!

### Production Build
```bash
npm run build
npm run preview
```

Test the production build locally before deploying.

## 🌐 Production Deployment

### Netlify
✅ **Already configured** via `public/_redirects`

The `_redirects` file ensures all routes serve `index.html`:
```
/*    /index.html   200
```

**Deploy steps:**
1. Connect your git repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy!

### Vercel
✅ **Already configured** via `vercel.json`

The config file handles SPA routing:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Deploy steps:**
1. Connect your git repository to Vercel
2. Framework preset: Vite
3. Deploy!

### Self-Hosted (VPS with Nginx)
✅ **Configuration provided** in `nginx.conf.example`

**Key configuration:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

This ensures that:
- Static files (JS, CSS, images) are served directly
- All other routes serve `index.html`
- React Router handles the routing client-side

**Deploy steps:**
1. Build the app: `npm run build`
2. Upload `dist/` folder to server: `/var/www/svetniche/`
3. Configure Nginx using the example config
4. Restart Nginx: `sudo systemctl reload nginx`

### Railway / Render
These platforms automatically detect Vite apps and handle SPA routing correctly. No additional configuration needed.

## 🔧 How It Works

### Client-Side Routing
React Router uses the browser's History API to:
1. Change the URL without reloading the page
2. Render the appropriate component based on the URL
3. Handle browser back/forward buttons

### The Problem It Solves
**Without proper configuration:**
- Visit `/map` directly → ❌ Server returns 404
- Refresh on `/map` → ❌ Blank page

**With our configuration:**
- Visit `/map` directly → ✅ Server serves index.html, React Router renders Map
- Refresh on `/map` → ✅ Works perfectly!

### Server Configuration
The server must be configured to:
1. Serve `index.html` for all routes (except static assets)
2. Let React Router determine which component to render

This is what `_redirects`, `vercel.json`, and `nginx.conf` accomplish.

## 📝 Adding New Routes

To add a new route (e.g., Admin Panel):

### 1. Create the page component
```
src/pages/
└── Admin/
    ├── index.js
    └── Admin.jsx
```

### 2. Add the route in App.jsx
```jsx
import Admin from './pages/Admin'

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/map" element={<Map />} />
  <Route path="/admin" element={<Admin />} />
</Routes>
```

### 3. Add navigation
```jsx
<Button onClick={() => navigate('/admin')}>
  Admin Panel
</Button>
```

## 🎯 Benefits

### User Experience
- ⚡ **Fast navigation** - No page reloads
- 🔄 **Smooth transitions** - Can add animations later
- 📱 **App-like feel** - Feels like a native app

### Development
- 🧩 **Component separation** - Each page is its own component
- 🔍 **Easy debugging** - Clear route → component mapping
- 📦 **Code splitting** - Can lazy load routes later

### Production
- ✅ **Refresh works** - No 404 errors on direct URL access
- 🚀 **Fast deployment** - Works with all major platforms
- 🔒 **SEO-ready** - Can add React Helmet for meta tags

## 🔮 Next Steps

### Planned Enhancements
1. **Add route transitions** - Smooth fade/slide animations
2. **Lazy loading** - Load pages on demand for faster initial load
3. **404 page** - Custom not found page
4. **Protected routes** - Admin authentication
5. **Query parameters** - For filtering reports on map

### Example: Lazy Loading
```jsx
import { lazy, Suspense } from 'react'

const Map = lazy(() => import('./pages/Map'))

<Route 
  path="/map" 
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <Map />
    </Suspense>
  } 
/>
```

## 📚 Resources

- [React Router Docs](https://reactrouter.com/)
- [Vite SPA Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Netlify SPA Config](https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps)
- [Vercel SPA Config](https://vercel.com/docs/concepts/projects/project-configuration#rewrites)

---

**Your routing is production-ready!** 🎉
