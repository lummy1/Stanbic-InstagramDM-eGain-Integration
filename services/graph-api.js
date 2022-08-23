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

// Imports dependencies


const config = require("./config"),
  fetch = require("node-fetch"),
  
  { URL, URLSearchParams } = require("url");

module.exports = class GraphApi {
  static async callSendApi(requestBody) {
    let url = new URL(`${config.apiUrl}/me/messages`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken
    });
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });
    //console.log(response)
    if (!response.ok) {
      console.warn(`Could not sent message.`, response.statusText);
    }
  }

  static async callMessengerProfileAPI(requestBody) {
    // Send the HTTP request to the Messenger Profile API

    console.log(`Setting Messenger Profile for app ${config.appId}`);
    let url = new URL(`${config.apiUrl}/me/messenger_profile`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken
    });
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });
    if (response.ok) {
      console.log(`Request sent.`);
    } else {
      console.warn(
        `Unable to callMessengerProfileAPI: ${response.statusText}`,
        await response.json()
      );
    }
  }

  static async callSubscriptionsAPI(customFields) {
    // Send the HTTP request to the Subscriptions Edge to configure your webhook
    // You can use the Graph API's /{app-id}/subscriptions edge to configure and
    // manage your app's Webhooks product
    // https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge
    console.log(
      `Setting app ${config.appId} callback url to ${config.webhookUrl}`
    );

    let fields =
      "messages, messaging_postbacks, messaging_optins, " +
      "message_deliveries, messaging_referrals";

    if (customFields !== undefined) {
      fields = fields + ", " + customFields;
    }

    console.log({ fields });

    let url = new URL(`${config.apiUrl}/${config.appId}/subscriptions`);
    url.search = new URLSearchParams({
      access_token: `${config.appId}|${config.appSecret}`,
      object: "page",
      callback_url: config.webhookUrl,
      verify_token: config.verifyToken,
      fields: fields,
      include_values: "true"
    });
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    if (response.ok) {
      console.log(`Request sent.`);
    } else {
      console.error(
        `Unable to callSubscriptionsAPI: ${response.statusText}`,
        await response.json()
      );
    }
  }

  static async callSubscribedApps(customFields) {
    // Send the HTTP request to subscribe an app for Webhooks for Pages
    // You can use the Graph API's /{page-id}/subscribed_apps edge to configure
    // and manage your pages subscriptions
    // https://developers.facebook.com/docs/graph-api/reference/page/subscribed_apps
    console.log(`Subscribing app ${config.appId} to page ${config.pageId}`);

    let fields =
      "messages, messaging_postbacks, messaging_optins, " +
      "message_deliveries, messaging_referrals";

    if (customFields !== undefined) {
      fields = fields + ", " + customFields;
    }

    console.log({ fields });

    let url = new URL(`${config.apiUrl}/${config.pageId}/subscribed_apps`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken,
      subscribed_fields: fields
    });
    let response = await fetch(url, {
      method: "POST"
    });
    if (response.ok) {
      console.log(`Request sent.`);
    } else {
      console.error(
        `Unable to callSubscribedApps: ${response.statusText}`,
        await response.json()
      );
    }
  }

  static async getUserProfile(senderIgsid) {
    let url = new URL(`${config.apiUrl}/${senderIgsid}`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken,
      //fields: "first_name, last_name, gender, locale, timezone"
      fields: "id, username,name"
    });
    let response = await fetch(url);
    if (response.ok) {
      let userProfile = await response.json();
      return {
        id: userProfile.id,
        username: userProfile.username,
        name: userProfile.name,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        gender: userProfile.gender,
        locale: userProfile.locale,
        timezone: userProfile.timezone
      };
    } else {
      console.warn(
        `Could not load profile for ${senderIgsid}: ${response.statusText}`,
        await response.json()
      );
      return null;
    }
  }

  static async getPersonaAPI() {
    // Send the POST request to the Personas API
    console.log(`Fetching personas for app ${config.appId}`);

    let url = new URL(`${config.apiUrl}/me/personas`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken
    });
    let response = await fetch(url);
    if (response.ok) {
      let body = await response.json();
      console.log('personas data' + body.data);
      return body.data;
    } else {
      console.warn(
        `Unable to fetch personas for ${config.appId}: ${response.statusText}`,
        await response.json()
      );
      return null;
    }
  }

  static async postPersonaAPI(name, profile_picture_url) {
    let requestBody = {
      name,
      profile_picture_url
    };
    console.log(`Creating a Persona for app ${config.appId}`);
    console.log({ requestBody });
    let url = new URL(`${config.apiUrl}/me/personas`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken
    });
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });
    if (response.ok) {
      console.log(`Request sent.`);
      let json = await response.json();
      return json.id;
    } else {
      console.error(
        `Unable to postPersonaAPI: ${response.statusText}`,
        await response.json()
      );
    }
  }

  static async callNLPConfigsAPI() {
    // Send the HTTP request to the Built-in NLP Configs API
    // https://developers.facebook.com/docs/graph-api/reference/page/nlp_configs/

    console.log(`Enable Built-in NLP for Page ${config.pageId}`);

    let url = new URL(`${config.apiUrl}/me/nlp_configs}/me/nlp_configs`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken,
      nlp_enabled: true
    });
    let response = await fetch(url, {
      method: "POST"
    });
    if (response.ok) {
      console.log(`Request sent.`);
    } else {
      console.error(`Unable to activate built-in NLP: ${response.statusText}`);
    }
  }
};

  //lummy from here
//   let address = fetch("https://jsonplaceholder.typicode.com/users/1")
//   .then((response) => response.json())
//   .then((user) => {
//     return user.address;
//   });

//  let printAddress = async () => {
//   const a = await address;
//   console.log(a);
// };

//printAddress()




//   static async getEgainAuthCode() {
//     let url = new URL(`${config.egainUrl}/authentication/oauth2/token?forceLogin=yes`);
//     // url.search = new URLSearchParams({
//     //   grant_type: "client_credentials"
//     //   //fields: "first_name, last_name, gender, locale, timezone"
//     //   //fields: "id, username,name"
//     // });
//     //let requestBody={ "grant_type":"client_credentials" }

   

// // const form = new FormData();
// // form.append("grant_type", "client_credentials");

//     let response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded",
//                 "Accept" : "application/json",
//                 "Accept-Language" : "en-us",
               
//                 "Authorization": "Basic QkU5REFDQUIxMjY1NEU3RjlCNDkwQ0ZGMTI1MTI2MkQ6UUREMUBCZllHbzhQemZKTldDVUZpcDFTd01HVERvd09hU3N5RnQ4SjFzMVJzV1kxc3UxMGJick50dzV5" },
//       body: "grant_type=client_credentials",
//       // form: {
//       //   "grant_type": "client_credentials"
//       // }
//     });
    
//     console.log(response)
//     if (response.ok) {
//       let data = await response.json();
//       console.log(data.access_token)
      
//       //let egain_token= data.access_token
//       //this.getEgainEntryPointConfig(egain_token)
//       return {
//         egain_token: data.access_token
       
        
        
//       };
//     } else {
//       console.warn(
//         `Could not get egain access_token: ${response.statusText}`,
//         await response.json()
//       );
//       return null;
//     }



//   }

//   static async getEgainEntryPointConfig() {

//     authcode=this.getEgainAuthCode();
//     let url = new URL(`${config.egainUrl}/messaging/configuration?entrypoint=1024`);
//     l//et authcode=egain_token;

//     console.log('authcode'+ authcode);
//     // url.search = new URLSearchParams({
//     //   grant_type: "client_credentials"
//     //   //fields: "first_name, last_name, gender, locale, timezone"
//     //   //fields: "id, username,name"
//     // });
//     //let requestBody={ "grant_type":"client_credentials" }

   

// // const form = new FormData();
// // form.append("grant_type", "client_credentials");
//     let response = await fetch(url, {
//       method: "GET",
//       headers: { 
//                 "Accept" : "application/json",
//                 "Accept-Language" : "en-us",
               
//                 "Authorization": `Bearer  ${authcode}` },
//      // body: "grant_type=client_credentials",
//       // form: {
//       //   "grant_type": "client_credentials"
//       // }
//     });
    
//     console.log(response)
//     if (response.ok) {
//       let data = await response.json();
//       console.log(data.entryPointConfiguration)

//      let entryPoConfig=data.entryPointConfiguration;
//      //newentryPoConfig=JSON.parse(entryPoConfig);
//     let modifiedDate=data.entryPointConfiguration[0].lastModified.date;
//      console.log(data.entryPointConfiguration[0].lastModified.date);

//      //let egain_token= modifiedDate;
//      this.initiateEgianChat(modifiedDate,authcode)


//       return {
//         egain_modeifiedDate: modifiedDate,
//         egain_authcode:authcode
        
        
//       };
//     } else {
//       console.warn(
//         `Could not get modifeied date: ${response.statusText}`,
//         await response.json()
//       );
//       return null;
//     }
//   }


//   static async initiateEgianChat(modifiedDate,code) {
//       //let authcode=token;

//     console.log('modifiedDate  : '+ modifiedDate);
//     console.log('chat code  : '+ code);

//     var body ={
//       "entryPointConfiguration": {
//         "entryPoint": {
//           "id": "1024"
//         },
//         "lastModified": {
//           "date": modifiedDate
//         }
//       },
//       "activity": {
//         "customer": {
//           "type": {
//             "value": "individual"
//           },
//           "contacts": {
//             "contact": [
//               {
//                 "firstName": "olumide",
//                 "email": [
//                   {
//                     "emailAddress": "oluodebiyi@gmail.com"
//                   }
//                 ]
//               }
//             ]
//           }
//         }
//       }
//     }
//     body=JSON.stringify(body)
//     console.log(body)
//     // url.search = new URLSearchParams({
//     //   grant_type: "client_credentials"
//     //   //fields: "first_name, last_name, gender, locale, timezone"
//     //   //fields: "id, username,name"
//     // });
//     //let requestBody={ "grant_type":"client_credentials" }

   

// // const form = new FormData();
// // form.append("grant_type", "client_credentials");
// let url = new URL(`${config.egainUrl}/messaging/conversation/start?searchContactOnAttribute=email.emailAddress`);
 
//     let response = await fetch(url, {
//       method: "POST",
//       headers: { 
//                 "Accept" : "application/json",
//                 "Accept-Language" : "en-us",
//                 "Content-Type":"application/json",
//                 "Authorization": `Bearer  ${code}` },
//       body: body
//       // form: {
//       //   "grant_type": "client_credentials"
//       // }
//     });
    
//     console.log(response)
//     if (response.ok) {
//       let data = await response.json();
//       console.log(data)

//      //let entryPoConfig=data.entryPointConfiguration;
//      //newentryPoConfig=JSON.parse(entryPoConfig);
//     //let modifiedDate=data.entryPointConfiguration[0].lastModified.date;
//      //console.log(data.entryPointConfiguration[0].lastModified.date);
//       return {
//         egain_modeifiedDate: modifiedDate
        
        
//       };
//     } else {
//       console.warn(
//         `Could not initiate chat: ${response.statusText}`,
//         await response.json()
//       );
//       return null;
//     }
//   }

//};
