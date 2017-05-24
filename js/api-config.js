"use strict";

let api = require("./api-getter.js");
let apiData = api.getKey();

var config = {
	apiKey: apiData.apiKey,
	databaseURL: apiData.databaseURL
};

api.getAPIsettings = function() {
	return config;
};

module.exports = {getAPIsettings};