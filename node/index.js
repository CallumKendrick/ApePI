var express = require("express");
var app = express();
var Pusher = require("pusher");

var pusherConfig = require("./pusherConfig.json");
var pusher = new Pusher(pusherConfig);

app.use("/", express.static("html"));

app.listen(3000 , function() {
    console.log("running");
});

app.get("/test", function(request, response) {
    pusher.trigger("questions", "new-question", {
        text: "hello world",
        username: "server"
    }, function(error, request, response) {
        console.log(error);
    });
    response.send("ping");
});
