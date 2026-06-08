
import { doctors as localDoctors } from '../data/mockData';
import { supabase } from '../lib/supabase';

// Helper to check if Supabase is configured
const isSupabaseReady = () => {
    return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
};

export const getDoctors = async ({ page = 1, itemsPerPage = 12, specialty = '', city = '', availability = '' }) => {
    if (isSupabaseReady()) {
        let query = supabase
            .from('doctors')
            .select('*', { count: 'exact' });

        if (specialty) query = query.ilike('specialty', `%${specialty}%`);
        if (city) query = query.ilike('city', `%${city}%`);
        // if (availability) ... (requires array logic in Supabase, keeping simple for now or using contains)

        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        const { data, count, error } = await query.range(from, to);

        if (error) {
            console.error('Supabase error:', error);
            return { data: [], count: 0, error };
        }

        // Apply Smart Ranking (Trust Score)
        // Score = Rating (0-5) - (ReportCount * 0.5)
        // Verified doctors get +0.5 bonus
        const rankedDocs = (data || []).sort((a, b) => {
            const getScore = (doc) => {
                let score = doc.rating || 0;
                const reportPenalty = (doc.reports?.length || 0) * 0.5;
                const verifiedBonus = doc.is_verified ? 0.5 : 0;
                return score - reportPenalty + verifiedBonus;
            };
            return getScore(b) - getScore(a); // Descending
        });

        return { data: rankedDocs, count: count || 0, error: null };
    }

    // Fallback if config is missing (Return Mock Data)
    const filtered = localDoctors.filter(d => {
        const matchesSpecialty = specialty ? d.specialty === specialty : true;
        const matchesCity = city ? d.city === city : true;
        return matchesSpecialty && matchesCity;
    });

    // Apply Smart Ranking (Trust Score)
    const rankedDocs = filtered.sort((a, b) => {
        const getScore = (doc) => {
            let score = doc.rating || 0;
            const reportPenalty = (doc.reports?.length || 0) * 0.5;
            // We don't have is_verified in mock yet, but logic is ready
            return score - reportPenalty;
        };
        return getScore(b) - getScore(a);
    });

    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage;
    const paginated = rankedDocs.slice(from, to);

    return { data: paginated, count: filtered.length, error: null };
};

export const getDoctorById = async (id) => {
    if (isSupabaseReady()) {
        const { data, error } = await supabase
            .from('doctors')
            .select('*')
            .eq('id', id)
            .single();
        return { data, error };
    }
    return { data: null, error: 'Supabase not configured' };
};
export const updateDoctor = async (id, updates) => {
    if (isSupabaseReady()) {
        const { data, error } = await supabase
            .from('doctors')
            .update(updates)
            .eq('id', id)
            .select();
        return { data, error };
    }
    return { error: 'Supabase not configured' };
};

export const deleteDoctor = async (id) => {
    if (isSupabaseReady()) {
        const { error } = await supabase
            .from('doctors')
            .delete()
            .eq('id', id);
        return { error };
    }
    return { error: 'Supabase not configured' };
};

export const submitReport = async (doctorId, reason, details) => {
    if (isSupabaseReady()) {
        const { data, error } = await supabase
            .from('reports')
            .insert([{ doctor_id: doctorId, reason, details }])
            .select();
        return { data, error };
    }
    return { error: 'Supabase not configured' };
};

// Admin Stats
export const getSystemStats = async () => {
    if (isSupabaseReady()) {
        const { count, error } = await supabase
            .from('doctors')
            .select('*', { count: 'exact', head: true });
        return { totalDoctors: count || 0, error };
    }
    return { totalDoctors: 0, error: 'Supabase not configured' };
};
