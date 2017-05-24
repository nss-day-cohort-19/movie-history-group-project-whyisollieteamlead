"use strict";

let api = require("./api-getter.js");
let apiData = api.getKey();

var config = {
	apiKey: apiData.apiKey,
	databaseURL: apiData.databaseURL
};

api.getJSON = function(query) {
	let movies = [];
	query = query.toLowerCase();
	$.getJSON( `${databaseURL}api_key=${apiKey}&query=${query}`, function(data){
		$.each(data, function() {
			;
		});
	});
};

module.exports = {getJSON};