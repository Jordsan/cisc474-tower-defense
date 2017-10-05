
/* --- TO DO ---


- make classes non regular classes, use weird js classes

- MAKE SECOND MAP
    - maybe harder ?


- TOWERS
    - add different types:
        - attack speed
        - attack range
    
    
    - upgrades (ties into tower details) 
        - when you click on a tower that you have placed on the map a little tower details box appears
            - the tower details box has the same thing as listed below here V
                but instead of the gold cost to build it, theres a gold cost to upgrade it
            - you can click on the upgrade button to upgrade the tower
                - potentially show what stats change when upgrading?

    - tower details (low priority)
        - when you hover your mouse over a tower in the menu you get a quick
            summary of the tower's stats
            - ex gold cost, damage, attack rate, range, special ability, etc

    - sell tower (low priority)
        - click on a tower and a sell tower button appears


- MONSTERS
    - different types:
        - speed differences?

- animations
    - add in shooting animations 
        - each tower might have differnet shooting animation / sprite
    - towers face direction they are shooting (8 adjacent directions)
        - 8 different sprites for every tower


- home base image
    - death animation when enemy reaches base?


*/

class Tile {
    constructor(val, monster, direction) {
        this.val = val;
        this.monster = monster;
        this.direction = direction;
    }
}


// make this right and left not horizontal

var mapArray = [
    [1, 1, new Tile(0, null, "vertical"), 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, new Tile(0, null, "vertical"), 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, new Tile(0, null, "bottom_left"), new Tile(0, null, "right"), new Tile(0, null, "right"),
        new Tile(0, null, "right"), new Tile(0, null, "right"), new Tile(0, null, "right"), new Tile(0, null, "right"), new Tile(0, null, "top_right"), 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, new Tile(0, null, "vertical"), 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, new Tile(0, null, "vertical"), 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, new Tile(0, null, "vertical"), 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, new Tile(0, null, "vertical"), 1, 1],
    [1, 1, new Tile(0, null, "top_left"), new Tile(0, null, "left"), new Tile(0, null, "left"), new Tile(0, null, "left"), 
        new Tile(0, null, "left"), new Tile(0, null, "left"), new Tile(0, null, "left"), new Tile(0, null, "bottom_right"), 1, 1],
    [1, 1, new Tile(0, null, "vertical"), 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, new Tile(0, null, "vertical"), 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, new Tile(0, null, "vertical"), 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, new Tile("F", null, "base"), 1, 1, 1, 1, 1, 1, 1, 1, 1]
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
var gameMoney = 30;
var gameLevel = 0;
var monsterCount = 0;
var monstersPerLevel = 2;
var killCount = 0;
var SelectedTowerId;
var monsterArray = [];
var nextLevel = false;
var gameOver = false;
var topOffset = 0;
var leftOffset = 0;

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
    $("#next-level-button").hide();
    $("#game-over-button").hide();
    var mapHtml = "";
    for (var i = 0; i < mapArray.length; i++) {
        mapHtml += '<div class="row" id="row-' + i + '">';
        for (var j = 0; j < mapArray[i].length; j++) {
            if (mapArray[i][j] == 1) {
                mapHtml += '<span class="column buildable" id="' + i + '-' + j + '">' + '</span>';
            }
            else {
                mapHtml += '<span class="column path ';

                switch(mapArray[i][j].direction){
                    case "top_left":
                        mapHtml += "top_left";
                        break;
                    case "top_right":
                        mapHtml += "top_right";
                        break;
                    case "bottom_left":
                        mapHtml += "bottom_left";
                        break;
                    case "bottom_right":
                        mapHtml += "bottom_right";
                        break;
                    case "vertical":
                        mapHtml += "vertical";
                        break;
                    case "right":
                        mapHtml += "horizontal";
                        break;
                    case "left":
                        mapHtml += "horizontal";
                        break;
                    default:
                        break;
                }
                
                mapHtml += '" id="' + i + '-' + j + '">' + '</span>';
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
        monsterArray = new Array();
        monsterCount = 0;
        killCount = 0;   
        gameMoney += (gameLevel + 1) * 3;     
        gameLevel += 1;
        
        nextLevel = false;
    });

    $("#game-over-button").click(function () {
        location.reload(true);
    });

    // game loop
    setInterval(function () {
        if (killCount >= monstersPerLevel) {
            nextLevel = true;
        }

        if (gameLives <= 0) {
            gameOver = true;
        }

        if (nextLevel){
            if (!gameOver){
                $("#next-level-button").show();                
            }
        }
        else {
            $("#next-level-button").hide();            
        }   

        if (gameOver) {
            $("#game-over-button").show();
        }
        else {
            $("#game-over-button").hide();
        }   

        if (monsterCount < monstersPerLevel) {
            monsterArray[monsterCount] = new Monster((gameLevel + 1), (gameLevel + 1) * 4, new Point(0, 2), new Point(0, 0));

            $("#monster-div").append(
                '<div class="monsterDiv monster-level-' + (gameLevel % 5) + '_S" id="monster-' + (monsterCount + 1) + '"></div>'
            );

            topOffset = $("#map-div").position().top;
            leftOffset = $("#map-div").position().left + $("#map-div").offset().left + $("#0-2").position().left;

            $("#monster-" + (monsterCount + 1)).css('top', topOffset);
            $("#monster-" + (monsterCount + 1)).css('left', leftOffset);            
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
                        gameMoney += (gameLevel + 1);
                        gameScore += 10 * (gameLevel + 1);
                        killCount += 1;
                    }
                    monsterArray[i].isAlive = false;
                }
                var direction = "";
                //jquery css update
                if (monsterArray[i].isAlive) {
                    switch (mapArray[currI][currJ].direction) {
                        case "top_left":
                            direction = "top_left";
                            $("#monster-" + (i + 1)).addClass("monster-level-" + (gameLevel % 5) + "-S")
                                .removeClass("monster-level-" + (gameLevel % 5) + "-W");
                            $("#monster-" + (i + 1)).animate({top:'+=50px'}, 500, 'linear'); 
                            break;
                        case "top_right":
                            direction = "top_right";
                            $("#monster-" + (i + 1)).addClass("monster-level-" + (gameLevel % 5) + "-S")
                                .removeClass("monster-level-" + (gameLevel % 5) + "-E");
                            $("#monster-" + (i + 1)).animate({top:'+=50px'}, 500, 'linear'); 
                            break;
                        case "bottom_left":
                            direction = "right";
                            $("#monster-" + (i + 1)).addClass("monster-level-" + (gameLevel % 5) + "-E")
                                .removeClass("monster-level-" + (gameLevel % 5) + "-S");
                            $("#monster-" + (i + 1)).animate({left: '+=50px'}, 500, 'linear');    
                            break;
                        case "bottom_right":
                            direction = "bottom_right";
                            $("#monster-" + (i + 1)).addClass("monster-level-" + (gameLevel % 5) + "-W")
                                .removeClass("monster-level-" + (gameLevel % 5) + "-S");
                            $("#monster-" + (i + 1)).animate({left: '-=50px'}, 500, 'linear');
                            break;
                        case "vertical":
                            direction = "vertical";
                            $("#monster-" + (i + 1)).addClass("monster-level-" + (gameLevel % 5) + "-S")
                                .removeClass("monster-level-" + (gameLevel % 5) + "-SW")
                                .removeClass("monster-level-" + (gameLevel % 5) + "-SE");
                            $("#monster-" + (i + 1)).animate({top:'+=50px'}, 500, 'linear'); 
                            break;
                        case "right":
                            direction = "right";
                            $("#monster-" + (i + 1)).addClass("monster-level-" + (gameLevel % 5) + "-E");
                            $("#monster-" + (i + 1)).animate({left: '+=50px'}, 500, 'linear');            
                            break;
                        case "left":
                            direction = "left";
                            $("#monster-" + (i + 1)).addClass("monster-level-" + (gameLevel % 5) + "-W");
                            $("#monster-" + (i + 1)).animate({left: '-=50px'}, 500, 'linear'); 
                            break;
                        default:
                            break;
                    }
                    
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
        $("#level-value").html(gameLevel + 1);

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
                    $(this).addClass("tile-tower");

                    gameMoney -= 10;
                }
            }
            else if (SelectedTowerId == "tower2") {
                if (gameMoney >= 20) {
                    var pos = this.id.split("-");
                    mapArray[pos[0]][pos[1]] = 4;
                    towerArray.push(new Tower(pos[0], pos[1], 4, 2));
                    $(this).removeClass("buildable");
                    $(this).addClass("tower2");
                    $(this).addClass("tile-tower");

                    gameMoney -= 20;
                }

            }
            else if (SelectedTowerId == "tower3") {
                if (gameMoney >= 30) {
                    var pos = this.id.split("-");
                    mapArray[pos[0]][pos[1]] = 5;
                    towerArray.push(new Tower(pos[0], pos[1], 5, 4));
                    $(this).removeClass("buildable");
                    $(this).addClass("tower3");
                    $(this).addClass("tile-tower");

                    gameMoney -= 30;
                }

            }
            else if (SelectedTowerId == "tower4") {
                if (gameMoney >= 40) {
                    var pos = this.id.split("-");
                    mapArray[pos[0]][pos[1]] = 6;
                    towerArray.push(new Tower(pos[0], pos[1], 6, 8));
                    $(this).removeClass("buildable");
                    $(this).addClass("tower4");
                    $(this).addClass("tile-tower");

                    gameMoney -= 40;
                }

            }
            else if (SelectedTowerId == "tower5")
            {
                var pos = this.id.split("-");
                mapArray[pos[0]][pos[1]] = 7;
                towerArray.push(new Tower (pos[0], pos[1], 7, 16));
                $(this).removeClass("buildable");
                $(this).addClass("tower5");
                $(this).addClass("tile-tower");

                gameMoney -= 50;
            }
            chosenTower = false;
        }
    });
});

