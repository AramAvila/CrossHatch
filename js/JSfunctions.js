/**
 * current data contains the updated values of the app
 * @type data
 */
var currentData;

function toggleOptions() {
    var opts = document.getElementById("additionalOptions");
    if (opts.style.visibility !== "visible") {
        opts.style.visibility = "visible";
    } else {
        opts.style.visibility = "hidden";
    }
}

function saveGcode() {

    //lbr will be a macro to print a line Break
    var lBr = "\r\n";

    //var lines will contain all the text for the file
    var lines = [];

    //all the propertries we got from the app will be added as comments. Just in case something goes wrong
    lines.push(";------- Current propertries ----" + lBr);
    var count = 0;
    for (var prop in currentData) {
        if (currentData.hasOwnProperty(prop))
            ++count;
        lines.push(";-------" + prop + ": " + currentData[prop] + lBr);
    }
    lines.push(";-------------------- " + lBr);
    lines.push(lBr);
    lines.push(lBr);

    var leftMargin = -(currentData.width / 2);
    var rightMargin = currentData.width / 2;

    var topMargin = currentData.height / 2;
    var botMargin = -(currentData.height / 2);

    var rowExtrusion = currentData.width * currentData.feedrateExtruder;
    var colExtrusion = currentData.height * currentData.feedrateExtruder;

    var currentExtrusion = 0;

    //extruder side will be one of 4: top -> t, bottom -> b, left -> l, right -> r. And will be used to now in wich side is the extruder, and to wich side has to move
    var extruderSide = "l";

    //spaces between rows or columns, has to be +1 to make sure that the center of rows or columns is in the middle
    var rowsSpacing = currentData.height / (currentData.rows + 1);
    var colsSpacing = currentData.width / (currentData.cols + 1);

    //Here we start working on printing lines
    lines.push(";------- Start printing ----" + lBr);
    lines.push(";---Homing all axis" + lBr);
    lines.push("G28" + lBr);
    lines.push(";---Reset extruder value" + lBr);
    lines.push("G92 E0" + lBr);

    var zHeight = currentData.initialHeight;
    for (var layer = 0; layer < currentData.layers; layer++) {
        var currPos, bup;
        zHeight += currentData.layerHeight;
        lines.push(";---New layer, number: " + layer + lBr);

        for (var row = 1; row <= currentData.rows; row++) {

            if (extruderSide === "l") { //if the extruder is on the left side, it will have to move to the right side
                lines.push(";---Extruder on left side, drawing row: " + row + lBr);
                currPos = topMargin - rowsSpacing * row;
                lines.push("G1 X" + leftMargin + " Y" + currPos + " Z" + zHeight + " F" + currentData.feedrateTravel + lBr);
                lines.push(";---Build up pressure and print" + lBr);
                bup = currentExtrusion + currentData.buildUpPressExtrusion;
                lines.push("G1 E" + bup + " F" + currentData.feedrateExtruder + lBr);
                lines.push("G92 E" + currentExtrusion + lBr);
                lines.push("G1 F" + currentData.feedratePrinting + lBr);
                currentExtrusion += rowExtrusion;
                currPos = topMargin - rowsSpacing * row;
                lines.push("G1 X" + rightMargin + " Y" + currPos + " E" + currentExtrusion + lBr);
                extruderSide = "r";
                lines.push(";---Release pressure and move" + lBr);
                lines.push("G1 E" + currentExtrusion + " F" + currentData.feedrateExtruder + lBr);
                lines.push("G1 F" + currentData.feedrateTravel + lBr);
                if (row !== currentData.rows) {//if we are not printing the last row, this line moves the extrusor to the next row
                    currPos = topMargin - rowsSpacing * (row + 1);
                    lines.push("G1 X" + rightMargin + " Y" + currPos + " E" + currentExtrusion + lBr);
                }

            } else if (extruderSide === "r") {//if the extruder is on the right side, it will have to move to the left.
                lines.push(";---Extruder on right side, drawing row: " + row + lBr);
                currPos = topMargin - rowsSpacing * row;
                lines.push("G1 X" + rightMargin + " Y" + currPos + " Z" + zHeight + " F" + currentData.feedrateTravel + lBr);
                lines.push(";---Build up pressure and print" + lBr);
                bup = currentExtrusion + currentData.buildUpPressExtrusion;
                lines.push("G1 E" + bup + " F" + currentData.feedrateExtruder + lBr);
                lines.push("G92 E" + currentExtrusion + lBr);
                lines.push("G1 F" + currentData.feedratePrinting + lBr);
                currentExtrusion += rowExtrusion;
                currPos = topMargin - rowsSpacing * row;
                lines.push("G1 X" + leftMargin + " Y" + currPos + " E" + currentExtrusion + lBr);
                extruderSide = "l";
                lines.push(";---Release pressure and move" + lBr);
                lines.push("G1 E" + currentExtrusion + " F" + currentData.feedrateExtruder + lBr);
                lines.push("G1 F" + currentData.feedrateTravel + lBr);
                if (row !== currentData.rows) {//if we are not printing the last row, this line moves the extrusor to the next row
                    currPos = topMargin - rowsSpacing * (row + 1);
                    lines.push("G1 X" + leftMargin + " Y" + currPos + " E" + currentExtrusion + lBr);
                }
            }
        }

        //depending on wich side the extrusor is, we will begin drawing the columns from the left or from the right
        var currentCol = 0;
        var columnsEnd = 0;
        var deltaCol = 0;
        if (extruderSide === "l") {
            currentCol = 1;
            columnsEnd = currentData.cols + 1;
            deltaCol = 1;
            extruderSide = "b";

        } else if (extruderSide === "r") {
            currentCol = currentData.cols;
            columnsEnd = 0;
            deltaCol = -1;
            extruderSide = "b";

        }

        lines.push(";---Done drawing rows, starting with columns" + lBr);

        //we will be drawing columns until we reach the last one
        var nextColumn = true;
        while (nextColumn) {

            if (extruderSide === "b") { //if the extruder is on the left side, it will have to move to the right side
                lines.push(";---Extruder on bot side, drawing column: " + currentCol + lBr);
                currPos = leftMargin + colsSpacing * currentCol;
                lines.push("G1 X" + currPos + " Y" + botMargin + " Z" + zHeight + " F" + currentData.feedrateTravel + lBr);
                lines.push(";---Build up pressure and print" + lBr);
                bup = currentExtrusion + currentData.buildUpPressExtrusion;
                lines.push("G1 E" + bup + " F" + currentData.feedrateExtruder + lBr);
                lines.push("G92 E" + currentExtrusion + lBr);
                lines.push("G1 F" + currentData.feedratePrinting + lBr);
                currentExtrusion += colExtrusion;
                currPos = leftMargin + colsSpacing * currentCol;
                lines.push("G1 X" + currPos + " Y" + topMargin + " E" + currentExtrusion + lBr);
                extruderSide = "t";
                lines.push(";---Release pressure and move" + lBr);
                lines.push("G1 E" + currentExtrusion + " F" + currentData.feedrateExtruder + lBr);
                lines.push("G1 F" + currentData.feedrateTravel + lBr);
                currPos = leftMargin + colsSpacing * (currentCol + deltaCol);
                lines.push("G1 X" + currPos + " Y" + topMargin + " E" + currentExtrusion + lBr);

            } else if (extruderSide === "t") {//if the extruder is on the right side, it will have to move to the left.
                lines.push(";---Extruder on top side, drawing column: " + currentCol + lBr);
                currPos = leftMargin + colsSpacing * currentCol;
                lines.push("G1 X" + currPos + " Y" + topMargin + " Z" + zHeight + " F" + currentData.feedrateTravel + lBr);
                lines.push(";---Build up pressure and print" + lBr);
                bup = currentExtrusion + currentData.buildUpPressExtrusion;
                lines.push("G1 E" + bup + " F" + currentData.feedrateExtruder + lBr);
                lines.push("G92 E" + currentExtrusion + lBr);
                lines.push("G1 F" + currentData.feedratePrinting + lBr);
                currentExtrusion += colExtrusion;
                currPos = leftMargin + colsSpacing * currentCol;
                lines.push("G1 X" + currPos + " Y" + botMargin + " E" + currentExtrusion + lBr);
                extruderSide = "b";
                lines.push(";---Release pressure and move" + lBr);
                lines.push("G1 E" + currentExtrusion + " F" + currentData.feedrateExtruder + lBr);
                lines.push("G1 F" + currentData.feedrateTravel + lBr);
                currPos = leftMargin + colsSpacing * (currentCol + deltaCol);
                lines.push("G1 X" + currPos + " Y" + botMargin + " E" + currentExtrusion + lBr);
            }

            currentCol += deltaCol;
            if (currentCol === columnsEnd) {
                nextColumn = false;
            }
        }

        //if the number of columns is even, they will be drawn from right to left, otherwise, from left to right
        //that means that the extruder position when it finishes drawing the columns will depend on the number of columns
        if (currentData.cols % 2 === 1) {
            extruderSide = "l";

        } else {
            extruderSide = "r";
        }
    }
    lines.push(";------- Done printing ----" + lBr);
    lines.push(";---Release pressure" + lBr);
    bup = currentExtrusion + currentData.buildUpPressExtrusion;
    lines.push("G1 E" + bup + " F" + currentData.feedrateExtruder + lBr);
    lines.push("G92 E" + currentExtrusion + lBr);
    lines.push(";---Homing all axis" + lBr);
    lines.push("G28" + lBr);  //<-- this would step over the shape
    lines.push(";---Motors disabled" + lBr);
    lines.push("M84" + lBr);

    var blob = new Blob(lines, {type: "text/plain;charset=utf-8"});
    saveAs(blob, "testFile.gcode");
}

function updateValues(data) {
    currentData = data;
}