
"use strict";
console.log("MAIN.JS");
let $ = require('jquery'),
    db = require("./db-interactions"),
        Handlebars=require("hbsfy/runtime"),
        unwatchedcardsTemplate = require("../templates/unwatched-cards.hbs"),
        watchedcardsTemplate = require("../templates/watched-cards.hbs"),
    // templates = require("./dom-builder"),
    user = require("./user");
require("bootstrap");
require("bootstrap-star-rating");

//Creates new blank movies object
var newMovieObj = {};



//Login
$("#auth-btn").click(function(){
    console.log("clicked on auth btn");
    user.logInGoogle()
    .then(function(result){
    console.log("result from Login", result.user.uid);
    user.setUser(result.user.uid);
    // loadUserMovies();
  });
});

$(document).on("click", "#logout-btn", function(){
    user.logOut();
});


//Gets new movies from movie API database, adds breadcrumbs and displays results on page
$("#find-new-movies").click(function(){
//    $(“.toggle-buttons”).toggle(“toggle-selected”);
    $(document).off("click", ".watch-list-delete");
    $("#input").focus();
    $(".movies").empty();
    let breadcrumbs = "Movie History > Search Results";
    $("#bread-crumbs").text(breadcrumbs);
    var inputItem = $("#input").val();
    //get array of movie titles from database
    db.getMovie(inputItem)
    .then(function(movieData){
        newMovieObj.results = movieData.results;
        //passes that array to getActors function
        getActors(newMovieObj);
    });
});

var getActors = function(movieObj){
    var movieElementArray = [];
    movieObj.results.forEach(function(element){
        element.cast = [];
            db.getActors(element.id)
            .then(function(actors){
                if(actors.cast.length > 5){
                    for(var i=0;i<5;i++){
                        element.cast.push(actors.cast[i]);
                    }
                }else if (actors.cast.length < 5){
                    for(var j=0;j<actors.cast.length;j++){
                        element.cast.push(actors.cast[j]);
                    }
                }
                element.starValue = 0;
            $(".movies").append(unwatchedcardsTemplate(element));
            });

        movieElementArray.push(element);

        });

        $(document).on("click", ".add-to-watchlist", function(event){
                addToWatchList(movieElementArray, event);
    });
};


var addToWatchList = function(movieElementArray,event){
    console.log("movieElementArray", movieElementArray);
    var userID = user.getUser();
    var movieTitle = event.target.closest("div").querySelector(".movie-title").innerHTML;
    var titleToPush = {};
    movieElementArray.forEach(function(movie){
        if(movieTitle === movie.title){
            titleToPush = movie;
        }
    });
    titleToPush.uid = userID;
    console.log("titleToPush", titleToPush);
    db.pushToFirebase(titleToPush)
    .then(function(response){
        console.log(response);
        });
};




$("#logout").click(function(){
  console.log("logout clicked");
  user.logOut();
});
///Tam..buttons do not toggle color yet, pulls a list of movies added to watchlist
$("#show-unwatched-movies").click((event) =>{
    let breadcrumbs = "Movie History > Search Results/Unwatched";
    $("#bread-crumbs").text(breadcrumbs);
    $("#input").val("");
//    $(".toggle-buttons").toggle("toggle-selected");
    let userID = user.getUser();
    console.log("Checking user ID", userID);
    db.pullWatchFromFirebase(userID)
    .then((data) =>{
        displayWatchList(data);
    });
//    .prop('disabled', true)......don't think we need to disable
});
//Tam....empties Dom so only Watchlist will display, set FB unique ID to a var and passed it as an arg//did npm install of bootstrap dependency for stars
function displayWatchList (watchObj) {
    $("#input").val("");
    $(".movies").empty();
     for (let key in watchObj) {
//            console.log("is this a key?" + data[key].title);
            let newMovieObj = watchObj[key];
            newMovieObj.key = key;
            $(".movies").append(watchedcardsTemplate(newMovieObj));
            $("#star--" + key).rating({stars: 10, step: 1, min: 0, max: 10});
            $("#star--" + key).rating('update', newMovieObj.starValue);
        }
    $(".rating").on('rating.change', function(event, value, caption) {
        let currentStarID = event.currentTarget.id.replace("star--", ""); // chop off letters
        let starObj = {
            starValue: value
        };
        let currentUser = user.getUser();
        db.updateStars(currentStarID, starObj, currentUser);

    });
}
//Tam...removed watched movie card from page
$(document).on("click", '.watch-list-delete', function(event){
    let firebaseKey = event.currentTarget.parentElement.id;
    console.log("which key is being deleted" + firebaseKey);
    let deleteButton = event.currentTarget.parentElement;
    let currentUser = user.getUser();
    db.deleteWatchedMovie(firebaseKey, currentUser);
    deleteButton.remove();
});


$("#show-watched-movies").click((event)=>{
    $(".movies").empty();
    let currentUser = user.getUser();
    db.pullWatchFromFirebase(currentUser)
    .then((movieObj) =>{
        for (let key in movieObj) {
            let singleMovie = movieObj[key];
            singleMovie.key = key;
            if (singleMovie.starValue > 0) {
                $(".movies").append(watchedcardsTemplate(singleMovie));
                $("#star--" + key).rating({stars: 10, step: 1, min: 0, max: 10});
                $("#star--" + key).rating('update', singleMovie.starValue);
            }
        }

    }).catch(console.error);
});











