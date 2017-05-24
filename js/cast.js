// takes movie id and calls api for cast member of that movie

"use strict";

let api = require('./api-config.js');
let castList = [];


let getCast = function(movieID) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${api.databaseURL}/3/movie/${movieID}/credits?api_key=${api.apiKey}`
		}).done(function(data){
			for(let n=0; n<4; n+=1){
				castList.push(data.cast[n].name);
			}
			resolve(castList);
		}).fail(function(error) {
			reject(error);
		});
	});
};

module.exports = {getCast};