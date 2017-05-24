"use strict";

let api = require("./api-getter.js");
let apiData = api.getKey();

var config = {
	apiKey: apiData.apiKey,
	databaseURL: apiData.databaseURL
};

api.getJSON = function(query) {
	query = query.toLowerCase();
	$.getJSON( `${databaseURL}api_key=${apiKey}&query=${query}`, function(){
		;
	})
};

module.exports = {getJSON};