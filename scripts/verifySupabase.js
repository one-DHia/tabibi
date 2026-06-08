
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDoctors() {
    console.log('🔍 Checking Supabase Doctors...');

    const { data: doctors, error } = await supabase
        .from('doctors')
        .select('*');

    if (error) {
        console.error('❌ Error fetching records:', error.message);
        return;
    }

    console.log(`✅ Found ${doctors.length} doctors.`);

    if (doctors.length === 0) {
        console.log('⚠️ The table is empty! You need to run the seed.sql script in Supabase SQL Editor.');
    } else {
        console.table(doctors.map(d => ({
            id: d.id,
            name: d.name,
            city: d.city,
            address: d.address?.substring(0, 30) + '...',
            verified: d.is_verified
        })));
    }
}

checkDoctors();
