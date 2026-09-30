// import { NgIf } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { OAuthService } from 'angular-oauth2-oidc';

// import { environment } from '../environments/environment';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [
//     RouterOutlet,
//     NgIf
//   ],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent {

//   title = 'Angular OAuth2 / OpenID Connect Demo';

//   backendResponse = '';

//   constructor(
//     private oauthService: OAuthService,
//     private http: HttpClient
//   ) {
//     this.oauthService.configure(environment.auth);

//     this.oauthService.loadDiscoveryDocumentAndTryLogin({
//       customHashFragment: window.location.search
//     });
//   }

//   login() {

//     this.backendResponse = '';

//     this.oauthService
//       .loadDiscoveryDocument()
//       .then(() => {
//         this.oauthService.initLoginFlow();
//       });
//   }

//   callUserEndpoint() {

//     this.callBackend(
//       'http://localhost:8082/api/user/profile'
//     );
//   }

//   callAdminEndpoint() {

//     this.callBackend(
//       'http://localhost:8082/api/admin/dashboard'
//     );
//   }

//   callSupportEndpoint() {

//     this.callBackend(
//       'http://localhost:8082/api/support/ticket'
//     );
//   }

//   private callBackend(url: string) {

//     if (!this.oauthService.hasValidAccessToken()) {

//       this.backendResponse =
//         'Please login first to access the protected backend.';

//       return;
//     }

//     const accessToken =
//       this.oauthService.getAccessToken();

//     console.log('Access Token:', accessToken);

//     console.log(
//       'Has valid access token:',
//       this.oauthService.hasValidAccessToken()
//     );

//     this.http.get(
//       url,
//       {
//         headers: {
//           'Accept': 'text/plain'
//         },
//         responseType: 'text'
//       }
//     ).subscribe({

//       next: (response) => {

//         console.log('Backend response:', response);

//         this.backendResponse = response;
//       },

//       error: (error) => {

//         console.error('Backend error:', error);

//         if (error.status === 401) {

//           this.backendResponse =
//             '401 - Unauthorized. Please login again.';

//           return;
//         }

//         if (error.status === 403) {

//           this.backendResponse =
//             '403 - Forbidden. You do not have the required role.';

//           return;
//         }

//         this.backendResponse =
//           'Unable to access the backend.';
//       }
//     });
//   }

//   logout() {

//     if (!this.oauthService.hasValidAccessToken()) {

//       console.log('User is not logged in.');

//       return;
//     }

//     this.backendResponse = '';

//     this.oauthService.logOut();
//   }

//   get isLoggedIn() {

//     return this.oauthService.hasValidAccessToken();
//   }
// }


import { NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Enterprise Identity Federation Dashboard';
  backendResponse = '';

  // Object structure matching your Spring Boot 'Customer' entity requirements
  newUser = {
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    active: 1,
    password: ''
  };

  constructor(private oauthService: OAuthService, private http: HttpClient) {
    this.oauthService.configure(environment.auth);
    this.oauthService.loadDiscoveryDocumentAndTryLogin({
      customHashFragment: window.location.search
    });
  }

  // PUBLIC CRUD INSIGHTS (Bypasses security validation checks completely)
  onRegisterSubmit() {
    this.backendResponse = 'Registering user in Database...';
    
    this.http.post('http://localhost:8083/api/customers', this.newUser)
      .subscribe({
        next: (response: any) => {
          console.log('Registration success:', response);
          this.backendResponse = `User "${response.userName}" created successfully with ID ${response.id} inside your Customer DB! You can now log in.`;
          this.resetForm();
        },
        error: (error) => {
          console.error('Registration failure:', error);
          this.backendResponse = `Registration failed: Error Status ${error.status}. Ensure your User Management service is running on port 8083.`;
        }
      });
  }

  // SECURE RESOURCE SERVER HANDLERS (Automatically intercepts and pipes JWT tokens)
  login() {
    this.backendResponse = '';
    this.oauthService.loadDiscoveryDocument().then(() => {
      this.oauthService.initLoginFlow();
    });
  }

  logout() {
    this.backendResponse = '';
    this.oauthService.logOut();
  }

  get isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }

  callUserEndpoint() {
    this.callSecureBackend('http://localhost:8082/api/user/profile');
  }

  callAdminEndpoint() {
    this.callSecureBackend('http://localhost:8082/api/admin/dashboard');
  }

  private callSecureBackend(url: string) {
    if (!this.isLoggedIn) {
      this.backendResponse = 'Access Denied: Please log in via Keycloak first.';
      return;
    }

    this.http.get(url, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.backendResponse = response;
      },
      error: (error) => {
        if (error.status === 401) {
          this.backendResponse = '401 Unauthorized - Active login session required.';
        } else if (error.status === 403) {
          this.backendResponse = '403 Forbidden - Missing required role mapping constraints.';
        } else {
          this.backendResponse = `Server connection error occurred: Status ${error.status}`;
        }
      }
    });
  }

  private resetForm() {
    this.newUser = {
      userName: '',
      email: '',
      firstName: '',
      lastName: '',
      active: 1,
      password: ''
    };
  }
}
