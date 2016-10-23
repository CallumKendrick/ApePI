var csv = require("fast-csv");
var fs = require('fs');

var stream = fs.createReadStream("test.csv");

///////////////////////////////////////////////////// Experimentation
function findWeights(sentence){
	csv
	 .fromStream(stream, {
	 	headers: true,
	 	ignoreEmpty: true
	 })
	 .on("data", function(data){
	     console.log(data);
	 })
	 .on("end", function(){
	     console.log("done");
	 });
}

//findWeights("Cake");


function modifySentence(sentence){
	sentence = sentence.replace(/[^a-zA-Z\s]/g,"");
	sentence = sentence.toLowerCase();
	sentenceArray = sentence.split(" ");
	for (var i = sentenceArray.length-1; i>=0; i--) {
	    if (sentenceArray[i] === "") {
	        sentenceArray.splice(i, 1);
	    }
	}
	sentenceArray.sort();
	var first = true;
	for (var i = sentenceArray.length-1; i>=0; i--) {
		if (first) {
			first = false;
			continue;
		}
	    if (sentenceArray[i] === sentenceArray[i + 1]) {
	        sentenceArray.splice(i, 1);
	    }
	}
	console.log(sentenceArray);
}

///////////////////////////////////////////Implementation


function getAnswer(sentence){
	sentence = sentence.replace(/[^a-zA-Z\s]/g,"");
	sentence = sentence.toLowerCase();
	sentenceArray = sentence.split(" ");
	for (var i = sentenceArray.length-1; i>=0; i--) {
	    if (sentenceArray[i] === "") {
	        sentenceArray.splice(i, 1);
	    }
	}

	var answer = "";
	var weight = -1;

	csv
	 .fromStream(stream, {
	 	headers: true,
	 	ignoreEmpty: true
	 })
	 .on("data", function(data){

    	sentenceArray.forEach(function(word){
     		if (data.word === word) {
     			if (+data.weight > weight) {
     				weight = +data.weight;
     				answer = data.response;
     			}
     		}
     	});
	 })
	 .on("end", function(){
	    console.log(answer);
		console.log(weight);
	 });


	//console.log(sentenceArray);
}
