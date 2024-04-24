var infoT = false;
var settingsT = false;
function info(){
    div = document.getElementById("info");
    div.style.transition = "height 0.3s, width 0.3s, left 0.3s";
    
    if(infoT){
        div.style.width = "100%";
        div.style.height = "50px";
        div.style.left = "-50px";
        infoT = false;
    }else{
        div.style.width = "200px";
        div.style.height = "500px";
        div.style.left = "-150px";
        infoT = true;
    }
}
function settings(){
    //div = document.getElementById("settings");
    //div.style.transition = "height 0.3s, width 0.3s, right 0.3s";
    if(settingsT){
        //div.style.width = "100%";
        //div.style.height = "50px";
        //div.style.right = "-50px";
        hidePopup();
        settingsT = false;
    }else{
        //div.style.width = "200px";
        //div.style.height = "500px";
        //div.style.right = "-150px";
        showPopup();
        settingsT = true;
    }
}
function slideDropDown(){
    let dropdown = document.getElementById("filePickWindowDropdown");
    let container = document.getElementById("customContainer");
    let main = document.getElementById("main");
    main.style.transition = "top 0.3s"
    container.style.transition = "height 0.3s";
    if(dropdown.classList.contains('slidedDropDown')){
        dropdown.classList.remove('slidedDropDown');
        container.style.height = "55px";
        main.style.top = "350px";
    }else{
        dropdown.classList.add('slidedDropDown');
        container.style.height = "140px";
        main.style.top = "430px";
    }
    
}
function slideDropDown2(){
    let dropdown = document.getElementById("mainDropdown");
    if(dropdown.classList.contains('slidedDropDownMain')){
        dropdown.classList.remove('slidedDropDownMain');
    }else{
        dropdown.classList.add('slidedDropDownMain');
    }
    
}
function showPopup() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.top = '50%';
}
// Function to hide the popup
function hidePopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('popup').style.top = '150%';
}
function RemoveCustomThing() {
	currentlyLoadedPzn[data].splice(imageIndex, 1);
	imageIndex--;
	loadCustomEditor(imageIndex);
}