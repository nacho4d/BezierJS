/*
Customizable parameters:

ibSquareSide       side of small squares. In pixels.
ibUnit             number of squares per unit (how many small squares are in a side of a big square)
ibWidth            number of squares along the x axis
ibHeight           number of squares along the y axis
ibRadius           radius of each control point. In pixels
ibTimingFunction   flag ('true' will load the widget with the checkbox checked)
*/

var IB = new function () {
//TODO: make this an object instead of a namespace so several widgets like this can be drawn in a single page
    //var IB = {

    // Private vars
    var squareSide = (typeof ibSquareSide != "undefined") ? ibSquareSide : 45;
    var unit = (typeof ibUnit != "undefined")? ibUnit : 3;
    var radius = (typeof ibRadius != "undefined")? ibRadius : 2;
    var timingFunction = (typeof ibTimingFunction != "undefined")? ibTimingFunction : true;
    var gridSize = { // size of grid in pixels
        'w': squareSide * ((typeof ibWidth != "undefined")? ibWidth : 10),
        'h': squareSide * ((typeof ibHeight != "undefined")? ibHeight : 10)
    };
    var ptIdx = -1;

    // Helpers : Conversion functions
    // x_ and y_ are in visible coordinates aprox. (-1,-1).
    // x and y are in canvas coordinates (0, gridFrame.w)
    var convX = function (x) { return x * squareSide * unit + gridSize.w / 2; };
    var convY = function (y) { return -y * squareSide * unit + gridSize.h / 2; };
    var visX = function (x_) { return (x_ - gridSize.w / 2) / (squareSide * unit); };
    var visY = function (y_) { return -(y_ - gridSize.h / 2) / (squareSide * unit); };

    // Points : Start, control point 1, control point 2 and End
    var pts = [{
        'x': convX(0.0),
        'y': convY(0.0)
    }, {
        'x': convX(1.3),
        'y': convY(-0.05)
    }, {
        'x': convX(0.92),
        'y': convY(0.2)
    }, {
        'x': convX(1.0),
        'y': convY(1.0)
    }];

    /*
    @param ctx : canvas context
    @param sqrSide : side of square. In pixels.
    @param gridFrame : drawing area
    @param bordered : whether draws the border or not
    */
    var drawGrid = function (ctx, sqrSide, gridFrame, bordered) {
            //Draw vertical lines
            for (var i = sqrSide; i < gridFrame.w; i += sqrSide) {
                ctx.moveTo(gridFrame.x + i, gridFrame.y);
                ctx.lineTo(gridFrame.x + i, gridFrame.y + gridFrame.h);
                ctx.stroke();
            }
            if (bordered === true) {
                ctx.moveTo(gridFrame.x, gridFrame.y);
                ctx.lineTo(gridFrame.x + gridFrame.w, gridFrame.y);
                ctx.stroke();
                ctx.moveTo(gridFrame.x + gridFrame.w, gridFrame.y);
                ctx.lineTo(gridFrame.x + gridFrame.w, gridFrame.y + gridFrame.h);
                ctx.stroke();
            }
            // Draw horizontal lines
            for (var j = sqrSide; j < gridFrame.h; j += sqrSide) {
                ctx.moveTo(gridFrame.x, gridFrame.y + j);
                ctx.lineTo(gridFrame.x + gridFrame.w, gridFrame.y + j);
                ctx.stroke();
            }
            if (bordered === true) {
                ctx.moveTo(gridFrame.x, gridFrame.y);
                ctx.lineTo(gridFrame.x, gridFrame.y + gridFrame.h);
                ctx.stroke();
                ctx.moveTo(gridFrame.x, gridFrame.y + gridFrame.h);
                ctx.lineTo(gridFrame.x + gridFrame.w, gridFrame.y + gridFrame.h);
                ctx.stroke();
            }
        };

    // Helper : Draws the control points and joint lines
    var drawControlPoints = function (ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 1;
            ctx.arc(pts[0].x, pts[0].y, radius, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.arc(pts[1].x, pts[1].y, radius, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.arc(pts[2].x, pts[2].y, radius, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.arc(pts[3].x, pts[3].y, radius, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.restore();
        };

    // Draws the whole canvas
    var drawCanvas = function () {
            var canvas = document.getElementById("ib-canvas");
            var ctx = canvas.getContext("2d");
            var gridFrame = {
                'x': 0,
                'y': 0,
                'w': gridSize.w,
                'h': gridSize.h
            };
            ctx.clearRect(gridFrame.x, gridFrame.y, gridFrame.w, gridFrame.h);
            // Grid
            ctx.save();
            ctx.lineWidth = 1.0;
            // Draw dense grid
            ctx.strokeStyle = "EEEEEE";
            ctx.beginPath();
            drawGrid(ctx, squareSide, gridFrame, true);
            ctx.closePath();
            // Draw non-dense grid
            ctx.strokeStyle = "AAAAAA";
            ctx.beginPath();
            var gX = (gridSize.w / 2) - Math.ceil((gridSize.w / 2) / (squareSide * unit)) * (squareSide * unit);
            var gY = (gridSize.h / 2) - Math.ceil((gridSize.h / 2) / (squareSide * unit)) * (squareSide * unit);
            var gW = gridSize.w + 2 * (-gX);
            var gH = gridSize.h + 2 * (-gY);
            drawGrid(ctx, squareSide * unit, {
                'x': gX,
                'y': gY,
                'w': gW,
                'h': gH
            }, false);
            ctx.closePath();
            ctx.restore();
            // Draw control points
            drawControlPoints(ctx);
            // Draw bezier
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            ctx.bezierCurveTo(pts[1].x, pts[1].y, pts[2].x, pts[2].y, pts[3].x, pts[3].y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.stroke();
            ctx.closePath();
        };

    // Update coordinates from view
    var updateFields = function () {
            document.getElementById("pt0x").value = visX(pts[0].x);
            document.getElementById("pt0y").value = visY(pts[0].y);
            document.getElementById("pt1x").value = visX(pts[1].x);
            document.getElementById("pt1y").value = visY(pts[1].y);
            document.getElementById("pt2x").value = visX(pts[2].x);
            document.getElementById("pt2y").value = visY(pts[2].y);
            document.getElementById("pt3x").value = visX(pts[3].x);
            document.getElementById("pt3y").value = visY(pts[3].y);
            document.getElementById("pt0x").disabled = timingFunction;
            document.getElementById("pt0y").disabled = timingFunction;
            document.getElementById("pt3x").disabled = timingFunction;
            document.getElementById("pt3y").disabled = timingFunction;
        };

    // Update obj-c from fields
    var updateObjc = function () {
            // Float with 2 decimals

            function format(original) {
                return Math.round(original * 100) / 100;
            }
            var objc = document.getElementById("ib-objc");
            objc.hidden = !timingFunction;
            if ((visX(pts[0].x) === 0 && visY(pts[0].y) === 0 && visX(pts[3].x) === 1 && visY(pts[3].y) === 1)) {
                var innerHTML = "<div class='ib-sc-method'>[<span class='ib-sc-class'>CAMediaTimingFunction</span></br>functionWithControlPoints:";
                innerHTML += "<span class='ib-sc-number'>" + format(visX(pts[1].x)) + "</span>" + " :";
                innerHTML += "<span class='ib-sc-number'>" + format(visY(pts[1].y)) + "</span>" + "\n:";
                innerHTML += "<span class='ib-sc-number'>" + format(visX(pts[2].x)) + "</span>" + " :";
                innerHTML += "<span class='ib-sc-number'>" + format(visY(pts[2].y)) + "</span>" + "];</div>";
                objc.innerHTML = innerHTML;
            } else {
                objc.innerText = "Error : start and/or end point are not (0,0) (1,1) respectively";
            }
        };

    // Event handlers:
    this.dragOn = function (event) {
        // Clicked position
        var canvas = document.getElementById("ib-canvas");
        var clickPos = {
            'x': event.offsetX ? (event.offsetX) : event.pageX - canvas.offsetLeft,
            'y': event.offsetY ? (event.offsetY) : event.pageY - canvas.offsetTop
        };
        // Calculate the clicked point
        for (var i = 0; i < pts.length; i++) {
            var dist = Math.sqrt(Math.pow((pts[i].x - clickPos.x), 2) + Math.pow((pts[i].y - clickPos.y), 2));
            if (dist <= radius * 2) {
                ptIdx = i;
                return;
            }
        }
        ptIdx = -1;
    };
    this.dragOff = function (event) {
        ptIdx = -1;
        // If is in timing function mode, change back the start and end points if needed
        if (timingFunction && (visX(pts[0].x) !== 0 || visY(pts[0].y) !== 0 || visX(pts[3].x) !== 1 || visY(pts[3].y) !== 1)) {
            pts[0] = {
                'x': convX(0),
                'y': convY(0)
            };
            pts[3] = {
                'x': convX(1),
                'y': convY(1)
            };
            drawCanvas();
            updateFields();
        }
    };
    this.dragPt = function (event) {
        if (ptIdx < 0) return;
        // Update points and re-draw the canvas
        pts[ptIdx] = {
            'x': event.offsetX ? (event.offsetX) : event.pageX - canvas.offsetLeft,
            'y': event.offsetY ? (event.offsetY) : event.pageY - canvas.offsetTop
        };
        drawCanvas();
        updateFields();
        if (timingFunction && ptIdx !== 0 && ptIdx !== 3) {
            updateObjc();
        }
    };
    this.fieldDidUpdate = function (fieldId, idx, xoryFlag) {
        
        var value = document.getElementById(fieldId).value;
        if (xoryFlag === true) {
            pts[idx].x = convX(value);
        } else {
            pts[idx].y = convY(value);
        }
        drawCanvas();
        updateObjc();
    };


    // Toogle mode Bezier for CAMediaTimingFunction <-> General Bezier
    this.toogleMode = function () {
        timingFunction = !timingFunction;
        if (timingFunction) {
            pts[0] = {
                'x': convX(0),
                'y': convY(0)
            };
            pts[3] = {
                'x': convX(1),
                'y': convY(1)
            };
        }
        // Draw the canvas, update the fields and Obj-c
        drawCanvas();
        updateFields();
        updateObjc();
    };

    this.load = function (containerId) {
        var innerHTML;
        innerHTML = "<canvas id='ib-canvas' onMousedown='IB.dragOn(event)' onmousemove='IB.dragPt(event)' onmouseup='IB.dragOff(event)'";
        innerHTML += "width='" + gridSize.w + "px' height='" + gridSize.h + "px'></canvas>"; // MUST use "width" and "height" instead of style="width: height:"
        innerHTML += "</br>";
        innerHTML += "<div id='ib-outer-points-container' style='width:" + gridSize.w +"px;'> <div class='ib-outer-points-container-sub'>";
        innerHTML +=   "<div id='ib-points-container'>";
        innerHTML +=     "<div style='font-weight:bold;'>";
        innerHTML +=     "Points Info:</br></br>";
        innerHTML +=     "</div>";
        innerHTML +=     "<span>Start Point&nbsp&nbsp&nbsp&nbsp&nbsp(";
        innerHTML +=     "<input type='text' id='pt0x' size='4' onkeyup='IB.fieldDidUpdate(this.id, 0, true)' />,";
        innerHTML +=     "<input type='text' id='pt0y' size='4' onkeyup='IB.fieldDidUpdate(this.id, 0, false)' /> ); </br>";
        innerHTML +=     "</span>";
        innerHTML +=     "<span>Control Point 1 (";
        innerHTML +=     "<input type='text' id='pt1x' size='4' onkeyup='IB.fieldDidUpdate(this.id, 1, true)' />,";
        innerHTML +=     "<input type='text' id='pt1y' size='4' onkeyup='IB.fieldDidUpdate(this.id, 1, false)' /> ); </br>";
        innerHTML +=     "</span>";
        innerHTML +=     "<span>Control Point 2 (";
        innerHTML +=     "<input type='text' id='pt2x' size='4' onkeyup='IB.fieldDidUpdate(this.id, 2, true)' />,";
        innerHTML +=     "<input type='text' id='pt2y' size='4' onkeyup='IB.fieldDidUpdate(this.id, 2, false)' /> ); </br>";
        innerHTML +=     "</span>";
        innerHTML +=     "<span>End Point&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp(";
        innerHTML +=     "<input type='text' id='pt3x' size='4' onkeyup='IB.fieldDidUpdate(this.id, 3, true)' />,";
        innerHTML +=     "<input type='text' id='pt3y' size='4' onkeyup='IB.fieldDidUpdate(this.id, 3, false)' /> ); </br>";
        innerHTML +=     "</span>";
        innerHTML +=   "</div> <!-- end of ib-points-container -->";
        innerHTML +=   "</br>";
        innerHTML +=   "<div id='function-container'>";
        innerHTML +=     "<input type='checkbox' id='checkbox' onclick='IB.toogleMode()' checked>&nbspConstrain path for CAMediaTimingFunction<br>";
        innerHTML +=     "</br>";
        innerHTML +=     "<div id='ib-objc'></div>";
        innerHTML +=     "</br>";
        innerHTML +=   "</div> <!-- end of ib-function-container -->";
        innerHTML += "</div></div> <!-- end of ib-outer-points-container -->";

        var mainContainer = document.getElementById(containerId);
        mainContainer.innerHTML = innerHTML;

        // Draw the canvas, update the fields and Obj-c
        drawCanvas();
        updateFields();
        updateObjc();
    };
}();
