const express = require('express');
const Route = require('../models/Route');
const authenticate = require('../middleware/auth');
const noCache = require('../middleware/noCache');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/plan-route', authenticate, noCache, (req, res) => {
    res.render('plan-route', { user: req.user, title: 'Plan Route - TripPlanner' });
});

router.post('/save-route', authenticate, async (req, res) => {
    const { name, description, tripTypeVal, city, cityImageUrl, coordinates, waypoints, distance } = req.body;
    await Route.create({
        userId: req.user.id,
        name,
        description,
        tripType: tripTypeVal,
        city,
        cityImageUrl,
        coordinates: JSON.parse(coordinates),
        waypoints: JSON.parse(waypoints),
        distance
    });
    res.redirect('/route-history');
});

router.get('/route-history', authenticate, noCache, async (req, res) => {
    const page = parseInt(req.query.page) || 1;        // Current page, default 1
    const limit = 6;                                   // Routes per page
    const skip = (page - 1) * limit;

    // Count total routes for user
    const totalRoutes = await Route.countDocuments({ userId: req.user.id });

    // Fetch paginated routes
    const routes = await Route.find({ userId: req.user.id })
        .sort({ createdAt: -1 })                       // latest first
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(totalRoutes / limit);

    res.render('route-history', {
        routes,
        user: req.user,
        title: 'Route History - TripPlanner',
        currentPage: page,
        totalPages: totalPages
    });
});


router.get('/view-route/:id', authenticate, noCache, async (req, res) => {
    const route = await Route.findById(req.params.id);
    res.render('view-route', { route, user: req.user, title: 'Route View - TripPlanner' });
});

router.post('/route-history/delete/:id', authenticate, async (req, res) => {
    const routeId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(routeId)) {
        return res.status(400).send('Invalid route ID');
    }

    try {
        // Only delete if route belongs to logged-in user
        const deleted = await Route.findOneAndDelete({ _id: routeId, userId: req.user.id });

        if (!deleted) {
            return res.status(404).send('Route not found or unauthorized');
        }

        res.redirect('/route-history');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
