"use client";

import { useEffect } from 'react';
import { env } from '~/env';

export default function FacebookSDKLoader() {
  useEffect(() => {
    if (document.getElementById('facebook-jssdk')) return;

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      window.fbAsyncInit = function () {
        // Use the FB type from @types/facebook-js-sdk
        FB.init({
          appId: env.FACEBOOK_APP_ID, // keep private
          xfbml: true,
          version: 'v21.0',
        });
        FB.login(function(response) {
            if (response.authResponse) {
             console.log('Welcome!  Fetching your information.... ');
             FB.api('/me', function(response) {
               console.log('Good to see you, ' + response.name + '.');
               console.log(response);
             });
            } else {
             console.log('User cancelled login or did not fully authorize.');
            }
        });
      };
    };
    

    document.body.appendChild(script);
  }, []);

  return null;
}
