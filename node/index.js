var express = require("express");
var app = express();
var Pusher = require("pusher");
var bodyParser = require('body-parser');

var pusherConfig = require("./pusherConfig.json");
var pusher = new Pusher(pusherConfig);

app.use("/", express.static(__dirname + "html"));

app.use(bodyParser.urlencoded( {
  extended: true
}));

app.listen(3000 , function() {
    console.log("running");
});

app.post("/test", function(request, response) {
    console.log(request.body);

    pusher.trigger("questions", "new-question", {
        text: request.body.userQuestion,
        username: request.body.username
    }, function(error, request, response) {
        console.log(error);
    });
    response.send("ping");
});
