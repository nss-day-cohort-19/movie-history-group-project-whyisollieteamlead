"use strict";

let $ = require('jquery'),
    movieTemplate = require("../templates/movie_template.hbs");

function buildDom(movies) {
	let masterCard = movieTemplate(movies);
	$("output").html(masterCard);
}