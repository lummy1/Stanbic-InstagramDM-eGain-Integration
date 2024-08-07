/**
 * Copyright 2021-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Original Coast Clothing
 * https://developers.facebook.com/docs/messenger-platform/getting-started/sample-apps/original-coast-clothing
 */

"use strict";

// Use dotenv to read .env vars into Node
require("dotenv").config();

// Required environment variables
const ENV_VARS = [
  "PAGE_ID",
  "APP_ID",
  "PAGE_ACCESS_TOKEN",
  "APP_SECRET",
  "VERIFY_TOKEN",
  "APP_URL",
  "SHOP_URL",
 
 "EGAIN_ENTRY_POINT_ID",
 "EGAIN_ENCODED_KEY_SECRET",


 
];

module.exports = {
  // Messenger Platform API
  apiDomain: "https://graph.facebook.com",
  apiVersion: "v14.0",


 


  // Meta Page and Application information
  pageId: process.env.PAGE_ID,
  appId: process.env.APP_ID,
  pageAccesToken: process.env.PAGE_ACCESS_TOKEN,
  appSecret: process.env.APP_SECRET,
  verifyToken: process.env.VERIFY_TOKEN,
 
//URL to get eGain access token
egainGetTokenUrl: process.env.EGAIN_GET_TOKEN_URL,


  // URL of your egain environment
    egainAPiUrl: process.env.EGAIN_API_URL,

    //egain entrypoint
    egainEntrypointId: process.env.EGAIN_ENTRY_POINT_ID,

     //egain dafault encoded clientkey and Secret
     egainClientkeySecret: process.env.EGAIN_ENCODED_KEY_SECRET,
     egainTokenClientId: process.env.EGAIN_TOKEN_CLIENT_ID,
     egainScope: process.env.EGAIN_SCOPE,

     //eGain Basic Auth Credentials
     authName:  process.env.AUTHAPINAME,
     basicAuthUsername: process.env.EGAIN_AUTH_USERNAME,
     basicAuthPassword: process.env.EGAIN_AUTH_PASSWORD,


  // URL of your app domain
  appUrl: process.env.APP_URL,
  clientappname: process.env.CLIENT_APP_NAME, 
  accountName: process.env.ACCOUNT_NAME, 
  channelType: process.env.CHANNEL_NAME, 
  channelAddress: process.env.CHANNEL_ADDRESS, 
  orchestrationName: process.env.ORCHESTRATION_NAME,
  // URL of your website
  shopUrl: process.env.SHOP_URL,

  //MongoDB URl
  mongoUri: process.env.MONGODB_URI ||  
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || 'localhost') + ':' + 
   (process.env.MONGO_PORT || '27017') +
    '/mernproject' ,
    
  // Persona IDs
  personas: {},

  // Preferred port (default to 3000)
  port: process.env.PORT || 3000,

  // Base URL for Messenger Platform API calls
  get apiUrl() {
    //console.log(this.apiDomain);
    //console.log(this.apiVersion);
    return `${this.apiDomain}/${this.apiVersion}`;

    
  },

  // get instaapiUrl() {
  //   console.log(this.instaapiDomain);
  //   console.log(this.instaapiVersion);
  //   return `${this.instaapiDomain}/${this.instaapiVersion}`;

    
  // },

  // URL of your webhook endpoint
  get webhookUrl() {
    return `${this.appUrl}/webhook`;
  },

  get newPersonas() {
    return [
      {
        name: "Jorge",
        picture: `${this.appUrl}/personas/sales.jpg`
      },
      {
        name: "Laura",
        picture: `${this.appUrl}/personas/billing.jpg`
      },
      {
        name: "Riandy",
        picture: `${this.appUrl}/personas/order.jpg`
      },
      {
        name: "Daniel",
        picture: `${this.appUrl}/personas/care.jpg`
      }
    ];
  },

  pushPersona(persona) {
    this.personas[persona.name] = persona.id;
  },

  get personaSales() {
    let id = this.personas["Jorge"] || process.env.PERSONA_SALES;
    return {
      name: "Jorge",
      id: id
    };
  },

  get personaBilling() {
    let id = this.personas["Laura"] || process.env.PERSONA_BILLING;
    return {
      name: "Laura",
      id: id
    };
  },

  get personaOrder() {
    let id = this.personas["Riandy"] || process.env.PERSONA_ORDER;
    return {
      name: "Riandy",
      id: id
    };
  },

  get personaCare() {
    let id = this.personas["Daniel"] || process.env.PERSONA_CARE;
    return {
      name: "Daniel",
      id: id
    };
  },

  get whitelistedDomains() {
    return [this.appUrl, this.shopUrl];
  },

  checkEnvVariables: function() {
    ENV_VARS.forEach(function(key) {
      if (!process.env[key]) {
        console.warn("WARNING: Missing the environment variable " + key);
      } else {
        // Check that urls use https
        if (["APP_URL", "SHOP_URL"].includes(key)) {
          const url = process.env[key];
          if (!url.startsWith("https://")) {
            console.warn(
              "WARNING: Your " + key + ' does not begin with "https://"'
            );
          }
        }
      }
    });
  }
};
