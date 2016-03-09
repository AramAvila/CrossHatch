var paper;

function flatCanvas(){

    var scaling = 5; //Maximum size is 120, but it looks small on screen. it will be multiplied by 5
    var layerSeparation = 25; //Layer separation to improve understanding

    var rows = parseInt($("#rows").val());
    var cols = parseInt($("#cols").val());
    var layers = parseInt($("#layers").val());
    var width = parseInt($("#width").val());
    var height = parseInt($("#height").val());

    width *= scaling;
    height *= scaling;

    document.getElementById('myCanvas').width = width + height * 0.707; //Width will be modified by height since we are faking a projection
    document.getElementById('myCanvas').height = height;

    var axisX = new Point(1,0);
    var axisY = new Point(0.707, 0.707);
    var axisZ = new Point(0,1);

    var rowsSpacing = height / (rows-1);
    var colsSpacing = width / (cols-1);

    paper.project.activeLayer.removeChildren();

    for (var l = 0; l < layers; l++) {
        for (var i = 0; i < rows; i++) {
            var path = new paper.Path()
            path.strokeColor = 'blue';
        
            var p1 = axisX * 0 + axisY * (i * rowsSpacing) + new Point(0, l * layerSeparation);
            var p2 = axisX * width + axisY * (i * rowsSpacing) + new Point(0, l * layerSeparation);

            path.add(p1, p2);
        };

        for (var i = 0; i < cols; i++) {
            var path = new paper.Path();
            path.strokeColor = 'red';

            var p1 = axisX * i * colsSpacing + axisY * 0 + new Point(0, l * layerSeparation);
            var p2 = axisX * i * colsSpacing + axisY * height + new Point(0, l * layerSeparation);

            path.add(p1, p2);
        };
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