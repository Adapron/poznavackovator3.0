const chemicalNames = ["acetyl","adenin","alanin","alpha-pyran","arginin","asparagin","cystein","cytosin","dioxan","fenylalanin","fosgen","furan","gamma-pyran","glutamin","glycin","guanin","histidin","imidazol","indol","isoleucin","kyselina_asparagova","kyselina_barbiturova","kyselina_citronova","kyselina_glutamova","kyselina_jablecna","kyselina_mlecna","kyselina_mocova","kyselina_pyrohroznova","kyselina_salicylova","kyselina_vinna","leucin","lysin","methionin","mocovina","perhydrofuran","piperidin","prolin","purin","pyrazol","pyridin","pyrimidin","pyrrol","serin","thiazol","thiofan","thiofen","threonin","thymin","tryptofan","tyrosin","uracil","valin"];
const chemicalDisplayNames = ["acetyl","adenin","alanin","alpha-pyran","arginin","asparagin","cystein","cytosin","dioxan","fenylalanin","fosgen","furan","gamma-pyran","glutamin","glycin","guanin","histidin","imidazol","indol","isoleucin","kyselina_asparagova","kyselina_barbiturova","kyselina_citronova","kyselina_glutamova","kyselina_jablecna","kyselina_mlecna","kyselina_mocova","kyselina_pyrohroznova","kyselina_salicylova","kyselina_vinna","leucin","lysin","methionin","mocovina","perhydrofuran","piperidin","prolin","purin","pyrazol","pyridin","pyrimidin","pyrrol","serin","thiazol","thiofan","thiofen","threonin","thymin","tryptofan","tyrosin","uracil","valin"];


function exportJSON() {
    
    var json = JSON.stringify({nodes: nodes, lines: lines}, null, 2); //convert to JSON
    downloadJSON(json, "downloadeddata.json");
    
}

function downloadJSON(json, fileName){ //saves the json to users computer
    var a = document.createElement('a');
    a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
    a.download = fileName;
    a.click();
}


function loadJSON(file) { //loads a json from file by its path and check current chemical against it
    return fetch(file)
        .then(response => response.json())
        .then(data => {

            checkButton(data);
        }).catch(error => {
            console.error('Error:', error);
        });
}


var showing = true;
function buttonPress(){

    if(showing){
        showing = false;
        //checkButton(JSON.parse(myjson));
        document.getElementById("learnButton").innerHTML = "next";
        console.log("loadong json " +"./chemicals/"+chemicalNames[pickedIndexCh]+".json" );
        loadJSON("./chemicals/"+chemicalNames[pickedIndexCh]+".json");
    }else{
        showing = true;
        document.getElementById("learnButton").innerHTML = "check";
        nodes = [];
        lines = [];
        randomBase();
    }

    


    
}



function randomBase(){
    pickRandomCh()
}

randomBase(); //initialize page with a random chemical picked



var pznLearned = [];


function updateListLearned() {

    
    var list = document.getElementById('learned');
    list.innerHTML = ''; // Clear existing list items
    
    // Loop through the array and create list items
    pznLearned.forEach((arrayItem, index, fullArray) => {
        
            var listItem = document.createElement('li');
            listItem.textContent = pznLearnedNames[index];
            
            // Add click event listener to each list item
            listItem.addEventListener('click', function() {
                // Retrieve the index of the clicked item
                var clickedIndex = index;
                console.log('Clicked item and index:', pznLearnedNames[index], index);
                pznLearned.splice(index, 1);
                pznLearnedNames.splice(index, 1);
                updateListLearned()
            });
            
            list.appendChild(listItem); // Append the list item to the list
        }
    );
    
}
var pickedIndexCh = NaN;
var shownImages = 0;


function pickRandomCh(){

    const availableIndices = chemicalNames
        .map((_, index) => index)
        .filter(index => !pznLearned.includes(index));
        pickedIndexCh = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    document.getElementById("bordered-div").innerHTML = chemicalDisplayNames[pickedIndexCh];
    
    //display
    console.log("displaying");
    document.getElementById("counterChemie").innerHTML = pznLearned.length + "    " + chemicalNames.length;
    
}
function chemieLearn(){
    var name = chemicalNames[pickedIndexCh];
    if(pznLearned.includes(pickedIndexCh)) return;
    pznLearned.push(pickedIndexCh);
    pznLearnedNames.push(name);
    updateListLearned();
    document.getElementById("counterChemie").innerHTML = pznLearned.length + "    " + chemicalNames.length;
}
