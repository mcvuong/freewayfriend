
new p5();

// WatchMyWeek is a tool where you can view your weekly schedule in a neat, visual format
// Starting variables
var startTime = 8;
var endTime = 20;
var smallLines = 30;
var bigLines = 60;
var blocks = [];
var shownDay = 8;
var maxBlocks = 50;
var json = { "blocks": [] };

// Window constants for later
// To be updated whenever the window changes size
var LRmargin = width / 100;
var TBmargin = height / 100;
var windowZeroX = LRmargin*12;
var windowZeroY = TBmargin*7;
var windowW = width - LRmargin*14;
var windowH = height - TBmargin*9;
var lineSpace = (windowH - TBmargin*4) / ((endTime-startTime) * 60 / smallLines);
var blockWidth = (windowW - LRmargin*10) / 7;
var blockSpace = (windowW - LRmargin*6) / 7;
var minuteLength = lineSpace / smallLines;
var blockX = windowZeroX+LRmargin*5;
var blockY = windowZeroY+TBmargin;

var aniColors = {
    red:        color(255, 0, 0),
    orange:     color(255, 148, 8),
    yellow:     color(255, 255, 0),
    green:      color(41,  186, 28),
    lime:       color(0,   255, 0),
    blue:       color(0,   0,   255),
    cyan:       color(0,   255, 255),
    purple:     color(157, 0,   255),
    magenta:    color(255, 0,   255),
    brown:      color(158, 87,  29),
    white:      color(255),
    black:      color(0),
    ltgrey:     color(180),
    grey:       color(120),
    dkgrey:     color(80)
};

var Block = function(name, day, start, duration, color) {
    this.name = name;
    this.day = day;
    this.start = start;
    this.duration = duration;
    this.color = color;
};

Block.prototype.draw = function(id) {
    if ((shownDay === 8 || shownDay === this.day) /*&& this.start > startTime*/) {
        stroke(aniColors.black);
        strokeWeight(1);
        fill(this.color);
        var x;
        var y = blockY + ((this.start - startTime) * 60 * minuteLength);
        var w;
        var h = this.duration*minuteLength;
        if (shownDay === 8) {
            x = blockX + (blockSpace * (this.day - 1));
            w = blockWidth;
            rect(x, y, w, h);
        } else {
            x = blockX;
            w = blockSpace*7;
            rect(x, y, w, h);
        }
        fill(aniColors.black);
        textSize(TBmargin*2.5);
        text(this.name, x+w/2-textWidth(this.name)/2, y+h*0.6);
        if (arguments.length > 0) {
            textSize(TBmargin*1.5);
            text(id, x+5, y+minuteLength*12);
            text(id, x+w-10, y+h-minuteLength*4);
        }
    }
};

function setup() {
    createCanvas(displayWidth, displayHeight);
    background(aniColors.grey);
    
    startSel = createSelect();
    startSel.position(LRmargin*33.5, TBmargin*2);
    startSel.size(80);
    for (var i = 0; i < 24; i ++) {
        startSel.option(minsToString(i*60));
    }
    startSel.input(setStart);
    
    endSel = createSelect();
    endSel.position(LRmargin*49, TBmargin*2);
    endSel.size(80);
    for (var j = 0; j < 24; j ++) {
        endSel.option(minsToString(j*60));
    }
    endSel.input(setEnd);
    
    divSel = createSelect();
    divSel.position(LRmargin*76.5, TBmargin*2);
    divSel.size(40);
    divSel.option(10);
    divSel.option(15);
    divSel.option(20);
    divSel.option(30);
    divSel.option(60);
    divSel.input(setSubdiv);
    
    daySel = createRadio();
    daySel.position(LRmargin*1.2, TBmargin*15);
    daySel.option("M ", 1);
    daySel.option("T ", 2);
    daySel.option("W ", 3);
    daySel.option("R ", 4);
    daySel.option("F ", 5);
    daySel.option("S ", 6);
    daySel.option("U ", 7);
    daySel.option("Week ", 8);
    daySel.changed(setDay);
    daySel.style("width", "120px");
    
    colorSel = createSelect();
    colorSel.position(LRmargin*3, TBmargin*24);
    for (var p in aniColors) {
        colorSel.option(p);
    }
    
    hrSel = createSlider(0, 23, 9, 1);
    hrSel.position(LRmargin*2.5, TBmargin*30);
    hrSel.style("width", "116px");
    
    minSel = createSlider(0, 59, 0, 1);
    minSel.position(LRmargin*2.5, TBmargin*33);
    minSel.style("width", "116px");
    
    nameIn = createInput();
    nameIn.position(LRmargin*1.5, TBmargin*40);
    nameIn.style("width", "132px");
    
    durSel = createSlider(1, 120, 75, 1);
    durSel.position(LRmargin*1.5, TBmargin*52);
    durSel.style("width", "132px");
    
    mon = createCheckbox("M");
    tue = createCheckbox("T");
    wed = createCheckbox("W");
    thu = createCheckbox("R");
    fri = createCheckbox("F");
    sat = createCheckbox("S");
    sun = createCheckbox("U");
    blockDaySel = [mon, tue, wed, thu, fri, sat, sun];
    
    mon.position(LRmargin*1.5, TBmargin*58.5);
    tue.position(LRmargin*3.7, TBmargin*58.5);
    wed.position(LRmargin*5.9, TBmargin*58.8);
    thu.position(LRmargin*8.1, TBmargin*58.8);
    fri.position(LRmargin*2.1, TBmargin*61);
    sat.position(LRmargin*4.4, TBmargin*61);
    sun.position(LRmargin*6.7, TBmargin*61);
    
    addBlocks = createButton("Add Block(s)");
    addBlocks.position(LRmargin*2.3, TBmargin*65);
    addBlocks.mousePressed(add);
    
    delSel = createSelect();
    for (var i = 0; i < maxBlocks; i ++) {
        delSel.option(i);
    }
    delSel.position(LRmargin*1.2, TBmargin*70);
    
    deleter = createButton("Delete Block");
    deleter.position(LRmargin*3.7, TBmargin*71);
    deleter.mousePressed(deleteBlock);
    
    JSONSaver = createButton("Save as a JSON File");
    JSONSaver.position(LRmargin*1.35, TBmargin*75);
    
    JSONFile = createInput();
    JSONFile.position(LRmargin*1.4, TBmargin*82);
    JSONFile.style("width", "132px");
    
    JSONLoader = createButton("Load as a JSON File");
    JSONLoader.position(LRmargin*1.35, TBmargin*85);
    JSONLoader.mousePressed(loadJSONFile);
}

function minsToString(min, twentyFourH) {
    var time = "";
    var h = floor(min/60);
    var m = min%60;
    var append = "";
    if (h === 0) {
        if (twentyFourH === false || arguments.length < 2) {
            time += "12:";
            append = " AM";
        } else {
            time += "00:";
        }
    } else if (h >= 24) {
        h -= 24;
        return minsToString(h*60 + m);
    } else if ((twentyFourH === false || arguments.length < 2) && h > 12) {
        h -= 12;
        append = " PM";
    } else if ((twentyFourH === false || arguments.length < 2) && h < 12) {
        append = " AM";
    } else if ((twentyFourH === false || arguments.length < 2) && h == 12) {
        append = " PM";
    }
    if (h > 0) {
        if (h < 10) {
            time += "0";
        }
        time += h + ":";
    }
    if (m < 10) {
        time += "0";
    }
    time += m + append;
    return time;
}

function stringToMins(str) {
    var noApp = split(str, " ");
    var parts = split(noApp[0], ":");
    parts[0] = int(parts[0]);
    parts[1] = int(parts[1]);
    if (noApp.length > 1) {
        if (noApp[1] === "PM" && parts[0] < 12) {
            parts[0] += 12;
        } else if (noApp[1] === "AM" && parts[0] === 12) {
            parts[0] -= 12;
        }
    }
    return parts[0]*60 + parts[1];
}

function minsToHrs(min) {
    var h = floor(min/60);
    var m = min%60;
    return (h + (m/60));
}

function setStart() {
    startTime = stringToMins(startSel.value()) / 60;
}

function setEnd() {
    endTime = stringToMins(endSel.value()) / 60;
}

function setSubdiv() {
    smallLines = int(divSel.value());
}

function setDay() {
    shownDay = int(daySel.value());
}

function add() {
    for (var i = 1; i <= blockDaySel.length; i ++) {
        if (blockDaySel[i-1].checked()) {
            blocks.push(new Block(nameIn.value(), i, minsToHrs(hrSel.value()*60 + minSel.value()),
                                    durSel.value(), aniColors[colorSel.value()]));
        }
    }
}

function deleteBlock() {
    if (blocks.length > int(delSel.value())) {
        blocks.splice(int(delSel.value()), 1);
    }
}

let data = {};
let url = "https://raw.githubusercontent.com/AgentLuigi3/randomFiles/master/JSON%20Files/data.json";

function loadJSONFile() {
    loadJSON(JSONFile.value(), addJSONData);
}
    
function addJSONData(data) {
    let JSONBlocks = data['blocks'];
    for (var jb in JSONBlocks) {
        var b = JSONBlocks[jb]
        var name = b['name'];
        var day = b['day'];
        var start = minsToHrs(stringToMins(b['start']));
        var dur = b['duration'];
        var col = b['color'];
        blocks.push(new Block(name, day, start, dur, aniColors[col]));
    }
}

var testBlock = new Block("TEST", 5, 14.75, 120, aniColors.cyan);
var testA = new Block("Math", 1, 10.5, 75, aniColors.red);
var testB = new Block("Math", 3, 10.5, 75, aniColors.red);
var testC = new Block("Japanese", 1, 12.5, 75, aniColors.lime);
var testD = new Block("Japanese", 3, 12.5, 75, aniColors.lime);
var testE = new Block("Japanese REC", 2, 9.5, 75, aniColors.lime);
var testF = new Block("Japanese REC", 4, 9.5, 75, aniColors.lime);
var testG = new Block("Writing", 2, 11, 75, aniColors.blue);
var testH = new Block("Writing", 4, 11, 75, aniColors.blue);
var testI = new Block("Lunch", 5, 11.75, 30, aniColors.brown);
var tests = [testA, testB, testC, testD, testE, testF, testG, testH, testI];

function draw() {
    // Redraw background
    background(aniColors.grey);
    
    // Recalculate ratios
    LRmargin = width / 100;
    TBmargin = height / 100;
    windowZeroX = LRmargin*12;
    windowZeroY = TBmargin*7;
    windowW = width - LRmargin*14;
    windowH = height - TBmargin*9;
    lineSpace = (windowH - TBmargin*4) / ((endTime-startTime) * 60 / smallLines);
    blockWidth = (windowW - LRmargin*10) / 7;
    blockSpace = (windowW - LRmargin*6) / 7;
    minuteLength = lineSpace / smallLines;
    blockX = windowZeroX+LRmargin*5;
    blockY = windowZeroY+TBmargin;
    
    // Reposition buttons and other elements
    startSel.position(LRmargin*33.5, TBmargin*2);
    endSel.position(LRmargin*49, TBmargin*2);
    divSel.position(LRmargin*76.5, TBmargin*2);
    daySel.position(LRmargin*1.2, TBmargin*15);
    colorSel.position(LRmargin*3.2, TBmargin*27);
    hrSel.position(LRmargin*2.5, TBmargin*31.7);
    minSel.position(LRmargin*2.5, TBmargin*34.7);
    nameIn.position(LRmargin*1.5, TBmargin*45);
    durSel.position(LRmargin*1.5, TBmargin*51);
    
    mon.position(LRmargin*1.5, TBmargin*58.5);
    tue.position(LRmargin*3.7, TBmargin*58.5);
    wed.position(LRmargin*5.9, TBmargin*58.8);
    thu.position(LRmargin*8.1, TBmargin*58.8);
    fri.position(LRmargin*2.1, TBmargin*61);
    sat.position(LRmargin*4.4, TBmargin*61);
    sun.position(LRmargin*6.7, TBmargin*61);
    
    addBlocks.position(LRmargin*2.8, TBmargin*64.5);
    delSel.position(LRmargin*1.3, TBmargin*71);
    deleter.position(LRmargin*3.7, TBmargin*71);
    JSONSaver.position(LRmargin*1.35, TBmargin*75);
    JSONFile.position(LRmargin*1.4, TBmargin*82);
    JSONLoader.position(LRmargin*1.35, TBmargin*85);
    
    // Draw week window
    fill(aniColors.white);
    rect(windowZeroX, windowZeroY, windowW, windowH);
    
    textSize(TBmargin*1.5);
    strokeWeight(1);
    // Draw lines in week window
    for (var t = startTime*60; t <= endTime*60; t += smallLines) {
        var time = minsToString(t, false);
        var lineY = windowZeroY+TBmargin+(lineSpace*((t-startTime*60)/smallLines));
        strokeWeight(1);
        fill(0);
        if ((t - startTime*60) % 60 === 0) {
            text(time, windowZeroX+LRmargin/2, lineY+TBmargin/2);
        }
        stroke(aniColors.black);
        if (t%bigLines === 0) {
            strokeWeight(3);
        } else {
            strokeWeight(1);
        }
        line(windowZeroX+LRmargin*5, lineY, windowZeroX+windowW-LRmargin, lineY);
    }
    
    // Draw blocks
    for (b in blocks) {
        blocks[b].draw(b);
    }
    
    // Debug blocks
    /*
    //testBlock.draw();
    for (t in tests) {
        tests[t].draw();
    }
    //text("TEST", 860.3557142857142, 367.1454166666667);
    //*/
    
    // Draw top/side option bars
    stroke(0);
    fill(aniColors.ltgrey);
    rect(LRmargin*15, TBmargin, width - (LRmargin*24), TBmargin*5);
    rect(LRmargin, TBmargin*11, LRmargin*10, height - (TBmargin*20));
    strokeWeight(1);
    line(LRmargin, TBmargin*24, LRmargin*11, TBmargin*24);
    line(LRmargin, TBmargin*68, LRmargin*11, TBmargin*68);
    line(LRmargin, TBmargin*74, LRmargin*11, TBmargin*74);
    
    // Fill in text for top bar
    fill(aniColors.black);
    strokeWeight(1);
    textSize(TBmargin*3);
    text("This schedule starts at \t\t\t\t\t\t and ends at \t\t\t\t\t\t . " + 
         "There are small lines every \t\t\t minutes.", LRmargin*16, TBmargin*4);
    
    // Fill in text for side bar
    textSize(TBmargin*2.5);
    text("Show Day", LRmargin*2, TBmargin*14);
    textSize(TBmargin*2);
    text("Pick Color", LRmargin*2.9, TBmargin*26);
    text("Pick Start Time", LRmargin*2, TBmargin*31);
    text("h\nm", LRmargin*1.2, TBmargin*34);
    textSize(TBmargin*3);
    text(minsToString(hrSel.value()*60 + minSel.value()), LRmargin*2, TBmargin*40);
    textSize(TBmargin*2);
    text("Enter Name", LRmargin*2.5, TBmargin*43);
    text("Pick Duration", LRmargin*2.3, TBmargin*50);
    text(durSel.value() + " minute(s)", LRmargin*2.4, TBmargin*55.5);
    text("Pick Day(s)", LRmargin*3.1, TBmargin*58);
    text("Pick ID to Delete", LRmargin*1.6, TBmargin*70);
    text("Enter JSON Path", LRmargin*1.5, TBmargin*80)
    
    // Draw rectangles to preserve background over blocks
    noStroke();
    fill(aniColors.grey);
    rect(windowZeroX, windowZeroY+windowH, windowZeroX+windowW, height);
    rect(LRmargin*15, 0, width - (LRmargin*24), TBmargin-1);
    rect(LRmargin*15, TBmargin*6+1, width - (LRmargin*15), windowZeroY-TBmargin*6-1);
    rect(LRmargin*91+1, 0, width-(LRmargin*76), TBmargin*7)
}