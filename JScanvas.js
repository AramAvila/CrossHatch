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
var axisY = new Point(0.5, 0.5) * multiplier;  //<---- if the ratio axisY.x / axisY.y != 1 the way circleHeight behaves will have to be changed!
/**
 * @axisZ Z axis used to translate the grid points to a 3D like space: [x,y] 
 */
var axisZ = new Point(0, 1) * multiplier;

/**
 * @gridStart indicates the point at which the grid has to start. All the gui's will be realtive to this point
 */
var gridStart = new Point([600 - ((width * multiplier + axisY.x * height) / 2), 100]);


updateVis = function () {

    gridStart.x = 600 - ((width * multiplier + axisY.x * height) / 2);

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

    var path = new Path();
    p1 = gridStart;
    p2 = axisZ * layers * layerSeparation + gridStart;
    path.add(p1, p2);
    paths.push(path);

    var path = new Path();
    p1 = axisY * height + gridStart;
    p2 = axisY * height + axisZ * layers * layerSeparation + gridStart;
    path.add(p1, p2);
    paths.push(path);

    var path = new Path();
    p1 = axisX * width + axisY * height + gridStart;
    p2 = axisX * width + axisY * height + axisZ * layers * layerSeparation + gridStart;
    path.add(p1, p2);
    paths.push(path);

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
    var guiItems = [];
    var textItems = [];

    var path1 = new Path();
    var g1 = new Point(gridStart.x, gridStart.y - 20);
    var c1 = new Point(gridStart.x + width * multiplier, gridStart.y - 20);
    path1.add(g1, c1); //top line, width scroll
    guiItems.push(path1);

    var text = new PointText((c1 + g1) / 2 - new Point(0, 10)); //descriptive width text
    text.fontSize = 20;
    text.content = 'Width: ' + width;
    text.justification = 'center',
            textItems.push(text);

    var text = new PointText((c1 + g1) / 2 - new Point(-50, 28)); //Add row text
    text.content = '+';
    text.fontSize = 30;
    text.justification = 'center';
    text.onMouseUp = function () {
        if (rows < 10) {
            rows += 1;
        }
        updateVis();
    };
    textItems.push(text);

    text = new PointText((c1 + g1) / 2 - new Point(0, 30)); //descriptive row text
    text.content = 'Rows: ' + rows;
        text.fontSize = 20;
    text.justification = 'center';
    textItems.push(text);

    text = new PointText((c1 + g1) / 2 - new Point(50, 30)); //Remove row text
    text.content = '-';
    text.fontSize = 30;
    text.justification = 'center';
    text.onMouseUp = function () {
        if (rows > 2) {
            rows -= 1;
        }
        updateVis();
    };
    textItems.push(text);

    var path2 = new Path(); //right line, height scroll 
    g1 = new Point(gridStart.x + 20 + width * multiplier, gridStart.y);
    var c3 = new Point(gridStart.x + 20 + width * multiplier + height * axisY.x, gridStart.y + height * axisY.x);
    path2.add(g1, c3); 
    guiItems.push(path2);

    text = new PointText((c3 + g1) / 2 + new Point(10, -10)); //descriptive height text
    text.fontSize = 20;
    text.content = 'Height: ' + height;
    text.justification = 'center';
    text.rotate(45);
    textItems.push(text);
    
    text = new PointText((c3 + g1) / 2 + new Point(75, 20)); //add column text
    text.content = '+';
    text.fontSize = 30;
    text.justification = 'center';
    text.rotate(45);
    text.onMouseUp = function () {
        if (cols < 10) {
            cols += 1;
        }
        updateVis();
    };
    textItems.push(text);

    text = new PointText((c3 + g1) / 2 + new Point(30, -30)); //descriptive column text
    text.content = 'Columns: ' + cols;
    text.fontSize = 20;
    text.justification = 'center';
    text.rotate(45);
    textItems.push(text);

    text = new PointText((c3 + g1) / 2 + new Point(-15, -75)); //remove column text
    text.content = '-';
    text.fontSize = 30;
    text.justification = 'center';
    text.rotate(45);
    text.onMouseUp = function () {
        if (cols > 2) {
            cols -= 1;
        }
        updateVis();
    };
    textItems.push(text);

    var path3 = new Path();
    g1 = new Point(gridStart.x - 20, gridStart.y);
    var c2 = new Point(gridStart.x - 20, gridStart.y + layers * layerSeparation * multiplier);
    path3.add(g1, c2); //left line, layer number
    guiItems.push(path3);

    var text3 = new PointText((c2 + g1) / 2 - new Point(-20, 0));
    text3.fontSize = 20;
    text3.content = 'Layers: ' + (layers + 1);
    text3.justification = 'right',
            text3.rotate(270);
    textItems.push(text3);

    var circleWidth = new crosshatch.Path.Circle({center: c1, radius: 7});
    circleWidth.fillColor = "blue";
    circleWidth.onMouseEnter = function () {
        this.fillColor = "red";
    };
    circleWidth.onMouseLeave = function () {
        this.fillColor = "blue";
    };
    circleWidth.onMouseDrag = function (event) {
        if (width > 0 && width < 120) {
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
            if (width >= 120 && event.delta.x < 0) {
                this.position.x -= 1;
                width -= 1;
                updateVis();
            }
        }
    };
    guiItems.push(circleWidth);


    var circleHeight = new crosshatch.Path.Circle({center: c3, radius: 7});
    circleHeight.fillColor = "blue";
    circleHeight.onMouseEnter = function () {
        this.fillColor = "red";

    };
    circleHeight.onMouseLeave = function () {
        this.fillColor = "blue";
    };
    circleHeight.onMouseDrag = function (event) {
        if (height > 0 && height < 120) {
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
            if (height >= 120 && event.delta.x < 0) {
                this.position -= 1;
                height -= 1;
                updateVis();
            }
        }
    };
    guiItems.push(circleHeight);


    var circleLayersMore = new crosshatch.Path.RegularPolygon(c2 - new Point(0, 10), 3, -10);
    circleLayersMore.closed = "true";
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
    guiItems.push(circleLayersMore);


    var circleLayersLess = new crosshatch.Path.RegularPolygon(g1 + new Point(0, 10), 3, 10);
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
    guiItems.push(circleLayersLess);

    var layer2 = new crosshatch.Layer({
        children: guiItems,
        strokeColor: 'blue',
        strokeWidth: 2
    });

    var layer3 = new crosshatch.Layer({
        children: textItems
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