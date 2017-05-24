"use strict";

let firebase = require("./fb-config"),
	$ = require("jquery"),
	provider = new firebase.auth.GoogleAuthProvider(),
	currentUser = null;

firebase.auth().onAuthStateChanged(function(user){
	console.log("onAuthStateChanged", user);
	if(user){
		currentUser = user.uid;
	}else{
		currentUser = null;
		console.log("no user logged in");
	}
});

function logInGoogle(){
	return firebase.auth().signInWithPrompt(provider);
}

function logOut(){
	return firebase.auth().signOut();
}

function setUser(val){
	currentUser = val;
}

function getUser(){
	return currentUser;
}

module.exports = {logInGoogle, logOut, setUser, getUser};