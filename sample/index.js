function calculate() {
    try{
        $("#answer").text(ParserSample1.eval($("#expression").val()));
    } catch(e) {
        $("#answer").text("ERROR!");
    }
}

$("#expression").keypress(function(e) {
    if (e.which == 13) {
        calculate();
    }
});
