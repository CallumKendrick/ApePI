var express = require("express");
var app = express();
var Pusher = require("pusher");
var bodyParser = require('body-parser');

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/favicon.ico'));

var pusherConfig = require("./pusherConfig.json");
var pusher = new Pusher(pusherConfig);

var questionList = [];

app.use("/", express.static(__dirname + "/html"));

app.use(bodyParser.urlencoded( {
  extended: true
}));

app.listen(3000 , function() {
    console.log("running");
});

app.post("/test", function(request, response) {
    console.log(request.body);

    var questionText = request.body.userQuestion;
    var username = request.body.username;

    pusher.trigger("questions", "new-question", {
        text: questionText,
        username: username
    }, function(error, request, response) {
        if(!error) {
            questionList.push({
                text: questionText,
                username: username
            });
            getAnswer(questionText);
        }
    });
    response.send("ping");
});

app.post("/clear-questions", function(request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    questionList = [];
    console.log(questionList);
    pusher.trigger("questions", "clear", {}, function(error) {console.log(error)});
    response.send("done");
});

app.post("/displayed-question", function(request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    pusher.trigger("questions", "answered-question", {
    }, function(error) {

    });
    if(questionList.length > 0) {
        questionList.shift();
    }
});

app.get("/getList", function(request, response) {
    response.send(JSON.stringify(questionList));
});

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

	var answer = "got nothing";
	var weight = -1;

    var stream = fs.createReadStream("test.csv");

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

            pusher.trigger("questions", "bot-response", {
                text: answer
            }, function() {

            });
        }
	 });


	//console.log(sentenceArray);
}
