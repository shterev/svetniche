# Светнички (Svetniche) 💡

> Граждански уеб апликация за докладване на повредени улични осветления в село Чепинци, България

Civic web application for reporting broken street lights in Chepintsi village, Bulgaria.

## 🎯 Overview

**Svetniche** empowers Chepintsi residents to quickly report broken street lights by simply clicking on a map. No registration required - just point, describe, and submit. Admins can then mark issues as fixed, creating a transparent feedback loop for the community.

### Key Features

- 🗺️ **Interactive Map** - Click to report location
- 📝 **Simple Reporting** - No authentication needed
- 🔐 **Ownership Tokens** - Edit your own reports
- 👁️ **Public Visibility** - Everyone sees all reports
- ⚡ **Admin Panel** - Mark issues as fixed
- 📱 **Mobile-First** - Optimized for phones

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Project Structure

```
svetniche/
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   ├── context/         # State management
│   ├── utils/           # Helper functions
│   └── constants/       # Configuration
├── public/              # Static assets
├── ARCHITECTURE.md      # Detailed architecture doc
└── package.json
```

## 📖 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system architecture, data models, API design, and deployment guide

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start dev server (hot reload)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Technology Stack

**Frontend:**
- React 19.x - UI framework
- Vite 7.x - Build tool
- Material UI 7.x - Component library
- Leaflet.js - Interactive maps (to be added)

**Backend (planned):**
- Node.js + Express - API server
- PostgreSQL + PostGIS - Database with geospatial support
- Prisma - ORM

## 🗺️ Next Steps

### Phase 1: Basic Functionality (MVP)
- [ ] Set up map component (Leaflet/Mapbox)
- [ ] Create report form
- [ ] Implement client-side token storage
- [ ] Build backend API
- [ ] Connect frontend to backend
- [ ] Create admin panel

### Phase 2: Enhancements
- [ ] Photo upload
- [ ] Email notifications
- [ ] Report statistics dashboard
- [ ] WhatsApp integration

### Phase 3: Polish
- [ ] PWA support (offline mode)
- [ ] Multi-language (BG/EN)
- [ ] Expand to nearby villages

## 🤝 Contributing

This is a community project for Chepintsi village. Contributions are welcome!

## 🚢 Deployment

### Client-Side Routing Configuration

This app uses React Router for client-side routing. To ensure routes work correctly after refresh in production, the following configurations are included:

#### Netlify
Already configured via `public/_redirects` file. No additional setup needed.

#### Vercel
Already configured via `vercel.json` file. No additional setup needed.

#### Self-Hosted (Nginx)
Use the provided `nginx.conf.example` as a template:

```bash
# Copy and edit the configuration
sudo cp nginx.conf.example /etc/nginx/sites-available/svetniche
sudo ln -s /etc/nginx/sites-available/svetniche /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Key Configuration**: All routes must serve `index.html` to allow React Router to handle routing.

### Build for Production

```bash
npm run build
```

The production files will be in the `dist/` directory.

## 📄 License

MIT License - Feel free to use this for your own village!

## 📞 Contact

For questions about this project or Chepintsi village initiatives:
- GitHub: [Issue Tracker](../../issues)

---

**Made with ❤️ for Chepintsi, Bulgaria**
