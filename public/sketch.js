var nameX = 100;
var nameBarGap = 15;
var gapX = 4;
var startY = 30;
var stepY = 20;
var rectSize = 14;
var rectOutlineSize = 1;
var shapeFillDark;
var shapeFillLight;
var shapeStroke;
var labelSize = 12; // should be an even int
var minStreakToDraw = 0;
var teams = 30;
var labelColorMain;
var labelColorInverse;

function setup() {
  createCanvas(400, startY*2 + stepY*(teams-2) + rectSize);
  background(220);
  loadJSON("season-current.json", drawData);
    shapeFillDark = color(0, 75, 150);
    shapeFillLight = color(200, 200, 200);
  shapeStroke = color(100, 100, 100);
  labelColorMain = color(30, 30, 30);
    labelColorInverse = color(200, 200, 200);
    console.log("starting from heroku v2");
}

function drawData(data) {
  var teams = data.teams;
  teams.sort(function (a, b) {
    if (a.current_streak != b.current_streak) {
      return parseFloat(b.current_streak) - parseFloat(a.current_streak);
    } else {
      return parseFloat(b.longest_streak) - parseFloat(a.longest_streak);
    }
  });
  var rowsDrawn = 0;
  var teamsUnderMin = 0;
  var currentY = 0;
  for (var i = 0; i < teams.length; i++) {
    var abbrev = teams[i].abbrev;
    var currentStreak = teams[i].current_streak;
    var longestStreak = teams[i].longest_streak;
    currentY = startY + stepY * rowsDrawn;
    if (currentStreak >= minStreakToDraw) {
      textSize(labelSize);
      fill(labelColorMain);
      noStroke();
        text(abbrev, nameX - textWidth(abbrev), currentY);
        if (currentStreak === longestStreak) {
            drawStreak("currentAndLongest", 0, currentStreak, nameX + nameBarGap, currentY);
        }
        else {
            drawStreak("current", 0, currentStreak, nameX + nameBarGap, currentY);
            drawStreak("longest", currentStreak, longestStreak, nameX + nameBarGap, currentY);
        }
      rowsDrawn++;
    } else {
      teamsUnderMin++;
    }
  }
  //fill(labelColorMain);
  //var minLabel = teamsUnderMin + " teams";
  //text(minLabel, nameX - textWidth(minLabel), currentY);
  //stroke(shapeStroke);
  //strokeWeight(rectOutlineSize);
  //rect(nameX + (nameBarGap / 2) + 1, currentY - 16, 1, rectSize); // FIXME: this is a hack!!
  //textStyle(ITALIC);
  //noStroke();
  //text("no current streak", nameX + nameBarGap, currentY);
    fill(labelColorMain);
    textSize(labelSize - 3);
    textAlign(RIGHT);
    text("last updated " + data.file_last_update, width-10, height-10);
}

function drawStreak(type, s, n, x, y) {
  var labelColor;
  if (type == "longest") {
      noStroke();
      fill(shapeFillLight);
    labelColor = labelColorMain;
  } else {
    noStroke();
    fill(shapeFillDark);
    labelColor = labelColorInverse;
  }
  var i = s;
  while (i < n) {
    var xPos = x + ((rectSize + gapX) * i);
    var yPos = y;
    rect(xPos - (rectSize / 2), yPos - ((textAscent(n) - 2) / 2) - (rectSize / 2), rectSize, rectSize);
    //    rect(xPos + (textWidth(n) / 2) - (rectSize / 2), yPos - ((textAscent(n) - 2) / 2) - (rectSize / 2), rectSize, rectSize);
    if (i + 1 == n) {
      noStroke();
      fill(labelColor);
      text(n, xPos - (textWidth(n) / 2), yPos);
    }
    i++;
  }
}
