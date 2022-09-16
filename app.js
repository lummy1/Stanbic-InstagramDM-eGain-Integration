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

// Import dependencies and set up http server
const express = require("express"),
  { urlencoded, json } = require("body-parser"),
  crypto = require("crypto"),
  path = require("path"),
  Response = require("./services/response"),

  Receive = require("./services/receive"),
  GraphApi = require("./services/graph-api"),
  Egain = require("./services/egain"),
  User = require("./services/user"),
  Convo = require("./services/convo"),
  config = require("./services/config"),
  i18n = require("./i18n.config"),
  app = express();

var users = {};
var userk = {};
var userj = {};
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

// Respond with index file when a GET request is made to the homepage
app.get("/", function(_req, res) {
  res.render("index");
});


//lummy Egain Agent message POst endpoint
app.post("/agentmsg", (req, res) => {
  let body = req.body;
  res.status(200).send();
  //console.log(body.message[0].content);
  
  let content=body.message[0];
  let conversationid=body.message[0].conversation.id;
  //console.log(body.message[0].conversation.id);
  
  let egainsender=body.message[0].sender.type;
  console.log(`\u{1F7EA}egain agent msg`);
  console.log('senderPsid_rec2'+ senderPsid_rec)
  console.dir(body, { depth: null });
  
  //return Receive.handleEgainMessage(egainsender,content,egainmsgid);
  let receiveMessage = new Receive(senderPsid_rec,content);
  return receiveMessage.handleEgainContinueMessage();
})


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
 
  
  
  
  try{
  // Check if this is an event from a page subscription
  if (body.object === "page" || body.object === "instagram" ) {
    // Returns a '200 OK' response to all requests
    //res.status(200).send("EVENT_RECEIVED");

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
          return;
        } else if ("delivery" in webhookEvent) {
          console.log("Got a delivery event");
          return;
        } else if (webhookEvent.message && webhookEvent.message.is_echo) {
          console.log("Got an echo of our send, mid = " + webhookEvent.message.mid);
          return;
        }

        // Get the sender PSID
        let senderPsid = webhookEvent.sender.id;
        //let userscheck=users;
       // console.log("sender psid=1 " + JSON.stringify(users));
        //let senderPsid_check = webhookEvent.sender.id;
        
        if (webhookEvent.message!=undefined) {
        if (!(senderPsid in users)) {
          // First time seeing this user
          //let receiveMessage = new Receive(senderPsid_check, webhookEvent);
          
          let user = new User(senderPsid);
          let userProfile = await GraphApi.getUserProfile(senderPsid);
          if (userProfile) {
            //console.log({ userProfile });
            user.setProfile(userProfile);
            users[senderPsid] = user;
           // console.log(`Created new user profile:`);
           // console.log({ user });

          }
          let messageProfile=await Egain.SendEgainNewMessage(users[senderPsid],webhookEvent);
          let converId=messageProfile.conversationid;
          if (messageProfile) {
            let user = new User(messageProfile.id);
            //console.log({ messageProfile });
            user.setProfile(messageProfile);
           
            users[senderPsid]=user;
            userk = users[senderPsid];

            if (!(converId in userj)) {
            let user1 = new User(messageProfile.conversationid);
            
            user1.setProfile(messageProfile);
            userj[converId]=user1;
           
            userm=userj[converId];
            }
            console.log(`updated user profile:`);
              console.log({ userk });
              //console.log({ userm });
              
  
              //console.log('comvo'+users[senderPsid].psid);
          }
          
         
        }else{
          console.log('users[senderPsid] in SendEgainContinueMessage'+JSON.stringify(users[senderPsid]));
          console.log('userk1 in SendEgainContinueMessage'+JSON.stringify(userk));
          console.log('userks1 in SendEgainContinueMessage'+JSON.stringify(userks));
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
            userk = users[senderPsid];
            if (!(converId in userj)) {
              let user1 = new User(messageProfile.conversationid);
              
              user1.setProfile(messageProfile);
              userj[converId]=user1;
             
              userm=userj[converId];
              }
            console.log(`updated user profile from continue message:`);
              //console.log({ userk });
              console.log('userk2 in SendEgainContinueMessage'+JSON.stringify(userk));
             
             // console.log({ userm });
  
          }
         
         
        }
           // let newSenderPsid=users[senderPsid].psid;
        //console.log("sender psid= " + JSON.stringify(users));
        i18n.setLocale(users[senderPsid].locale);
        //console.log("suserscheck=1 " +  JSON.stringify(users[newSenderPsid]));
        //users[nsenderPsid] = user;
        
      }
          // console.log('senderPsid_checknew '+senderPsid_check )
           //Egain.SendEgainNewMessage();

      
      });
    }


    });
  
  }else if(body.message[0]!=''){
   console.log('user k in egain body msg'+JSON.stringify(userk));
  // console.log('user m in egain body msg'+JSON.stringify(userm));
     let egainmsgjson=body.message[0];
let egainconvoid=egainmsgjson.conversation.id;
let userconvoid=userk.convoid;
var userks='';
     if(userconvoid!=egainconvoid){
     
      var obj=userj;
   //console.log('egainconvoid '+egainconvoid);
   var userks=obj[egainconvoid];
   //console.log('dkk '+userks);
    //console.log('dd[egainconvoid] '+obj[egainconvoid].psid);
//        
      // let userm = new Convo(egainconvoid);
      //  console.log({ messageProfile });
      //  userm.setConvoProfile(messageProfile);
      //  users[egainconvoid]=userm;
      //  userk = users[egainconvoid];
      //  console.log(`updated user profile from egain body :`);
      //    console.log({ userk });
         
     }
    console.log(`\u{1F7EA}egain agent msg`); 
    //console.log("suserscheck=123 " +  JSON.stringify(users[senderPsid]));
    //console.log("su " +  JSON.stringify(user));
   // console.log("suserscheck=12 " +  JSON.stringify(users));
   // console.log("suserscheck=14 " +  JSON.stringify(userj));
   // console.log(dd[egainconvoid].name);

   //console.log('userk '+userk);
   //console.log('userks '+userks);
    //let convoid=body.message[0].conversation.id;
   // console.log("suserscheck=13 " +  JSON.stringify(users[newSenderPsid]));
    //if (convoid in users){
      //console.log("suserscheck=14 got " +  convoid);
      if(userks!=''){
        let receiveMessage = new Receive(userks,egainmsgjson);
      return receiveMessage.handleEgain2InstagramMessage();
      }else{
      let receiveMessage = new Receive(userk,egainmsgjson);
      return receiveMessage.handleEgain2InstagramMessage();
      }

    //}


  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
} catch (e) {
  console.error("Error: ", e);
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
        "Make sure to set the both the Messenger profile, persona " +
        "and webhook by visiting:\n" +
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
