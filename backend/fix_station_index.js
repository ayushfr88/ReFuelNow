const mongoose = require('mongoose');
const Station = require('./models/Station');
require('dotenv').config();

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');

        // Check existing indexes
        const indexes = await Station.collection.getIndexes();
        console.log('Existing Indexes:', JSON.stringify(indexes, null, 2));

        // Create 2dsphere index if missing
        console.log('Ensuring 2dsphere index on location...');
        await Station.collection.createIndex({ location: '2dsphere' });

        console.log('Index creation command sent.');

        // Re-check
        const newIndexes = await Station.collection.getIndexes();
        console.log('Updated Indexes:', JSON.stringify(newIndexes, null, 2));

        mongoose.disconnect();
    } catch (err) {
        console.error('Error fixing indexes:', err);
    }
};

fixIndexes();
