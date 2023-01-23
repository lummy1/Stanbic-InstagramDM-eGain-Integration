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
 Response = require("./response"),
 i18n = require("../i18n.config"),
   fetch = require("node-fetch"),
   
   { URL, URLSearchParams } = require("url");
 
 module.exports = class Egain {
  

 

    static genEgainMessage(sender,message,msgid) {
        // let welcome = this.genText(
        //   i18n.__("get_started.welcome", {
        //     userFirstName: user.firstName
        //   })
        // );
        console.log('sender ' + sender);
        console.log('msg '+message)
    
        console.log('msgid '+msgid);
        return message;
    }

   //lummy from here

   static async  SendEgainContinueMessage(user,webhookEvent) {
    let psid=user.psid;
    let message=webhookEvent.message.text;
    let convid=""
    console.log('Inside  SendEgain Continue  Message for '+user.username  +'and convoid ' +user.convoid);
     try{
    if(user.convoid === ""){

      console.log('Create  SendEgain New  Message since convoid is null' );


      let url = new URL(`${config.egainUrl}/authentication/oauth2/token?forceLogin=yes`);  
      let address = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded",
                "Accept" : "application/json",
                "Accept-Language" : "en-us",
               
                "Authorization":`Basic ${config.egainClientkeySecret}` },
      body: "grant_type=client_credentials",
      // form: {
      //   "grant_type": "client_credentials"
      // }
    })
    
    let data = await address.json();
    
    
   
    console.log('data.access_token '+data.access_token);
    let urls = new URL(`${config.egainUrl}/messaging/configuration?entrypoint=${config.egainEntrypointId}`);
    

  //console.log(head);
let rr= await fetch(urls, {
  method: "GET",
  headers: { 
            "Accept" : "application/json",
            "Accept-Language" : "en-us",
           
            "Authorization": `Bearer ${data.access_token}` },
 // body: "grant_type=client_credentials",
  // form: {
  //   "grant_type": "client_credentials"
  // }
})

let dat = await rr.json();

  var body ={
    "entryPointConfiguration": {
      "entryPoint": {
        "id": `${config.egainEntrypointId}`
      },
      "lastModified": {
        "date": dat.entryPointConfiguration[0].lastModified.date
      }
    },
    "activity": {
      "customer": {
        "type": {
          "value": "individual"
        },
        "contacts": {
          "contact": [
            {
              "firstName": user.name,
              "social": [
                {
                  "type": {
                    "value": "instagram"
                  },
                  "socialId":user.username
                }
              ]
            }
          ]
        }
      }
    }
  }
  body=JSON.stringify(body)
 // console.log(body)
 
let urlses = new URL(`${config.egainUrl}/messaging/conversation/start?searchContactOnAttribute=social.instagramId&conversationContact=social.instagramId`);

let jj= await fetch(urlses, {
    method: "POST",
    headers: { 
              "Accept" : "application/json",
              "Accept-Language" : "en-us",
              "Content-Type":"application/json",
              "Authorization": `Bearer  ${data.access_token}` },
    body: body
     
})


let datum = await jj.json();
  convid=datum.id;
 
        var msg ={ 
          "conversation":{ 
             "id":datum.id
          },
          "type":{ 
             "value":"text/plain"
          },
         "content":message
       }
       msg=JSON.stringify(msg)
        console.log(msg)
       
      let urlses1 = new URL(`${config.egainUrl}/messaging/sendmessage`);
      
      let kk= await fetch(urlses1, {
          method: "POST",
          headers: { 
                    "Accept" : "application/json",
                    "Accept-Language" : "en-us",
                    "Content-Type":"application/json",
                    "Authorization": `Bearer  ${data.access_token}` },
          body: msg
           
      })
     

    }else{

      convid = user.convoid;
    //console.log('user funra e' + JSON.stringify(user));
//  console.log('user .psid' + user.psid);
//  console.log('user .firstName' + user.firstName);
//  console.log('user .username' + user.username);
// console.log('user.psid ' + user.psid);
// console.log('user.name ' + user.name);
//console.log('username ' + user.convoid);
//console.log('username ' + user.username);
//  console.log('user ' + user.username);
  // console.log('msg '+message);
  let url = new URL(`${config.egainUrl}/authentication/oauth2/token?forceLogin=yes`);  
  let address = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded",
            "Accept" : "application/json",
            "Accept-Language" : "en-us",
            "Authorization":`Basic ${config.egainClientkeySecret}` },
            
  body: "grant_type=client_credentials",
  // form: {
  //   "grant_type": "client_credentials"
  // }
})

let data = await address.json();

  let msgs=webhookEvent.message;

  if (msgs.is_deleted===true) {

    var msg ={ 
      "conversation":{ 
         "id":user.convoid
      },
      "type":{ 
         "value":"text/plain"
      },
     "content":"The message has been deleted"
   }
   msg=JSON.stringify(msg)
    //console.log(msg)
   
  let urlses1 = new URL(`${config.egainUrl}/messaging/sendmessage`);
  
  let kk= await fetch(urlses1, {
      method: "POST",
      headers: { 
                "Accept" : "application/json",
                "Accept-Language" : "en-us",
                "Content-Type":"application/json",
                "Authorization": `Bearer  ${data.access_token}` },
      body: msg
       
  })


  }else if (msgs.text) {
   //console.log(JSON.stringify(user));
   
 
 

 //console.log('data.access_token '+data.access_token);
 

     var msg ={ 
       "conversation":{ 
          "id":user.convoid
       },
       "type":{ 
          "value":"text/plain"
       },
      "content":message
    }
    msg=JSON.stringify(msg)
     //console.log(msg)
    
   let urlses1 = new URL(`${config.egainUrl}/messaging/sendmessage`);
   
   let kk= await fetch(urlses1, {
       method: "POST",
       headers: { 
                 "Accept" : "application/json",
                 "Accept-Language" : "en-us",
                 "Content-Type":"application/json",
                 "Authorization": `Bearer  ${data.access_token}` },
       body: msg
        
   })
   

  }else if (msgs.attachments) {
    let attachment = msgs.attachments[0];
    let type=attachment.type;
    let url=attachment.payload.url;
    let response;

    var msg = { 
      "conversation":{ 
       "id":user.convoid
    },
    "type":{ 
       "value":"uploadAttachment"
    },
    "attachments":{ 
       "attachment":[ 
          { 
             "fileName":"attachment.jpeg",
             "contentType":"image/jpeg",
             "size":"32",
             "contentUrl":url
          }
       ]
    }
 }
  
   msg=JSON.stringify(msg)
    //console.log(msg)
   
  let urlses1 = new URL(`${config.egainUrl}/messaging/sendmessage`);
  
  let kk= await fetch(urlses1, {
      method: "POST",
      headers: { 
                "Accept" : "application/json",
                "Accept-Language" : "en-us",
                "Content-Type":"application/json",
                "Authorization": `Bearer  ${data.access_token}` },
      body: msg
       
  })
    // Get the attachment
    let daas = await kk.json();
    console.log("Received attachment:", `${JSON.stringify(msgs.attachments)} for ${psid}`);
    console.log('type '+JSON.stringify(daas)+ ' url ');
    console.log("Received attachment:", `${JSON.stringify(attachment)} for ${psid}`);

    response = Response.genQuickReply(i18n.__("fallback.attachment"), [
      {
        title: i18n.__("menu.help"),
        payload: "CARE_HELP"
      },
      {
        title: i18n.__("menu.start_over"),
        payload: "GET_STARTED"
      }
    ]);

    //return response;
    
  }
}
  // let responsemsg = await kk.json();
  
 
 // console.log('conversationid'+datum.id)
  
   

  
    
       console.log('conversationid'+convid)
       
     //const  conversationid= datum.id;
     return {
      id: user.psid,
       conversationid: convid,
       message: message,
       
       username:user.username,
       name:user.name,

                  
     };

    } catch (e) {
      console.error("Error: ", e);
    }


}

    static async  SendEgainNewMessage(user,webhookEvent) {
        let psid=user.psid;
        let message=webhookEvent.message.text;
        let msgs=webhookEvent.message;
  try{
   
        console.log('Inside  SendEgain New  Message' );
    //  console.log('user.psid ' + user.psid);
    //  console.log('user.name ' + user.name);

    //  console.log('username ' + user.username);
    //  console.log('user ' + user.username);
        //console.log('msg '+message);
    
        //console.log(JSON.stringify(user));


        let url = new URL(`${config.egainUrl}/authentication/oauth2/token?forceLogin=yes`);  
        let address = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded",
                  "Accept" : "application/json",
                  "Accept-Language" : "en-us",
                 
                  "Authorization":`Basic ${config.egainClientkeySecret}` },
        body: "grant_type=client_credentials",
        // form: {
        //   "grant_type": "client_credentials"
        // }
      })
      
      let data = await address.json();
      
      
     
      console.log('data.access_token '+data.access_token);
      let urls = new URL(`${config.egainUrl}/messaging/configuration?entrypoint=${config.egainEntrypointId}`);
      let head={ 
    "Accept" : "application/json",
    "Accept-Language" : "en-us",
   
    "Authorization": `Bearer  ${data.access_token}` }
  
    //console.log(head);
  let rr= await fetch(urls, {
    method: "GET",
    headers: { 
              "Accept" : "application/json",
              "Accept-Language" : "en-us",
             
              "Authorization": `Bearer ${data.access_token}` },
   // body: "grant_type=client_credentials",
    // form: {
    //   "grant_type": "client_credentials"
    // }
  })
  
  let dat = await rr.json();
   console.log('tryPointConfigu '+dat.entryPointConfiguration[0].lastModified.date);
    var body ={
      "entryPointConfiguration": {
        "entryPoint": {
          "id": `${config.egainEntrypointId}`
        },
        "lastModified": {
          "date": dat.entryPointConfiguration[0].lastModified.date
        }
      },
      "activity": {
        "customer": {
          "type": {
            "value": "individual"
          },
          "contacts": {
            "contact": [
              {
                "firstName": user.name,
                "social": [
                  {
                    "type": {
                      "value": "instagram"
                    },
                    "socialId":user.username
                  }
                ]
              }
            ]
          }
        }
      }
    }
    body=JSON.stringify(body)
   // console.log(body)
   
  let urlses = new URL(`${config.egainUrl}/messaging/conversation/start?searchContactOnAttribute=social.instagramId&conversationContact=social.instagramId`);
  
  let jj= await fetch(urlses, {
      method: "POST",
      headers: { 
                "Accept" : "application/json",
                "Accept-Language" : "en-us",
                "Content-Type":"application/json",
                "Authorization": `Bearer  ${data.access_token}` },
      body: body
       
  })
  
  
  let datum = await jj.json();
     
  if (msgs.text) {
          var msg ={ 
            "conversation":{ 
               "id":datum.id
            },
            "type":{ 
               "value":"text/plain"
            },
           "content":message
         }
        
        }else if (msgs.attachments) {
          let attachment = msgs.attachments[0];
          let type=attachment.type;
          let url=attachment.payload.url;
          let response;
      
          var msg = { 
            "conversation":{ 
             "id":datum.id
          },
          "type":{ 
             "value":"uploadAttachment"
          },
          "attachments":{ 
             "attachment":[ 
                { 
                   "fileName":"attachment.jpeg",
                   "contentType":"image/jpeg",
                   "size":"32",
                   "contentUrl":url
                }
             ]
          }
       }
      }

      msg=JSON.stringify(msg)
      console.log(msg)
        let urlses1 = new URL(`${config.egainUrl}/messaging/sendmessage`);
        
        let kk= await fetch(urlses1, {
            method: "POST",
            headers: { 
                      "Accept" : "application/json",
                      "Accept-Language" : "en-us",
                      "Content-Type":"application/json",
                      "Authorization": `Bearer  ${data.access_token}` },
            body: msg
             
        })
        
        //let responsemsg = await kk.json();
        
       
         
           // console.log(responsemsg)
            //console.log('conversationid'+datum.id)
          //const  conversationid= datum.id;
          return {
            id: user.psid,
            conversationid: datum.id,
            message: message,
             username:user.username,
            name:user.name,
            firstName: user.first_name,
        lastName: user.last_name,
        gender: user.gender,
        locale: user.locale,
        timezone: user.timezone
          };
 
        } catch (e) {
          console.error("Error: ", e);
        }
      }


  };
  //lummy from here
  

//printAddress()
 