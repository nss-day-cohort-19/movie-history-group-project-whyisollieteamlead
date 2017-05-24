//send newMovie to the db then reload DOM w/ updated movie data
$(document).on("click", ".add-new-movie", function(){
		console.log("clicked add new movie btn");
		let movieObj = buildMovieObj();
		db.addMovie(movieObj)
		.then(function(movieID){
			loadMoviesToDOM();
	});
});

$(document).on("click", ".delete-btn", function(){
	let movieID = $(this).data("delete-id");
	db.deleteMovie(movieID)
	.then(function(){
		loadMoviesToDOM();
	});
});


//get movie from db and populate form for editing
$(document).on("click", ".edit-btn", function(){
		console.log("clicked on edit movies");
		let movieID = $(this).data("edit-id");
		db.getMovies(movieID)
		.then(function(movie){
			return templates.movieForm(movie, movieID);
		});
		// .then(function(finishedForm){
		// 	//will need to add div or wrapper here
		// });
});

//load the new movie form
$("#add-movie").click(function(){
	console.log("clicked add movie");
	var movieForm = templates.movieForm()
	.then(function(movieForm){
		$(".uiContainer--wrapper").html(movieForm);
	});
});

$("#auth-btn").click(function(){
	console.log("clicked on auth-btn");
	user.logInGoogle()
	.then(function(result){
		console.log("result from user login", result.user.uid);
		user.setUser(result.user.uid);
		$("#auth-btn").addClass("is-hidden");
		$("#logout").addClass("is-hidden");
		loadMoviesToDOM();
	});
});

$("#logout").click(function(){
	console.log("LOGOUT WAS CLICKED");
	user.logOut();
});


