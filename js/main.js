
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




//Login/Logout Functionality

//Login
$("#auth-btn").click(function(event){
    console.log("clicked on auth btn");
   $(this).addClass('hidden');
   $("#logout-btn").removeClass('hidden');
   //showPage();
   console.log(event);
    user.logInGoogle()
    .then(function(result){
    console.log("result from Login", result.user.uid);
    user.setUser(result.user.uid);
    // loadUserMovies();
  });
});

//Logout
$(document).on("click", "#logout-btn", function(){
    console.log("logout");
    $(this).addClass('hidden');
   $("#auth-btn").removeClass('hidden');
    user.logOut();
    $("#output").html("");
    //showPage();
});


// var showPage = function(){
//     var currentUser = user.getUser();
//     if (currentUser === null){
//         $("#toolbar").addClass("hidden");
//     }else{
//         $("#toolbar").removeClass("hidden");
//     }
// };







//Gets new movies from movie API database, adds breadcrumbs and displays results on page
$("#find-new-movies").click(function(){
//    $(“.toggle-buttons”).toggle(“toggle-selected”);
    $(document).off("click", ".add-to-watchlist");
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
            console.log("Add to Watchlist: ", event.target);//creating multiple objects that have listener set to it everytime same title is search, which was creating multiple empty objects on other pages
                addToWatchList(movieElementArray, event);
    });
};


var addToWatchList = function(movieElementArray,event){
    console.log("movieElementArray", movieElementArray);
    var userID = user.getUser();
    var movieTitle = event.target.closest("section").querySelector(".movie-title").innerHTML;
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



$("#show-unwatched-movies").click((event) =>{
    let breadcrumbs = "Movie History > Search Results/ Watchlist";
    $("#bread-crumbs").text(breadcrumbs);
    $("#input").val("");
//    $(".toggle-buttons").toggle("toggle-selected");
    let userID = user.getUser();
    console.log("Checking user ID", userID);
    db.pullWatchFromFirebase(userID)
    .then((data) =>{
        displayWatchList(data);
    });
});


//Tam....empties Dom so only Watchlist will display, set FB unique ID to a var and passed it as an arg//did npm install of bootstrap dependency for stars
function displayWatchList (watchObj) {

    $("#input").val("");
    $(".movies").empty();
     for (let key in watchObj) {
            let newMovieObj = watchObj[key];
            newMovieObj.key = key;
            $(".movies").append(watchedcardsTemplate(newMovieObj));
            deleteButtonListener(key);
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
function deleteButtonListener(key) {
    $("#watch--" + key).click((event)=>{
        let deleteButton = event.currentTarget.parentElement.parentElement;
        let currentUser = user.getUser();
        db.deleteWatchedMovie(key, currentUser);
        deleteButton.remove();
    });
}



$("#show-watched-movies").click((event)=>{
    let breadcrumbs = "Movie History > Search Results/ Watchlist/ Watched Movies";
    $("#bread-crumbs").text(breadcrumbs);
    $(document).off("click", ".watch-list-delete");
    $(".movies").empty();
    let currentUser = user.getUser();
    db.pullWatchFromFirebase(currentUser)
    .then((movieObj) =>{
        for (let key in movieObj) {
            let singleMovie = movieObj[key];
            singleMovie.key = key;
            if (singleMovie.starValue > 0) {
                $(".movies").append(watchedcardsTemplate(singleMovie));
                deleteButtonListener(key);
                $("#star--" + key).rating({stars: 10, step: 1, min: 0, max: 10});
                $("#star--" + key).rating('update', singleMovie.starValue);
            }
        }

    }).catch(console.error);
});

$("#searchFilter p").click((event)=>{
    $(".button-class").removeClass("button-class");
    let currentButton = event.currentTarget.id;
    console.log("what is happening here with this button", currentButton);
    $("#" + currentButton).toggleClass("button-class");
});









