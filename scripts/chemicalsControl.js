var chemicalNames = ["acetaldehyd","aceton","acetyl","acetylen","adenin","alanin","allyl","alpha-pyran","antracen","arginin","asparagin","benzaldehyd","benzen","benzyl","chloroform","cystein","cytosin","dioxan","dreveny_lih","eter","etylen","etylenglykol","fenantren","fenol","fenyl","fenylalanin","fluoroglucinol","fosgen","freon","furan","gamma-pyran","glutamin","glyceraldehyd","glycerol","glycin","glykolaldehyd","guanin","histidin","hydrochinon","imidazol","indol","isoleucin","izopropyl","kumen","kyselina_adipova","kyselina_akrylova","kyselina_asparagova","kyselina_barbiturova","kyselina_benzoova","kyselina_citronova","kyselina_fumarova","kyselina_glutamova","kyselina_glutarova","kyselina_jablecna","kyselina_jantarova","kyselina_linolenova","kyselina_linolova","kyselina_maleinova","kyselina_malonova","kyselina_maselna","kyselina_metakrylova","kyselina_mlecna","kyselina_mocova","kyselina_mravenci","kyselina_octova","kyselina_olejova","kyselina_palmitova","kyselina_pikrova","kyselina_propionova","kyselina_pyrohroznova","kyselina_salicylova","kyselina_stavelova","kyselina_stearova","kyselina_vinna","leucin","lih","lysin","methionin","mocovina","naftalen","nitroglycerin","perhydrofuran","piperidin","prolin","purin","pyrazol","pyridin","pyrimidin","pyrokatechol","pyrrol","rezorcinol","serin","styren","thiazol","thiofan","thiofen","threonin","thymin","TNT","toluen","tryptofan","tyrosin","uracil","valin","vynil"];
var chemicalDisplayNames = ["acetaldehyd","aceton","acetyl","acetylen","adenin","alanin","allyl","alpha-pyran","antracen","arginin","asparagin","benzaldehyd","benzen","benzyl","chloroform","cystein","cytosin","dioxan","dreveny_lih","eter","etylen","etylenglykol","fenantren","fenol","fenyl","fenylalanin","fluoroglucinol","fosgen","freon","furan","gamma-pyran","glutamin","glyceraldehyd","glycerol","glycin","glykolaldehyd","guanin","histidin","hydrochinon","imidazol","indol","isoleucin","izopropyl","kumen","kyselina_adipova","kyselina_akrylova","kyselina_asparagova","kyselina_barbiturova","kyselina_benzoova","kyselina_citronova","kyselina_fumarova","kyselina_glutamova","kyselina_glutarova","kyselina_jablecna","kyselina_jantarova","kyselina_linolenova","kyselina_linolova","kyselina_maleinova","kyselina_malonova","kyselina_maselna","kyselina_metakrylova","kyselina_mlecna","kyselina_mocova","kyselina_mravenci","kyselina_octova","kyselina_olejova","kyselina_palmitova","kyselina_pikrova","kyselina_propionova","kyselina_pyrohroznova","kyselina_salicylova","kyselina_stavelova","kyselina_stearova","kyselina_vinna","leucin","lih","lysin","methionin","mocovina","naftalen","nitroglycerin","perhydrofuran","piperidin","prolin","purin","pyrazol","pyridin","pyrimidin","pyrokatechol","pyrrol","rezorcinol","serin","styren","thiazol","thiofan","thiofen","threonin","thymin","TNT","toluen","tryptofan","tyrosin","uracil","valin","vynil"];


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
