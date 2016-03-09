var paper;

function flatCanvas(){
    var rows = $("#rows").val();
    var cols = $("#cols").val();
    var layers = $("#layers").val();
    var width = $("#width").val();
    var height = $("#height").val();

    document.getElementById('myCanvas').width = width;
    document.getElementById('myCanvas').height = height;

    /*var axisX = new Point(1,0);
    var axisY = new Point(0.707, 0.707);
    var axisZ = new Point(0,1);*/

    var rowsSpacing = height / (rows-1);
    var colsSpacing = width / (cols-1);

    paper.project.activeLayer.removeChildren();

    for (var i = 0; i < rows; i++) {
        var path = new paper.Path();
        path.strokeColor = 'blue';

        path.add(new Point([0, i*rowsSpacing]), new Point([width/1, i*rowsSpacing])); //<-- Whithout dividing by 1 this wont work... can't understand why
    };

    for (var i = 0; i < cols; i++) {
        var path = new paper.Path();
        path.strokeColor = 'red';

        path.add(new Point([i*colsSpacing, 0]), new Point([i*colsSpacing, height/1])); //<-- Whithout dividing by 1 this wont work... can't understand why
    };

    paper.view.draw();
}


$(document).ready(function(){

    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');

    paper.setup(canvas);

    flatCanvas();

    $("#rows, #cols, #layers, #width, #height").keyup(function(){
        flatCanvas()
    });

    $("#rows, #cols, #layers, #width, #height").on("keydown", function(e){

        switch(e.which) {
            case 38: // up
                $(this).val(parseInt($(this).val())+1);
            break;

            case 40: // down
                $(this).val(parseInt($(this).val())-1);
            break;

            default: return;
        }
        e.preventDefault();
    });
}); 