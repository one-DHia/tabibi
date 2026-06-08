
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, image, type = 'website' }) => {
    const location = useLocation();
    const siteUrl = 'https://tabibi.dz'; // Placeholder production URL
    const fullUrl = `${siteUrl}${location.pathname}`;

    const defaultTitle = 'Tabibi - Trouvez un médecin en Algérie';
    const defaultDescription = 'La première plateforme de prise de rendez-vous médicaux en Algérie. Trouvez un cardiologue, dentiste ou généraliste à Alger, Oran, Constantine...';
    const defaultImage = `${siteUrl}/og-image.jpg`;

    const finalTitle = title ? `${title} | Tabibi` : defaultTitle;
    const finalDescription = description || defaultDescription;
    const finalImage = image || defaultImage;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={finalDescription} />
            <meta property="twitter:image" content={finalImage} />
        </Helmet>
    );
};

export default SEO;
