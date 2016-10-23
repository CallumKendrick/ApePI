var express = require("express");
var app = express();
var Pusher = require("pusher");
var bodyParser = require('body-parser');

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
            console.log(questionList);
        }
    });
    response.send("ping");
});

app.get("/getList", function(request, response) {
    response.send(JSON.stringify(questionList));
});
