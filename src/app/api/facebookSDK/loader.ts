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
        FB.init({
          appId: env.FACEBOOK_APP_ID,
          xfbml: true,
          version: 'v21.0',
        });

        /*FB.login((response: fb.AuthResponse) => {
          if (response.authResponse) {
            console.log('Welcome! Fetching your information....');
            FB.api('/me', (userResponse: { name: string }) => {
              console.log('Good to see you, ' + userResponse.name + '.');
              console.log(userResponse);
            });
          } else {
            console.log('User cancelled login or did not fully authorize.');
          }
        }); */
      };
    };

    document.body.appendChild(script);
  }, []);

  return null;
}
