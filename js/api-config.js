"use strict";

let api = require("./api-getter.js");
let apiData = api.getKey();

var config = {
	apiKey: apiData.apiKey,
	databaseURL: apiData.databaseURL
};

let getAPIsettings = function() {
	return config;
};

let search = function(value) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${config.databaseURL}/3/search/movie?api_key=${config.apiKey}&language=en-US&query=${value}&page=1&include_adult=false`
		}).done(function(data){
			resolve(data);
		}).fail(function(error){
			reject(error);
		})
	});
};

module.exports = {getAPIsettings, search};