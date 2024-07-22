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
    console.log('sender ' + sender);
    console.log('msg ' + message);

    console.log('msgid ' + msgid);
    return message;
  }

  //lummy from here

  static async SendEgainContinueMessage(user, webhookEvent) {
    let psid = user.psid;
    let message = webhookEvent.message.text;
    let convid = '';
    console.log(
      'Inside  SendEgain Continue  Message for ' +
        user.username +
        'and convoid ' +
        user.convoid
    );
    try {
      if (user.convoid === '') {
        console.log('Create  SendEgain New  Message since convoid is null');

        let url = new URL(
          `${config.egainAPiUrl}/authentication/oauth2/token?forceLogin=yes`
        );
        let address = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            'Accept-Language': 'en-us',

            Authorization: `Basic ${config.egainClientkeySecret}`,
          },
          body: 'grant_type=client_credentials',
          // form: {
          //   "grant_type": "client_credentials"
          // }
        });

        let data = await address.json();

        console.log('data.access_token ' + data.access_token);
        let urls = new URL(
          `${config.egainAPiUrl}/messaging/configuration?entrypoint=${config.egainEntrypointId}`
        );

        //console.log(head);
        let rr = await fetch(urls, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Accept-Language': 'en-us',

            Authorization: `Bearer ${data.access_token}`,
          },
          // body: "grant_type=client_credentials",
          // form: {
          //   "grant_type": "client_credentials"
          // }
        });

        let dat = await rr.json();

        var body = {
          entryPointConfiguration: {
            entryPoint: {
              id: `${config.egainEntrypointId}`,
            },
            lastModified: {
              date: dat.entryPointConfiguration[0].lastModified.date,
            },
          },
          activity: {
            customer: {
              type: {
                value: 'individual',
              },
              contacts: {
                contact: [
                  {
                    firstName: user.name,
                    social: [
                      {
                        type: {
                          value: 'instagram',
                        },
                        socialId: user.username,
                      },
                    ],
                  },
                ],
              },
            },
          },
        };
        body = JSON.stringify(body);
        // console.log(body)

        let urlses = new URL(
          `${config.egainAPiUrl}/messaging/conversation/start?searchContactOnAttribute=social.instagramId&conversationContact=social.instagramId`
        );

        let jj = await fetch(urlses, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-Language': 'en-us',
            'Content-Type': 'application/json',
            Authorization: `Bearer  ${data.access_token}`,
          },
          body: body,
        });

        let datum = await jj.json();
        convid = datum.id;

        var msg = {
          conversation: {
            id: datum.id,
          },
          type: {
            value: 'text/plain',
          },
          content: message,
        };
        msg = JSON.stringify(msg);
        console.log(msg);

        let urlses1 = new URL(`${config.egainAPiUrl}/messaging/sendmessage`);

        let kk = await fetch(urlses1, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-Language': 'en-us',
            'Content-Type': 'application/json',
            Authorization: `Bearer  ${data.access_token}`,
          },
          body: msg,
        });
      } else {
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
        let url = new URL(
          `${config.egainAPiUrl}/authentication/oauth2/token?forceLogin=yes`
        );
        let address = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            'Accept-Language': 'en-us',
            Authorization: `Basic ${config.egainClientkeySecret}`,
          },

          body: 'grant_type=client_credentials',
          // form: {
          //   "grant_type": "client_credentials"
          // }
        });

        let data = await address.json();

        let msgs = webhookEvent.message;

        if (msgs.is_deleted === true) {
          var msg = {
            conversation: {
              id: user.convoid,
            },
            type: {
              value: 'text/plain',
            },
            content: 'The message has been deleted',
          };
          msg = JSON.stringify(msg);
          //console.log(msg)

          let urlses1 = new URL(`${config.egainAPiUrl}/messaging/sendmessage`);

          let kk = await fetch(urlses1, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-Language': 'en-us',
              'Content-Type': 'application/json',
              Authorization: `Bearer  ${data.access_token}`,
            },
            body: msg,
          });
        } else if (msgs.text) {
          //console.log(JSON.stringify(user));

          //console.log('data.access_token '+data.access_token);

          var msg = {
            conversation: {
              id: user.convoid,
            },
            type: {
              value: 'text/plain',
            },
            content: message,
          };
          msg = JSON.stringify(msg);
          //console.log(msg)

          let urlses1 = new URL(`${config.egainAPiUrl}/messaging/sendmessage`);

          let kk = await fetch(urlses1, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-Language': 'en-us',
              'Content-Type': 'application/json',
              Authorization: `Bearer  ${data.access_token}`,
            },
            body: msg,
          });
        } else if (msgs.attachments) {
          let attachment = msgs.attachments[0];
          let type = attachment.type;
          let url = attachment.payload.url;
          let response;

          console.log(url);
          //     var msg = {
          //       "conversation":{
          //        "id":user.convoid
          //     },
          //     "type":{
          //        "value":"uploadAttachment"
          //     },
          //     "attachments":{
          //        "attachment":[
          //           {
          //              "fileName":"attachment.jpeg",
          //              "contentType":"image/jpeg",
          //              "size":"32",
          //              "contentUrl":url
          //           }
          //        ]
          //     }
          //  }

          var msg = {
            conversation: {
              id: user.convoid,
            },
            type: {
              value: 'text/plain',
            },
            content: url,
          };
          msg = JSON.stringify(msg);

          console.log('url1' + url);
          // var msg ={
          //   "conversation":{
          //      "id":user.convoid
          //   },
          //   "type":{
          //      "value":"text/plain"
          //   },
          //  "content":url
          // }

          //msg=JSON.stringify(msg)

          // msg=JSON.stringify(msg)
          console.log(msg);

          let urlses1 = new URL(`${config.egainAPiUrl}/messaging/sendmessage`);

          let kk = await fetch(urlses1, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-Language': 'en-us',
              'Content-Type': 'application/json',
              Authorization: `Bearer  ${data.access_token}`,
            },
            body: msg,
          });
          // Get the attachment
          let daas = await kk.json();
          console.log(
            'Received attachment:',
            `${JSON.stringify(msgs.attachments)} for ${psid}`
          );
          console.log('type ' + JSON.stringify(daas) + ' url ');
          console.log(
            'Received attachment:',
            `${JSON.stringify(attachment)} for ${psid}`
          );

          response = Response.genQuickReply(i18n.__('fallback.attachment'), [
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
      // let responsemsg = await kk.json();

      // console.log('conversationid'+datum.id)

      console.log('conversationid' + convid);

      //const  conversationid= datum.id;
      return {
        id: user.psid,
        conversationid: convid,
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
    let message = webhookEvent.message.text;

    console.log(`\u{1F7EA}message object`);
      console.log('message'+ webhookEvent)
      console.dir(webhookEvent, { depth: null });


    let msgs = webhookEvent.message;
    try {
      console.log('Inside  SendEgain New  Message');
       console.log('user.psid ' + user.psid);
       console.log('user.name ' + user.name);

       console.log('username ' + user.username);
       console.log('user ' + user.username);
      console.log('msg '+message);

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

      console.log('data.access_token ' + access_token);

    
    // let accountapp = await account_response.json();
    // let accountapp_id= accountapp.id;
    // console.log(`\u{1F7EA}auth`);
    //   console.log('accountapp '+ accountapp_id)
    //   console.dir(accountapp, { depth: null });
   

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
                  "type": "new_custom_channel"
                },
                "address": "123456766"
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
                      "address": "johnsmith@example.com"
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
    // console.log(body)
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
    console.log(`\u{1F7EA}from eGain`);
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
