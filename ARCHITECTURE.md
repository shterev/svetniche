# Svetniche - Street Light Reporting System Architecture

## 🎯 Project Overview

**Svetniche** (Bulgarian: "Светнички" - little lights) is a civic web application for residents of Chepintsi, Bulgaria to report broken street lights. The system enables community-driven infrastructure monitoring with minimal friction.

### Key Requirements
- **No authentication** - Zero barriers to reporting issues
- **Public visibility** - All reports visible to everyone
- **Client-side ownership** - Reporters get a token to edit their own submissions
- **Admin moderation** - Admins can mark issues as fixed
- **Single village scope** - Optimized for Chepintsi community

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  (React + Vite + Leaflet/Mapbox + TailwindCSS)            │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Map View    │  │ Report Form  │  │ Admin Panel  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  State Management (React Context/Zustand)          │   │
│  │  - Reports, Filters, User Tokens                   │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ REST API (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                             │
│        (Node.js/Express OR Python/FastAPI)                 │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Reports    │  │   Admin      │  │  Validation  │    │
│  │   API        │  │   API        │  │   Layer      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Business Logic                                    │   │
│  │  - Token generation & verification                 │   │
│  │  - Ownership validation                            │   │
│  │  - Admin authentication (simple key-based)         │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE                              │
│          (PostgreSQL with PostGIS OR MongoDB)               │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │   reports    │  │   admins     │                       │
│  └──────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Frontend Architecture

### Technology Stack
- **Framework**: React 19.x
- **Build Tool**: Vite 7.x
- **UI Library**: Material UI (MUI) 7.x
- **Mapping**: Leaflet.js or Mapbox GL JS
- **State Management**: React Context API or Zustand (lightweight)
- **HTTP Client**: Fetch API or Axios
- **Form Validation**: Zod or React Hook Form

### Folder Structure
```
src/
├── components/
│   ├── Map/
│   │   ├── MapView.jsx          # Main map component
│   │   ├── ReportMarker.jsx     # Individual report markers
│   │   └── LocationPicker.jsx   # Click to place marker
│   ├── Reports/
│   │   ├── ReportForm.jsx       # Create/edit report form
│   │   ├── ReportList.jsx       # List view of reports
│   │   ├── ReportDetails.jsx    # Single report modal
│   │   └── ReportFilters.jsx    # Filter by status
│   ├── Admin/
│   │   ├── AdminPanel.jsx       # Admin dashboard
│   │   └── AdminLogin.jsx       # Simple key-based login
│   └── UI/
│       ├── Button.jsx
│       ├── Modal.jsx
│       └── Toast.jsx            # Notifications
├── hooks/
│   ├── useReports.js            # Fetch/manage reports
│   ├── useLocalToken.js         # Manage user's ownership token
│   └── useAdmin.js              # Admin session management
├── services/
│   ├── api.js                   # API client configuration
│   ├── reportService.js         # Report CRUD operations
│   └── adminService.js          # Admin operations
├── context/
│   ├── ReportContext.jsx        # Global report state
│   └── AdminContext.jsx         # Admin state
├── utils/
│   ├── tokenGenerator.js        # Client-side token utilities
│   ├── validators.js            # Form validation
│   └── mapConfig.js             # Map boundaries for Chepintsi
├── constants/
│   └── config.js                # API URLs, map center, etc.
├── App.jsx
└── main.jsx
```

### Responsibilities

#### 1. **Map Component**
- Display interactive map centered on Chepintsi
- Show all public reports as markers (color-coded by status)
- Allow users to click map to select location for new report
- Cluster markers if many reports in same area

#### 2. **Report Management**
- **Create**: Form with location, description, optional photo
- **Read**: List all reports, filter by status (pending/fixed)
- **Update**: Edit own reports using stored token
- **Delete**: Remove own reports (soft delete)

#### 3. **Client-Side Ownership**
- Generate unique token on report creation (UUID)
- Store token in localStorage: `{ reportId: token }`
- Send token with edit/delete requests
- Backend validates token ownership

#### 4. **Admin Panel**
- Simple key-based authentication (single admin key)
- View all reports
- Mark reports as fixed/pending
- View report statistics

---

## 🔧 Backend Architecture

### Technology Stack Options

#### Option A: Node.js Stack (Recommended for MVP)
- **Runtime**: Node.js 20.x
- **Framework**: Express.js or Fastify
- **Database**: PostgreSQL 16+ with PostGIS extension
- **ORM**: Prisma or Drizzle
- **Validation**: Zod
- **Image Storage**: Local filesystem or Cloudinary/S3

#### Option B: Python Stack
- **Framework**: FastAPI
- **Database**: PostgreSQL with PostGIS
- **ORM**: SQLAlchemy with GeoAlchemy2
- **Validation**: Pydantic
- **Image Storage**: Local or cloud

### Folder Structure (Node.js/Express)
```
backend/
├── src/
│   ├── routes/
│   │   ├── reports.js           # Report CRUD endpoints
│   │   └── admin.js             # Admin endpoints
│   ├── controllers/
│   │   ├── reportController.js
│   │   └── adminController.js
│   ├── services/
│   │   ├── reportService.js     # Business logic
│   │   ├── tokenService.js      # Token validation
│   │   └── imageService.js      # Image upload handling
│   ├── models/
│   │   ├── Report.js
│   │   └── Admin.js
│   ├── middleware/
│   │   ├── validateToken.js     # Verify ownership tokens
│   │   ├── validateAdmin.js     # Admin authentication
│   │   ├── rateLimit.js         # Prevent spam
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── tokenGenerator.js
│   │   └── validators.js
│   ├── config/
│   │   └── database.js
│   └── app.js
├── prisma/
│   └── schema.prisma
├── .env.example
└── package.json
```

### Responsibilities

#### 1. **Report Endpoints**
```javascript
POST   /api/reports              // Create new report
GET    /api/reports              // Get all reports (public)
GET    /api/reports/:id          // Get single report
PATCH  /api/reports/:id          // Update report (requires token)
DELETE /api/reports/:id          // Delete report (requires token)
POST   /api/reports/:id/photo    // Upload photo
```

#### 2. **Admin Endpoints**
```javascript
POST   /api/admin/login          // Validate admin key
PATCH  /api/admin/reports/:id    // Mark as fixed/pending
GET    /api/admin/stats          // Get statistics
```

#### 3. **Token Service**
- Generate cryptographically secure token (32-byte hex)
- Hash token before storing in database
- Validate token on update/delete operations
- Never expose raw tokens in responses

#### 4. **Validation & Security**
- Rate limiting: 10 reports per IP per hour
- Input sanitization (XSS prevention)
- Image size/type validation (max 5MB, jpg/png only)
- Geographic bounds validation (must be within Chepintsi area)

---

## 🗄️ Data Models

### Report Entity
```javascript
{
  id: UUID,
  location: {
    latitude: Float,      // WGS84
    longitude: Float,     // WGS84
    address: String       // Optional reverse-geocoded
  },
  description: String,     // Max 500 chars
  photoUrl: String | null,
  status: Enum['pending', 'fixed'],
  reporterName: String | null,  // Optional
  contactInfo: String | null,   // Optional email/phone
  tokenHash: String,       // Hashed ownership token
  createdAt: DateTime,
  updatedAt: DateTime,
  fixedAt: DateTime | null,
  fixedBy: String | null   // Admin identifier
}
```

### Admin Entity
```javascript
{
  id: UUID,
  name: String,
  keyHash: String,         // Hashed admin key
  createdAt: DateTime
}
```

### Database Schema (Prisma)
```prisma
model Report {
  id          String   @id @default(uuid())
  latitude    Float
  longitude   Float
  address     String?
  description String   @db.VarChar(500)
  photoUrl    String?
  status      Status   @default(PENDING)
  reporterName String?
  contactInfo String?
  tokenHash   String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  fixedAt     DateTime?
  fixedBy     String?
}

enum Status {
  PENDING
  FIXED
}

model Admin {
  id        String   @id @default(uuid())
  name      String
  keyHash   String   @unique
  createdAt DateTime @default(now())
}
```

---

## 🔄 Data Flow

### 1. Creating a Report

```
User selects location on map
       │
       ▼
Fills form (description, optional photo)
       │
       ▼
Frontend generates ownership token (UUID)
       │
       ▼
POST /api/reports
  Body: { lat, lng, description, photo }
  Header: X-Ownership-Token: <token>
       │
       ▼
Backend validates input
       │
       ▼
Backend hashes token, saves report
       │
       ▼
Returns report data (without token)
       │
       ▼
Frontend stores { reportId: token } in localStorage
       │
       ▼
Display success + show report on map
```

### 2. Editing Own Report

```
User clicks "Edit" on their report
       │
       ▼
Frontend checks localStorage for token
       │
       ▼
Opens edit form with current data
       │
       ▼
User modifies and submits
       │
       ▼
PATCH /api/reports/:id
  Header: X-Ownership-Token: <token>
  Body: { description, status }
       │
       ▼
Backend verifies token hash matches
       │
       ▼
Updates report in database
       │
       ▼
Returns updated report
       │
       ▼
Frontend refreshes map
```

### 3. Admin Marking as Fixed

```
Admin logs in with admin key
       │
       ▼
POST /api/admin/login
  Body: { adminKey }
       │
       ▼
Backend validates key, returns session token
       │
       ▼
Frontend stores admin session
       │
       ▼
Admin clicks "Mark as Fixed" on report
       │
       ▼
PATCH /api/admin/reports/:id
  Header: X-Admin-Token: <session>
  Body: { status: 'fixed' }
       │
       ▼
Backend validates admin session
       │
       ▼
Updates report status, sets fixedAt timestamp
       │
       ▼
Returns updated report
       │
       ▼
Frontend updates map marker color
```

---

## 🔐 Security Considerations

### Client-Side Ownership Token
**Why this approach?**
- No user accounts needed (low friction)
- Users can still manage their reports
- Simple for village-scale app

**Implementation:**
1. Frontend generates UUID on report creation
2. Token sent to backend in header
3. Backend hashes token (bcrypt/argon2) before storage
4. Token stored in localStorage (never sent to user again)
5. User can edit/delete only if they have token

**Limitations:**
- User loses access if localStorage cleared
- No cross-device ownership
- Acceptable trade-off for simplicity

### Admin Authentication
**Simple Key-Based:**
- Single admin key stored in `.env`
- Admin enters key to log in
- Backend issues JWT with short expiry (2 hours)
- For village scale, this is sufficient

**Future Enhancement:**
- Multiple admin accounts with bcrypt-hashed passwords
- Role-based permissions (viewer, moderator, admin)

### Rate Limiting
- **Report creation**: 10 per IP per hour
- **Admin login**: 5 attempts per IP per 15 minutes
- **Photo upload**: Max 3 per report

### Input Validation
- Coordinates must be within Chepintsi bounding box:
  - Lat: 42.68 - 42.73
  - Lng: 23.68 - 23.75
- Description: 10-500 characters, sanitized HTML
- Photo: max 5MB, MIME types: image/jpeg, image/png

---

## 🚀 Deployment Architecture

### Hosting Options

#### Option 1: Single Server (Recommended for MVP)
- **VPS**: DigitalOcean Droplet ($12/month) or Hetzner
- **Setup**: Nginx reverse proxy + Node.js + PostgreSQL
- **Domain**: svetniche.chepintsi.bg
- **SSL**: Let's Encrypt (free)

#### Option 2: Serverless/PaaS
- **Frontend**: Vercel or Netlify (free tier)
- **Backend**: Railway.app or Render (free tier with sleep)
- **Database**: Supabase (free tier, PostgreSQL + PostGIS)

### Environment Variables
```bash
# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/svetniche
ADMIN_KEY=<secure-random-key>
JWT_SECRET=<secure-random-secret>
UPLOAD_DIR=/var/uploads
MAX_FILE_SIZE=5242880  # 5MB
CORS_ORIGIN=https://svetniche.chepintsi.bg
```

```javascript
// Frontend (.env)
VITE_API_URL=https://api.svetniche.chepintsi.bg
VITE_MAP_CENTER_LAT=42.7050
VITE_MAP_CENTER_LNG=23.7250
VITE_MAP_ZOOM=15
```

---

## 📊 API Contract

### Response Format
```javascript
// Success
{
  success: true,
  data: { ... }
}

// Error
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Description must be at least 10 characters"
  }
}
```

### Detailed Endpoints

#### `POST /api/reports`
**Request:**
```javascript
Headers: {
  'Content-Type': 'application/json',
  'X-Ownership-Token': 'uuid-v4-token'
}
Body: {
  latitude: 42.7050,
  longitude: 23.7250,
  description: "Street light on Main Street is not working",
  reporterName: "Ivan", // optional
  contactInfo: "ivan@email.com" // optional
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    id: "uuid",
    location: { latitude: 42.7050, longitude: 23.7250 },
    description: "...",
    status: "pending",
    createdAt: "2026-01-23T10:00:00Z",
    photoUrl: null
  }
}
```

#### `GET /api/reports`
**Query Params:**
- `status` (optional): "pending" | "fixed" | "all"
- `limit` (optional): number, default 100
- `offset` (optional): number, default 0

**Response:**
```javascript
{
  success: true,
  data: {
    reports: [ /* array of reports */ ],
    total: 45,
    pending: 12,
    fixed: 33
  }
}
```

#### `PATCH /api/reports/:id`
**Request:**
```javascript
Headers: {
  'X-Ownership-Token': 'user-token'
}
Body: {
  description: "Updated description"
}
```

#### `PATCH /api/admin/reports/:id`
**Request:**
```javascript
Headers: {
  'Authorization': 'Bearer <admin-jwt>'
}
Body: {
  status: "fixed"
}
```

---

## 🎨 UI/UX Considerations

### Map Interface
- **Center**: Chepintsi village center (42.7050, 23.7250)
- **Zoom**: 15 (street level)
- **Markers**: 
  - 🔴 Red for pending reports
  - 🟢 Green for fixed reports
  - Cluster markers when > 5 in small area

### Responsive Design
- Mobile-first approach (most users on phones)
- Bottom sheet for report form on mobile
- Side panel for desktop
- Touch-friendly marker interaction

### Bulgarian Localization
- All UI text in Bulgarian
- Date/time in Bulgarian format
- Address search in Bulgarian (if geocoding added)

### Accessibility
- ARIA labels for map interactions
- Keyboard navigation support
- High contrast mode for markers
- Alt text for uploaded photos

---

## 📈 Future Enhancements

### Phase 2
- Email notifications to admins on new report
- WhatsApp integration for village community group
- Report categories (broken light, damaged pole, etc.)
- Photo gallery (multiple photos per report)

### Phase 3
- PWA (offline support, install to home screen)
- Push notifications when report is fixed
- Historical data visualization
- Export reports to CSV for municipality

### Phase 4
- Multi-language support (Bulgarian/English)
- Expand to nearby villages
- Integration with municipal tracking system
- Public API for transparency

---

## 🛠️ Development Workflow

### Local Development
```bash
# Frontend
cd frontend
npm install
npm run dev        # http://localhost:5173

# Backend
cd backend
npm install
npm run dev        # http://localhost:3000

# Database
docker-compose up  # PostgreSQL + PostGIS
npm run migrate    # Run Prisma migrations
```

### Git Workflow
```
main           (production)
  ↑
develop        (staging)
  ↑
feature/*      (feature branches)
```

### Testing Strategy
- **Frontend**: Vitest + React Testing Library
- **Backend**: Jest + Supertest
- **E2E**: Playwright
- **Manual**: Test on real mobile devices before launch

---

## 📝 Next Steps

1. ✅ **Initialize React + Vite app** (DONE)
2. **Frontend Setup**:
   - Install Leaflet.js + TailwindCSS
   - Create map component with Chepintsi center
   - Build report form component
   - Implement localStorage token management
3. **Backend Setup**:
   - Initialize Node.js/Express project
   - Set up PostgreSQL with PostGIS
   - Create Prisma schema
   - Implement report CRUD endpoints
4. **Integration**:
   - Connect frontend to backend API
   - Test report creation flow
   - Implement admin panel
5. **Deployment**:
   - Set up VPS or Railway
   - Configure domain + SSL
   - Deploy and test in production

---

## 📞 Questions to Consider

1. **Photos**: Should users be required to upload photos? Optional is more user-friendly.
2. **Admin Key**: Who will be the admin? How to securely share the key?
3. **Hosting Budget**: What's the monthly budget? Affects hosting choice.
4. **Domain**: Already have `chepintsi.bg` or need to register?
5. **Municipality Integration**: Will this feed into official municipal systems?

---

**Architecture Version**: 1.0  
**Last Updated**: January 23, 2026  
**Prepared for**: Chepintsi Village - Svetniche Project
