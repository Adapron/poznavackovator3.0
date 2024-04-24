const fileName = "data.json";

function downloadJSON(json, fileName){ //saves the json to users computer
    var a = document.createElement('a');
    a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
    a.download = fileName;
    a.click();
}

function inputFile() { //lets the user upload a file and returns parsed json
    return new Promise((resolve, reject) => {
        var inputElement = document.createElement('input');
        inputElement.type = 'file';
        inputElement.addEventListener('change', function (e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var contents = e.target.result;
                var data = JSON.parse(contents);
                resolve(data);
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsText(file);
        });
        inputElement.click();
    });
}

function loadJSON(file) { //loads a json from file by its path and return the parsed json
    return fetch(file)
        .then(response => response.json())
        .then(data => {
            currentlyLoadedPzn = data;
            setupPzn()
            loadCustomEditor(0)
        }).catch(error => {
            console.error('Error:', error);
    });
}
function exportJSON() {
    var input = document.getElementById('input').value; //get the input
    //construct the object
    var data = {
        "input": input
    };
    var json = JSON.stringify(data, null, 2); //convert to JSON
    downloadJSON(json, fileName);
    
}
function savejson(){
    const json = currentlyLoadedPzn;
    const blob = new Blob([JSON.stringify(json, null, 2)], {type : 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function searchGoogle() {
    const searchTerm = document.getElementById('enteredName').value.trim();
    if (searchTerm === '') {
        alert('Please enter a search term');
        return;
    }

    const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
    const googleImagesUrl = `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(searchTerm)}&title=Special:MediaSearch&go=Go&type=image&uselang=cs`;

    fetch(corsAnywhereUrl + googleImagesUrl)
        .then(response => response.text())
        .then(fetchedHtml => {
            console.log("page loaded")
        const parser = new DOMParser();
        const doc = parser.parseFromString(fetchedHtml, 'text/html');
        const imageElements = doc.querySelectorAll('img');
        console.log(doc);
        const imageLinks = [];
        var found = 0;
        imageElements.forEach(img => {
            const src = img.getAttribute('src');
            console.log(src);
            if (src && src.startsWith('http')) {
                found++;
                if(found>10)return
                currentlyLoadedPzn.data[imageIndex][1].push(src);
        
        
                loadCustomEditor(imageIndex);
            }
        });
        })
        .catch(error => {
        console.error('Error fetching images:', error);
        alert('An error occurred while fetching images');
    });
}
async function importJSON() {
    try {
        var data = await inputFile();
        currentlyLoadedPzn = data;
        setupPzn()
        loadCustomEditor(0)
    } catch (error) {
        console.error('Error:', error);
    }
}
async function loadDefaultJSON() {
    try {
        var data = await loadJSON('default.json');
        var input = data.input;
        document.getElementById('input').value = input;
    } catch (error) {
        console.error('Error:', error);
    }
}