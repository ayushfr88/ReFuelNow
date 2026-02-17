const https = require('https');
// Using Node.js native https module for better control
exports.reverseGeocode = (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and Longitude are required' });
        }

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

        console.log(`Proxying geocode request to: ${url}`);

        const options = {
            headers: {
                'User-Agent': 'RefuelNow/1.0 (contact@refuelnow.com)'
            }
        };

        https.get(url, options, (apiRes) => {
            let data = '';

            // A chunk of data has been received.
            apiRes.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received.
            apiRes.on('end', () => {
                if (apiRes.statusCode >= 200 && apiRes.statusCode < 300) {
                    try {
                        const jsonData = JSON.parse(data);
                        console.log('Nominatim Response Success');
                        res.json(jsonData);
                    } catch (e) {
                        console.error('Error parsing JSON from Nominatim:', e.message);
                        res.status(500).json({ message: 'Error parsing geocoding response' });
                    }
                } else {
                    console.error(`Nominatim Error: ${apiRes.statusCode}`);
                    res.status(apiRes.statusCode).json({ message: 'Geocoding API Error', details: data });
                }
            });

        }).on("error", (err) => {
            console.error("Geocoding Request Error: " + err.message);
            res.status(500).json({ message: 'Failed to connect to geocoding service' });
        });

    } catch (err) {
        console.error('Geocoding Controller Error:', err.message);
        res.status(500).json({ message: 'Internal Server Error during geocoding' });
    }
};
