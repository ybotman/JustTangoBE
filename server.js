// server.js
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const allowedOrigins = [
    'https://proud-mud-0788d6f0f.5.azurestaticapps.net', // Init Cloud origin
    'https://wonderful-glacier-03516880f.5.azurestaticapps.net', // official test 
    'http://localhost:3000', // Local development origin
    'https://tangotiempo.com', // final production
   'https://www.tangotiempo.com' // final production
];


// Middleware setup
app.use(bodyParser.json());
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));


// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(`MongoDB connection error: ${err}`));

// Import routes
const eventRoutes = require('./routes/serverEvents');
const organizerRoutes = require('./routes/serverOrganizers');
const regionRoutes = require('./routes/serverRegions');
const categoryRoutes = require('./routes/serverCategories');
const locationRoutes = require('./routes/serverLocations');
const userLoginRoutes = require('./routes/serverUserLogins');
const firebaseRoutes = require('./routes/serverFirebase');

// Use routes
app.use('/api/events', eventRoutes);
app.use('/api/organizers', organizerRoutes);
app.use('/api/regions', regionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/userlogins', userLoginRoutes);
app.use('/api/firebase', firebaseRoutes);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});