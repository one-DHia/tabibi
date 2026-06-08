
const fs = require('fs');
const https = require('https');
const path = require('path');

// CONFIGURATION
// You must provide your key: node scripts/fetchDoctors.js KEY=YOUR_API_KEY
const args = process.argv.slice(2);
const keyArg = args.find(arg => arg.startsWith('KEY='));
const API_KEY = keyArg ? keyArg.split('=')[1] : process.env.VITE_GOOGLE_MAPS_API_KEY;

if (!API_KEY) {
    console.error('❌ ERROR: API Key is required.');
    console.error('Usage: node scripts/fetchDoctors.js KEY=AIzaSye...');
    process.exit(1);
}

const TARGET_WILAYAS = [
    { name: "Alger", location: "36.752887,3.042048" },
    { name: "Oran", location: "35.696956,-0.633100" },
    { name: "Constantine", location: "36.365,6.6147" },
    { name: "Bejaia", location: "36.755869,5.084334" }
];

const SPECIALTIES = [
    "cardiologue", "dentiste", "dermatologue", "gynécologue", "pédiatre", "médecin généraliste", "ophtalmologue"
];

// Map French search terms to english keys in DB
const SPECIALTY_MAP = {
    "cardiologue": "cardiologist",
    "dentiste": "dentist",
    "dermatologue": "dermatologist",
    "gynécologue": "gynecologist",
    "pédiatre": "pediatrician",
    "médecin généraliste": "general_practitioner",
    "ophtalmologue": "ophthalmologist"
};

const WAIT_BETWEEN_REQUESTS = 2000; // ms to avoid rate limits

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchPlaces(query, location) {
    return new Promise((resolve, reject) => {
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${location}&radius=5000&key=${API_KEY}`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.status === 'OK') {
                        resolve(json.results);
                    } else if (json.status === 'ZERO_RESULTS') {
                        resolve([]);
                    } else {
                        reject(new Error(json.error_message || json.status));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function fetchPlaceDetails(placeId) {
    return new Promise((resolve, reject) => {
        const fields = 'name,formatted_address,formatted_phone_number,international_phone_number,rating,user_ratings_total,types,geometry';
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.status === 'OK') {
                        resolve(json.result);
                    } else {
                        resolve(null); // Fail silent on details
                    }
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

async function main() {
    console.log('🚀 Starting Mass Doctor Fetch (Target: 300+ Verified)...');
    console.log(`Using API Key: ${API_KEY.substring(0, 10)}...`);

    let allDoctors = [];
    let sqlOutput = `-- AUTOMATICALLY GENERATED SEED FILE FROM GOOGLE MAPS
-- Generated on: ${new Date().toISOString()}
-- Contains REAL, VERIFIED Data from Maps API

TRUNCATE TABLE doctors RESTART IDENTITY CASCADE;

INSERT INTO doctors (name, specialty, city, address, phone, image, rating, reviews, price, availability, is_verified) VALUES
`;

    // Loop through cities and specialties
    for (const wilaya of TARGET_WILAYAS) {
        for (const specialty of SPECIALTIES) {
            console.log(`\n🔎 Searching for ${specialty} in ${wilaya.name}...`);
            try {
                const query = `${specialty} à ${wilaya.name}`;
                const results = await fetchPlaces(query, wilaya.location);

                console.log(`   Found ${results.length} raw results.`);

                for (const place of results) {
                    await sleep(300); // polite delay

                    // Fetch details for verification
                    const details = await fetchPlaceDetails(place.place_id);

                    if (!details) continue;

                    // STRICT VERIFICATION FILTER
                    // 1. Must have a phone number
                    if (!details.formatted_phone_number && !details.international_phone_number) {
                        // console.log(`   Skipping ${details.name}: No phone.`);
                        continue;
                    }

                    // 2. Address validation
                    if (!details.formatted_address || details.formatted_address.length < 10) {
                        // console.log(`   Skipping ${details.name}: Bad address.`);
                        continue;
                    }

                    // Mapping
                    const mappedDoc = {
                        name: details.name.replace(/'/g, "''"), // Escape SQL quotes
                        specialty: SPECIALTY_MAP[specialty],
                        city: wilaya.name.toLowerCase(),
                        address: details.formatted_address.replace(/'/g, "''"),
                        phone: (details.formatted_phone_number || details.international_phone_number).replace(/'/g, "''"),
                        image: `https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300&h=300`, // Placeholder
                        rating: details.rating || 0,
                        reviews: details.user_ratings_total || 0,
                        price: "2000 DA", // Placeholder
                        availability: `ARRAY['sunday', 'monday', 'wednesday', 'thursday']`,
                        is_verified: true
                    };

                    allDoctors.push(mappedDoc);
                    process.stdout.write('.'); // Progress dot
                }

            } catch (err) {
                console.error(`Error searching ${specialty} in ${wilaya.name}:`, err.message);
            }
            await sleep(WAIT_BETWEEN_REQUESTS);
        }
    }

    console.log(`\n\n✅ Verification Complete. Collected ${allDoctors.length} verified profiles.`);

    if (allDoctors.length === 0) {
        console.log("No doctors found. Check your API Key and Quota.");
        return;
    }

    // Generate SQL Values
    const sqlValues = allDoctors.map(d => `(
    '${d.name}',
    '${d.specialty}',
    '${d.city}',
    '${d.address}',
    '${d.phone}',
    '${d.image}',
    ${d.rating},
    ${d.reviews},
    '${d.price}',
    ${d.availability},
    true
)`).join(',\n');

    const finalSql = sqlOutput + sqlValues + ';';

    fs.writeFileSync(path.join(__dirname, '../supabase/seed_google.sql'), finalSql);
    console.log(`\n📄 SQL Script generated at: supabase/seed_google.sql`);
    console.log(`👉 Run this script in Supabase SQL Editor to populate your database with ${allDoctors.length} real doctors.`);
}

main();
