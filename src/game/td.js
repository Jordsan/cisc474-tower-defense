
/* --- TO DO ---


- make classes non regular classes, use weird js classes

- css needs to not just collapse on window size change


- MAKE SECOND MAP
    - maybe harder ?


- GAME OVER


- TOWERS
    - add different types:
        = damage
        - attack speed
        - attack range
        - upgrades


- MONSTERS
    - different types:
        = health
        - gold value
        - speed


- animations
    - just add in translations now


*/

class Tile {
    constructor(val, monster) {
        this.val = val;
        this.monster = monster;
    }
}

var mapArray = [
    [1, 1, new Tile(0, null), 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, new Tile(0, null), 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, new Tile(0, null), new Tile(0, null), new Tile(0, null),
        new Tile(0, null), new Tile(0, null), new Tile(0, null), new Tile(0, null), new Tile(0, null), 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, new Tile(0, null), 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, new Tile(0, null), 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, new Tile(0, null), 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, new Tile(0, null), 1, 1],
    [1, 1, new Tile(0, null), new Tile(0, null), new Tile(0, null), new Tile(0, null), new Tile(0, null), new Tile(0, null), new Tile(0, null), new Tile(0, null), 1, 1],
    [1, 1, new Tile(0, null), 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, new Tile(0, null), 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, new Tile(0, null), 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, new Tile("F", null), 1, 1, 1, 1, 1, 1, 1, 1, 1]
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
// 7 = tower 5;

var towerArray = [];

var chosenTower = false;
var gameLives = 25;
var gameScore = 0;
var gameTime = 0;
var gameMoney = 100;
var gameLevel = 1;
var monsterCount = 0;
var monstersPerLevel = 5;
var killCount = 0;
var SelectedTowerId;
var monsterArray = [];
var nextLevel = false;

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

class Tower {
    constructor(i, j, id, damage) {
        this.i = i;
        this.j = j;
        this.id = id;
        this.damage = damage;
    }
}

$(document).ready(function () {
    var mapHtml = "";
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

    $("#next-level-button").click(function () {
        console.log(mapArray);
        console.log(towerArray);
        console.log(monsterArray);

        monsterArray = new Array();
        monsterCount = 0;
        killCount = 0;        
        gameLevel += 1;

        nextLevel = false;
    });


    // game loop
    setInterval(function () {
        if (killCount >= monstersPerLevel) {
            nextLevel = true;
        }

        if (nextLevel){
            $("#next-level-button").show();
        }
        else {
            $("#next-level-button").hide();            
        }

        if (monsterCount < monstersPerLevel) {
            monsterArray[monsterCount] = new Monster(0, 2, new Point(0, 2), new Point(0, 0));

            $("#monster-div").append(
                '<div class="monsterDiv monsterPic" id="monster-' + (monsterCount + 1) + '"></div>'
            );

            $("#monster-" + (monsterCount + 1)).css('top', 0);
            $("#monster-" + (monsterCount + 1)).css('left', 150);            
            monsterCount++;
        }

        if (monsterArray.length > 0) {
            for (var i = 0; i < monsterArray.length; i++) {
                var currI = monsterArray[i].currLoc.i;
                var currJ = monsterArray[i].currLoc.j;
                var oldI = monsterArray[i].oldLoc.i;
                var oldJ = monsterArray[i].oldLoc.j;



                if (mapArray[currI][currJ].val == "F") {
                    if (monsterArray[i].isAlive) {
                        gameLives--;
                        killCount += 1;
                    }
                    monsterArray[i].isAlive = false;
                }

                // move left
                if (currJ - 1 >= 0) {
                    if (mapArray[currI][currJ - 1].val == 0 ||
                        mapArray[currI][currJ - 1].val == 2) {
                        if (oldJ != currJ - 1) {
                            monsterArray[i].oldLoc.j = currJ;
                            monsterArray[i].oldLoc.i = currI;
                            monsterArray[i].currLoc.j = currJ - 1;
                        }
                    }
                }
                // move right
                if (currJ + 1 <= 11) {
                    if (mapArray[currI][currJ + 1].val == 0 ||
                        mapArray[currI][currJ + 1].val == 2) {
                        if (oldJ != currJ + 1) {
                            monsterArray[i].oldLoc.j = currJ;
                            monsterArray[i].oldLoc.i = currI;
                            monsterArray[i].currLoc.j = currJ + 1;
                        }
                    }
                }
                // move down
                if (currI + 1 <= 11) {
                    if (mapArray[currI + 1][currJ].val == 0 ||
                        mapArray[currI + 1][currJ].val == 2 ||
                        mapArray[currI + 1][currJ].val == "F") {
                        if (oldI != currI + 1) {
                            monsterArray[i].oldLoc.j = currJ;
                            monsterArray[i].oldLoc.i = currI;
                            monsterArray[i].currLoc.i = currI + 1;
                        }
                    }
                }

                if (monsterArray[i].health <= 0) {
                    if (monsterArray[i].isAlive) {
                        gameMoney += 1;
                        gameScore += 10 * gameLevel;
                        killCount += 1;
                    }
                    monsterArray[i].isAlive = false;
                }

                //jquery css update
                if (monsterArray[i].isAlive) {
                    $("#monster-" + (i + 1)).css('top', 50 * currI);
                    $("#monster-" + (i + 1)).css('left', 50 * (currJ + 1)); 
                    mapArray[currI][currJ].val = 2;
                    mapArray[currI][currJ].monster = monsterArray[i];
                }
                else {
                    $("#monster-" + (i + 1)).remove();                    
                }
                mapArray[oldI][oldJ].val = 0;
                mapArray[oldI][oldJ].monster = null;
            }
        }

        

        $.each(towerArray, function (index, value) {
            var towerI = parseInt(value.i);
            var towerJ = parseInt(value.j);
            var validMonsters = [];

            if (towerI - 1 >= 0 && towerJ - 1 >= 0) {
                if (typeof (mapArray[towerI - 1][towerJ - 1]) === 'object') {
                    if (mapArray[towerI - 1][towerJ - 1].val == 2) {
                        validMonsters.push(mapArray[towerI - 1][towerJ - 1].monster);
                    }
                }
            }

            if (towerI - 1 >= 0) {
                if (typeof (mapArray[towerI - 1][towerJ]) === 'object') {
                    if (mapArray[towerI - 1][towerJ].val == 2) {
                        validMonsters.push(mapArray[towerI - 1][towerJ].monster);
                    }
                }
            }

            if (towerI - 1 >= 0 && towerJ + 1 < 12) {
                if (typeof (mapArray[towerI - 1][towerJ + 1]) === 'object') {
                    if (mapArray[towerI - 1][towerJ + 1].val == 2) {
                        validMonsters.push(mapArray[towerI - 1][towerJ + 1].monster);
                    }
                }
            }

            if (towerJ - 1 >= 0) {
                if (typeof (mapArray[towerI][towerJ - 1]) === 'object') {
                    if (mapArray[towerI][towerJ - 1].val == 2) {
                        validMonsters.push(mapArray[towerI][towerJ - 1].monster);
                    }
                }
            }

            if (towerJ + 1 < 12) {
                if (typeof (mapArray[towerI][towerJ + 1]) === 'object') {
                    if (mapArray[towerI][towerJ + 1].val == 2) {
                        validMonsters.push(mapArray[towerI][towerJ + 1].monster);
                    }
                }
            }

            if (towerI + 1 < 12 && towerJ - 1 >= 0) {
                if (typeof (mapArray[towerI + 1][towerJ - 1]) === 'object') {
                    if (mapArray[towerI + 1][towerJ - 1].val == 2) {
                        validMonsters.push(mapArray[towerI + 1][towerJ - 1].monster);
                    }
                }
            }

            if (towerI + 1 < 12) {
                if (typeof (mapArray[towerI + 1][towerJ]) === 'object') {
                    if (mapArray[towerI + 1][towerJ].val == 2) {
                        validMonsters.push(mapArray[towerI + 1][towerJ].monster);
                    }
                }
            }

            if (towerI + 1 < 12 && towerJ + 1 < 12) {
                if (typeof (mapArray[towerI + 1][towerJ + 1]) === 'object') {
                    if (mapArray[towerI + 1][towerJ + 1].val == 2) {
                        validMonsters.push(mapArray[towerI + 1][towerJ + 1].monster);
                    }
                }
            }

            if (validMonsters.length > 0) {
                var randomMonster = Math.floor(Math.random() * validMonsters.length);
                validMonsters[randomMonster].health -= towerArray[index].damage;
            }

        });

        $("#score-value").html(gameScore);
        $("#lives-value").html(gameLives);
        $("#money-value").html(gameMoney);
        $("#level-value").html(gameLevel);

    }, 500);

    $(".tower-button").click(function () {
        chosenTower = true;
        SelectedTowerId = (this).id;
    });


    $(".buildable").click(function () {
        if (!chosenTower) {
            return;
        }
        else {
            if (SelectedTowerId == "tower1") {
                if (gameMoney >= 10) {
                    var pos = this.id.split("-");
                    mapArray[pos[0]][pos[1]] = 3;
                    towerArray.push(new Tower(pos[0], pos[1], 3, 1));
                    $(this).removeClass("buildable");
                    $(this).addClass("tower1");

                    gameMoney -= 10;
                }
            }
            else if (SelectedTowerId == "tower2") {
                if (gameMoney >= 20) {
                    var pos = this.id.split("-");
                    mapArray[pos[0]][pos[1]] = 4;
                    towerArray.push(new Tower(pos[0], pos[1], 4, 1));
                    $(this).removeClass("buildable");
                    $(this).addClass("tower2");

                    gameMoney -= 20;
                }

            }
            else if (SelectedTowerId == "tower3") {
                if (gameMoney >= 30) {
                    var pos = this.id.split("-");
                    mapArray[pos[0]][pos[1]] = 5;
                    towerArray.push(new Tower(pos[0], pos[1], 5, 1));
                    $(this).removeClass("buildable");
                    $(this).addClass("tower3");

                    gameMoney -= 30;
                }

            }
            else if (SelectedTowerId == "tower4") {
                if (gameMoney >= 40) {
                    var pos = this.id.split("-");
                    mapArray[pos[0]][pos[1]] = 6;
                    towerArray.push(new Tower(pos[0], pos[1], 6, 1));
                    $(this).removeClass("buildable");
                    $(this).addClass("tower4");

                    gameMoney -= 40;
                }

            }
            else if (SelectedTowerId == "tower5")
            {
                var pos = this.id.split("-");
                mapArray[pos[0]][pos[1]] = 7;
                towerArray.push(new Tower (pos[0], pos[1], 7, 1));
                $(this).removeClass("buildable");
                $(this).addClass("tower5");
            }
            chosenTower = false;
        }
    });
});

