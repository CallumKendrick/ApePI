$(document).ready(function() {

    var APP_KEY = "b3453c59cc3f52599663";

    var pusher = new Pusher(APP_KEY);
    var questionsChannel = pusher.subscribe('questions');

    var questionsCount = 0;

    questionsChannel.bind('new-question', function(data) {
        drawQuestion(data.text, data.username);
        ++questionsCount;
    });
    //should push queue to front of queue and remove duplicates
    drawQuestionQueue(questionsCount);

    drawCurrentlyAnsweringQuestion();

    questionsChannel.bind('answered-question', function(data) {
        nextQuestion();
    });

    questionsChannel.bind("bot-response", function(data) {
        console.log(data);
    })

    questionsChannel.bind("clear", function() {
        $("#questions").html("");
        $("#current-question").html("");
    });

    $("#send").on("click", function() {
        sendQuestion();
    });

    $("#reset").on("click", function() {
        $.post("/displayed-question",
            {
            },
            function(data) {
            }
        );
    });

});

function makeHtmlQuestion(questionText, username) {

    var usernameElement = document.createElement("h2");
    $(usernameElement).addClass("username");
    $(usernameElement).html(username);


    var questionBody = document.createElement("p");
    $(questionBody).addClass("question-body");
    $(questionBody).html(questionText)

    var div = document.createElement("div");
    $(div).addClass("question");

    $(div).append(usernameElement);
    $(div).append(questionBody);

    return div;
}

function drawQuestion(questionText, username) {
    $("#questions").append(makeHtmlQuestion(questionText, username));
}

function drawQuestionQueue(questionsCount) {
    //Remember to check if the last questionsCount amount of questions has any duplicates... or maybe just remove questionsCount amount of records at the end?
    $.get("/getList", {}, function(response) {
        response = JSON.parse(response);
        for(var i = response.length - 1; i >= 0; --i) {
            var text = response[i].text;
            var username = response[i].username;

            $("#questions").prepend(makeHtmlQuestion(text, username));
        }
    });
}

function drawCurrentlyAnsweringQuestion() {
    $("current-question").html(makeHtmlQuestion("todo: current answering question logic", "callum"))
}

function nextQuestion() {
    var next = $("#questions")[0].children[0];
    $("#current-question").html(next);
}

function sendQuestion() {
    $.post("/test",
        {
            username: $("#username").val(),
            userQuestion: $("#userQuestion").val()
        },
        function() {
            console.log("done");
        }
    );
}
