import React, { useEffect, useState } from 'react';

function ChatBot() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {

    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
    script.async = true;

    const style = document.createElement('style');
    style.textContent = `
      .bpw-powered,
      .bpw-powered-by,
      [class*="bpw-powered"],
      .bp-powered,
      .bp-powered-by,
      [class*="bp-powered"],
      div[class*="powered-by"],
      span[class*="powered-by"],
      .powered-by-botpress,
      a[href*="botpress.com"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
      }
    `;
    document.head.appendChild(style);


    script.onload = () => {
      setIsLoaded(true);
      if (window.botpress) {
        window.botpress.init({
          "botId": "8817148a-89d9-4c59-9e53-53cb3a92dde4",
          "configuration": {
            "website": {},
            "email": {},
            "phone": {},
            "termsOfService": {},
            "privacyPolicy": {},
            "color": "#E3A831",
            "variant": "solid",
            "themeMode": "light",
            "fontFamily": "inter",
            "hideWidget": true,
            "disableAnimations": true,
            "showPoweredBy": false,
            "radius": 3,
            "botName": "SyncSheet Bot", 
            "styling": {
              "header": {
                "backgroundColor": "#E3A831", 
                "color": "#1C2833", 
                "text": "SyncSheet" 
              },
              "footer": {
                "display": "none"
              }
            }
          },
          "clientId": "0a0cf038-32b0-408b-92d7-2f39d42db153"
        });

        window.botpress.on("webchat:ready", () => {
          window.botpress.open();
        });
      }
    };


    document.body.appendChild(script);


    return () => {
      document.body.removeChild(script);
      document.head.removeChild(style);
      if (window.botpress) {
        window.botpress.destroy();
      }
    };
  }, []);

  return (
    <div 
      className="webchat fixed bottom-0 right-0 z-50" 
      style={{ 
        height: '600px', 
        width: '400px',
        maxHeight: '80vh',
        maxWidth: '90vw'
      }}
    >
      {isLoaded && (
        <div 
          id="webchat" 
          style={{ 
            height: '100%', 
            width: '100%'
          }}
        />
      )}
    </div>
  );
}

export default ChatBot;