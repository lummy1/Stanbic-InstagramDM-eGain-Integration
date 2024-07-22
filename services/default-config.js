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

module.exports = class DefaultConfig {
  //lummy from here

  static async GetDefaultEgainConfig() {
    try {
      //console.log(JSON.stringify(user));

      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', `${config.egainTokenClientId}`);
      params.append('client_secret', `${config.egainClientkeySecret}`);
      params.append('scope', `${config.egainScope}`);

      var url = new URL(`${config.egainGetTokenUrl}`);
      var get_token = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          'Accept-Language': 'en-us',

          // "Authorization":`Basic ${config.egainClientkeySecret}`
        },
        body: params,
      });

      var data = await get_token.json();

      var access_token = data.access_token;

      console.log('data.access_token ' + access_token);

      // Implement eGain Auth API
      var req = {
        name: `${config.authName}`,
        type: 'basic',
        basicAuth: {
          username: `${config.basicAuthUsername}`,
          password: `${config.basicAuthPassword}`,
        },
      };
      var body = JSON.stringify(req);
      console.log(body);
      var auth_url = new URL(`${config.egainAPiUrl}/authentications`);
      var auth_response = await fetch(auth_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-Language': 'en-us',
          Authorization: `Bearer  ${access_token}`,
        },
        body: body,
      });

      var auth = await auth_response.json();
      console.log(`\u{1F7EA}auth`);

      console.dir(auth, { depth: null });
      console.log(auth.code);
      if (auth.code != undefined || auth.error != undefined) {
        console.log(auth.code);
        var developerMsg = auth.developerMessage;
        console.log(developerMsg);
        return developerMsg;
      } else {
        var auth_id = auth.id;
        console.log('auth_id' + auth_id);

        // Implement eGain Create Client App  API
        var clientapp_req = {
          name: `${config.clientappname}`,
          description: 'Client app for lummax bot',
          active: true,
          roles: [
            {
              name: 'customer',
              version: 'v3',
              callback: `${config.appUrl}/webhook`,
              notificationEmail: 'oluodebiyi@gmail.com',
              headers: [
                {
                  name: 'X-custom-header',
                  value: 'xyz',
                },
              ],
              authentication: {
                id: `${auth_id}`,
                //id: 'efea2248-fcda-4968-9781-40a0afd6001c'
              },
            },
          ],
        };

        var body1 = JSON.stringify(clientapp_req);
        // console.log(body)
        var clientapp_url = new URL(`${config.egainAPiUrl}/clientapplications`);
        var clientapp_response = await fetch(clientapp_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Accept-Language': 'en-us',
            Authorization: `Bearer  ${access_token}`,
          },
          body: body1,
        });

        var clientapp = await clientapp_response.json();
        
        if (clientapp.code != undefined || clientapp.error != undefined) {
          var developerMsg = clientapp.developerMessage;
          return developerMsg;
        } else {
          var clientapp_id = clientapp.id;
          console.log('clientapp_id' + clientapp_id);

          // Implement eGain Create Channel  API
          var channel_req = {
            type: `${config.channelType}`,
            icon: '<base64>',
            displayName: 'Custom Channel',
            description: 'Custom Channel',
            active: true,
            restrictions: {
              inbound: {
                maxTextLength: 140,
                features: ['typing_events', 'attachments', 'richText'],
                attachmentPolicy: {
                  enabled: true,
                  maxSize: 12345,
                  type: 'block',
                  extensions: ['bat', 'exe', 'js'],
                },
              },
              outbound: {
                maxTextLength: 140,
                systemMessages: true,
                midChatAuth: true,
                features: ['typing_events', 'attachments', 'richText'],
                richMessageTypes: [
                  'listpicker',
                  'quickreply',
                  'timepicker',
                  'richlink',
                ],
                attachmentPolicy: {
                  enabled: true,
                  maxSize: 12345,
                  type: 'block',
                  extensions: ['bat', 'exe', 'js'],
                },
              },
            },
            l10nProperties: [
              {
                language: 'en-US',
                properties: [
                  {
                    name: 'msg_hub_retain_and_retry',
                    value:
                      'Thank you for reaching out. We will respond to you at the earliest.',
                  },
                  {
                    name: 'msg_hub_off_hours',
                    value:
                      'Thank you for your inquiry. Our service hours are 9am-5pm PST, Monday-Friday. If you are trying within the service hours and still getting this message, please try again after some time.',
                  },
                  {
                    name: 'msg_hub_invalid_content_type_to_customer',
                    value: 'This content type is not currently supported.',
                  },
                  {
                    name: 'msg_hub_invalid_content_type_to_agent',
                    value: 'This content type is not currently supported.',
                  },
                  {
                    name: 'msg_hub_channel_msg_failed',
                    value:
                      'Message could not be delivered. Please try again after some time.',
                  },
                  {
                    name: 'msg_hub_blocked_file_extension',
                    value: "Attachment file type '{0}' is not allowed.",
                  },
                  {
                    name: 'msg_hub_attachment_size_exceeds_limit',
                    value:
                      'File could not be sent. It exceeded the maximum limit of {0}',
                  },
                ],
              },
            ],
          };

          var channel_body1 = JSON.stringify(channel_req);
          // console.log(body)
          var channel_url = new URL(`${config.egainAPiUrl}/channels`);
          var channel_response = await fetch(channel_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'Accept-Language': 'en-us',
              Authorization: `Bearer  ${access_token}`,
            },
            body: channel_body1,
          });

          var channelapp = await channel_response.json();

          if (channelapp.code != undefined || channelapp.error != undefined) {
            var developerMsg = channelapp.developerMessage;
            return developerMsg;
          } else {
            var channelapp_id = channelapp.id;
            console.log('channelapp_id' + channelapp_id);

            //Implement eGain Create Orchestration  API
            var orchestration_req = {
              name: `${config.orchestrationName}`,
              applications: {
                customerConfiguration: {
                  customer: {
                    id: `${clientapp_id}`,
                  },
                },
                agentConfiguration: {
                  agents: [
                    {
                      id: '5cb3cef6-34bb-4d6f-ae85-310ce6775a62',
                    },
                  ],
                },
              },
            };

            var orchestration_body = JSON.stringify(orchestration_req);
            // console.log(body)
            var orchestration_url = new URL(
              `${config.egainAPiUrl}/orchestrations`
            );
            var orchestration_response = await fetch(orchestration_url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Accept-Language': 'en-us',
                Authorization: `Bearer  ${access_token}`,
              },
              body: orchestration_body,
            });

            var orchestratinapp = await orchestration_response.json();

            if (orchestratinapp.code != undefined || orchestratinapp.error != undefined) {
              var developerMsg = orchestratinapp.developerMessage;
              return developerMsg;
            } else {
              var orchestratinapp_id = orchestratinapp.id;
              console.log('orchestratinapp_id' + orchestratinapp_id);

              //Implement eGain Create Account  API
              var account_req = {
                name: `${config.accountName}`,
                address: '123456766',
                channel: {
                  id: `${channelapp_id}`,
                },
                chatConfigurations: {
                  timeout: 30,
                  defaultLanguage: 'en-US',
                  onAgentUnavailability: 'off_hours',
                  allowLogoutWithOpenChats: false,
                  allowQueueTransferOnAgentUnavailability: false,
                  orchestration: {
                    id: `${orchestratinapp_id}`,
                  },
                  entryPoint: {
                    id: `${config.entryPoint}`,
                  },
                },
              };

              var account_body = JSON.stringify(account_req);
              // console.log(body)
              var account_url = new URL(`${config.egainAPiUrl}/accounts`);
              var account_response = await fetch(account_url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'Accept-Language': 'en-us',
                  Authorization: `Bearer  ${access_token}`,
                },
                body: account_body,
              });

              var accountapp = await account_response.json();
              if (accountapp.code != undefined || accountapp.error != undefined) {
                var developerMsg = accountapp.developerMessage;
                return developerMsg;
              } else {
                var accountapp_id = accountapp.id;
                console.log('accountapp_id' + accountapp_id);
              }


              return {
                accountapp_id: accountapp_id,
                orchestratinapp_id: orchestratinapp_id,
                channelapp_id: channelapp_id,
                auth_id: auth_id,
      
                clientapp_id: clientapp_id,
              };
              // var accountapp_id = accountapp.id;
              // console.log(`\u{1F7EA}auth`);
              // console.log('accountapp ' + accountapp_id);
              // console.dir(accountapp, { depth: null });
              //const  conversationid= datum.id;
            }
          }
        }
      }
      
      
       
      
    } catch (e) {
      console.error('Error: ', e);
    }
  }
};
//lummy from here

//printAddress()
