const mongoose = require('mongoose');
const Station = require('./models/Station');
require('dotenv').config();

const checkStations = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');

        const stations = await Station.find({});
        console.log(`Found ${stations.length} stations.`);

        stations.forEach(station => {
            console.log(`Station: ${station.stationName}, Status: ${station.status}, Coords: ${JSON.stringify(station.location?.coordinates)}`);
        });

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

checkStations();
