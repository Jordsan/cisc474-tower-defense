var mapArray = [];
for(var i = 0; i < 12; i++){
    mapArray[i] = [];    
    for(var j = 0; j < 12; j++){ 
        mapArray[i][j] = 0;    
    }    
}


var gameLives = 25;
var gameScore = 0;
var gameTime = 0;

$( document ).ready(function() {
    var mapHtml = "";
    for(var i = 0; i < mapArray.length; i++){
        mapHtml += '<div class="row" id="row-' + i + '">';
        for(var j = 0; j < mapArray[i].length; j++){ 
            mapHtml += '<span class="column" id="' + i + '-' + j + '">' + mapArray[i][j] + '</span>';
            console.log("hit");
        }
        mapHtml += '</div>';
    }
    
    $("#map-div").html(mapHtml);

    function pad ( val ) { return val > 9 ? val : "0" + val; }
    setInterval( function(){
        $("#seconds").html(pad(++gameTime%60));
        $("#minutes").html(pad(parseInt(gameTime/60,10)));
    }, 1000);
        
    
});