# 🏫 Campus Navigator — Shortest Path & Accessible Route Finder

**Campus Navigator** is a responsive full-stack web application designed to help university students, faculty, and campus visitors find the shortest walking routes between buildings, research labs, hostels, and recreational amenities on a college campus.

Powered by a pure JavaScript implementation of **Dijkstra’s algorithm**, Campus Navigator models the campus pedestrian walkway network as a weighted graph, calculating minimum-distance paths, estimated walking times, turn-by-turn guidance, and dedicated **wheelchair-accessible routes** that avoid stairs and steep outdoor steps.

---

## 🌟 Key Features

### 🗺️ 1. Interactive Campus Map (Leaflet.js & OpenStreetMap)
- **High-Contrast CartoDB & OSM Tiles**: Clear campus map visualization.
- **Custom Location Markers**: Distinct color-coded icons for academic buildings, libraries, administrative offices, dining facilities, residences, sports complexes, and health clinics.
- **Dynamic Route Visualization**: Calculated route rendered as a highlighted polyline with directional indicators.
- **Interactive Building Popups**: Click any location on the map to view building information and set it as a starting point or destination.
- **Full Walkway Network Layer**: Option to toggle visibility of all campus walking paths.

### 🔍 2. Intelligent Location Search & Swapping
- Searchable starting-point and destination inputs with categorized building lists and keyword search (e.g., "LIB-01", "Hostel", "Lab").
- Instant swap button with smooth animation to invert your origin and destination.
- Preset one-click quick routes (e.g. *Main Gate → Library*, *Canteen → CS Lab*, *North Hostel → Auditorium*).

### ♿ 3. Wheelchair-Accessible Routing
- Graph edges store attributes for stairs (`hasStairs: true/false`), surface types (`paved`, `ramped`, `stairs`, `tile`), and accessibility ratings.
- Toggling **Wheelchair Accessible Route** automatically excludes stairs (such as the steep 32-step Library terrace shortcut or amphitheater bleachers) and recalculates the shortest path using accessible ramps.
- Immediate detection and reporting if no barrier-free route exists between disconnected points.

### 🧭 4. Turn-by-Turn Route Guidance
- **Total Distance**: Accurate path distance calculated in meters.
- **Estimated Walking Time**: Calculated dynamically based on walking speed (~80 m/min standard, ~65 m/min ramp/wheelchair pace).
- **Step-by-Step Directions**: Clear guidance with distance per segment, surface indicators, and stair/ramp warnings.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router, Leaflet.js, React Leaflet, Lucide React, Modern Custom CSS Design System |
| **Backend** | Node.js, Express.js, REST API, CORS, Dotenv, Mongoose (Optional) |
| **Algorithm** | Dijkstra's Shortest Path Algorithm implemented in pure JavaScript with Priority Queue |
| **Data & Storage** | In-memory campus graph seed data (12 key buildings, 7 junctions, 25 bidirectional path segments) + MongoDB Mongoose integration |

---

## 📁 Repository Architecture

```text
sortest route project/
├── backend/
│   ├── algorithms/
│   │   └── dijkstra.js            # Dijkstra shortest path algorithm & graph builder
│   ├── controllers/
│   │   ├── locationController.js  # Campus locations & graph retrieval controllers
│   │   └── routeController.js     # Route calculation handler
│   ├── data/
│   │   └── campusData.js          # Seed dataset (12 buildings, 7 junctions, 25 paths)
│   ├── middleware/
│   │   └── errorMiddleware.js     # 404 handler, error boundary & admin protection
│   ├── models/
│   │   ├── Location.js            # Mongoose schema for campus locations
│   │   └── Path.js                # Mongoose schema for walkable paths
│   ├── routes/
│   │   ├── locationRoutes.js      # /api/locations endpoints
│   │   └── routeRoutes.js         # /api/routes endpoints
│   ├── tests/
│   │   └── dijkstra.test.js       # Automated tests verifying algorithm optimality
│   ├── .env                       # Backend environment configuration
│   ├── package.json
│   └── server.js                  # Main Express server entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AboutModal.jsx             # System architecture & status modal
│   │   │   ├── AccessibilityInfoModal.jsx # Wheelchair routing documentation modal
│   │   │   ├── CampusDirectoryModal.jsx   # Searchable directory of all buildings
│   │   │   ├── CampusMap.jsx              # Leaflet interactive map & polyline drawer
│   │   │   ├── LocationPickerModal.jsx    # Searchable location selector
│   │   │   ├── Navbar.jsx                 # Header bar with API status badge
│   │   │   ├── RouteDetailsCard.jsx       # Distance, duration & turn guidance
│   │   │   └── RouteSearchPanel.jsx       # Inputs, swap button & accessible toggle
│   │   ├── services/
│   │   │   └── api.js                     # REST API client
│   │   ├── App.jsx                        # Main application container
│   │   ├── index.css                      # Design system tokens, glassmorphism & theme
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js                     # Vite configuration with /api reverse proxy
├── package.json                           # Root convenience script runner
└── README.md
```

---

## 🚀 Quick Start & Setup

### Prerequisites
- **Node.js** (v18.x or newer)
- **npm** (v9.x or newer)

---

### Step 1: Install Dependencies

From the project root directory, install dependencies for both backend and frontend:

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install

cd ..
```

---

### Step 2: Start the Backend Server

```bash
cd backend
npm run dev
```

The Express API will start on **`http://localhost:5000`**.

Verify backend health in your browser or terminal:
```bash
curl http://localhost:5000/api/health
```

---

### Step 3: Start the Frontend Application

In a separate terminal window:

```bash
cd frontend
npm run dev
```

The Vite dev server will start on **`http://localhost:5173`**.

Open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 🧪 Running Algorithm Tests

Automated unit tests verify the Dijkstra algorithm for shortest path correctness, stair avoidance, wheelchair ramp preference, same-point queries, and invalid inputs:

```bash
cd backend
npm test
```

Expected output:
```text
🧪 Running Dijkstra Algorithm Tests...

  ✅ PASS: Finds route from Main Gate to Admin Block
  ✅ PASS: Distance is 245m (115m + 130m). Got: 245
  ✅ PASS: Optimal sequence verified
  ✅ PASS: Finds route to library
  ✅ PASS: Chooses 185m stairs shortcut. Got: 185
  ✅ PASS: Detects route has stairs
  ✅ PASS: Finds wheelchair-accessible route to library
  ✅ PASS: Chooses 245m accessible ramp detour. Got: 245
  ✅ PASS: Route is fully accessible
  ✅ PASS: Zero distance for identical start & destination
  ✅ PASS: Handles non-existent location ID gracefully
  ✅ PASS: Finds multi-hop path across campus
  ✅ PASS: Generates step-by-step guidance

Results: 13/13 tests passed.
```

---

## 📡 Express REST API Documentation

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "ok",
  "service": "Campus Navigator API",
  "version": "1.0.0",
  "timestamp": "2026-10-13T18:53:29.615Z",
  "mongoConnected": false,
  "algorithm": "Dijkstra",
  "uptimeSeconds": 120
}
```

### 2. Retrieve Campus Locations
- **Endpoint**: `GET /api/locations`
- **Optional Query Parameters**:
  - `includeJunctions=true|false` (default: `false` for user-facing building lists)
  - `category=academic|amenity|residential|...`
  - `search=string`
- **Response**:
```json
{
  "success": true,
  "count": 12,
  "dataSource": "SeedData",
  "locations": [
    {
      "id": "main-gate",
      "name": "Main Campus Gate",
      "shortName": "Main Gate",
      "category": "entry",
      "code": "MG-01",
      "description": "Primary campus entrance, visitor security kiosk, and bus transit stop.",
      "coordinates": [28.5410, 77.1900],
      "accessible": true,
      "features": ["Security Checkpoint", "Bicycle Parking", "Visitor Badge Counter", "Bus Stop"]
    }
  ]
}
```

### 3. Retrieve Location by ID
- **Endpoint**: `GET /api/locations/:id`
- **Example**: `GET /api/locations/library`

### 4. Retrieve Full Graph for Map Rendering
- **Endpoint**: `GET /api/locations/graph/all`
- Returns all campus buildings, pathway junctions, and connecting paths with geometry.

### 5. Calculate Shortest Route (Dijkstra)
- **Endpoint**: `POST /api/routes`
- **Content-Type**: `application/json`
- **Request Body**:
```json
{
  "startId": "main-gate",
  "destinationId": "library",
  "accessibleOnly": false
}
```
- **Response**:
```json
{
  "success": true,
  "route": [
    "main-gate",
    "junction-gate",
    "admin-block",
    "junction-central",
    "library"
  ],
  "distanceMeters": 570,
  "estimatedMinutes": 7.1,
  "algorithm": "Dijkstra",
  "isAccessible": false,
  "accessibleOnly": false,
  "steps": [
    {
      "stepNumber": 1,
      "instruction": "Start at Main Campus Gate (MG-01)",
      "distance": 0,
      "type": "depart"
    },
    {
      "stepNumber": 2,
      "instruction": "Walk along Main Palm Avenue towards Main Avenue Crossing.",
      "distance": 115,
      "surface": "paved",
      "accessible": true,
      "hasStairs": false,
      "type": "walk"
    },
    {
      "stepNumber": 5,
      "instruction": "Ascend/descend stairs via Library Terrace Stone Steps towards Central Knowledge Library.",
      "distance": 185,
      "surface": "stairs",
      "accessible": false,
      "hasStairs": true,
      "type": "walk"
    },
    {
      "stepNumber": 6,
      "instruction": "Arrive at your destination: Central Knowledge Library.",
      "distance": 0,
      "type": "arrive"
    }
  ]
}
```

*When `accessibleOnly` is set to `true`, the stairs edge (`185m`) is excluded and the accessible ramp path (`245m`) is chosen instead, yielding `distanceMeters: 630` and `isAccessible: true`.*

### 6. Protected Admin Location Creation
- **Endpoint**: `POST /api/admin/locations`
- **Headers**:
  - `x-admin-key: campus-navigator-admin-secret-2026`
- **Request Body**:
```json
{
  "id": "new-research-lab",
  "name": "Quantum Computing Lab",
  "category": "academic",
  "code": "QC-01",
  "coordinates": [28.5470, 77.1950],
  "accessible": true
}
```

---

## 🍃 MongoDB Integration (Optional)

Campus Navigator works out-of-the-box using the built-in campus seed data. To persist data in a MongoDB database:

1. Open `backend/.env`.
2. Add your MongoDB connection string:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campus_navigator?retryWrites=true&w=majority
   ```
3. Restart the backend server. The backend will automatically detect the connection, log `🍃 MongoDB connected successfully`, and switch data queries to MongoDB via Mongoose.

---

## 📐 Algorithm Explanation: Dijkstra's Weighted Graph Traversal

Dijkstra’s algorithm computes the shortest path from a starting vertex $s$ to all other vertices in a weighted, non-negative graph $G = (V, E)$.

1. **Initialization**: Distance to $s$ is set to $0$ ($d[s] = 0$) and all other vertices $v \in V \setminus \{s\}$ are set to $\infty$.
2. **Priority Queue**: Unvisited vertices are prioritized by their current tentative distance $d[u]$.
3. **Edge Relaxation**: For vertex $u$ with minimum tentative distance:
   For every incident edge $(u, v) \in E$ with weight $w(u, v)$:
   $$\text{if } d[u] + w(u, v) < d[v] \implies d[v] = d[u] + w(u, v)$$
4. **Constraint Filtering**: When wheelchair accessibility is enabled, edges with `hasStairs === true` or `accessible === false` are filtered out during graph initialization.
5. **Backtracking**: The ordered sequence of vertices is reconstructed using predecessor pointers.

---

## 📄 License
This project is licensed under the MIT License.
