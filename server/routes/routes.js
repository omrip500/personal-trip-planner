const express = require('express');
const Route = require('../models/Route');
const authenticate = require('../middleware/auth');
const noCache = require('../middleware/noCache');
const mongoose = require('mongoose');
const router = express.Router();

router.post('/save-route', authenticate, async (req, res) => {
    try {
        const { name, description, tripTypeVal, city, cityImageUrl, coordinates, waypoints, distance } = req.body;
        const route = await Route.create({
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
        res.json({ success: true, route });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/route-history', authenticate, noCache, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        const totalRoutes = await Route.countDocuments({ userId: req.user.id });
        const routes = await Route.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalRoutes / limit);

        res.json({
            routes,
            currentPage: page,
            totalPages: totalPages,
            totalRoutes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/view-route/:id', authenticate, noCache, async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        
        // Debug logging
        console.log('Route ID:', req.params.id);
        console.log('User ID from token:', req.user.id);
        console.log('Route found:', route ? 'Yes' : 'No');
        if (route) {
            console.log('Route userId:', route.userId);
            console.log('Match:', route.userId === req.user.id);
        }
        
        if (!route) {
            return res.status(404).json({ error: 'Route not found' });
        }
        
        // Convert both to strings for comparison
        if (route.userId.toString() !== req.user.id.toString()) {
            return res.status(404).json({ error: 'Route not found' });
        }
        
        res.json({ route });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/route/:id', authenticate, async (req, res) => {
    const routeId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(routeId)) {
        return res.status(400).json({ error: 'Invalid route ID' });
    }

    try {
        const deleted = await Route.findOneAndDelete({ _id: routeId, userId: req.user.id });

        if (!deleted) {
            return res.status(404).json({ error: 'Route not found or unauthorized' });
        }

        res.json({ success: true, message: 'Route deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
