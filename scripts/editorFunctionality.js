dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.classList.add('drag-over');
});

dragDropArea.addEventListener('dragleave', () => {
    dragDropArea.classList.remove('drag-over');
});

dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.classList.remove('drag-over');

    const link = e.dataTransfer.getData('text/plain');
    console.log(link);

    // Check if the dropped link corresponds to a photo
    if (isPhotoLink(link)) {
        // Add the photo to the list
        currentlyLoadedPzn.data[imageIndex][1].push(link);
        
        
        loadCustomEditor(imageIndex);

    }
});

function isPhotoLink(link) {
    // Your logic to determine if the link corresponds to a photo
    // For simplicity, this example assumes that any link ending with ".jpg" or ".png" is a photo
    return true;
    //return link.toLowerCase().endsWith('.jpg') || link.toLowerCase().endsWith('.png');
}

function addPhotoToList(link) {
    // Create an image element
    const image = document.createElement('img');
    image.src = link;
    image.alt = 'Dropped Photo';

    // Create a list item for the photo
    const listItem = document.createElement('li');
    listItem.appendChild(image);

    // Add a click event listener to remove the photo when clicked
    listItem.addEventListener('click', () => {
        removePhotoFromList(listItem);
    });

    // Add the list item to the photo list
    photoList.appendChild(listItem);
}

function removePhotoFromList(listItem) {
    // Remove the clicked photo from the list

    var index = currentlyLoadedPzn[data][imageIndex][1].indexOf(listItem.firstChild.src);

    
    if (index !== -1) {
        // Use splice to remove the first instance of the element
        currentlyLoadedPzn[data][imageIndex][1].splice(index, 1);
    }

    loadCustomEditor(imageIndex);
    
}

function ImageLeft(){
    if(imageIndex == 0) return;

    currentlyLoadedPzn[data][imageIndex][0] = enteredName.value;

    imageIndex--;

    loadCustomEditor(imageIndex);

    

}

enteredName.addEventListener("change", function(event){
    currentlyLoadedPzn[data][imageIndex][0] = enteredName.value;
})

function ImageRight(){
    console.log(currentlyLoadedPzn[data].length + " " + imageIndex)
    if(imageIndex == currentlyLoadedPzn[data].length - 1){currentlyLoadedPzn[data].push(["",[]])}

    currentlyLoadedPzn[data][imageIndex][0] = enteredName.value;

    imageIndex++;

    loadCustomEditor(imageIndex);
    

}





function wipePhotoList() {
    // Remove all child elements from the photo list
    while (photoList.firstChild) {
        photoList.removeChild(photoList.firstChild);
    }
}