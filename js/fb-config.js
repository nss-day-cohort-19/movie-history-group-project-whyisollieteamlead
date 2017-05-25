"use strict";

let firebase = require("../lib/node_modules/firebase/app"),
	fb = require("./fb-getter"),
	fbData = fb();

require("firebase/auth");
require("firebase/database");

var config = {
	apiKey: fbData.apiKey,
	dababaseURL: fbData.databaseURL,
	authDomain: fbData.authDomain,
	//storageBucket: fbData.bucketURL
};

firebase.getFBsettings = function () {
	console.log("gettingFBsettings", config);
	return config;
};

firebase.initializeApp(config);

module.exports = firebase;