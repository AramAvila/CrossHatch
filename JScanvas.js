var Grid = function () {

    this.paper;

    this.rows;
    this.cols;
    this.layers;
    this.width;
    this.height;

    /**
     * @gridStart indicates the point at which the grid has to start. All the gui's will be realtive to this point
     */
    this.gridStart = new Point(50, 50);

    /**
     * Max grid size is 120 * 120. It looks small on the screen, this multiplier is added to the axis to comensate the size
     */
    this.multiplier = 5;

    /**
     * @axisX X axis used to translate the grid points to a 3D like space: [x,y] 
     */
    this.axisX = new Point(1, 0) * this.multiplier;
    /**
     * @axisY Y axis used to translate the grid points to a 3D like space: [x,y] 
     */
    this.axisY = new Point(0.707, 0.707) * this.multiplier;
    /**
     * @axisZ Z axis used to translate the grid points to a 3D like space: [x,y] 
     */
    this.axisZ = new Point(0, 1) * this.multiplier;

    /**
     * This method updates the list of points to draw changing the this.paper object
     */
    this.updateVis = function () {

        var layerSeparation = Math.min(10, 120 / this.layers); //Layer separation to improve understanding

        var rowsSpacing = this.height / (this.rows - 1);
        var colsSpacing = this.width / (this.cols - 1);

        this.paper.project.activeLayer.removeChildren(); //all previous paths are removed

        for (var l = this.layers; l >= 0; l--) {

            var color1 = Math.min(Math.random(), 0.8);
            var color2 = Math.min(Math.random(), 0.8);
            var color3 = Math.min(Math.random(), 0.8);

            for (var i = 0; i < this.rows; i++) {
                var path = new this.paper.Path();
                path.strokeColor = new Color(color1, color2, color3);
                path.strokeWidth = 3;

                var p1 = this.axisX * 0 + this.axisY * (i * rowsSpacing) + this.axisZ * l * layerSeparation + this.gridStart;
                var p2 = this.axisX * this.width + this.axisY * (i * rowsSpacing) + this.axisZ * l * layerSeparation + this.gridStart;

                path.add(p1, p2);
            }

            for (var i = 0; i < this.cols; i++) {
                var path = new this.paper.Path();
                path.strokeColor = new Color(color1, color2, color3);
                path.strokeWidth = 3;

                var p1 = this.axisX * i * colsSpacing + this.axisY * 0 + this.axisZ * l * layerSeparation + this.gridStart;
                var p2 = this.axisX * i * colsSpacing + this.axisY * this.height + this.axisZ * l * layerSeparation + this.gridStart;

                path.add(p1, p2);
            }
        }

        //----grawing gui items
        var path = new this.paper.Path();
        path.strokeColor = new Color(0, 0, 0);
        path.strokeWidth = 3;
        var g1 = new Point(this.gridStart[0], this.gridStart[1] - 20);
        var g2 = new Point(this.gridStart[0] + this.width * this.multiplier, this.gridStart[1] - 20);
        path.add(g1, g2);

        var path = new this.paper.Path();
        path.strokeColor = new Color(0, 0, 0);
        path.strokeWidth = 3;
        var g1 = new Point(this.gridStart[0] - 20, this.gridStart[1]);
        var g2 = new Point(this.gridStart[0] - 20, this.gridStart[1] + this.layers * layerSeparation * this.multiplier);
        path.add(g1, g2);

        var path = new this.paper.Path();
        path.strokeColor = new Color(0, 0, 0);
        path.strokeWidth = 3;
        var g1 = new Point(this.gridStart[0] + 20 + this.width * this.multiplier, this.gridStart[1]);
        var g2 = new Point(this.gridStart[0] + 20 + this.width * this.multiplier + this.height * 0.707 * this.multiplier, this.gridStart[1]+ this.height * 0.707 * this.multiplier);
        path.add(g1, g2);

        this.paper.view.draw();
    };

    /**
     * This method updates the values with wich the grid will be created (number of columns, rows, layers, etc)
     */
    this.updateValues = function () {
        this.rows = parseInt($("#rows").text());
        this.cols = parseInt($("#cols").val());
        this.layers = parseInt($("#layers").val());
        this.width = parseInt($("#width").val());
        this.height = parseInt($("#height").val());
        this.gridStart = [600 - ((this.width * this.multiplier + this.axisY.x * this.height) / 2), 50];
    };
};

var crosshatch = new Grid();

function onMouseDrag(event) {
    if (event.point.x < 1200 && event.point.x > 0) {

    }
    if (event.point.y < 1200 && event.point.y > 0) {

    }
}

$(document).ready(function () {

    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    crosshatch.paper = paper;

    crosshatch.updateValues();
    crosshatch.updateVis();

    $("#cols, #layers, #width, #height").keyup(function () {
        crosshatch.updateValues();
        crosshatch.updateVis();
    });

    $("#cols, #layers, #width, #height").on("keydown", function (e) {

        switch (e.which) {
            case 38: // up
                $(this).val(parseInt($(this).val()) + 1);

                break;

            case 40: // down
                $(this).val(parseInt($(this).val()) - 1);

                break;

            default:
                return;
        }
        e.preventDefault();
    });

    $("#rowsUp").on("click", function () {
        $("#rows").text(parseInt($("#rows").text()) + 1);
        orthogonalCanvas();
    });

    $("#rowsDown").on("click", function () {
        $("#rows").text(parseInt($("#rows").text()) - 1);
        orthogonalCanvas();
    });
}); 