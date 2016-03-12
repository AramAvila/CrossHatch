var width = 100;
var height = 100;
var cols = 3;
var rows = 4;
var layers = 3;
var crosshatch;

/**
 * Max grid size is 120 * 120. It looks small on the screen, this multiplier is added to the axis to comensate the size
 */
var multiplier = 5;

/**
 * @axisX X axis used to translate the grid points to a 3D like space: [x,y] 
 */
var axisX = new Point(1, 0) * multiplier;
/**
 * @axisY Y axis used to translate the grid points to a 3D like space: [x,y] 
 */
var axisY = new Point(0.707, 0.707) * multiplier;  //<---- if the ratio axisY.x / axisY.y != 1 the way circleHeight behaves will have to be changed!
/**
 * @axisZ Z axis used to translate the grid points to a 3D like space: [x,y] 
 */
var axisZ = new Point(0, 1) * multiplier;

/**
 * @gridStart indicates the point at which the grid has to start. All the gui's will be realtive to this point
 */
var gridStart = new Point([600 - ((width * multiplier + axisY.x * height) / 2), 50]);


updateVis = function () {

    gridStart = new Point([600 - ((width * multiplier + axisY.x * height) / 2), 50]);

    crosshatch.project.clear();

    var layerSeparation = Math.min(10, 120 / layers); //Layer separation to improve understanding

    var rowsSpacing = height / (rows - 1);
    var colsSpacing = width / (cols - 1);

    var paths = [];

    for (var l = layers; l > 0; l--) {

        var path = new Path();
        var p1 = axisZ * l * layerSeparation + gridStart;
        var p2 = axisY * height + axisZ * l * layerSeparation + gridStart;
        var p3 = axisX * width + axisY * height + axisZ * l * layerSeparation + gridStart;

        path.add(p1, p2, p3);
        paths.push(path);
    }

    for (var i = 0; i < rows; i++) {
        var path = new Path();
        var p1 = axisX * 0 + axisY * (i * rowsSpacing) + axisZ * l * layerSeparation + gridStart;
        var p2 = axisX * width + axisY * (i * rowsSpacing) + axisZ * l * layerSeparation + gridStart;

        path.add(p1, p2);
        paths.push(path);
    }

    for (var i = 0; i < cols; i++) {
        var path = new Path();
        var p1 = axisX * i * colsSpacing + axisY * 0 + axisZ * l * layerSeparation + gridStart;
        var p2 = axisX * i * colsSpacing + axisY * height + axisZ * l * layerSeparation + gridStart;

        path.add(p1, p2);
        paths.push(path);
    }

    var layer1 = new Layer({
        children: paths,
        strokeColor: 'black',
        strokeWidth: 3
    });

    //----grawing gui items------------------------------------------------------
    var path1 = new Path();
    var g1 = new Point(gridStart.x, gridStart.y - 20);
    var c1 = new Point(gridStart.x + width * multiplier, gridStart.y - 20);
    path1.add(g1, c1); //top line, width scroll

    var path2 = new Path();
    g1 = new Point(gridStart.x + 20 + width * multiplier, gridStart.y);
    var c3 = new Point(gridStart.x + 20 + width * multiplier + height * 0.707 * multiplier, gridStart.y + height * 0.707 * multiplier);
    path2.add(g1, c3); //right line, height scroll 

    var path3 = new Path();
    g1 = new Point(gridStart.x - 20, gridStart.y);
    var c2 = new Point(gridStart.x - 20, gridStart.y + layers * layerSeparation * multiplier);
    path3.add(g1, c2); //left line, layer number



    var circleWidth = new crosshatch.Path.Circle({center: c1, radius: 7});
    circleWidth.fillColor = "blue";
    circleWidth.onMouseEnter = function () {
        this.fillColor = "red";
    };
    circleWidth.onMouseLeave = function () {
        this.fillColor = "blue";
    };
    circleWidth.onMouseDrag = function (event) {
        if (width > 0 && width <= 120) {
            if (event.delta.x > 0) {
                this.position.x += 1;
                width += 1;
                updateVis();
            } else if (event.delta.x < 0) {
                this.position.x -= 1;
                width -= 1;
                updateVis();
            }

        } else {
            if (width <= 0 && event.delta.x > 0) {
                this.position.x += 1;
                width += 1;
                updateVis();
            }
            if (width > 120 && event.delta.x < 0) {
                this.position.x -= 1;
                width -= 1;
                updateVis();
            }
        }
    };

    var circleHeight = new crosshatch.Path.Circle({center: c3, radius: 7});
    circleHeight.fillColor = "blue";
    circleHeight.onMouseEnter = function () {
        this.fillColor = "red";

    };
    circleHeight.onMouseLeave = function () {
        this.fillColor = "blue";
    };
    circleHeight.onMouseDrag = function (event) {
        if (height > 0 && height <= 120) {
            if (event.delta.x > 0) {
                this.position += 1;
                height += 1;
                updateVis();
            } else if (event.delta.x < 0) {
                this.position -= 1;
                height -= 1;
                updateVis();
            }

        } else {
            if (height <= 0 && event.delta.x > 0) {
                this.position += 1;
                height += 1;
                updateVis();
            }
            if (height > 120 && event.delta.x < 0) {
                this.position -= 1;
                height -= 1;
                updateVis();
            }
        }
    };

    var circleLayersMore = new crosshatch.Path.Circle({center: c2, radius: 7});
    circleLayersMore.fillColor = "blue";
    circleLayersMore.onMouseEnter = function () {
        this.fillColor = "red";
    };
    circleLayersMore.onMouseLeave = function () {
        this.fillColor = "blue";
    };
    circleLayersMore.onMouseUp = function () {
        layers += 1;
        updateVis();
    };

    var circleLayersLess = new crosshatch.Path.Circle({center: g1, radius: 7});
    circleLayersLess.fillColor = "blue";
    circleLayersLess.onMouseEnter = function () {
        this.fillColor = "red";
    };
    circleLayersLess.onMouseLeave = function () {
        this.fillColor = "blue";
    };
    circleLayersLess.onMouseUp = function () {
        if (layers > 1) {
            layers -= 1;
            updateVis();
        }
    };

    var layer2 = new crosshatch.Layer({
        children: [path1, path2, path3, circleWidth, circleHeight, circleLayersMore, circleLayersLess],
        strokeColor: 'blue',
        strokeWidth: 2
    });

    crosshatch.view.draw();
};

$(document).ready(function () {

    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    crosshatch = paper;

    updateVis();
}); 