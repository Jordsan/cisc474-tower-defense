
/* --- TO DO ---


- make classes non regular classes, use weird js classes


- css needs to not just collapse on window size change


- SCORE

- GAME OVER

- MONEY
    - on monster kill increase money

- TOWERS
    - decrease money
    - collision detection of shooting monsters
    

    - TOWER PSEUDO CODE:
        when you place a tower:
            add to tower array
                tower has position
            subtract money
        loop through all towers (inside of main game loop)
            for each tower:
                check its 1/2? adjacent tiles for a monster
                    if there is a monster within range
                        choose random monster?
                            (in future maybe choose furthest monster)
                            "shoot" monster
                            set monster in specific position to be dead / subtract health
                        after shooting:
                            wait X game ticks before being able to shoot again?


- overwrite monster array each level
    = add in "alive" property to monsters
    - set alive to false when reaches end
    - set alive to false when health <= 0 

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
// 3 = tower 1;
// 4 = tower 2;
// 5 = tower 3;
// 6 = tower 4;

var chosenTower = false;
var gameLives = 25;
var gameScore = 0;
var gameTime = 0;
var gameMoney = 100;
var gameLevel = 1;
var monsterCount = 0;
var SelectedTowerId;
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

class Tower{
    constructor(id, damage) {
        this.id = id;
        this.numLives = damage;
    }
}
 
$(document).ready(function () {
    var mapHtml = "" ;
    for (var i = 0; i < mapArray.length; i++) {
        mapHtml += '<div class="row" id="row-' + i + '">';
        for (var j = 0; j < mapArray[i].length; j++) {
            if (mapArray[i][j] == 1) {
                mapHtml += '<span class="column buildable" id="' + i + '-' + j + '">' + '</span>';                
            }
            else {
                mapHtml += '<span class="column path" id="' + i + '-' + j + '">' + '</span>';
            }
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
                    //oldI = currI;
                    //oldJ = currJ;
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
                    if (mapArray[currI + 1][currJ] == 0||
                        mapArray[currI + 1][currJ] == "F") {
                        if (oldI != currI + 1) {
                            monsterArray[i].oldLoc.j = currJ;
                            monsterArray[i].oldLoc.i = currI;
                            monsterArray[i].currLoc.i = currI + 1;
                        }
                    }
                }

                //jquery css update
                if (monsterArray[i].isAlive){
                    $("#" + currI + "-" + currJ).addClass("monsterPic");
                }
                $("#" + oldI + "-" + oldJ).removeClass("monsterPic");
            }
        }



        if (monsterCount < 10) {
            if (mapArray[0][2] == "S") {
                monsterArray[monsterCount] = new Monster(0, 5, new Point(0, 2), new Point(0, 0));
            }
            monsterCount++;
        }

        //console.log("Monster Loc 1: ");
        //console.log("    I: " + monsterArray[0].currLoc.i + "    J: " + monsterArray[0].currLoc.j);
        //console.log("Monster Loc 2: ");
        //console.log("    I: " + monsterArray[1].currLoc.i + "    J: " + monsterArray[1].currLoc.j);

        $("#score-value").html(gameScore);
        $("#lives-value").html(gameLives);
        $("#money-value").html(gameMoney);
        $("#level-value").html(gameLevel);
    }, 500);

    $(".tower-button").click( function(){
        chosenTower = true;
        SelectedTowerId = (this).id;
    });


    $("#main-menu-button").click(function(){
        console.log(mapArray);
    });

    $(".buildable").click(function(){
        if (!chosenTower){
            return;
        }
        else{
            if (SelectedTowerId == "tower1")
            {
                var pos = this.id.split("-");
                mapArray[pos[0]][pos[1]] = 3;
                $(this).removeClass("buildable");
                $(this).addClass("tower1");
            }
            else if (SelectedTowerId == "tower2")
            {
                var pos = this.id.split("-");
                mapArray[pos[0]][pos[1]] = 4;
                $(this).removeClass("buildable");
                $(this).addClass("tower2");
            }
            else if (SelectedTowerId == "tower3")
            {
                var pos = this.id.split("-");
                mapArray[pos[0]][pos[1]] = 5;
                $(this).removeClass("buildable");
                $(this).addClass("tower3");
            }
            else if (SelectedTowerId == "tower4")
            {
                var pos = this.id.split("-");
                mapArray[pos[0]][pos[1]] = 6;
                $(this).removeClass("buildable");
                $(this).addClass("tower4");
            }
            chosenTower = false;
        }
    });
});

