const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/db');
connectDB();

const app = express();

// ✅ Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Routes
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/routes');

// ✅ Home Route
app.get('/', (req, res) => {
    if (req.cookies.token) {
        return res.redirect('/plan-route');
    }
    res.render('index', { title: 'Home - TripPlanner', user: null });
});


// ✅ Register other routes
app.use('/', authRoutes);
app.use('/', tripRoutes);

// ✅ Error Handling (Optional)
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found - TripPlanner' });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
