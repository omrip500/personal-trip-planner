# TripPlanner – Personal Trip Planner

## About the project
TripPlanner is a modern full‑stack web application that lets a registered user create two‑day cycling or trekking routes on an interactive map, save them, and view them later.  
While planning, the app shows the total distance, the daily split, a three‑day weather forecast for the start point, and a representative photo of the chosen city.

**🔥 Recently updated to modern client-server architecture:** This application has been restructured from a monolithic EJS-based application to a modern client-server architecture with React frontend and Express.js API backend.

---

## Main features
- **User account** – Register, log in, and log out.  
- **Plan a route** –  
  - Choose a city and a trip type (cycling 20‑50 km loop, trekking 5‑15 km loop).  
  - The map (Leaflet + OSRM) draws a realistic loop and colours each day in a different colour.  
  - Shows distance per day, total distance, weather forecast, and a city image (Unsplash).  
  - Save the route with a name and description.  
- **Route history** –  
  - See a paginated list of all routes you saved.  
  - View a route again on the map or delete it.
- **Private data** – Every route is stored in MongoDB with the user ID, so only the owner can see it.

---

## Quick start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally on default port)

### Installation & Running

1. **Start the Backend Server:**
   ```bash
   cd server
   npm install
   npm start
   ```
   Server will run on http://localhost:3000

2. **Start the Frontend Client:**
   ```bash
   cd client
   npm install
   npm start
   ```
   Client will run on http://localhost:3001

### Usage
1. Open your browser to http://localhost:3001
2. Register a new account or login with existing credentials
3. Use the application exactly as before - no changes to user experience

---

## Project structure
```
personal-trip-planner/
├── server/                 # Backend API server
│   ├── config/            # Database configuration
│   ├── middleware/        # Authentication & caching middleware
│   ├── models/            # MongoDB models (User, Route)
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   ├── package.json       # Server dependencies
│   └── .env              # Environment variables
├── client/                # React frontend application
│   ├── public/           # Static assets
│   ├── src/              # React source code
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   └── App.js        # Main React application
│   └── package.json      # Client dependencies
└── README.md             # This file
```

---

## Technologies used

### Backend
- Node.js, Express.js
- MongoDB with Mongoose  
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests

### Frontend
- React 19 with React Router
- Bootstrap 5 for styling
- Leaflet for interactive maps
- Leaflet‑Routing‑Machine for route generation
- Google Maps API for places autocomplete

### External APIs
- OpenWeatherMap forecast
- Unsplash photos
- OSRM for routing

---

## How to use
1. Open the app in your browser.  
2. Register a new account and log in.  
3. Go to **Plan Route**, pick a city and a trip type, then click **Generate Route**.  
4. Review the map, distances, weather, and photo.  
5. Give the route a name and description, then click **Save Route**.  
6. Visit **My Routes** to see everything you have planned.

Enjoy your trips!

---

## Architecture Changes

This application has been modernized from the original EJS-based monolith to a client-server architecture:

### What Changed
1. **Architecture Separation**: Split into `client/` and `server/` directories
2. **API-First Backend**: Converted EJS routes to JSON API endpoints  
3. **React Frontend**: Rebuilt all EJS templates as React components
4. **State Management**: Implemented React state for authentication and data
5. **Modern Routing**: Using React Router instead of server-side routing
6. **CORS Support**: Added cross-origin support for API communication

### API Endpoints

#### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login  
- `POST /api/logout` - User logout
- `GET /api/auth-status` - Check authentication status

#### Routes
- `POST /api/save-route` - Save a new route
- `GET /api/route-history` - Get user's routes (paginated)
- `GET /api/view-route/:id` - Get specific route details
- `DELETE /api/route/:id` - Delete a route

### What Stayed the Same
- **100% Feature Parity**: All functionality remains identical
- **User Experience**: No changes to UI/UX from end-user perspective
- **Database Schema**: MongoDB models and data structure unchanged
- **External Integrations**: Weather, Unsplash, and Google Maps APIs work identically
