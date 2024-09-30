/**
 * Copyright 2021-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Original Coast Clothing
 * https://developers.facebook.com/docs/messenger-platform/getting-started/sample-apps/original-coast-clothing
 */

'use strict';

// Imports dependencies
const probe = require('probe-image-size');
const config = require('./config'),
  Response = require('./response'),
  i18n = require('../i18n.config'),

  fetch = require('node-fetch'),
  { URL, URLSearchParams } = require('url');

module.exports = class Egain {
  static genEgainMessage(sender, message, msgid) {
    // let welcome = this.genText(
    //   i18n.__("get_started.welcome", {
    //     userFirstName: user.firstName
    //   })
    // );
    //console.log('sender ' + sender);
    //console.log('msg ' + message);

    //console.log('msgid ' + msgid);
    return message;
  }

  //lummy from here

  static async SendEgainContinueMessage(user, webhookEvent) {
    let psid = user.psid;
    //let message = webhookEvent.message.text;
    let conversationId = user.convoid;
   
    let message = webhookEvent.message.text;
    let msgs = webhookEvent.message;
    console.dir(msgs, { depth: null });
    let convid = '';
    console.log(
      'Inside  Send to Egain Continue  Message for ' +
      msgs +
        'and convoid ' +
        user.convoid
    );



    try {


      //get accesstoken for all API calls
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', `${config.egainTokenClientId}`);
      params.append('client_secret', `${config.egainClientkeySecret}`);
      params.append('scope', `${config.egainScope}`);

      let url = new URL(`${config.egainGetTokenUrl}`);
      let get_token = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          'Accept-Language': 'en-us',

          // "Authorization":`Basic ${config.egainClientkeySecret}`
        },
        body: params,
      });

      let data = await get_token.json();

      var access_token = data.access_token;

     // console.log('data.access_token ' + access_token);

      if (conversationId === '') {
        
        let res=await this.SendEgainNewMessage(user, webhookEvent);
   
        let msgs = webhookEvent.message;

      
      }else{

        if (msgs.is_deleted === true) {
          console.log('got into delete');
         

          var att_msg_req={
                messages: {
                  message: [
                    {
                     
                      conversation: {
                        id: `${conversationId}`
                      },
                      parent: {
                        messageId: `${msgs.mid}`
                      },
                      type: {value: 'delete.soft'},
                      sender: {type: 'customer'}
                    }
                  ]
                }
              }
          
        
          
 
          var att_msg= JSON.stringify(att_msg_req);
          console.dir(att_msg,  { depth: null })
         let sendmsg_url = new URL(`${config.egainAPiUrl}/conversations/messages`);
         let sendmsg_response = await fetch(sendmsg_url, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             Accept: 'application/json',
             'Accept-Language': 'en-us',
             Authorization: `Bearer  ${access_token}`,
           },
           body: att_msg,
         });
     
         let del_msg = await sendmsg_response.json();
          
          // Get the deleted msg
         console.dir(del_msg,  { depth: null })
         if (del_msg.code != undefined || del_msg.error != undefined) {
          var developerMsg = del_msg.developerMessage;
          return developerMsg;
        } 
          
           

           
        } else if (msgs.text) {
          console.log('got into text msg');

          //console.log('data.access_token '+data.access_token);

          //Send  message
     var sendmsg_req = {
      "metadata": {
        "attributes": [
          {
            "name": "k1",
            "value": "v1"
          }
        ]
      },
      "messages": {
        "message": [
          {
            "messageId":`${msgs.mid}`,
            "type": {
              "value": "text"
            },
            "content": {
              "text": `${message}`
            },
            "conversation": {
              "id":  `${conversationId}`,
              "account": {
                "channel": {
                  "type": `${config.channelType}`
                },
                "address": `${config.channelAddress}`
              },
              "clientInfo": {
                "timeOffset": 30,
                "referrerName": "DD",
                "referrerUrl": "http://egain.com"
              },
              "lookupContact": "phone.mobile",
              "conversationContact": "phone.mobile",
              "customer": {
                "name": `${user.name}`,
                "type": "individual",
                "attributes": [
                  {
                    "name": "group",
                    "value": "eGain"
                  }
                ],
                "contacts": {
                  "contact": [
                    {
                      "type": "phone",
                      "subType": "mobile",
                      "address": "123456788"
                    },
                    {
                      "type": "email",
                      "address":  `${user.username}@yopmail.com`
                    }
                  ]
                }
              }
            },
            "sender": {
              "type": "customer",
              "participant": {
                "name": "customer_name"
              }
            },
            "attributes": {
              "attribute": [
                {
                  "external": true,
                  "name": "k1",
                  "value": "v1"
                }
              ]
            }
          }
        ]
      }
    };
    var sendmsg_body= JSON.stringify(sendmsg_req);
    //console.dir(sendmsg_body)
   let sendmsg_url = new URL(`${config.egainAPiUrl}/conversations/messages`);
   let sendmsg_response = await fetch(sendmsg_url, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       Accept: 'application/json',
       'Accept-Language': 'en-us',
       Authorization: `Bearer  ${access_token}`,
     },
     body: sendmsg_body,
   });

   let text_msg = await sendmsg_response.json();
   
   console.dir(text_msg,  { depth: null })
   if (text_msg.code != undefined || text_msg.error != undefined) {
    var developerMsg = text_msg.developerMessage;
    if(text_msg.code=='400-630'){
      let res=await this.SendEgainNewMessage(user, webhookEvent);
    }
    return developerMsg;
  } 



       } else if (msgs.attachments) {
         console.log('got into attachment');


         let attachmentss = msgs.attachments;

         console.dir(attachmentss,  { depth: null })


         let attachment = msgs.attachments[0];
         
         let url = attachment.payload.url;
        

         let img_details = await probe(url);
         console.log(img_details); 
         
        let mimetype=img_details.mime;
        let type=img_details.type;
        let lengtha=img_details.length;
        let length=lengtha*10;

         var att_msg_req={

          "messages": {
        
            "message": [
        
              {
        
               
        
                "conversation": {
        
                  "id": `${conversationId}`,
        
                },
        
                "type": {
        
                  "value": "text"
        
                },
        
                "attachments": {
        
                  "attachment": [
        
                    {
        
                      "name": `attachment.${type}`,
        
                      "contentType":`${mimetype}`,
        
                      "size": `${lengtha}`,
        
                      "url": `${url}`,
                    }
                   
                  ]
        
                },
        
                "sender": {
        
                  "type": "customer",
        
                  "participant": {
        
                    "name": "customer_name"
        
                  }
        
                }
        
              }
        
            ]
        
          }
        
        }

         var att_msg= JSON.stringify(att_msg_req);
         console.dir(att_msg);
        let sendmsg_url = new URL(`${config.egainAPiUrl}/conversations/messages`);
        let sendmsg_response = await fetch(sendmsg_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Accept-Language': 'en-us',
            Authorization: `Bearer  ${access_token}`,
          },
          body: att_msg,
        });
    
        let attach_msg = await sendmsg_response.json();
         
         // Get the attachment
         console.dir(attach_msg,  { depth: null })
         if (attach_msg.code != undefined || attach_msg.error != undefined) {
          var developerMsg = attach_msg.developerMessage;
          return developerMsg;
        } 

         var response = Response.genQuickReply(i18n.__('fallback.attachment'), [
           {
             title: i18n.__('menu.help'),
             payload: 'CARE_HELP',
           },
           {
             title: i18n.__('menu.start_over'),
             payload: 'GET_STARTED',
           },
         ]);

         //return response;
       }

  }
      // console.log('conversationid'+datum.id)

      //console.log('conversationid' + conversationId);

      //const  conversationid= datum.id;
      return {
        id: user.psid,
        conversationid: conversationId,
        message: message,

        username: user.username,
        name: user.name,
      };
    } catch (e) {
      console.error('Error: ', e);
    }
  }

  static async SendEgainNewMessage(user, webhookEvent) {
    let psid = user.psid;
    

     console.log(`\u{1F7EA}user object`);
    //   console.log('message'+ webhookEvent)
      console.dir(user, { depth: null });

      let message = webhookEvent.message.text;
    let msgs = webhookEvent.message;
    try {
      // console.log('Inside  SendEgain New  Message');
      //  console.log('user.psid ' + user.psid);
      //  console.log('user.name ' + user.name);

      //  console.log('username ' + user.username);
      //  console.log('user ' + user.username);
      // console.log('msg '+message);

      //console.log(JSON.stringify(user));

      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', `${config.egainTokenClientId}`);
      params.append('client_secret', `${config.egainClientkeySecret}`);
      params.append('scope', `${config.egainScope}`);

      let url = new URL(`${config.egainGetTokenUrl}`);
      let get_token = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          'Accept-Language': 'en-us',

          // "Authorization":`Basic ${config.egainClientkeySecret}`
        },
        body: params,
      });

      let data = await get_token.json();

      var access_token = data.access_token;

     // console.log('data.access_token ' + access_token);

    
   

//Send  message
     var sendmsg_req = {
      "metadata": {
        "attributes": [
          {
            "name": "k1",
            "value": "v1"
          }
        ]
      },
      "messages": {
        "message": [
          {
            "messageId":`${msgs.mid}`,
            "type": {
              "value": "text"
            },
            "content": {
              "text": `${message}`
            },
            "conversation": {
              "account": {
                "channel": {
                  "type": `${config.channelType}`
                },
                "address": `${config.channelAddress}`
              },
              "clientInfo": {
                "timeOffset": 30,
                "referrerName": "DD",
                "referrerUrl": "http://egain.com"
              },
              "lookupContact": "phone.mobile",
              "conversationContact": "phone.mobile",
              "customer": {
                "name": `${user.name}`,
                "type": "individual",
                "attributes": [
                  {
                    "name": "group",
                    "value": "eGain"
                  }
                ],
                "contacts": {
                  "contact": [
                    {
                      "type": "phone",
                      "subType": "mobile",
                      "address": "123456788"
                    },
                    {
                      "type": "email",
                      "address":  `${user.username}@example.com`
                    }
                  ]
                }
              }
            },
            "sender": {
              "type": "customer",
              "participant": {
                "name": "customer_name"
              }
            },
            "attributes": {
              "attribute": [
                {
                  "external": true,
                  "name": "k1",
                  "value": "v1"
                }
              ]
            }
          }
        ]
      }
    };

    var sendmsg_body= JSON.stringify(sendmsg_req);
     //console.dir(sendmsg_body)
    let sendmsg_url = new URL(`${config.egainAPiUrl}/conversations/messages`);
    let sendmsg_response = await fetch(sendmsg_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': 'en-us',
        Authorization: `Bearer  ${access_token}`,
      },
      body: sendmsg_body,
    });

    let egain_msg_feedback = await sendmsg_response.json();
    let conversationid= egain_msg_feedback.messages.message[0].conversation.id;
    console.log(`\u{1F7EA}from eGain egain_msg_feedback++++`);
      console.log('egain_msg_feedbackid '+ conversationid)
      console.dir(egain_msg_feedback, { depth: null });
   
//const  conversationid= datum.id;
      return {
        id: user.psid,
        conversationid: conversationid,
        message: message,
        username: user.username,
        name: user.name,
        firstName: user.first_name,
        lastName: user.last_name,
        gender: user.gender,
        locale: user.locale,
        timezone: user.timezone,
      };

      
    } catch (e) {
      console.error('Error: ', e);
    }
  }
};
//lummy from here

//printAddress()
