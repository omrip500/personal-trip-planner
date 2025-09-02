const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    description: String,
    tripType: String,
    city: String,
    cityImageUrl: String,
    coordinates: Array,
    waypoints: Array,
    distance: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Route', routeSchema);
