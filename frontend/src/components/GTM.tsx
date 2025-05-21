// GTM.tsx
import React, { useEffect } from 'react';

const GTM_ID = 'GTM-MCMWK3JK'; // Замените на ваш ID GTM

const GTM = () => {
    useEffect(() => {
        // Добавляем скрипт GTM
       const script = document.createElement('script');
       script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
        script.async = true;
       document.head.appendChild(script);

        // Добавляем noscript часть
       const noscript = document.createElement('noscript');
       noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.appendChild(noscript);
    }, []);

    return null;
};

export default GTM;
   