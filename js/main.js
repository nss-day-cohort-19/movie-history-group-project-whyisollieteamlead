
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
var Slider = require("bootstrap-slider");

//Creates new blank movies object
var newMovieObj = {};




//Login/Logout Functionality

//Login
$("#auth-btn").click(function(event){
    console.log("clicked on auth btn");

   console.log(event);
    user.logInGoogle()
    .then(function(result){
    console.log("result from Login", result.user.uid);
    user.setUser(result.user.uid);
    showPage();
  });
});

//Logout
$("#logout-btn").click(function(){
    console.log("logout");
    user.logOut();
    hidePage();
});


var hidePage = function(){
        $("#toolbar").addClass("hidden");
        $("#logout-btn-div").addClass('hidden');
        $("#auth-btn-div").removeClass('hidden');
        $("#output").html("");
};

var showPage = function(){
        $("#toolbar").removeClass("hidden");
        $("#auth-btn-div").addClass('hidden');
        $("#logout-btn-div").removeClass('hidden');
    };








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
    var movieId = event.target.closest("section").querySelector(".movie-id").innerHTML;
    var titleToPush = {};
    movieElementArray.forEach(function(movie){
    console.log("movieId", movieId);
    console.log("movie.id", movie.id);
        if(Number(movieId) == movie.id){
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

    let userID = user.getUser();
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
            if(Number(newMovieObj.starValue) === 0){
            $(".movies").append(watchedcardsTemplate(newMovieObj));
            }
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
    console.log("Is event happening");
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

    showWatchedMovies();
    // let currentUser = user.getUser();
    // db.pullWatchFromFirebase(currentUser)
    // .then((movieObj) =>{
    //     for (let key in movieObj) {
    //         let singleMovie = movieObj[key];
    //         singleMovie.key = key;
    //         if (singleMovie.starValue > 0) {
    //             $(".movies").append(watchedcardsTemplate(singleMovie));
    //             deleteButtonListener(key);
    //             $("#star--" + key).rating({stars: 10, step: 1, min: 0, max: 10});
    //             $("#star--" + key).rating('update', singleMovie.starValue);
    //         }
    //     }

    // }).catch(console.error);
});

// $("#searchFilter p").click((event)=>{
//     $(".button-class").removeClass("button-class");
//     let currentButton = event.currentTarget.id;
//     console.log("what is happening here with this button", currentButton);
//     $("#" + currentButton).toggleClass("button-class");
// });



// Kathy's attempt at bootstrap-slider

// // Create a star slider
// var mySlider = $("#movie-star-slider").slider();

// // Call a method on the slider
// var value = mySlider.slider('getValue');

// // For non-getter methods, you can chain together commands
//     mySlider.slider('setValue', 1);
//     mySlider.slider('setValue', 10);

//var slide = document.getElementById('slide'),

//$("#slide").click((event) => {
//        console.log("is anything happening?");
//});


$("#slide").on("input change", function(event) {
    showWatchedMovies(event);
});

var showWatchedMovies = function (event) {
    $(".movies").empty();
    let currentUser = user.getUser();
    let currentSlideValue = $("#slide").val();
    console.log("currentSlideValue", currentSlideValue);
    db.pullWatchFromFirebase(currentUser)
    .then ((movieObj)=>{

        for (let items in movieObj ) {
            let stars = movieObj[items].starValue;
            let starkey = movieObj[items];
            starkey.key = items;
//            console.log("what is my star", stars);
            if (stars == currentSlideValue) {
                deleteButtonListener(items);
                console.log("star rating", stars);
                console.log("Slider Value: " + event.currentTarget.value);
                $(".movies").append(watchedcardsTemplate(movieObj[items]));
                $("#star--" + items).rating({stars: 10, step: 1, min: 0, max: 10});
                $("#star--" + items).rating('update', movieObj[items].starValue);

            }else {
                console.log("no rating");

            }
        }
    });
};

