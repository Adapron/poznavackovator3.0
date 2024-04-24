//function exportJSON() {
//    
//    var json = JSON.stringify(convertLinear(nodes, lines), null, 2); //convert to JSON
//    downloadJSON(json, "downloadeddata.json");
//    
//}
//
//function downloadJSON(json, fileName){ //saves the json to users computer
//    var a = document.createElement('a');
//    a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
//    a.download = fileName;
//    a.click();
//}


function loadJSON(file) { //loads a json from file by its path and check current chemical against it
    return fetch(file)
        .then(response => response.json())
        .then(data => {
            const drawnImage = convertLinear(nodes, lines);
            const isImageCorrect = compareLinearObjects(drawnImage, data, false) || compareLinearObjects(drawnImage, data, true);
            alert(isImageCorrect?"correct!":"incorrect!");
        }).catch(error => {
            console.error('Error:', error);
        });
}

function buttonPress(){
    loadJSON("./chemicals/"+document.getElementById("bordered-div").innerHTML+".json");
    randomBase();
}

function randomBase(){
    const bases = ["adenine","guanine","cytosine","thymine"];
    document.getElementById("bordered-div").innerHTML = bases[Math.floor(Math.random()*4)];
}

randomBase(); //initialize page with a random chemical picked
