var newestQuestion = -1;

$(document).ready(function() {

    var APP_KEY = "b3453c59cc3f52599663";

    var pusher = new Pusher(APP_KEY);
    var questionsChannel = pusher.subscribe('questions');


    questionsChannel.bind('new-question', function(data) {
        drawQuestion(data.number, data.text, data.username);
        newestQuestion = data.number;
    });

    //should push queue to front of queue and remove duplicates
    drawQuestionQueue();

    questionsChannel.bind('question-answered', function(data) {
        undrawQuestion(data.number);
    });

    drawCurrentlyAnsweringQuestion();

    questionsChannel.bind('answering-question', function(data) {
        moveQuestionToAnswering(data.number);
    });

});

function makeHtmlQuestion(questionNumber, questionText, username) {

    var usernameElement = document.createElement("h2");
    $(usernameElement).addClass("username");
    $(usernameElement).html(username);


    var questionBody = document.createElement("p");
    $(questionBody).addClass("question-body");
    $(questionBody).html(questionText)

    var div = document.createElement("div");
    $(div).addClass("question");
    $(div).attr("id", "question-" + questionNumber);

    $(div).append(usernameElement);
    $(div).append(questionBody);

    return div;
}

function drawQuestion(questionNumber, questionText, username) {
    console.log(username);
    $("#questions").append(makeHtmlQuestion(questionNumber, questionText, username));
}
