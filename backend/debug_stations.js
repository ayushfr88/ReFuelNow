const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const StationSchema = new mongoose.Schema({
    stationName: String,
    sellerId: mongoose.Schema.Types.ObjectId,
    location: Object,
    createdAt: Date
});
const Station = mongoose.model('Station', StationSchema);

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String
});
const User = mongoose.model('User', UserSchema);

async function checkStations() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const users = await User.find({});
        let output = '--- ALL USERS ---\n';
        users.forEach(u => {
            output += `ID: ${u._id} | Role: ${u.role} | Name: ${u.name}\n`;
        });

        const stations = await Station.find({});
        output += '\n--- ALL STATIONS ---\n';
        stations.forEach(s => {
            output += `Station: ${s.stationName} | SellerID: ${s.sellerId}\n`;
        });

        fs.writeFileSync('debug_output.txt', output);
        console.log('Output written to debug_output.txt');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkStations();
