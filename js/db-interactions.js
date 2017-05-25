"use strict";
let $ = require('jquery'),
    firebase = require("./fb-config"),
    movies = require("./api-config");


function getMovie(movie) {
    return new Promise(function(resolve, reject){
        $.ajax({
            url: `${movies.getMovieSettings().databaseURL}/3/search/movie?api_key=${movies.getMovieSettings().apiKey}&language=en-US&query=${movie}&page=1&include_adult=false`
        }).done(function(movieData){
            resolve(movieData);
        }).fail(function(error){
            reject(error);
        });
    });
}
function getActors(movieID) {
    return new Promise(function(resolve, reject){
        $.ajax({
            url: `${movies.getMovieSettings().databaseURL}/3/movie/${movieID}/credits?api_key=${movies.getMovieSettings().apiKey}`
        }).done(function(movieData){
            resolve(movieData);
        }).fail(function(error){
            reject(error);
        });
    });
}
function pushToFirebase(movieObj, userID){
    return new Promise(function(resolve, reject){
        $.ajax({
            url: `${firebase.getFBsettings().databaseURL}/${userID}/movies.json`,
            type: "POST",
            data: JSON.stringify(movieObj),
            dataType: "json"
        }).done(function(movieId){
            resolve(movieId);
        });
    });
}
//function pushToFirebaseArray(movieID, userID){
//    return new Promise(function(resolve, reject){
//        $.ajax({
//            url: `${firebase.getFBsettings().databaseURL}/${userID}/array.json`,
//            type: "POST",
//            data: JSON.stringify(movieID),
//            dataType: "json"
//        }).done(function(movieId){
//            resolve(movieId);
//        });
//    });
//}
function pullWatchFromFirebase(userID){
    return new Promise(function(resolve, reject){
        $.ajax({
            url: `${firebase.getFBsettings().databaseURL}/${userID}/movies.json`,
            type: "GET",
            dataType: "json"
        }).done(function(data){
            resolve(data);
        });
    });
}
//not deleting yet
function deleteWatchedMovie(firebaseKey, userID) {
    return new Promise (function(resolve, reject){
        $.ajax({
            url: `${firebase.getFBsettings().databaseURL}/${userID}/movies/${firebaseKey}.json`,
            method: "DELETE"
        }).done(function(){
            resolve();
        });
    });
}
//not updating to FB
function updateStars(firebaseKey, starValue, userID) {
    return new Promise (function(resolve, reject){
        $.ajax({
            url: `${firebase.getFBsettings().databaseURL}/${userID}/movies/${firebaseKey}.json`,
            type: "PATCH",
            data: JSON.stringify(starValue)
        }).done(function(data){
            console.log("did this resolve");
            resolve(data);
        });
    });
}
module.exports = {
    getMovie,
    getActors,
    pushToFirebase,
//    pushToFirebaseArray,
    pullWatchFromFirebase,
    deleteWatchedMovie,
    updateStars
};
