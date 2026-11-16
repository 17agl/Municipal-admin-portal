# EcoSort AI — Municipal Admin Portal (Operations & Command Center)

An enterprise-grade Municipal Command Dashboard engineered for City Urban Development Authorities, Sanitation Commissioners, Ward Supervisors, and Dispatchers. Built in seamless coordination with **EcoSort AI's Citizen Portal** and backend GIS telematics.

---

## 🌟 Key Features & Module Architecture

### 1. 🏛️ Admin Command Center (`/`)
- **8 Core Operational KPIs:**
  - **Total Complaints**: Aggregated tickets from citizen reports and automated camera scanners.
  - **Pending Complaints**: Unassigned backlog awaiting dispatcher triage.
  - **In-Progress Complaints**: Active field crews and compactor trucks dispatched on site.
  - **Resolved Complaints**: Verified cleanups with geotagged photo proof.
  - **Overdue Complaints**: Breached SLA response windows automatically flagged for supervisor escalation.
  - **Active Staff Members**: Real-time count of on-duty drivers, sanitary inspectors, and sweepers.
  - **Average Resolution Time**: City-wide resolution speed benchmark (hours).
  - **Ward-Wise Performance**: Live progress bars and SLA compliance ranking across all municipal wards.
- Interactive GIS Quick-Map preview, priority hotspot triage queue, and AI waste classification distribution donut chart.

### 2. 📋 Complaint Management (`/complaints`)
- Multi-dimensional filtering: Search by Ticket ID, citizen name, location, status, ward, priority tier (P1–P4), and AI waste category.
- One-click squad assignment modal with SLA deadline picker and field dispatcher instructions.
- Priority adjustment modal with automated escalation triggers.
- Direct administrative ticket intake for hotline phone callers.
- Instant CSV export of filtered complaint logs.

### 3. 🔍 Complaint Details (`/complaints/:id`)
- **Citizen Evidence Photo** with YOLOv11 AI detection overlay, classification confidence %, and model reasoning.
- **Geographic Details**: Reverse-geocoded address, ward jurisdiction, exact GPS coordinates, and Google Maps direct link.
- **Citizen Submitter Profile**: Name, phone, email, and community sighting frequency.
- **SLA Countdown & Overdue Watchdog**: Live status tracker against mandated municipal response windows.
- **Full Audit Timeline History**: Chronological log of ticket intake, hotspot elevation, squad dispatch, and supervisor verification.

### 4. 🗺️ Live Garbage Map (`/map`)
- Fullscreen Leaflet OpenStreetMap with real-time toggleable GIS layers:
  - **Complaint Markers**: Color-coded by status and priority tier.
  - **Hotspot Clusters**: Pulsating hazard zones with community report density.
  - **Ward Boundaries**: GeoJSON/Polygon outlines with supervisor contacts and resolution ratings.
  - **Smart IoT Bins**: Pins showing real-time fill level percentages.
  - **Fleet Vehicles**: Moving truck markers with live driver, speed, and payload tonnage.
- **Direct Municipal Action Hub**: Dispatch compactor truck, approve smart bin station, or mark area cleaned.

### 5. 👥 Staff Management (`/staff`)
- Comprehensive staff roster with employee avatars, designation, assigned ward, vehicle, rating, and shift timing.
- Search and filter by ward, team, or on-duty status (Active / On Leave / Off Duty).
- Modal to register new sanitation officers and update field squad profiles.

### 6. 🗂️ Task Assignment & Dispatch Board (`/tasks`)
- 4-column operational Kanban board:
  - *Unassigned Pending* (intake queue needing immediate squad dispatch)
  - *In-Progress Dispatched* (trucks en route with deadline timers)
  - *Overdue Escalations* (SLA breaches alerted to Ward Supervisors)
  - *Resolved & Cleared* (completed tickets verified with disposal slips)
- Re-assign squad and adjust deadline in one click.

### 7. 🚛 Collection Management (`/collections`)
- Automated weighbridge ticket recording: Gross mass, Tare mass, and Net waste (kg) calculator.
- Disposal destination assignment (Material Recovery Facility, Waste-to-Energy, Bio-Composting Park).
- Fleet inventory tracker with vehicle capacity, payload utilization %, fuel/SoC level, and maintenance dates.
- Weighbridge ticket CSV audit download.

### 8. 🛣️ Route Management (`/routes`)
- Active collection circuit tracking with stop checkpoints, vehicle assignment, distance (km), and estimated duration.
- **AI Route Optimizer**: Dynamic rerouting suggestions to skip low-fill bins, bypass traffic bottlenecks, and prioritize critical P1 hotspots.
- Interactive checkpoint logger (mark stops picked up in real time).

### 9. 🗑️ Smart Bin Monitoring (`/smart-bins`)
- Real-time ultrasonic fill level monitoring (color-coded gauges: Normal < 70%, High 70–84%, Overflow >= 85%).
- Automated **Critical Overflow Alerts** banner when bins exceed 85% capacity.
- Telemetry indicators: battery percentage, internal temperature, and capacity liters.
- One-click "Mark Emptied & Reset Sensor" action.

### 10. 📊 Impact Analytics (`/analytics`)
- Quantified ESG & Circular Economy metrics: Total waste diverted (Tons), Carbon emissions offset (MT CO2e), clean energy generated (kWh), and trees preserved.
- Ward resolution SLA ranking table with cleanest ward leaderboards.
- Segregated material recovery index.

### 11. 📑 Reports & Audits (`/reports`)
- One-click downloads for:
  - Daily Complaints & Resolution Audit (CSV)
  - Weekly Ward SLA Performance Audit (CSV)
  - Weighbridge Waste Tonnage Audit (CSV)
  - IoT Smart Bin Telemetry Report (CSV)
- Official Government Print Preview & Save-as-PDF generator with municipal letterhead formatting.

### 12. ⚙️ Settings & Governance (`/settings`)
- Municipal Ward boundary configuration (supervisors and daily tonnage targets).
- Mandated SLA priority thresholds (P1: 4 hrs, P2: 12 hrs, P3: 24 hrs, P4: 48 hrs).
- Solid Waste Bye-Laws & recycling rules table.
- Municipal Administrator role permissions and demo store reset.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 + Vite 8
- **Routing**: React Router DOM v7
- **GIS Mapping**: Leaflet 1.9.4 + OpenStreetMap tiles
- **Styling**: Modernized Eco-Gov design tokens with accessible status badges, glassmorphism modals, and responsive layout.
- **State Management**: React Context (`MunicipalProvider`, `AuthProvider`) with automatic `localStorage` synchronization.
- **Backend Telematics**: Connects to EcoSortAI FastAPI backend (`http://127.0.0.1:8000/gis/hotspots`) with graceful offline fallback.

---

## 🚀 Running the Municipal Portal

### 1. Environment Configuration (`.env`)
The portal reads its environment configuration from `.env` (copied from `.env.example`):
- `VITE_API_BASE_URL`: Citizen Portal FastAPI backend (default: `http://127.0.0.1:8000`)
- `VITE_MUNICIPAL_BACKEND_URL`: Municipal Admin FastAPI backend (default: `http://127.0.0.1:8001`)
- `VITE_MAP_DEFAULT_LAT` & `VITE_MAP_DEFAULT_LNG`: Initial GIS map center coordinates
- `VITE_MAP_DEFAULT_ZOOM`: Map zoom level (default: `13`)
- `VITE_SLA_P1_HOURS` to `VITE_SLA_P4_HOURS`: Mandated municipal SLA thresholds

### 2. Python Virtual Environment (`.venv`) & Backend
A dedicated Python virtual environment is initialized at `.venv/`. To launch the Municipal Backend API:

```powershell
# Activate the virtual environment
.\.venv\Scripts\Activate.ps1

# (Optional) Seed the database with sample tickets and IoT bins
python backend/seed.py

# Launch the FastAPI Municipal server on port 8001
python backend/main.py
```

### 3. Frontend Development Server
From `c:\Random projects\EcoSortAI\municipal`:

```bash
# Start frontend dashboard
npm run dev

# Or build for production
npm run build
```

Open `http://localhost:5174` (or port indicated in the terminal) to access the Municipal Admin Command Center.

