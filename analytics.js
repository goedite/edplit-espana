// Google Tag Manager Configuration
// Este archivo se carga solo después del consentimiento de cookies

(function() {
    'use strict';
    
    // ID de Google Tag Manager
    const GTM_ID = 'GTM-5JX4R3CN';
    
    // Verificar si ya está cargado
    if (window.google_tag_manager) {
        console.log('Google Tag Manager ya está cargado');
        return;
    }
    
    // Inicializar dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Cargar el script de Google Tag Manager
    (function(w,d,s,l,i){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',GTM_ID);
    
    console.log('Google Tag Manager inicializado con ID:', GTM_ID);
})();
