var pickedIndex = -1;
var displayedIndex = -1;
var pickedName = "";
var pickedImages = [];
var pznLearned = [];
var pznLearnedNames = [];
var displayingName = false;
const imgCounder = document.getElementById("imgCounder");
const data = "data"
var imgData = {};
const enteredName = document.getElementById("enteredName");
const dragDropArea = document.getElementById('drag-drop-area');
const photoList = document.getElementById('photo-list');
const imgList = document.getElementById("photo-list");
const removeCustomThing = document.getElementById("removeCustomThing");
const imageArrowLeft = document.getElementById("imageArrowLeft");
const imageArrowRight = document.getElementById("imageArrowRight");
var currentlyLoadedPzn = {data: [["firstName", []]]};
var imageIndex = 0;
var isEdit = false;

function updateListPzn(index) {
    
    var list = document.getElementById('learned');
    list.innerHTML = ''; // Clear existing list items
    
    // Loop through the array and create list items
    var listData = currentlyLoadedPzn[data];
    listData.forEach(
        function(item, index) {
            var listItem = document.createElement('li');
            listItem.textContent = item[0];
            
            // Add click event listener to each list item
            listItem.addEventListener('click', function() {
                // Retrieve the index of the clicked item
                var clickedIndex = index;
                console.log('Clicked index:', clickedIndex);
                currentlyLoadedPzn[data][imageIndex][0] = enteredName.value;
                imageIndex = clickedIndex;
                loadCustomEditor(imageIndex);
                // You can perform further actions with the clicked index here
            });
            
            list.appendChild(listItem); // Append the list item to the list
        }
    );
    
}

function editMode() {
    if(isEdit){
        document.getElementById("editmode").innerHTML = "upravit";
        document.getElementById("poznavackovatorField").style.display = "block";
        document.getElementById("editor").style.display = "none";
        isEdit = false;
    }else{
        document.getElementById("editmode").innerHTML = "zpustit";
        document.getElementById("poznavackovatorField").style.display = "none";
        document.getElementById("editor").style.display = "block";
        isEdit = true;
        loadCustomEditor(0);
    }
    
}

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
function loadCustomEditor(index){
	wipePhotoList()
    updateListPzn(index);
	imgCounder.innerHTML = imageIndex+1+"/"+currentlyLoadedPzn[data].length;
	console.log("loading " + index)
	enteredName.value = currentlyLoadedPzn[data][index][0];
	if(currentlyLoadedPzn[data][index][1].length == 0 && imageIndex != 0){
		removeCustomThing.style.display = "block"
	}else{
		removeCustomThing.style.display = "none"
	}
	currentlyLoadedPzn[data][index][1].forEach(element => {
		addPhotoToList(element);
	});
	if(imageIndex == 0){
		imageArrowLeft.style.display = "none";
	}else{
		imageArrowLeft.style.display = "block";
	}
	if(imageIndex == currentlyLoadedPzn[data].length - 1){
		imageArrowRight.innerHTML = "+";
	}else{
		imageArrowRight.innerHTML = ">";
	}
}
// Get a reference to the dropdown element
const dropdown = document.getElementById('myDropdown');
// Add an event listener to the dropdown to listen for change events
dropdown.addEventListener('change', function(event) {
    // Code to execute when the dropdown selection changes
    const selectedIndex = dropdown.selectedIndex;
    const selectedOption = dropdown.options[selectedIndex];
    selectedOption.click();
    
    // You can perform any action here based on the selected option
});
function setupPzn(){
    resetTimer();
    startTimer();
    pickRandom();
    updateListLearned(0);
}

var shownImages = 0;
function pickRandom(){
    const availableIndices = currentlyLoadedPzn[data]
        .map((_, index) => index)
        .filter(index => !pznLearned.includes(index));
    pickedIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    pickedName = currentlyLoadedPzn[data][pickedIndex][0];
    pickedImages = currentlyLoadedPzn[data][pickedIndex][1];
    
    //display
    console.log("displaying");
    document.getElementById("counterPzn").innerHTML = pznLearned.length + "    " + shownImages;
    shownImages++;
    displayedIndex = 0;
    document.getElementById("imageDivPzn").src = pickedImages[displayedIndex];
}
function pznLearn(){
    var name = currentlyLoadedPzn[data][pickedIndex][0];
    if(pznLearned.includes(pickedIndex)) return;
    pznLearned.push(pickedIndex);
    pznLearnedNames.push(name);
    updateListLearned();
    document.getElementById("counterPzn").innerHTML = pznLearned.length + "    " + shownImages;
}
function pznShow() {
    if(displayingName){
        //hidename
        document.getElementById("showButton").innerHTML = "ukázat jméno"
        document.getElementById("imageNamePzn").innerHTML = "";
        pickRandom();
        displayingName = false;
    }
    else{
        document.getElementById("imageNamePzn").innerHTML = pickedName;
        //showname
        document.getElementById("showButton").innerHTML = "další náhodná fotka"
        displayingName = true;
    }
}
function sameName(){
    displayedIndex++;
    displayedIndex = displayedIndex % pickedImages.length;
    document.getElementById("imageDivPzn").src = pickedImages[displayedIndex];
}
document.getElementById("toggleType").addEventListener("change", function() {
    console.log("switched")
    // Toggle the switch's state
    if (document.getElementById("toggleType").checked) {
        // Switch is ON
        // Perform actions when switch is on
        dropdown.innerHTML = document.getElementById("vyssiData").innerHTML;
    } else {
        // Switch is OFF
        // Perform actions when switch is off
        dropdown.innerHTML = document.getElementById("nizsiData").innerHTML;
    }
});



loadJSON(`./poz/rasyV.json`)
pznShow()
pznShow()