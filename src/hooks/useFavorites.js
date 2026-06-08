import { useState, useEffect } from 'react';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('tabibi_favorites');
        if (stored) {
            setFavorites(JSON.parse(stored));
        }
    }, []);

    const toggleFavorite = (doctorId) => {
        let newFavorites;
        if (favorites.includes(doctorId)) {
            newFavorites = favorites.filter(id => id !== doctorId);
        } else {
            newFavorites = [...favorites, doctorId];
        }
        setFavorites(newFavorites);
        localStorage.setItem('tabibi_favorites', JSON.stringify(newFavorites));
    };

    const isFavorite = (doctorId) => favorites.includes(doctorId);

    return { favorites, toggleFavorite, isFavorite };
};
