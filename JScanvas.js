
var width = 100;
var height = 100;

var maxSize = new Point(120, 120);
var minSize = new Point(10, 10);

var cols = 3;
var rows = 4;
var layers = 3;
var layerSeparation = 10;
var canvasLayers = [];
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
var gridStart = new Point(50, 100);

var wallColor = new Color(0.7, 0.7, 0.7);


var updateVis = function () {

    layerSeparation = Math.min(5, 120 / layers); //Layer separation to improve understanding

    canvasLayers[0].activate();
    canvasLayers[0].clear();

    var rowsSpacing = height / (rows - 1);
    var colsSpacing = width / (cols - 1);

    var paths = [];

    for (var l = layers; l > 0; l--) {

        for (var r = 0; r < rows; r++) {//first is drawn the furthest wall, (the lowest first row)
            var recR1 = gridStart + axisZ * layerSeparation * (l - 1) + axisY * r * rowsSpacing;
            var recR2 = gridStart + axisZ * layerSeparation * (l - 1) + axisY * r * rowsSpacing + axisX * width;
            var recR3 = gridStart + axisZ * layerSeparation * l + axisY * r * rowsSpacing + axisX * width;
            var recR4 = gridStart + axisZ * layerSeparation * l + axisY * r * rowsSpacing;
            var recR = new Path(recR1, recR2, recR3, recR4);
            recR.fillColor = wallColor;
            recR.strokeColor = "black";

            paths.push(recR);
            if (r !== rows - 1) { //the last row is the wall that closes the shape, it has no more columns
                for (var c = cols - 1; c >= 0; c--) { //after the first row is drawn the columns are added
                    var recC1 = gridStart + axisZ * layerSeparation * (l - 1) + axisY * r * rowsSpacing + axisX * colsSpacing * c;
                    var recC2 = gridStart + axisZ * layerSeparation * (l - 1) + axisY * (r + 1) * rowsSpacing + axisX * colsSpacing * c;
                    var recC3 = gridStart + axisZ * layerSeparation * l + axisY * (r + 1) * rowsSpacing + axisX * colsSpacing * c;
                    var recC4 = gridStart + axisZ * layerSeparation * l + axisY * r * rowsSpacing + axisX * colsSpacing * c;
                    var recC = new Path(recC1, recC2, recC3, recC4);
                    recC.closed = true;
                    recC.fillColor = wallColor / 2;
                    recC.strokeColor = "black";
                    paths.push(recC);
                }
            }
        }
    }
    var path = new Path();
    path.add(gridStart + axisX * width - axisY * 8, gridStart + axisX * width);
    path.strokeColor = "black";
    path.dashArray = [5, 6];
    path.strokeWidth = 1;
    paths.push(path);

    var path = new Path();
    path.add(gridStart + axisX * (maxSize.x + 5) + axisY * height, gridStart + axisX * width + axisY * height);
    path.strokeColor = "black";
    path.dashArray = [5, 6];
    path.strokeWidth = 1;
    paths.push(path);

    /*
     var path = new Path();
     path.add(gridStart, gridStart + axisX * 20);
     path.dashArray = [5, 6];
     path.strokeWidth = 5;
     path.strokeColor = "yellow";
     paths.push(path);
     
     var path = new Path();
     path.add(gridStart, gridStart + axisY * 20);
     path.dashArray = [5, 6];
     path.strokeWidth = 5;
     path.strokeColor = "red";
     paths.push(path);*/

    canvasLayers[0] = new Layer({
        children: paths
    });

    crosshatch.view.draw();
};

var drawGui = function () {

    canvasLayers[1].activate();
    canvasLayers[1].clear();
    canvasLayers[2].activate();
    canvasLayers[2].clear();

    //----grawing gui items------------------------------------------------------
    var guiItems = [];
    var textItems = [];

    //---Upper part of the grid: Width scroll, and rows
    var path1 = new Path();
    var g1 = gridStart + axisY * (-8);
    var c1 = gridStart + axisX * maxSize.x + axisY * (-8);
    path1.add(g1, c1); //top line, width scroll
    guiItems.push(path1);
    for (var i = 0; i <= 12; i++) {
        g1 = gridStart + axisX * i * 10 + axisY * (-6);
        c1 = gridStart + axisX * i * 10 + axisY * (-10);
        var path = new Path(g1, c1);
        guiItems.push(path);
    }

    for (var i = 0; i < 12; i++) {
        g1 = gridStart + axisX * (i + 0.5) * 10 + axisY * (-8);
        c1 = gridStart + axisX * (i + 0.5) * 10 + axisY * (-10);
        var path = new Path(g1, c1);
        guiItems.push(path);
    }

    var widthScrollStart = gridStart + axisX * width + axisY * (-13);

    var widthText = new PointText(widthScrollStart + axisZ * (-3)); //descriptive width text
    widthText.fontSize = 20;
    widthText.content = Math.round(width);
    widthText.justification = "center";

    var widthPointer = new crosshatch.Path.RegularPolygon(widthScrollStart + axisZ * (-1), 3, -10);
    widthPointer.fillColor = "blue";

    var widthRectangle = new crosshatch.Shape.Rectangle(widthScrollStart + axisX * (-4) + axisZ * (-7), new Size(40, 25));
    widthRectangle.fillColor = "white";

    groupW = new Group([widthPointer, widthRectangle, widthText]);

    groupW.onMouseEnter = function () {
        $('html,body').css('cursor', 'grab');
        widthPointer.fillColor = "red";
    };
    groupW.onMouseLeave = function () {
        $('html,body').css('cursor', 'default');
        widthPointer.fillColor = "blue";
    };
    groupW.onMouseUp = function () {
        $('html,body').css('cursor', 'default');
        widthPointer.fillColor = "blue";
    };

    groupW.onMouseDrag = function (event) {
        $('html,body').css('cursor', 'grabbing');
        width += event.delta.x / multiplier;
        updateVis();
        if (width < minSize.x) {
            width = minSize.x;
        }
        if (width > maxSize.x) {
            width = maxSize.x;
        }
        widthPointer.fillColor = "red";
        widthPointer.position = new Point(gridStart + axisX * width + axisY * (-10) + axisZ * (-2));
        widthRectangle.position = new Point(gridStart + axisX * width + axisY * (-10) + axisZ * (-6));
        widthText.content = Math.round(width);
        widthText.position = new Point(gridStart + axisX * width + axisY * (-10) + axisZ * (-6));
    };
    guiItems.push(groupW);

    //------Right side of gui, Height scroll
    var path2 = new Path();
    g1 = gridStart + axisX * (maxSize.x + 5);
    var c3 = gridStart + axisX * (maxSize.x + 5) + axisY * maxSize.y;
    path2.add(g1, c3); //top line, width scroll
    guiItems.push(path2);

    var p1 = (c3 - g1) / 12;
    for (var i = 0; i <= 12; i++) {
        var p2 = new Point(g1 + p1 * i - axisX);
        c3 = new Point(g1 + p1 * i + axisX);
        var path = new Path(p2, c3);
        guiItems.push(path);
    }

    for (var i = 0; i < 12; i++) {
        var p2 = g1 + p1 * (i + 0.5);
        c3 = g1 + p1 * (i + 0.5) + axisX;
        var path = new Path(p2, c3);
        guiItems.push(path);
    }

    var heightText = new PointText(g1 + axisY * height + [10, -10]); //descriptive width text
    heightText.fontSize = 20;
    heightText.content = Math.round(height);
    heightText.rotate(45);
    heightText.align = "center";

    var heightPointer = new crosshatch.Path.RegularPolygon(g1 + axisY * height + [10, -10], 3, -10);
    heightPointer.fillColor = "blue";
    heightPointer.rotate(45);


    var heightRectangle = new crosshatch.Shape.Rectangle(g1 + axisY * height + [5, -30], new Size(40, 25));
    heightRectangle.strokeColor = "blue";
    heightRectangle.fillColor = "white";
    heightRectangle.strokeWidth = 2;
    heightRectangle.rotate(45);


    groupH = new Group([heightPointer, heightRectangle, heightText]);

    groupH.onMouseEnter = function () {
        $('html,body').css('cursor', 'grab');
        heightPointer.fillColor = "red";
    };
    groupH.onMouseLeave = function () {
        $('html,body').css('cursor', 'default');
        heightPointer.fillColor = "blue";
    };
    groupH.onMouseUp = function () {
        $('html,body').css('cursor', 'default');
        heightPointer.fillColor = "blue";
    };

    groupH.onMouseDrag = function (event) {
        $('html,body').css('cursor', 'grabbing');
        height += event.delta.y / multiplier;
        updateVis();
        if (height < minSize.y) {
            height = minSize.y;
        }
        if (height > maxSize.y) {
            height = maxSize.y;
        }
        heightPointer.fillColor = "red";
        heightPointer.position = new Point(g1 + axisY * height + [10, -10]);
        heightRectangle.position = new Point(g1 + axisY * height + [20, -20]);
        heightText.content = Math.round(height);
        heightText.position = new Point(g1 + axisY * height + [20, -20]);
    };
    guiItems.push(groupH);

    canvasLayers[1] = new crosshatch.Layer({
        children: guiItems,
        strokeColor: 'blue',
        strokeWidth: 2
    });

    canvasLayers[2] = new crosshatch.Layer({
        children: textItems
    });
};

function onKeyDown(event) {
    switch (event.key) {
        case 'up':
            height += 1;
            event.preventDefault();
            break;
        case 'down':
            height -= 1;
            event.preventDefault();
            break;
        case 'left':
            width -= 1;
            event.preventDefault();
            break;
        case 'right':
            width += 1;
            event.preventDefault();
            break;
            /*
             case 'a':
             angle += 1;
             angle2 += 1;
             axisY = new Point(rotatePointArroundAxis([axisY.x, 0, axisY.y], [0, 1, 0], -0.1)[0], rotatePointArroundAxis([axisY.x, 0, axisY.y], [0, 1, 0], -0.1)[2]);
             axisX = new Point(rotatePointArroundAxis([axisX.x, 0, axisX.y], [0, 1, 0], -0.1)[0], rotatePointArroundAxis([axisX.x, 0, axisX.y], [0, 1, 0], -0.1)[2]);
             event.preventDefault();
             break;
             case 'd':
             angle -= 1;
             angle2 -= 1;
             axisY = new Point(rotatePointArroundAxis([axisY.x, 0, axisY.y], [0, 1, 0], 0.1)[0], rotatePointArroundAxis([axisY.x, 0, axisY.y], [0, 1, 0], 0.1)[2]);
             axisX = new Point(rotatePointArroundAxis([axisX.x, 0, axisX.y], [0, 1, 0], 0.1)[0], rotatePointArroundAxis([axisX.x, 0, axisX.y], [0, 1, 0], 0.1)[2]);
             event.preventDefault();
             break;*/
    }
    if (height < minSize.y) {
        height = minSize.y;
    }
    if (height > maxSize.y) {
        height = maxSize.y;
    }
    if (width < minSize.x) {
        width = minSize.x;
    }
    if (width > maxSize.x) {
        width = maxSize.x;
    }
    crosshatch.project.clear();
    updateVis();
    drawGui();
}


function rotatePointArroundAxis(point, axis, angle) {

    var v1 = point[0] * axis[0] + point[1] * axis[1] + point[2] * axis[2];
    var oneMinusCos = 1 - Math.cos(angle);
    var axisModule = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
    var axisM = axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2];
    var rotatedPoint = [];
    rotatedPoint[0] = ((axis[0] * v1 * oneMinusCos + axisM * point[0] * Math.cos(angle) + axisModule * (-axis[2] * point[1] + axis[1] * point[2]) * Math.sin(angle)) / axisM);
    rotatedPoint[1] = ((axis[1] * v1 * oneMinusCos + axisM * point[1] * Math.cos(angle) + axisModule * (axis[2] * point[0] - axis[0] * point[2]) * Math.sin(angle)) / axisM);
    rotatedPoint[2] = ((axis[2] * v1 * oneMinusCos + axisM * point[2] * Math.cos(angle) + axisModule * (-axis[1] * point[0] + axis[0] * point[1]) * Math.sin(angle)) / axisM);
    console.log(rotatedPoint);
    return rotatedPoint;
}

function onMouseUp() {
    $('html,body').css('cursor', 'default');
}




$(document).ready(function () {

    // Get a reference to the canvas object
    $("#rowsUp").on("click", function () {
        if (rows < 10) {
            rows++;
            $("#rows").text("Rows: " + rows);
            updateVis();
        }
    });

    $("#rowsDown").on("click", function () {
        if (rows > 2) {
            rows--;
            $("#rows").text("Rows: " + rows);
            updateVis();
        }
    });

    $("#colsUp").on("click", function () {
        if (cols < 10) {
            cols++;
            $("#columns").text("Columns: " + cols);
            updateVis();
        }
    });

    $("#colsDown").on("click", function () {
        if (cols > 2) {
            cols--;
            $("#columns").text("Columns: " + cols);
            updateVis();
        }
    });

    $("#layersUp").on("click", function () {
        if (layers < 100) {
            layers++;
            $("#layers").text("Layers: " + layers);
            updateVis();
        }
    });

    $("#layersDown").on("click", function () {
        if (layers > 1) {
            layers--;
            $("#layers").text("Layers: " + layers);
            updateVis();
        }
    });

    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    crosshatch = paper;

    //the layers have to be defied for the updateVis() to work  
    canvasLayers[0] = new crosshatch.Layer({children: []});
    canvasLayers[1] = new crosshatch.Layer({children: []});
    canvasLayers[2] = new crosshatch.Layer({children: []});

    drawGui();
    updateVis();
});