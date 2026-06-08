
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ALLOWED_CITIES = ['algiers', 'oran', 'constantine', 'annaba', 'adrar'];

const main = async () => {
    console.log('🗑️ Purging doctors from non-verified cities...');

    // We need to match case-insensitive or normalized. 
    // The previous fetch script used the city name as key. 
    // Let's normalize everything to lowercase for the check if possible, 
    // or just use the exact strings 'Alger', 'Oran' etc if that's what's in DB.
    // Actually, fetchDoctors maps 'Alger' -> 'Alger' (or 'algiers'?).
    // Let's check the previous `mapPlaceToDoctor` in fetchDoctors.js:
    // `city: cityKey` -> cityKey was "Alger", "Oran" etc from the array.
    // BUT `mockData.js` used "algiers", "oran".
    // Let's delete everything that is NOT in the allowed list (checking both English/French variants just in case).

    const allowed = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Adrar', 'algiers', 'oran', 'constantine', 'annaba', 'adrar'];

    // It's safer to fetch all, filter in JS, and delete by ID, 
    // or use a NOT IN filter.

    const { data: allDocs, error } = await supabase
        .from('doctors')
        .select('id, city');

    if (error) {
        console.error("Error fetching docs:", error);
        return;
    }

    const toDeleteIds = allDocs
        .filter(doc => !allowed.includes(doc.city) && !allowed.includes(doc.city?.toLowerCase()))
        .map(doc => doc.id);

    console.log(`Found ${toDeleteIds.length} doctors to purge out of ${allDocs.length} total.`);

    if (toDeleteIds.length > 0) {
        const { error: delError } = await supabase
            .from('doctors')
            .delete()
            .in('id', toDeleteIds);

        if (delError) {
            console.error("Error deleting:", delError);
        } else {
            console.log("✅ Purge successful.");
        }
    } else {
        console.log("Nothing to purge.");
    }
};

main();
