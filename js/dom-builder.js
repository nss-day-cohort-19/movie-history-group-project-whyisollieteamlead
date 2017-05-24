"use strict";

let $ = require('jquery'),
    movieTemplate = require("./templates/movie_template.hbs");

function buildDom(movies) {
	let masterCard = movie_template(movies);
	$("output").html(masterCard);
}