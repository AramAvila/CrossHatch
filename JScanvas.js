var paper;

function flatCanvas(){
    var rows = $("#rows").val();
    var cols = $("#cols").val();
    var layers = $("#layers").val();
    var length = $("#length").val();

    var rowsSpacing = length / (rows-1);
    var colsSpacing = length / (cols-1);

    document.getElementById('myCanvas').width = length;
    document.getElementById('myCanvas').height = length;

    paper.project.activeLayer.removeChildren();    

    for (var i = 0; i < rows; i++) {

        var path = new paper.Path();
        path.strokeColor = 'blue';

        var start = new Point([i*rowsSpacing, 0]);
        var end = new Point([i*rowsSpacing, length]);

        path.add(start);
        path.add(end);
    };

    for (var i = 0; i < cols; i++) {

        var path = new paper.Path();
        path.strokeColor = 'red';

        var start = new Point([0, i*colsSpacing]);
        var end = new Point([length, i*colsSpacing]);

        path.add(start);
        path.add(end);
    };

    paper.view.draw();
}


$(document).ready(function(){

    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');

    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    // Create a Paper.js Path to draw a line into it:

    flatCanvas();

    $("#rows, #cols, #layers, #length").keyup(function(){
        flatCanvas()
    });

    $("#rows, #cols, #layers, #length").on("keydown", function(e){

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