"use strict";

let api =  require('./api-config.js');
let searchTerm;


$('#searchbar').on("keyup", function(event){
	if(event.key == "Enter") {
		searchTerm = $('#searchbar').value;
		api.getJSON(searchTerm);
	}
});


