import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix Leaflet Default Icon Issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom Marker Icons
const createCustomIcon = (specialty) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div class="w-10 h-10 rounded-full bg-white border-2 border-emerald-500 shadow-xl flex items-center justify-center text-xl overflow-hidden">
                <span class="scale-125">🏥</span>
              </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

// Component to recenter map when doctors change
const RecenterMap = ({ locations }) => {
    const map = useMap();
    useEffect(() => {
        if (locations.length > 0) {
            const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [locations, map]);
    return null;
};

const DoctorMap = ({ doctors }) => {
    // Filter doctors with valid coordinates (mocking coords if missing for demo)
    const doctorsWithCoords = doctors.map((doc, index) => {
        // Mock coordinates for demo (Algiers centered + random spread)
        // In real app, doctor.lat/lng would exist
        const baseLat = 36.75;
        const baseLng = 3.05;
        // Pseudo-random deterministic offset based on ID
        const offsetLat = (doc.id % 10 - 5) * 0.01;
        const offsetLng = (doc.id % 8 - 4) * 0.01;

        return {
            ...doc,
            lat: doc.lat || (baseLat + offsetLat),
            lng: doc.lng || (baseLng + offsetLng)
        };
    });

    if (doctorsWithCoords.length === 0) return null;

    return (
        <div className="h-[500px] w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200 relative z-0">
            <MapContainer
                center={[36.75, 3.05]}
                zoom={12}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterMap locations={doctorsWithCoords} />

                {doctorsWithCoords.map(doc => (
                    <Marker
                        key={doc.id}
                        position={[doc.lat, doc.lng]}
                        icon={createCustomIcon(doc.specialty)}
                    >
                        <Popup>
                            <div className="min-w-[150px]">
                                <h3 className="font-bold text-slate-800">{doc.name}</h3>
                                <p className="text-emerald-600 text-xs font-bold uppercase">{doc.specialty}</p>
                                <p className="text-slate-500 text-xs mt-1">{doc.address}</p>
                                <Link
                                    to={`/doctor/${doc.id}`}
                                    className="block mt-2 text-center bg-slate-900 text-white text-xs py-1 rounded hover:bg-slate-700"
                                >
                                    Voir Profil
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default DoctorMap;
