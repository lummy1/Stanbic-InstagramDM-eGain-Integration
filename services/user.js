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

module.exports = class User {
  constructor() {
    this.psid = "";
    this.name = "";
    this.convoid = "";
    //this.username = "";
    this.firstName = "";
    this.lastName = "";
    this.locale = "";
    this.timezone = "";
    this.gender = "neutral";
  }
  setProfile(profile) {
    this.psid = profile.id;
    this.name = profile.name;
    
    //const myArray = profile.name.split(" ");

   // this.firstName = myArray[0];
    this.username = profile.username;
    //this.lastName = myArray[1];
    this.locale = profile.locale || "";
    this.convoid = profile.conversationid || "";
    this.timezone = profile.timezone || "";
    this.gender = profile.gender || "";
  }
};
