export const environment = {

  production: false,

  auth: {

    issuer:
      'http://localhost:8081/realms/yash_realm',

    redirectUri:
      'http://localhost:4200',

    clientId:
      'public_pkce_client',

    responseType:
      'code',

    scope:
      'openid profile email offline_access',


    showDebugInformation:
      true,

    timeoutFactor:
      0.01

  }

};

