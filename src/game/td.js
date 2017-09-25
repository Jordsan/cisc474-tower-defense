
/* --- TO DO ---


- SCORE

- GAME OVER

- MONEY
    - on monster kill increase money

- TOWERS
    - on click of button, drag(?) to point
      and spawn at location you want
    - decrease money
    - collision detection of shooting monsters


- overwrite monster array each level
    = add in "alive" property to monsters
    - set alive to false when reaches end
    - set alive to false when health <= 0 


- need to remove red on F tile at end


*/

var mapArray = [
    [1, 1, "S", 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, "F", 1, 1, 1, 1, 1, 1, 1, 1, 1]
];


// 0 = road (monster path)
// S = start point
// F = finish point
// 1 = grass / dirt
// 2 = monster
// 3+ = towers

var gameLives = 25;
var gameScore = 0;
var gameTime = 0;
var monsterCount = 0;

var monsterArray = [];


class Point {
    constructor(i, j) {
        this.i = i;
        this.j = j;
    }
}

class Monster {
    constructor(id, health, currLoc, oldLoc) {
        this.id = id;
        this.health = health;
        this.currLoc = currLoc;
        this.oldLoc = oldLoc;
        this.isAlive = true;
    }
}

$(document).ready(function () {
    var mapHtml = "";
    for (var i = 0; i < mapArray.length; i++) {
        mapHtml += '<div class="row" id="row-' + i + '">';
        for (var j = 0; j < mapArray[i].length; j++) {
            mapHtml += '<span class="column" id="' + i + '-' + j + '">' + mapArray[i][j] + '</span>';
        }
        mapHtml += '</div>';
    }

    $("#map-div").html(mapHtml);

    function pad(val) { return val > 9 ? val : "0" + val; }
    setInterval(function () {
        $("#seconds").html(pad(++gameTime % 60));
        $("#minutes").html(pad(parseInt(gameTime / 60, 10)));
    }, 1000);

    // game loop
    setInterval(function () {
        if (monsterArray.length > 0) {
            for (var i = 0; i < monsterArray.length; i++) {
                var currI = monsterArray[i].currLoc.i;
                var currJ = monsterArray[i].currLoc.j;
                var oldI = monsterArray[i].oldLoc.i;
                var oldJ = monsterArray[i].oldLoc.j;

                if (mapArray[currI][currJ] == "F") {

                    if (monsterArray[i].isAlive){
                        gameLives--;                        
                    }
                    monsterArray[i].isAlive = false;

                }

                // move left
                if (currJ - 1 >= 0) {
                    if (mapArray[currI][currJ - 1] == 0) {
                        if (oldJ != currJ - 1) {
                            monsterArray[i].oldLoc.j = currJ;
                            monsterArray[i].oldLoc.i = currI;
                            monsterArray[i].currLoc.j = currJ - 1;
                        }
                    }
                }
                // move right
                if (currJ + 1 <= 11) {
                    if (mapArray[currI][currJ + 1] == 0) {
                        if (oldJ != currJ + 1) {
                            monsterArray[i].oldLoc.j = currJ;
                            monsterArray[i].oldLoc.i = currI;
                            monsterArray[i].currLoc.j = currJ + 1;
                        }
                    }
                }
                // move down
                if (currI + 1 <= 11) {
                    if (mapArray[currI + 1][currJ] == 0 ||
                        mapArray[currI + 1][currJ] == "F") {
                        if (oldI != currI + 1) {
                            monsterArray[i].oldLoc.j = currJ;
                            monsterArray[i].oldLoc.i = currI;
                            monsterArray[i].currLoc.i = currI + 1;
                        }
                    }
                    
                }

                //jquery css update
                $("#" + currI + "-" + currJ).addClass("redBackground");
                
                //if (mapArray[currI][currJ] == "F"){
                  //  $("#" + currI + "-" + currJ).removeClass("redBackground");                    
                //}
                //else {
                    $("#" + oldI + "-" + oldJ).removeClass("redBackground");                    
                //}

                
            }
        }



        if (monsterCount < 2) {
            if (mapArray[0][2] == "S") {
                monsterArray[monsterCount] = new Monster(0, 5, new Point(0, 2), new Point(0, 0));
            }
            monsterCount++;
        }

        console.log("Monster Loc 1: ");
        console.log("    I: " + monsterArray[0].currLoc.i + "    J: " + monsterArray[0].currLoc.j);
        console.log("Monster Loc 2: ");
        console.log("    I: " + monsterArray[1].currLoc.i + "    J: " + monsterArray[1].currLoc.j);


        $("#score-value").html(gameScore);
        $("#lives-value").html(gameLives);
    }, 500);
});