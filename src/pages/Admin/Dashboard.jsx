
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Users, Activity, AlertTriangle, CheckCircle, XCircle,
    Search, Filter, Shield, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalContext: 0, pending: 0, reports: 0 });
    const [activeTab, setActiveTab] = useState('doctors'); // 'doctors', 'reports'
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchItems();
    }, [activeTab]);

    const fetchStats = async () => {
        // Quick counts
        // Note: Real counts should use count: 'exact'
        const { count: totalDocs } = await supabase.from('doctors').select('id', { count: 'exact' });
        const { count: pendingDocs } = await supabase.from('doctors').select('id', { count: 'exact' }).eq('is_verified', false);
        // Assuming 'reports' table exists and has status
        // const { count: pendingReports } = await supabase.from('reports').select('id', { count: 'exact' }).eq('status', 'pending');

        setStats({
            totalDocs: totalDocs || 0,
            pendingDocs: pendingDocs || 0,
            // reports: pendingReports || 0
            reports: 0 // Mock for now until table confirmed populated
        });
    };

    const fetchItems = async () => {
        setLoading(true);
        try {
            if (activeTab === 'doctors') {
                const { data, error } = await supabase
                    .from('doctors')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(50);
                if (data) setItems(data);
            } else if (activeTab === 'reports') {
                // Fetch reports
                setItems([]); // TODO
            }
        } catch (e) {
            console.error("Fetch error", e);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyParams = async (id, status) => {
        const { error } = await supabase
            .from('doctors')
            .update({ is_verified: status })
            .eq('id', id);

        if (!error) {
            // Optimistic update
            setItems(items.map(i => i.id === id ? { ...i, is_verified: status } : i));
            fetchStats();
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce profil ?")) return;

        const { error } = await supabase
            .from('doctors')
            .delete()
            .eq('id', id);

        if (!error) {
            setItems(items.filter(i => i.id !== id));
            fetchStats();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1a365d] text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-bold tracking-tight">Tabibi Admin</h1>
                    <p className="text-xs text-gray-400 mt-1">Super Admin Console</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('doctors')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'doctors' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                    >
                        <Users size={20} />
                        <span>Médecins</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'reports' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                    >
                        <AlertTriangle size={20} />
                        <div className="flex-1 flex justify-between items-center">
                            <span>Signalements</span>
                            {/* <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span> */}
                        </div>
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button onClick={logout} className="flex items-center space-x-2 text-gray-400 hover:text-white transition">
                        <LogOut size={18} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen">
                {/* Header */}
                <header className="bg-white border-b px-8 py-5 flex justify-between items-center sticky top-0 z-20">
                    <h2 className="text-xl font-bold text-gray-800">
                        {activeTab === 'doctors' ? 'Gestion des Médecins' : 'Signalements & Modération'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-right hidden sm:block">
                            <p className="font-semibold text-gray-900">Admin</p>
                            <p className="text-gray-500 text-xs">admin@tabibi.dz</p>
                        </div>
                        <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                            A
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-500 text-sm font-medium">Total Médecins</h3>
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Users size={20} />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stats.totalDocs}</div>
                            <div className="text-sm text-green-600 mt-2 flex items-center">
                                <Activity size={14} className="mr-1" /> Base de donnée active
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-500 text-sm font-medium">En Attente</h3>
                                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                                    <Shield size={20} />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stats.pendingDocs}</div>
                            <div className="text-sm text-gray-500 mt-2">Nécessitent une validation</div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-500 text-sm font-medium">Signalements</h3>
                                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                    <AlertTriangle size={20} />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stats.reports}</div>
                            <div className="text-sm text-gray-500 mt-2">Dossiers ouverts</div>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom, ville..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center text-gray-600">
                                    <Filter size={18} className="mr-2" /> Filtres
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-semibold">Médecin</th>
                                        <th className="px-6 py-4 font-semibold">Spécialité & Ville</th>
                                        <th className="px-6 py-4 font-semibold">Statut</th>
                                        <th className="px-6 py-4 font-semibold">Date d'inscription</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Chargement...</td>
                                        </tr>
                                    ) : items.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Aucune donnée trouvée.</td>
                                        </tr>
                                    ) : (
                                        items.map(doc => (
                                            <tr key={doc.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full overflow-hidden mr-3">
                                                            {doc.image ? (
                                                                <img src={doc.image} alt="" className="h-full w-full object-cover" />
                                                            ) : (
                                                                <div className="h-full w-full flex items-center justify-center text-gray-500 uppercase font-bold text-xs">
                                                                    {doc.name?.substring(0, 2)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{doc.name}</div>
                                                            <div className="text-xs text-gray-500">{doc.phone || 'Pas de téléphone'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{doc.specialty}</div>
                                                    <div className="text-xs text-gray-500">{doc.city}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {doc.is_verified ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Vérifié
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            En attente
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(doc.created_at || Date.now()).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    {!doc.is_verified && (
                                                        <button
                                                            onClick={() => handleVerifyParams(doc.id, true)}
                                                            className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-lg transition"
                                                            title="Valider"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    {doc.is_verified && (
                                                        <button
                                                            onClick={() => handleVerifyParams(doc.id, false)}
                                                            className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 p-2 rounded-lg transition"
                                                            title="Désactiver Vérification"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(doc.id)}
                                                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition"
                                                        title="Supprimer"
                                                    >
                                                        <LogOut size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                            <div>Affichage de 1 à {items.length} sur {stats.totalDocs} résultats</div>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Précédent</button>
                                <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Suivant</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
