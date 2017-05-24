"use strict";

// let $ = require('jquery');
// 	db = require("./dom-interaction");
// 	templates = require("./dom-builder");
// 	user = require("./user");

//using the rest api
function loadMoviesToDom(){
	console.log("movies loaded");
	let currentUser = user.getUser();
	db.getMovies(currentUser)
	.then(function(movideData){
		console.log("got movie data", movideData);
		var idArray = Object.keys(movieData);
		idArray.forEach(function(key){
			movieData[key].id = key;
		});
		console.log("movie object w/ id", movieData);
		templates.makeMovieList(movieData);
	});
}

// loadMoviesToDOM(): // move to auth section after adding login btn

//*************************************************
//HELPER FUNCTIONS- DOES NOT INVOLVE FIREBASE/API
//*************************************************
//these may need to edited depending on API formatting/info

function buildMovieObj(){
	let movieObj = {
		// title: $("#form-title").val(),
		// poster: $("#form-poster").val(),
		// rating: $("#form-rating").val(),
		// movieId: $("#form-movieId").val();
		// uid: user.getUser();
	};
	return movieObj;
}
