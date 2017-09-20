var mapArray = [];
for(var i = 0; i < 10; i++){
    mapArray[i] = [];    
    for(var j = 0; j < 10; j++){ 
        mapArray[i][j] = 0;    
    }    
}

$( document ).ready(function() {
    var mapHtml = "";
    for(var i = 0; i < mapArray.length; i++){
        mapHtml += '<div id="row-' + i + '">';
        for(var j = 0; j < mapArray[i].length; j++){ 
            mapHtml += '<span id="' + i + '-' + j + '">' + mapArray[i][j] + '</span>';
            console.log("hit");
        }
        mapHtml += '</div>';
    }
    
    $("#map-div").html(mapHtml);
        
    
});