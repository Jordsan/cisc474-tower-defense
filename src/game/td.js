/*
var mapArray = [];

for(var i = 0; i < 12; i++){
    mapArray[i] = [];    
    for(var j = 0; j < 12; j++){ 
        mapArray[i][j] = 0;    
    }    
}
*/

var mapArray = [
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];


// 0 = road (monster path)
// 1 = grass / dirt
// 2 = monster
// 3+ = towers

var gameLives = 25;
var gameScore = 0;
var gameTime = 0;
var monsterCount = 0;

var monsterArray = [];


class Point {
    constructor(i, j){
        this.i = i;
        this.j = j;
    }
}

class Monster {
    constructor(id, health, currLoc, oldLoc){
        this.id = id;
        this.health = health;
        this.currLoc = currLoc;
        this.oldLoc = oldLoc;
    }
}

$( document ).ready(function() {
    var mapHtml = "";
    for(var i = 0; i < mapArray.length; i++){
        mapHtml += '<div id="row-' + i + '">';
        for(var j = 0; j < mapArray[i].length; j++){ 
            mapHtml += '<span id="' + i + '-' + j + '">' + mapArray[i][j] + '</span>';
        }
        mapHtml += '</div>';
    }
    
    $("#map-div").html(mapHtml);

    function pad ( val ) { return val > 9 ? val : "0" + val; }
    setInterval( function(){
        $("#seconds").html(pad(++gameTime%60));
        $("#minutes").html(pad(parseInt(gameTime/60,10)));
    }, 1000);
        
    setInterval( function() {
        // for all game board
        //     for 
        //         if the tile is a monster
        //             check the adjacent tiles for another path tile
        //             update position to that tile
        // i, j - 1
        // i, j + 1
        // i + 1, j
        for (var i = 0; i < monsterArray.length; i++){
            // if is valid loc (otherwise throws error)
            var currI = monsterArray[i].currLoc.i;
            var currJ = monsterArray[i].currLoc.j;
            var oldI = monsterArray[i].oldLoc.i;
            var oldJ = monsterArray[i].oldLoc.j;

            // move left
            if (currJ - 1 >= 0) {
                if (mapArray[currI][currJ - 1] == 0){
                    if (oldJ != currJ - 1) {
                        monsterArray[i].oldLoc.j = currJ;
                        monsterArray[i].oldLoc.i = currI;                        
                        monsterArray[i].currLoc.j = currJ - 1;
                        console.log("left");                        
                    }
                }
            }
            // move right
            if (currJ + 1 <= 11) {
                if (mapArray[currI][currJ + 1] == 0){
                    if (oldJ != currJ + 1) {
                        monsterArray[i].oldLoc.j = currJ;
                        monsterArray[i].oldLoc.i = currI;                        
                        monsterArray[i].currLoc.j = currJ + 1;
                        console.log("right");
                        
                    }
                }
            }
            // move down
            if (currI + 1 <= 11){
                if (mapArray[currI + 1][currJ] == 0){
                    if (oldI != currI + 1) {
                        monsterArray[i].oldLoc.j = currJ;
                        monsterArray[i].oldLoc.i = currI;
                        monsterArray[i].currLoc.i = currI + 1;
                        console.log("down");
                        
                    }
                }
            }

        }
        
        
        if (monsterCount < 1){
            if (mapArray[0][2] == 0){
                monsterArray[monsterCount] = new Monster(0, 5, new Point(0, 2), new Point(0, 0));               
            }
            monsterCount++;
        }

        console.log("Monster Loc: ");
        console.log("    I: " + monsterArray[0].currLoc.i + "    J: " + monsterArray[0].currLoc.j);

    }, 500);
});