// Google Analytics 4 Configuration
// Este archivo se carga solo después del consentimiento de cookies

(function() {
    'use strict';
    
    // ID de medición de Google Analytics (reemplazar con tu ID real)
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Reemplazar con tu ID
    
    // Verificar si ya está cargado
    if (window.gtag) {
        console.log('Google Analytics ya está cargado');
        return;
    }
    
    // Cargar el script de Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    
    // Inicializar gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        'anonymize_ip': true, // Anonimizar IPs para GDPR
        'cookie_flags': 'SameSite=None;Secure' // Cookies seguras
    });
    
    console.log('Google Analytics 4 inicializado');
})();
