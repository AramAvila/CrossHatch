var width = 100;
var height = 100;
var maxSize = new Point(120, 120);
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
var gridStart = new Point(100, 100);


var updateVis = function () {

    layerSeparation = Math.min(10, 120 / layers); //Layer separation to improve understanding

    canvasLayers[0].activate();
    canvasLayers[0].clear();

    var rowsSpacing = height / (rows - 1);
    var colsSpacing = width / (cols - 1);

    var paths = [];

    for (var l = layers; l > 0; l--) {

        var path = new Path();
        var p1 = axisZ * l * layerSeparation + gridStart;
        var p2 = axisY * height + axisZ * l * layerSeparation + gridStart;
        var p3 = axisX * width + axisY * height + axisZ * l * layerSeparation + gridStart;

        path.add(p1, p2, p3);
        if (l === layers) {
            path.strokeWidth = 3;
        };
        paths.push(path);
    }

    var path = new Path();
    p1 = gridStart;
    p2 = axisZ * layers * layerSeparation + gridStart;
    path.strokeWidth = 3;
    path.add(p1, p2);
    paths.push(path);

    var path = new Path();
    p1 = axisY * height + gridStart;
    p2 = axisY * height + axisZ * layers * layerSeparation + gridStart;
    path.strokeWidth = 3;
    path.add(p1, p2);
    paths.push(path);

    var path = new Path();
    p1 = axisX * width + axisY * height + gridStart;
    p2 = axisX * width + axisY * height + axisZ * layers * layerSeparation + gridStart;
    path.strokeWidth = 3;
    path.add(p1, p2);
    paths.push(path);

    var path = new Path();
    path.add(new Point(gridStart + axisX * width + axisY * (-8)), new Point(gridStart + axisX * width));
    path.dashArray = [5, 6];
    path.strokeWidth = 1;
    paths.push(path);

    for (var i = 0; i < rows; i++) {
        var path = new Path();
        var p1 = axisX * 0 + axisY * (i * rowsSpacing) + axisZ * l * layerSeparation + gridStart;
        var p2 = axisX * width + axisY * (i * rowsSpacing) + axisZ * l * layerSeparation + gridStart;
        path.strokeWidth = 3;
        path.add(p1, p2);
        paths.push(path);
    }

    for (var i = 0; i < cols; i++) {
        var path = new Path();
        var p1 = axisX * i * colsSpacing + axisY * 0 + axisZ * l * layerSeparation + gridStart;
        var p2 = axisX * i * colsSpacing + axisY * height + axisZ * l * layerSeparation + gridStart;
        path.strokeWidth = 3;
        path.add(p1, p2);
        paths.push(path);
    }
    
    var path = new Path();
    path.add(new Point(gridStart.x + 20 + maxSize.x * multiplier, gridStart.y) + axisY * height, p2);
    path.dashArray = [5, 6];
    path.strokeWidth = 1;
    paths.push(path);
    
    var innerLines = getInnerLines();

    canvasLayers[0] = new Layer({
        children: paths,
        strokeColor: 'black'
    });

    crosshatch.view.draw();
};

var getInnerLines = function(){
  var a = 1;
    return a;
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
    var g1 = new Point(gridStart.x, gridStart.y) + axisY * (-8);
    var c1 = new Point(gridStart.x + maxSize.x * multiplier, gridStart.y) + axisY * (-8);
    path1.add(g1, c1); //top line, width scroll
    guiItems.push(path1);
    for (var i = 0; i <= 12; i++) {
        g1 = new Point(gridStart.x + i * 10 * multiplier, gridStart.y) + axisY * (-6);
        c1 = new Point(gridStart.x + i * 10 * multiplier, gridStart.y) + axisY * (-10);
        var path = new Path(g1, c1);
        guiItems.push(path);
    }

    for (var i = 0; i < 12; i++) {
        g1 = new Point(gridStart.x + (5 + i * 10) * multiplier, gridStart.y) + axisY * (-8);
        c1 = new Point(gridStart.x + (5 + i * 10) * multiplier, gridStart.y) + axisY * (-10);
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
        if (width < 0) {
            width = 0;
        }
        if (width > 120) {
            width = 120;
        }
        widthPointer.fillColor = "red";
        widthPointer.position = new Point(gridStart + axisX * width + axisY * (-10) + axisZ * (-2));
        widthRectangle.position = new Point(gridStart + axisX * width + axisY * (-10) + axisZ * (-6));
        widthText.content = Math.round(width);
        widthText.position = new Point(gridStart + axisX * width + axisY * (-10) + axisZ * (-6));
    };
    guiItems.push(groupW);


    /*text = new PointText((c1 + g1) / 2 - new Point(-50, 28)); //Add row text
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
     textItems.push(text);*/

    //------Right side of gui, Height scroll
    var path2 = new Path();
    g1 = new Point(gridStart.x + 20 + maxSize.x * multiplier, gridStart.y);
    var c3 = new Point(gridStart.x + 20 + maxSize.x * multiplier + maxSize.y * axisY.x, gridStart.y + maxSize.y * axisY.x);
    path2.add(g1, c3); //top line, width scroll
    guiItems.push(path2);

    var p1 = (c3 - g1) / 12;
    for (var i = 0; i <= 12; i++) {
        var p2 = new Point(g1 + p1 * i - [5, 0]);
        c3 = new Point(g1 + p1 * i + [5, 0]);
        var path = new Path(p2, c3);
        guiItems.push(path);
    }

    for (var i = 0; i < 12; i++) {
        var p2 = new Point(g1 + p1 * i + [10, 10]);
        c3 = new Point(g1 + p1 * i + [15, 10]);
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
        if (height < 0) {
            height = 0;
        }
        if (height > 120) {
            height = 120;
        }
        heightPointer.fillColor = "red";
        heightPointer.position = new Point(g1 + axisY * height + [10, -10]);
        heightRectangle.position = new Point(g1 + axisY * height + [20, -20]);
        heightText.content = Math.round(height);
        heightText.position = new Point(g1 + axisY * height + [20, -20]);
    };
    guiItems.push(groupH);



    var circleLayersMore = new crosshatch.Path.RegularPolygon(new Point(gridStart.x - 20, gridStart.y + layers * layerSeparation * multiplier) - new Point(0, 10), 3, -10);
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


    var circleLayersLess = new crosshatch.Path.RegularPolygon(gridStart - [20, -10], 3, 10);
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
    }
    if (height < 0) {
        height = 0;
    }
    if (height > 120) {
        height = 120;
    }
    if (width < 0) {
        width = 0;
    }
    if (width > 120) {
        width = 120;
    }
    crosshatch.project.clear();
    updateVis();
    drawGui();
}

function onMouseUp() {
    $('html,body').css('cursor', 'default');

}
;


$(document).ready(function () {

    // Get a reference to the canvas object
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