"use strict";

let $ = require('../lib/node_modules/jquery');
let api = require("./api-getter.js");
let apiData = api.getKey();

var config = {
	apiKey: apiData.apiKey,
	databaseURL: apiData.databaseURL
};

function getJSON(query) {
	return new Promise((resolve, reject) => {
		console.log('calling all movies');
		query = query.toLowerCase();
		console.log('query', query);
		$.getJSON(`${config.databaseURL}/3/search/movie?api_key=${config.apiKey}&query=${query}`, function(data) {
				data = data.results;
				console.log("movie getJSON array", data);
		}).done(function() {
			resolve(data);
		});
	});
}

module.exports = {getJSON};