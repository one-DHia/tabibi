
// scripts/uploadToSupabase.js
// Usage: node scripts/uploadToSupabase.js --url=YOUR_URL --key=YOUR_KEY

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to parse CLI args
const args = process.argv.slice(2);
const getArg = (name) => {
    const arg = args.find(a => a.startsWith(`--${name}=`));
    return arg ? arg.split('=')[1] : null;
};

const SUPABASE_URL = getArg('url') || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = getArg('key') || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Error: Missing Supabase credentials. Pass them via --url and --key arguments.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA_FILE_PATH = path.join(__dirname, '../src/data/realDoctors.json');

const main = async () => {
    console.log("🚀 Starting Upload to Supabase...");

    // Read data
    try {
        const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');

        let doctors = JSON.parse(rawData);
        console.log(`📋 Found ${doctors.length} doctors to upload.`);

        // SMART ID ASSIGNMENT
        // 1. Fetch all existing google_place_ids and their IDs from DB (Pagination required > 1000)
        let allExistingDocs = [];
        let page = 0;
        const PAGE_SIZE = 1000;
        let hasMore = true;

        console.log("📥 Fetching existing DB records...");

        while (hasMore) {
            const { data, error } = await supabase
                .from('doctors')
                .select('id, google_place_id')
                .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

            if (error) {
                console.error("❌ Error fetching page", page, error);
                process.exit(1);
            }

            if (data.length > 0) {
                allExistingDocs = [...allExistingDocs, ...data];
                page++;
            } else {
                hasMore = false;
            }
        }

        const idMap = new Map();
        let maxId = 0;

        allExistingDocs.forEach(row => {
            if (row.google_place_id) idMap.set(row.google_place_id, row.id);
            if (row.id > maxId) maxId = row.id;
        });

        // If maxId is still 0 (empty DB), start at 1 or 50000
        if (maxId === 0) maxId = 50000;

        console.log(`🧠 Knowledge Base: ${idMap.size} existing doctors. Max ID: ${maxId}`);

        doctors = doctors.map((doc) => {
            const { hours, is_emergency, id: ignoredId, ...rest } = doc;

            let finalId;
            if (idMap.has(doc.google_place_id)) {
                finalId = idMap.get(doc.google_place_id);
            } else {
                maxId++;
                finalId = maxId;
            }

            return {
                ...rest,
                id: finalId
            };
        });

        // Batch upload
        const BATCH_SIZE = 50; // Smaller batch for safety
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < doctors.length; i += BATCH_SIZE) {
            const batch = doctors.slice(i, i + BATCH_SIZE);

            // Clean data/Remap if necessary to match Table Schema EXACTLY
            // Table schema assumed: id (bigint), name, specialty, city, etc.
            // Note: Availability is an array, ensure DB has it as text[] or jsonb

            const { error } = await supabase
                .from('doctors')
                .upsert(batch, { onConflict: 'google_place_id' }); // Use google_place_id to avoid dupes

            if (error) {
                console.error(`❌ Error uploading batch ${i / BATCH_SIZE + 1}:`, error.message);
                failCount += batch.length;
            } else {
                process.stdout.write(`.`); // Progress dot
                successCount += batch.length;
            }
        }

        console.log(`\n\n✅ Upload Complete!`);
        console.log(`   Success: ${successCount}`);
        console.log(`   Failed: ${failCount}`);

    } catch (err) {
        console.error("❌ Critical Error:", err);
    }
};

main();
