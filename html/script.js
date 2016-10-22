var newestQuestion = -1;
var answeringQuestion = {};
var questions = [];

$(document).ready(function() {

    var APP_KEY = "b3453c59cc3f52599663";

    var pusher = new Pusher(APP_KEY);
    var questionsChannel = pusher.subscribe('questions');


    questionsChannel.bind('new-question', function(data) {
        drawQuestion(data.number, data.text);
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
