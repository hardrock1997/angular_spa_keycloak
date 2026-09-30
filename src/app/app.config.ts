// import {
//   provideHttpClient,
//   withInterceptorsFromDi
// } from '@angular/common/http';

// import {
//   ApplicationConfig,
//   provideZoneChangeDetection
// } from '@angular/core';

// import { provideRouter } from '@angular/router';

// import { provideOAuthClient } from 'angular-oauth2-oidc';

// import { routes } from './app.routes';

// export const appConfig: ApplicationConfig = {

//   providers: [

//     provideZoneChangeDetection({
//       eventCoalescing: true
//     }),

//     provideRouter(routes),

//     provideHttpClient(
//       withInterceptorsFromDi()
//     ),

//     provideOAuthClient({
//       resourceServer: {
//         allowedUrls: [
//           'http://localhost:8082'
//         ],

//         sendAccessToken: true
//       }
//     })

//   ]

// };




import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS // 1. IMPORT THIS
} from '@angular/common/http';

import {
  ApplicationConfig,
  provideZoneChangeDetection
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideOAuthClient, DefaultOAuthInterceptor } from 'angular-oauth2-oidc'; // 2. IMPORT THIS DEFAULT INTERCEPTOR

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true
    }),

    provideRouter(routes),

    provideHttpClient(
      withInterceptorsFromDi()
    ),

    // 3. EXPLICITLY BIND THE DEFAULT INTERCEPTOR TO THE DI SYSTEM
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: DefaultOAuthInterceptor, 
      multi: true 
    },

    provideOAuthClient({
      resourceServer: {
        allowedUrls: [
          'http://localhost:8082'
        ],
        sendAccessToken: true
      }
    })
  ]
};
