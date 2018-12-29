var ps1 = require("../dist/parser-sample1.js");

function calculate() {
    try{
        $("#answer").text(ps1.eval($("#expression").val()));
    } catch(e) {
        $("#answer").text("ERROR!");
    }
}

$("#expression").keypress(function(e) {
    if (e.which == 13) {
        calculate();
    }
});
