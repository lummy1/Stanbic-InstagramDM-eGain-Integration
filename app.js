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

const { response } = require("express");

//const nodeUuid = require('uuid');
//const  mongoose = require("mongoose");
// Import dependencies and set up http server

const express = require("express"),

  { urlencoded, json } = require("body-parser"),
  crypto = require("crypto"),
  path = require("path"),
  //User = require("./services/user.model"),
  Response = require("./services/response"),
  User = require("./services/user"),
  DefaultConfig = require("./services/default-config"),
  Receive = require("./services/receive"),
  GraphApi = require("./services/graph-api"),
  Egain = require("./services/egain"),
  
  Convo = require("./services/convo"),
  config = require("./services/config"),
  i18n = require("./i18n.config"),


  
  app = express();

var users = {};
var updatedUserProfile = {};
var initialUser = {};
var userm = {};
//var messageProfile = {};
// Parse application/x-www-form-urlencoded
app.use(
  urlencoded({
    extended: true
  })
);

// Parse application/json. Verify that callback came from Facebook
app.use(json({ verify: verifyRequestSignature }));

// Serving static files in Express
app.use(express.static(path.join(path.resolve(), "public")));

// Set template engine in Express
app.set("view engine", "ejs");





	// mongoose.Promise = global.Promise
	
	// mongoose.connect(config.mongoUri, { useNewUrlParser: true,
	// //useCreateIndex: true, 
	// //useUnifiedTopology: true 
	// } ).then(()=>{
	// 	console.log("mongodb database connected")
	// })
	// mongoose.connection.on('error', () => {
	// throw new Error(`unable to connect to database: ${config.mongoUri}`) 
	// });


// Respond with index file when a GET request is made to the homepage
app.get("/", function(_req, res) {
  res.render("index");
});

// //lummy handle Authentication POst endpoint
//  app.post("/authentication", async (req, res) => {
//   //let users = new User(req.body);
//   // res.status(200).send();
//   let search = await User.find().select('basicAuth.username basicAuth.password');
//   //let search = await User.find();
//   let users = new User(req.body);
//   console.log(search[0].basicAuth.username);
//   console.log(search[0].basicAuth.password);
//   console.log(users.basicAuth.username);
//   console.log(users.basicAuth.password);

  
//   if(search[0].basicAuth.username==users.basicAuth.username && search[0].basicAuth.password==users.basicAuth.password){
//     console.log('correct');
//     var uuid = nodeUuid.v4();
//     users.token = uuid;
//     users.save();
//   }else{

//     return res.json(
      
//       {message: "wrong username and password"}
//     );
//   }

//   return res.json(users.token);
 
// });
app.get("/testactivity", (req,res)=>{
 

async function run() {
  const query = new URLSearchParams({
    //$pagenum: '',
    // $pagesize: '',
    // $rangestart: '',
    // $rangesize: '',
   $attribute: 'all',
   // $order: 'asc',
    //$sort: '',
    //caseID: '',
    //customerID: '',
    status: 'completed',
    mode: 'inbound',
    //assignedTo: '',
   // queueID: '',
    //created: '08/04/2024',
    //lastModified: '',
    //assignedUserName: '',
    type: 'chat',
    //read: 'yes',
    //secure: 'yes',
    department: 'Avante',
    //custom: ''
  }).toString();

  const resp = await fetch(
    `https://api.egain.cloud/core/casemgr/v3/activity?${query}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en-US',
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik1HTHFqOThWTkxvWGFGZnBKQ0JwZ0I0SmFLcyJ9.eyJhdWQiOiI3MTNkYWE1OC0yNTIxLTQzZmMtOTIzZi01Y2RhOGRiZjExZTkiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vZjUxMzAyZGQtNzAzNi00MWI1LWI2MTktZTFhNTJhNjdjNzgwL3YyLjAiLCJpYXQiOjE3MjI5NDY1NjgsIm5iZiI6MTcyMjk0NjU2OCwiZXhwIjoxNzIyOTUwNDY4LCJhaW8iOiJBU1FBMi84WEFBQUFvZWdlY0xZdmNLbVVoRU9jcU9lV0VkZ3R4cTFaR3pEdlA4b1JNaUk5Q2JVPSIsImF6cCI6ImM2NjE0ZjEzLTQ0N2EtNDU1NS04NTM1LTQ5MmE5NjFhZTllOSIsImF6cGFjciI6IjEiLCJvaWQiOiJjZjY4MmJmMy04Nzg5LTQ1NzUtOTA1My0wOTdkZDY4NmZmMjIiLCJyaCI6IjAuQVI0QTNRSVQ5VFp3dFVHMkdlR2xLbWZIZ0ZpcVBYRWhKZnhEa2o5YzJvMl9FZWtlQUFBLiIsInJvbGVzIjpbImFwcC5jb252ZXJzYXRpb24ubm90aWZpY2F0aW9ubWdyLmludGVyYWN0aW9uLnJlYWQiLCJhcHAuY29yZS5kZXBhcnRtZW50bWdyLnJlYWQiLCJhcHAuY29udmVyc2F0aW9uLmNvbnZlcnNhdGlvbm1nci5pbnRlcmFjdGlvbi5yZWFkIiwiYXBwLmNvbnZlcnNhdGlvbi5ub3RpZmljYXRpb25tZ3IuaW50ZXJhY3Rpb24ubWFuYWdlIiwiYXBwLmNvcmUuY3VzdG9tZXJtZ3IubWFuYWdlIiwiYXBwLmNvbnZlcnNhdGlvbi5jb252ZXJzYXRpb25tZ3IubWFuYWdlIiwiYXBwLmtub3dsZWRnZS5wb3J0YWxtZ3IubWFuYWdlIiwiYXBwLmNvbnZlcnNhdGlvbi5jb252ZXJzYXRpb25tZ3IuaW50ZXJhY3Rpb24ubWFuYWdlIiwiYXBwLmNvbnZlcnNhdGlvbi5jb252ZXJzYXRpb25tZ3IucmVhZCIsImFwcC5jb3JlLmN1c3RvbWVybWdyLnJlYWQiLCJhcHAuY29udmVyc2F0aW9uLm5vdGlmaWNhdGlvbm1nci5yZWFkIiwiYXBwLmNvbnZlcnNhdGlvbi5ub3RpZmljYXRpb25tZ3IubWFuYWdlIiwiYXBwLmNvcmUuaW5mb21nci5yZWFkIiwiYXBwLmNvcmUuY2FzZW1nci5tYW5hZ2UiLCJhcHAuY29udmVyc2F0aW9uLm1lc3NhZ2Vyb3V0ZXIucmVhZCJdLCJzdWIiOiJjZjY4MmJmMy04Nzg5LTQ1NzUtOTA1My0wOTdkZDY4NmZmMjIiLCJ0aWQiOiJmNTEzMDJkZC03MDM2LTQxYjUtYjYxOS1lMWE1MmE2N2M3ODAiLCJ1dGkiOiJQRm9ldm14cVkwdWVGcnlMdUxUSEFBIiwidmVyIjoiMi4wIn0.IkvL58h7HsxAABcI89GZDqk6EpYUzGnfS-xD52vYxoOArkx-jbJPZYG2BbTu9osolv-UXAwZ8yDXKqpNJXm9FwL5lbOtiq_cP71lYdOPWwIRssgHq2YuhqccLvzvJeYgw3WrfGGw3VscpV57yfrhFgPLobPtJF_eZ8PFQQNIp5vaHZZLOkWdnn5Vul2ZwcMxk-ny3JRX2w3qURNTPRWyf7QdHx6EB_uNvseWz3LIfRMHLyporMutwkOL1zmmqHc2ffZ-p-xIt4E7yazAd0JFIEAQenAyfoQQkHOTeQK6_S3wgR3pG2jpMBOx9TzaG1YTzey54wuH4WryarbyBlNV2A'
      }
    }
  );

  const data = await resp.json();
  console.log(data);
  res.send(data);
}

run();
})

//lummy Egain Agent message Post endpoint
app.post("/agentmsg", (req, res) => {
  let body = req.body;
  res.status(200).send();
  console.log(`\u{1F7EA}egain reply message  object`);
      
      //console.dir(body, { depth: null });
  // console.log(body.message[0].content);
  
  let content=body.messages.message[0];
  let conversationid=content.conversation.id;
  //console.log(body.message[0].conversation.id);
  
  let egainsender=content.sender.type;
  let egainsendername=content.sender.participant.name;
  console.log(`\u{1F7EA}egain agent msg`);
 // console.log('senderPsid_rec2'+ senderPsid_rec)
  console.dir(body, { depth: null });
 
  
console.log(egainsender + ' '+egainsendername)
  //return Receive.handleEgainMessage(egainsender,content,egainmsgid);
  //let receiveMessage = new Receive(senderPsid_rec,content);
  let receiveMessage = new Receive(body,content);
      return receiveMessage.handleEgain2InstagramMessage();
  //return receiveMessage.handleEgainContinueMessage();
})

//use to setup default
app.get("/default_config", async (req, res) => {

  let val=  await DefaultConfig.GetDefaultEgainConfig();
  console.log(val);
  res.send(val);
});
// Add support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === config.verifyToken) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Create the endpoint for your webhook
app.post("/webhook", (req, res) => {
  let body = req.body;
  res.status(200).send("EVENT_RECEIVED");
  //console.log(body.object);
  console.log(`\u{1F7EA} Received webhook:`);
  console.dir(body, { depth: null });

 
  // Check if this is an event from a page subscription
  if (body.object === "page" || body.object === "instagram" ) {
    // Returns a '200 OK' response to all requests
    //res.status(200).send("EVENT_RECEIVED");

    try{
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(async function(entry) {

      
      if ("changes" in entry) {
        // Handle Page Changes event
        // let receiveMessage = new Receive();
        // if (entry.changes[0].field === "feed") {
        //   let change = entry.changes[0].value;
        //   switch (change.item) {
        //     case "post":
        //       return receiveMessage.handlePrivateReply(
        //         "post_id",
        //         change.post_id
        //       );
        //     case "comment":
        //       return receiveMessage.handlePrivateReply(
        //         "comment_id",
        //         change.comment_id
        //       );
        //     default:
        //       console.warn("Unsupported feed change type.");
        //       return;
        //   }
        // }

        let receiveMessage = new Receive();
        if (entry.changes[0].field === "comments") {
          let change = entry.changes[0].value;
                   
          switch (change.media.media_product_type) {
            case "FEED":
              return receiveMessage.handlePrivateReply(
                "post_id",
                change.post_id
              );
            case "REELS":
              return receiveMessage.handlePrivateReply(
                "comment_id",
                change.comment_id
              );
            default:
              console.warn("Unsupported feed change type.");
              return;
          }
        }

        if (entry.changes[0].field === "comments") {
          let change = entry.changes[0].value;
          switch (change.item) {
            case "post":
              return receiveMessage.handlePrivateReply(
                "post_id",
                change.post_id
              );
            case "comments":
              return receiveMessage.handlePrivateReply(
                "comment_id",
                change.media.id
              );
            default:
              console.warn("Unsupported feed change type.");
              return;
          }
        }
      
      }
     
      

      if(entry.messaging!=undefined){
      // Iterate over webhook events - there may be multiple
      entry.messaging.forEach(async function(webhookEvent) {
        //console.dir('webhookEvent '+webhookEvent)
        // Discard uninteresting events
        if ("read" in webhookEvent) {
          console.log("Got a read event");
         // return;
        } else if ("delivery" in webhookEvent) {
          console.log("Got a delivery event");
          //return;
        } else if (webhookEvent.message && webhookEvent.message.is_echo) {
          console.log("Got an echo of our send, mid = " + webhookEvent.message.mid);
          //return;
        }

        // console.log("Got2 an echo of our send, mid = " + webhookEvent.message.mid);
        //   console.log('got'+webhookEvent.sender.id);
        // Get the sender PSID
        let senderPsid = webhookEvent.sender.id;
        //let userscheck=users;
       // console.log("sender psid=1 " + JSON.stringify(users));
        //let senderPsid_check = webhookEvent.sender.id;
        
        // console.log(`\u{1F7EA} New change:`);
        //   console.log(webhookEvent.sender.id);


        if (webhookEvent.message!=undefined && webhookEvent.message.is_echo!=true) {


        if (!(senderPsid in users)) {
          // First time seeing this user
          //let receiveMessage = new Receive(senderPsid_check, webhookEvent);
          
          let user = new User(senderPsid);
          let userProfile = await GraphApi.getUserProfile(senderPsid);
          if (userProfile) {
            console.log({ userProfile });
            user.setProfile(userProfile);
            users[senderPsid] = user;
             console.log(`Created new user profile:`);
            console.log({ user });
           let messageProfile=await Egain.SendEgainNewMessage(users[senderPsid],webhookEvent);
           let converId=messageProfile.conversationid;
           if (messageProfile) {
             let user = new User(messageProfile.id);
             //console.log({ messageProfile });
             user.setProfile(messageProfile);
            
             users[senderPsid]=user;
             updatedUserProfile = users[senderPsid];
 
             if (!(converId in initialUser)) {
             let userWithConvoid = new User(messageProfile.conversationid);
             
             userWithConvoid.setProfile(messageProfile);
             initialUser[converId]=userWithConvoid;
            
             userm=initialUser[converId];
             }
            //  console.log(`updated user profile:`);
            //    console.log({ updatedUserProfile });
               //console.log({ userm });
               
   
               //console.log('comvo'+users[senderPsid].psid);
           }
          }
          
          
         
        }else{

          

          console.log('users[senderPsid] in SendEgainContinueMessage'+JSON.stringify(users[senderPsid]));
          console.log('updatedUserProfile in SendEgainContinueMessage'+JSON.stringify(updatedUserProfile));
          console.log('userks1 in SendEgainContinueMessage'+JSON.stringify(userks));
          console.log('userks1 in SendEgainContinueMessage'+JSON.stringify(userm));
          let messageProfile;
          if((JSON.stringify(userks))!=undefined){
            messageProfile=await Egain.SendEgainContinueMessage(userks,webhookEvent);
          }else{
             messageProfile=await Egain.SendEgainContinueMessage(users[senderPsid],webhookEvent);
          }
          
          let converId=messageProfile.conversationid;
          if (messageProfile) {
            let user = new User(messageProfile.id);
           // console.log({ messageProfile });
            user.setProfile(messageProfile);
            users[senderPsid]=user;
            updatedUserProfile = users[senderPsid];
            if (!(converId in initialUser)) {
              let userWithConvoid = new User(messageProfile.conversationid);
              
              userWithConvoid.setProfile(messageProfile);
              initialUser[converId]=userWithConvoid;
             
              userm=initialUser[converId];
              }
            console.log(`updated user profile from continue message:`);
              //console.log({ updatedUserProfile });
              console.log('userk2 in SendEgainContinueMessage'+JSON.stringify(updatedUserProfile));
             
             // console.log({ userm });
  
          }
         
         
        }
           // let newSenderPsid=users[senderPsid].psid;
        //console.log("sender psid= " + JSON.stringify(users));
        //i18n.setLocale(users[senderPsid].locale);
        //console.log("suserscheck=1 " +  JSON.stringify(users[newSenderPsid]));
        //users[nsenderPsid] = user;
        
      }
          // console.log('senderPsid_checknew '+senderPsid_check )
           //Egain.SendEgainNewMessage();

      
      });
    }


    });
  } catch (e) {
    console.error("Error: ", e);
  }

  }else if(body.messages.message[0]!=''){

    console.log('if coming from egain body ++++++++++++++++++')
     console.dir(body, { depth: null });
     let egainmsgjson=body.messages.message[0];
     if(egainmsgjson.type.value== 'conversation.end'){

      updatedUserProfile={};
      console.log('updatedUserProfile in egain body msg'+JSON.stringify(updatedUserProfile));
     }
    try{
   console.log('updatedUserProfile in egain body msg'+JSON.stringify(updatedUserProfile));
  // console.log('user m in egain body msg'+JSON.stringify(userm));
     let egainmsgjson=body.messages.message[0];
    
    
  let egainconvoid=egainmsgjson.conversation.id;
  let userconvoid=updatedUserProfile.convoid;
  var userks='';
     if(userconvoid!=egainconvoid){
     
      var obj=initialUser;
   //console.log('egainconvoid '+egainconvoid);
   var userks=obj[egainconvoid];
   //console.log('dkk '+userks);
    //console.log('dd[egainconvoid] '+obj[egainconvoid].psid);
//        
      // let userm = new Convo(egainconvoid);
      //  console.log({ messageProfile });
      //  userm.setConvoProfile(messageProfile);
      //  users[egainconvoid]=userm;
      //  updatedUserProfile = users[egainconvoid];
      //  console.log(`updated user profile from egain body :`);
      //    console.log({ updatedUserProfile });
         
     }
   // console.log(`\u{1F7EA}egain agent msg`); 
    //console.log("suserscheck=123 " +  JSON.stringify(users[senderPsid]));
    //console.log("su " +  JSON.stringify(user));
   // console.log("suserscheck=12 " +  JSON.stringify(users));
   // console.log("suserscheck=14 " +  JSON.stringify(initialUser));
   // console.log(dd[egainconvoid].name);

   //console.log('updatedUserProfile '+updatedUserProfile);
   //console.log('userks '+userks);
    //let convoid=body.message[0].conversation.id;
   // console.log("suserscheck=13 " +  JSON.stringify(users[newSenderPsid]));
    //if (convoid in users){
      //console.log("suserscheck=14 got " +  convoid);
      if(userks!=''){
        console.log('got in here');
        let receiveMessage = new Receive(userks,egainmsgjson);
      return receiveMessage.handleEgain2InstagramMessage();
      }else{
        console.log('got in here2');
      let receiveMessage = new Receive(updatedUserProfile,egainmsgjson);
      return receiveMessage.handleEgain2InstagramMessage();
      }

    //}

  } catch (e) {
    console.error("Error: ", e);
  }

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }



});

// Set up your App's Messenger Profile
app.get("/profile", (req, res) => {
  let token = req.query["verify_token"];
  let mode = req.query["mode"];

  try{
  if (!config.webhookUrl.startsWith("https://")) {
    res.status(200).send("ERROR - Need a proper API_URL in the .env file");
  }
  var Profile = require("./services/profile.js");
  Profile = new Profile();

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    if (token === config.verifyToken) {
      if (mode == "webhook" || mode == "all") {
        Profile.setWebhook();
        res.write(
          `<p>&#9989; Set app ${config.appId} call to ${config.webhookUrl}</p>`
        );
      }
      if (mode == "profile" || mode == "all") {
        Profile.setThread();
        res.write(
          `<p>&#9989; Set Messenger Profile of Page ${config.pageId}</p>`
        );
      }
      if (mode == "personas" || mode == "all") {
        Profile.setPersonas();
        res.write(`<p>&#9989; Set Personas for ${config.appId}</p>`);
        res.write(
          "<p>Note: To persist the personas, add the following variables \
          to your environment variables:</p>"
        );
        res.write("<ul>");
        res.write(`<li>PERSONA_BILLING = ${config.personaBilling.id}</li>`);
        res.write(`<li>PERSONA_CARE = ${config.personaCare.id}</li>`);
        res.write(`<li>PERSONA_ORDER = ${config.personaOrder.id}</li>`);
        res.write(`<li>PERSONA_SALES = ${config.personaSales.id}</li>`);
        res.write("</ul>");
      }
      if (mode == "nlp" || mode == "all") {
        GraphApi.callNLPConfigsAPI();
        res.write(
          `<p>&#9989; Enabled Built-in NLP for Page ${config.pageId}</p>`
        );
      }
      if (mode == "domains" || mode == "all") {
        Profile.setWhitelistedDomains();
        res.write(
          `<p>&#9989; Whitelisted domains: ${config.whitelistedDomains}</p>`
        );
      }
      if (mode == "private-reply") {
        Profile.setPageFeedWebhook();
        res.write(`<p>&#9989; Set Page Feed Webhook for Private Replies.</p>`);
      }
      res.status(200).end();
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  } else {
    // Returns a '404 Not Found' if mode or token are missing
    res.sendStatus(404);
  }
} catch (e) {
  console.error("Error: ", e);
}
});

// Verify that the callback came from Facebook.
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    console.warn(`Couldn't find "x-hub-signature" in headers.`);
  } else {
    var elements = signature.split("=");
    var signatureHash = elements[1];
    var expectedHash = crypto
      .createHmac("sha1", config.appSecret)
      .update(buf)
      .digest("hex");
    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

// Check if all environment variables are set
config.checkEnvVariables();

// Listen for requests :)
var listener = app.listen(config.port, function() {
  console.log(`The app is listening on port ${listener.address().port}`);
  if (
    Object.keys(config.personas).length == 0 &&
    config.appUrl &&
    config.verifyToken
  ) {
    console.log(
      "Is this the first time running?\n" +
        "Make sure to set the default environment variables and click \n"
        + config.appUrl +"/default_config \n\n"+
        " Also, make sure to set the both the Messenger profile, persona " +
        "and webhook by visiting:\n\n" +
        config.appUrl +
        "/profile?mode=all&verify_token=" +
        config.verifyToken
    );
  }

  if (config.pageId) {
    console.log("Test your app by messaging:");
    console.log(`https://m.me/${config.pageId}`);
  }
});
