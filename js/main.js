"use strict";

let $ = require('jquery');
	db = require("./dom-interaction");
	templates = require("./dom-builder");
	user = require("./user");

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

//send newMovie to the db then reload DOM w/ updated movie data
$(document).on("click", ".add-new-movie", function(){
		console.log("clicked add new movie btn");
		let movieObj = buildMovieObj();
		db.addMovie(movieObj)
		.then(function(movieID){
			loadMoviesToDOM();
	});
});

//get movie from db and populate form for editing
$(document).on("click", ".edit-btn", function(){
		console.log("clicked on edit movies");
		let movieID = $(this).data("edit-id");
		db.getMovies(movieID)
		.then(function(movie){
			return templates.movieForm(movie, movieID)
		})
		// .then(function(finishedForm){
		// 	//will need to add div or wrapper here
		// });
});

$(document).on("click", ".delete-btn", function(){
	let movieID = $(this).data("delete-id");
	db.deleteMovie(movieID)
	.then(function(){
		loadMoviesToDOM();
	});
});

// function buildMovieObj() {
// 	this will depend on the api format-- leaving blank for now
// };








