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
let val='';

const Curation = require("./curation"),
  Order = require("./order"),
  Response = require("./response"),
  Care = require("./care"),
  Survey = require("./survey"),
  Egain = require("./egain"),
  GraphApi = require("./graph-api"),
  i18n = require("../i18n.config");
  //var Storage = require('dom-storage');

  
  
module.exports = class Receive {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  
//handle Egain continous message
handleEgain2InstagramMessage() {
    
    let event = this.webhookEvent;
    let user = this.user;
    console.log('ENter Send to Instagram Continue messagae');
    console.log('event'+JSON.stringify(event));
    console.log('user'+JSON.stringify(user));
    //let userss =JSON.stringify(user)
    //console.log('useru'+userss.psid);
    //console.log('useru_val'+this.user.psid);
    console.log('useru_valconvoid'+this.user.convoid);
    console.log('egain_valconvoid'+event.conversation.id); 
    // in-file, doesn't call `String(val)` on values (default)
  //var localStorage = new Storage(null, { strict: false, ws: '  ' });
  
  // in-memory, does call `String(val)` on values (i.e. `{}` becomes `'[object Object]'`
  //var sessionStorage = new Storage(null, { strict: true });
  
  // var myValue = { foo: 'bar', baz: 'quux' };
  // if (user.psid){
  // localStorage.setItem('myKey', user);
  // }
  // myValue = localStorage.getItem('myKey');


    let responses;

    try {

      
         if(event.content){
        console.log('if coming from egain, send message to instagram');
           // console.log('event'+event.content);
        //if(event.sender.type!='system'){
        responses = this.handleEgainTextMessage();
        console.log('responses  '+JSON.stringify(responses))
        //}
      }
        
      
    } catch (error) {
      console.error(error);
      responses = {
        text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`
      };
    }

    if (Array.isArray(responses)) {
      //console.log('got')
     this.sendMessage(responses);
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 2000);
        delay++;
      }
    } else {
      this.sendMessage(responses);
    }
  }
 
  
  //Egain Handle New message
  handleEgainNewMessage() {
    console.log('ENter NEW egain messagae');
    let event = this.webhookEvent;
    let user = this.user;
    console.log('event'+event);
    console.log('user'+user);
   // console.log('user'+user.psid); 
    val= user.psid;
    
    let message = event.message;
    console.log(val);
    let responses;

    try {
      if (message.text) {
       
        
       // let res= Egain.SendEgainNewMessage(user,event.message.text);
      //   async function doSomething() {
      //     let result = await Egain.SendEgainNewMessage(user,event.message.text);
      //     console.log('res'+result)
      //     return result ;
      // }
      //   let resa=doSomething();
      
      //  console.log('resa'+resa)
        var something = async() => {
          let result = await Egain.SendEgainNewMessage(user,event.message.text);
          console.log('res'+result)
          return result;
       }
       something().then(data => console.log('cheel'+data));
     let  some=something().then(data => console.log('cheel'+data));
      console.log('rrrr'+some);
        
        //responses = this.handleEgainTextMessage();
      }else if (message.attachments) {
             responses = this.handleAttachmentMessage();
           }
        
      //   if (message.quick_reply) {
      //     responses = this.handleQuickReply();
      //   } else if (message.attachments) {
      //     responses = this.handleAttachmentMessage();
      //   } else if (message.text) {
      //     responses = this.handleTextMessage();
      //   }
      // } else if (msg.postback) {
      //   responses = this.handlePostback();
      // } else if (msg.referral) {
      //   responses = this.handleReferral();
      // }
    } catch (error) {
      console.error(error);
      responses = {
        text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`
      };
    }

    if (Array.isArray(responses)) {
      //console.log('got')
     this.sendMessage(responses);
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 2000);
        delay++;
      }
    } else {
      this.sendMessage(responses);
    }
  }


  // Check if the event is a message or postback and
  // call the appropriate handler function
  handleMessage() {
    let event = this.webhookEvent;

    let responses;

    try {
      if (event.message) {
        let message = event.message;

        if (message.quick_reply) {
          responses = this.handleQuickReply();
        } else if (message.attachments) {
          responses = this.handleAttachmentMessage();
        } else if (message.text) {
          responses = this.handleTextMessage();
        }
      } else if (event.postback) {
        responses = this.handlePostback();
      } else if (event.referral) {
        responses = this.handleReferral();
      }
    } catch (error) {
      console.error(error);
      responses = {
        text: `An error has occured: '${error}'. We have been notified and will fix the issue shortly!`
      };
    }

    if (Array.isArray(responses)) {
      this.sendMessage(responses);
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 2000);
        delay++;
      }
    } else {
      this.sendMessage(responses);
    }
  }

  //lummy handle text msgs
  // Handles messages events with text
  static genEgainMessage(sender,message,msgid) {

    // let welcome = this.genText(
    //   i18n.__("get_started.welcome", {
    //     userFirstName: user.firstName
    //   })
    // );

    
    console.log('senders ' + sender);
    console.log('msgss '+message)

    console.log('msgids '+msgid)

    this.webhookEvent;
    console.dir('webhookEvent '+this.webhookEvent, { depth: null });
    console.dir('userr '+this.user, { depth: null });
    return message;


  }



  handleTextMessage() {
    console.log(
      "Received text:",
      `${this.webhookEvent.message.text} for ${this.user.psid} and ${this.user.username}`
    );

    let event = this.webhookEvent;

    // check greeting is here and is confident
    let greeting = this.firstEntity(event.message.nlp, "greetings");
    let message = event.message.text.trim().toLowerCase();

    let response;

    if (
      (greeting && greeting.confidence > 0.8) ||
      message.includes("start over")
    ) {
      response = Response.genNuxMessage(this.user);
    // } else if (Number(message)) {
    //   response = Order.handlePayload("ORDER_NUMBER");
    // } else if (message.includes("#")) {
    //   response = Survey.handlePayload("CSAT_SUGGESTION");
    // } else if (message.includes(i18n.__("care.help").toLowerCase())) {
    //   let care = new Care(this.user, this.webhookEvent);
    //   response = care.handlePayload("CARE_HELP");
    } else {

      
      response = Response.genText(message);
      //console.dir("convoid" +convoid);
      //res = this.genEgainMessage(sender,message,msgid);
      //console.log('resp' +res);

     //response= Response.genText(res);
         //Response.genText(i18n.__("get_started.guidance")),
      // response = [
      //   Response.genText(
      //     i18n.__("fallback.any", {
      //       message: event.message.text
      //     })
      //   ),
      //   Response.genText(i18n.__("get_started.guidance")),
      //   Response.genQuickReply(i18n.__("get_started.help"), [
      //     {
      //       title: i18n.__("menu.suggestion"),
      //       payload: "CURATION"
      //     },
      //     {
      //       title: i18n.__("menu.help"),
      //       payload: "CARE_HELP"
      //     }
      //   ])
      // ];
    }

    return response;
  }


  handleEgainTextMessage() {
    console.log(
      "Received text:",
      `${this.webhookEvent.content} for ${this.user.psid} and ${this.user.username} and ${this.user}`
    );

    let event = this.webhookEvent;

    // check greeting is here and is confident
    //let greeting = this.firstEntity(event.message.nlp, "greetings");
    let message = event.content.trim().toLowerCase();
    //let messa = event.content.trim().toLowerCase();
    //console.log('event.content messa'+messa);
    let response;

    // if (
    //   (greeting && greeting.confidence > 0.8) ||
    //   message.includes("start over")
    // ) {
    //   response = Response.genNuxMessage(this.user);
    // } else if (Number(message)) {
    //   response = Order.handlePayload("ORDER_NUMBER");
    // } else if (message.includes("#")) {
    //   response = Survey.handlePayload("CSAT_SUGGESTION");
    // } else if (message.includes(i18n.__("care.help").toLowerCase())) {
    //   let care = new Care(this.user, this.webhookEvent);
    //   response = care.handlePayload("CARE_HELP");
    // } else {
      response = 
        Response.genText(
          i18n.__("egain.msg", {
            message:event.content
          })
        );
    
//console.log('check '+JSON.stringify(response))
    return response;
  }


  // Handles mesage events with attachments
  handleAttachmentMessage() {
    let response;

    // Get the attachment
    let attachment = this.webhookEvent.message.attachments[0];
    console.log("Received attachment:", `${attachment} for ${this.user.psid}`);

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

    return response;
  }

  //Lummy quick reply
  // Handles mesage events with quick replies
  handleQuickReply() {
    // Get the payload of the quick reply
    let payload = this.webhookEvent.message.quick_reply.payload;

    return this.handlePayload(payload);
  }

  // Handles postbacks events
  handlePostback() {
    let postback = this.webhookEvent.postback;
    // Check for the special Get Starded with referral
    let payload;
    if (postback.payload) {
      // Get the payload of the postback
      payload = postback.payload;
    } else if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    }

    return this.handlePayload(payload.toUpperCase());
  }

  // Handles referral events
  handleReferral() {
    // Get the payload of the postback
    let payload = this.webhookEvent.referral.ref.toUpperCase();

    return this.handlePayload(payload);
  }

  handlePayload(payload) {
    console.log("Received Payload:", `${payload} for ${this.user.psid}`);

    let response;

    // Set the response based on the payload
    if (
      payload === "GET_STARTED" ||
      payload === "DEVDOCS" ||
      payload === "GITHUB"
    ) {
      response = Response.genNuxMessage(this.user);
    } else if (payload.includes("CURATION") || payload.includes("COUPON")) {
      let curation = new Curation(this.user, this.webhookEvent);
      response = curation.handlePayload(payload);
    } else if (payload.includes("CARE")) {
      let care = new Care(this.user, this.webhookEvent);
      response = care.handlePayload(payload);
    } else if (payload.includes("ORDER")) {
      response = Order.handlePayload(payload);
    } else if (payload.includes("CSAT")) {
      response = Survey.handlePayload(payload);
    } else if (payload.includes("CHAT-PLUGIN")) {
      response = [
        Response.genText(i18n.__("chat_plugin.prompt")),
        Response.genText(i18n.__("get_started.guidance")),
        Response.genQuickReply(i18n.__("get_started.help"), [
          {
            title: i18n.__("care.order"),
            payload: "CARE_ORDER"
          },
          {
            title: i18n.__("care.billing"),
            payload: "CARE_BILLING"
          },
          {
            title: i18n.__("care.other"),
            payload: "CARE_OTHER"
          }
        ])
      ];
    } else if(payload.includes("BOOK_APPOINTMENT")){
      response = [
        Response.genText(i18n.__("care.appointment")),
        Response.genText(i18n.__("care.end"))
      ];
    }else {
      response = {
        text: `This is a default postback message for payload: ${payload}!`
      };
    }

    return response;
  }

  handlePrivateReply(type, object_id) {
    let welcomeMessage =
      i18n.__("get_started.welcome") +
      " " +
      i18n.__("get_started.guidance") +
      ". " +
      i18n.__("get_started.help");

    let response = Response.genQuickReply(welcomeMessage, [
      {
        title: i18n.__("menu.suggestion"),
        payload: "CURATION"
      },
      {
        title: i18n.__("menu.help"),
        payload: "CARE_HELP"
      }
    ]);

    let requestBody = {
      recipient: {
        [type]: object_id
      },
      message: response
    };

    GraphApi.callSendApi(requestBody);
  }

  sendMessage(response, delay = 0) {
console.log('inside send message: user- '+this.user.psid +'and message -'+response)

    
    if(response!=undefined){
    // Check if there is delay in the response
    if ("delay" in response) {
      delay = response["delay"];
      delete response["delay"];
    }

    // Construct the message body
    let requestBody = {
      recipient: {
        id: this.user.psid
        //id: this.user.psid
        //id:7407800592594275
      },
      message: response
    };

   // Check if there is persona id in the response
    if ("persona_id" in response) {
      let persona_id = response["persona_id"];
      delete response["persona_id"];

      requestBody = {
        recipient: {
          id: this.user.psid
        },
        message: response,
        persona_id: persona_id
      };
    }

    setTimeout(() => GraphApi.callSendApi(requestBody), delay);
  }
  }

  firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
  }
};
