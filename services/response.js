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

const i18n = require("../i18n.config");
const config = require("./config"),
  fetch = require("node-fetch"),
  
  { URL, URLSearchParams } = require("url");

module.exports = class Response {
  static genQuickReply(text, quickReplies) {
    let response = {
      text: text,
      quick_replies: []
    };

    for (let quickReply of quickReplies) {
      response["quick_replies"].push({
        content_type: "text",
        title: quickReply["title"],
        payload: quickReply["payload"]
      });
    }

    return response;
  }

  static genGenericTemplate(image_url, title, subtitle, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url,
              buttons: buttons
            }
          ]
        }
      }
    };

    return response;
  }

  static genImageTemplate(image_url, title, subtitle = "") {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url
            }
          ]
        }
      }
    };

    return response;
  }

  static genButtonTemplate(title, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: title,
          buttons: buttons
        }
      }
    };

    return response;
  }

  static genText(text) {
    let response = {
      text: text
    };

    return response;
  }

  static genTextWithPersona(text, persona_id) {
    let response = {
      text: text,
      persona_id: persona_id
    };

    return response;
  }

  static genPostbackButton(title, payload) {
    let response = {
      type: "postback",
      title: title,
      payload: payload
    };

    return response;
  }

  static genWebUrlButton(title, url) {
    let response = {
      type: "web_url",
      title: title,
      url: url,
      messenger_extensions: true
    };

    return response;
  }

  static genNuxMessage(user) {
    let welcome = this.genText(
      i18n.__("get_started.welcome", {
        userFirstName: user.firstName
      })
    );

    //let guide = this.genText(i18n.__("get_started.guidance"));
    let guide = this.genText(i18n.__("get_started.help"));

    let curation = this.genQuickReply(i18n.__("get_started.help"), [
      {
        title: i18n.__("menu.suggestion"),
        payload: "CURATION"
      },
      {
        title: i18n.__("menu.help"),
        payload: "CARE_HELP"
      }
    ]);

   // return [welcome, guide, curation];
    return [welcome, guide];
  }




  


  static genEgainMessage(sender,message,msgid) {
    // let welcome = this.genText(
    //   i18n.__("get_started.welcome", {
    //     userFirstName: user.firstName
    //   })
    // );

    
    console.log('senders ' + sender);
    console.log('msgss '+message)

    console.log('msgids '+msgid)

    return message;
    //console.log(JSON.stringify(user));

//     let url = new URL(`${config.egainUrl}/authentication/oauth2/token?forceLogin=yes`);
       
//     const address = fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded",
//                 "Accept" : "application/json",
//                 "Accept-Language" : "en-us",
               
//                 "Authorization": "Basic QkU5REFDQUIxMjY1NEU3RjlCNDkwQ0ZGMTI1MTI2MkQ6UUREMUBCZllHbzhQemZKTldDVUZpcDFTd01HVERvd09hU3N5RnQ4SjFzMVJzV1kxc3UxMGJick50dzV5" },
//       body: "grant_type=client_credentials",
//       // form: {
//       //   "grant_type": "client_credentials"
//       // }
//     }).then((response) => response.json())
//   .then((data) => {
//     console.log('data.access_token '+data.access_token);
//     let urls = new URL(`${config.egainUrl}/messaging/configuration?entrypoint=1024`);
//     let head={ 
//   "Accept" : "application/json",
//   "Accept-Language" : "en-us",
 
//   "Authorization": `Bearer  ${data.access_token}` }

//   console.log(head);
//  fetch(urls, {
//   method: "GET",
//   headers: { 
//             "Accept" : "application/json",
//             "Accept-Language" : "en-us",
           
//             "Authorization": `Bearer ${data.access_token}` },
//  // body: "grant_type=client_credentials",
//   // form: {
//   //   "grant_type": "client_credentials"
//   // }
// }).then((responses) => responses.json())
// .then((dat) => {
//   console.log('tryPointConfigu '+dat.entryPointConfiguration[0].lastModified.date);
//   var body ={
//     "entryPointConfiguration": {
//       "entryPoint": {
//         "id": "1024"
//       },
//       "lastModified": {
//         "date": dat.entryPointConfiguration[0].lastModified.date
//       }
//     },
//     "activity": {
//       "customer": {
//         "type": {
//           "value": "individual"
//         },
//         "contacts": {
//           "contact": [
//             {
//               "firstName": "olumide",
//               "email": [
//                 {
//                   "emailAddress": "oluodebiyi@gmail.com"
//                 }
//               ]
//             }
//           ]
//         }
//       }
//     }
//   }
//   body=JSON.stringify(body)
//   console.log(body)
 
// let urlses = new URL(`${config.egainUrl}/messaging/conversation/start?searchContactOnAttribute=email.emailAddress`);

// fetch(urlses, {
//     method: "POST",
//     headers: { 
//               "Accept" : "application/json",
//               "Accept-Language" : "en-us",
//               "Content-Type":"application/json",
//               "Authorization": `Bearer  ${data.access_token}` },
//     body: body
     
// }).then((responsesa) => responsesa.json())
// .then((datum) => {

//   console.dir(datum.id, { depth: null });
//   console.log('datum '+datum);
//   const obj = JSON.stringify(datum);
//        console.log('rvalvv  ' + obj)
  
       
       
//         var msg ={ 
//           "conversation":{ 
//              "id":datum.id
//           },
//           "type":{ 
//              "value":"text/plain"
//           },
//          "content":message
//        }
//        msg=JSON.stringify(msg)
//         console.log(msg)
       
//       let urlses = new URL(`${config.egainUrl}/messaging/sendmessage`);
      
//       fetch(urlses, {
//           method: "POST",
//           headers: { 
//                     "Accept" : "application/json",
//                     "Accept-Language" : "en-us",
//                     "Content-Type":"application/json",
//                     "Authorization": `Bearer  ${data.access_token}` },
//           body: msg
           
//       }).then((responsemsg) => responsemsg.json())
//       .then((responsemsg) => {
//       console.log(responsemsg);
// }).catch(err => {
//   console.log(`Error in send messages: ${err}`)
// });            
// }).catch(err => {
//   console.error(`Error in initiate chate: ${err}`);
// });
// }).catch(err => {
// console.log(`Error in get entrypoint(): ${err}`)
// });
// }).catch(err => {
//   console.log(`Error in get auth code(): ${err}`)
// });


  







// const printAddress = async () => {
//   const a = await address;
//   console.log(a);
// };

// // const printentrypoint= async () => {
// //   const a = await entrypoint;
// //   console.log(a);
// // };

// printAddress();
//printentrypoint();
//console.log(token);



// const getModifiedDate = async () => {
// const a = await entrypoint;

// console.log(a);
// };

//let tokens=getModifiedDate();






    // let res=this.getEgainAuthCode().then(function(result){
 
    //   let val = JSON.stringify(result)
    //   console.log('rvalvv  ' + val)
    //   const obj = JSON.parse(val);
    //   console.log('rvalvv  ' + obj.egainToken)
    // let token=obj.egainToken
    
    
    // return token;
    // });

    // console.log('res '+res);
    //  let ent=this.getEgainEntryPointConfig(token);
    // ent.then(function(results){
     
    //   let vals = JSON.stringify(results)
    //   console.log('wals  ' + vals)
    //   const objs = JSON.parse(vals);
    //   console.log('wals2  ' + objs.modifiedDate + ' '+ objs.authcode)
    // //let token=obj.egainToken
    // })




//     let userToken = AuthUser(data)
// console.log(userToken) // Promise { <pending> }

// userToken.then(function(result) {
//    console.log(result) // "Some User token"
// })


// const printAddress = () => {
//   res.then(function(result){
 
//     let val = JSON.stringify(result)
//     console.log('rvalvv  ' + val)
//     const obj = JSON.parse(val);
//     console.log('rvalvv  ' + obj.egainToken)
//   });
// };
//res


//let token=obj.egainToken

    //this.getEgainEntryPointConfig();

    //console.dir(a, { depth: null });
    //return [welcome];

    
  }
};
