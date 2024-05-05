function distanceSquared(x1, y1, x2, y2) {
    return (Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getNodeAtPos(x,y){

    var clickedNode = null;
    nodes.forEach(node => {
            let dist = distanceSquared(node.x, node.y, x, y)
            if(dist < node.radius**2){

                clickedNode = node;
            }
    });
    return clickedNode;
}

function connectNodes(id1, id2){
    lines.push({
        id: newId(),
        shape: "line",
        startNodeId: id1,
        endNodeId: id2,
        count: 1
    });
}


function newNode(x,y,connectTo) {

    let newNodeId = newId();

    nodes.push({
        id: newNodeId,
        shape: "node",
        type: "C", // Set the type of node as needed
        highlight: "white",
        radius: 20 * sizeMultiplier, // Set the radius as needed
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        mass: 1
    })
    
    if(connectTo){
        connectNodes(connectTo, newNodeId);
    }
    
    selectedNodeEdited = false;

    return newNodeId;

}

function connectionExists(startNodeId, endNodeId) {
    return lines.find(line => {
        return (line.startNodeId === startNodeId && line.endNodeId === endNodeId) || (line.startNodeId === endNodeId && line.endNodeId === startNodeId);
    });
}

function getAnyLineOfANode(nodeId) {
    return lines.find(line => {
        return line.startNodeId == nodeId || line.endNodeId === nodeId;
    });
}

function getNodeById(nodeId) {
    return nodes.find(node => node.id === nodeId);
}

function removeNodeAndConnections(nodeId){


    nodes = nodes.filter(node=>{
        return node.id !== nodeId;
    })

    lines = lines.filter(line=>{
        return line.startNodeId !== nodeId && line.endNodeId !== nodeId;
    })
}

function removeConnection(connectionId){
    lines = lines.filter(line=>{
        return line.id != connectionId;
    })
}

const subscriptMap = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉'
};

var selectedNodeEdited = false;

var selectedNodeId = null; // Store the ID of the last added node

function pressKey(key){
    console.log(key);
    let selectedNode = getNodeById(selectedNodeId);
    // Check if specific keys are pressed

    if(!selectedNodeEdited){
        selectedNode.type = "";
        selectedNodeEdited = true;
    }


    if(key == "Delete") {
        removeNodeAndConnections(selectedNode.id);
        return;
    }
    
    if(key.length == 1 && /[a-zA-Z]/.test(key)) selectedNode.type = selectedNode.type + key.toUpperCase();

    if (/^\d$/.test(key)) selectedNode.type = selectedNode.type + subscriptMap[key];

    if(key == "Backspace") selectedNode.type = selectedNode.type.slice(0, -1);

}

document.addEventListener("keydown", function(event) {
    const key = event.key;

    pressKey(key)
    

});

function deselect(){
    selectedNodeId = null; //deselect
    selectedNodeEdited = false;
}

function select(node){
    selectedNodeId = node.id;
    selectedNodeEdited = false;
}
var mouseTimer = 0;

setInterval(() => {
    mouseTimer += 0.1;
    
}, 100);

var currentMouseX = null;
var currentMouseY = null;
var clickedNode = null;
var isMouseDown = false;


document.addEventListener("DOMContentLoaded", function() {
    
    canvas.addEventListener("contextmenu", function(event) {
        event.preventDefault(); // Prevent default context menu
    });
    
    //canvas.addEventListener("contextmenu", function(event) {
    //    event.preventDefault(); // Prevent default context menu
    //});
    // Function to handle click event

    
    

    var clickedPosX = null;
    var clickedPosY = null;


    function onMouseMove(event){
        
            const rect = canvas.getBoundingClientRect();
            var x;
            var y;
            if(event.touches && event.touches[0]){
                var touch = event.touches[0];

                x = touch.clientX - rect.left;
                y = touch.clientY - rect.top;
            }else{
                x = event.clientX - rect.left;
                y = event.clientY - rect.top;
            }
    
            var overNode = getNodeAtPos(x,y);
    
            if(overNode != null) {
                highlightedNodeId = overNode.id
            }
            else{
                highlightedNodeId = null;
            }
    
            if(clickedNode == null && mouseTimer > 0.05 && isMouseDown && distance(clickedPosX,clickedPosY, x, y) > 20) {
                clickedNode = getNodeById(newNode(clickedPosX,clickedPosY,null));
            }
    
    
            currentMouseX = x;
            currentMouseY = y;
        
    }

    

    function onMouseeUp(event) {
        if(currentlyDeleted)return;
        
        isMouseDown = false;

        let button = event.button;


        const rect = canvas.getBoundingClientRect();
        var x;
        var y;
        console.log(event)
        if(event.changedTouches && event.changedTouches[0]){
            var touch = event.changedTouches[0];

            x = touch.clientX - rect.left;
            y = touch.clientY - rect.top;
        }else{
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        }

        var releasedNode = getNodeAtPos(x,y);

        if(button == 2) {

            deselect();

            event.preventDefault();

        }

        if(button == 1) {

            if(releasedNode){
                removeNodeAndConnections(releasedNode.id);
                deselect();
            }

            event.preventDefault();

        }

        console.log(button)
        
        if(button == 0 || button == undefined) {

            

            const tapped = mouseTimer < 0.2;


            if(tapped && releasedNode == null){  //tapped in air
                if(selectedNodeId != null){
                    deselect()

                }else{
                    console.log("newnode")
                    selectedNodeId = newNode(x,y,null); 
                }
            }

            if(tapped && releasedNode != null){ //tapped on a node
                select(releasedNode);
            }

            if(!tapped && releasedNode == null){ //dragged into air
                if(clickedNode != null) {
                    selectedNodeId = newNode(x,y,clickedNode.id); //make a new node connected to the selected
                }else{
                    return;
                    //let initialNodeId = newNode(clickedPos.x,clickedPos.y,null); //make a new node 
                    //let secondNodeId = newNode(x,y,null);
                    //selectedNodeId = secondNodeId; //make a new node 
                    //connectNodes(initialNodeId,secondNodeId);
                }
            }

            if(!tapped && releasedNode != null){ //dragged onto a node
                if(clickedNode.id == releasedNode.id) return;
                let connection = connectionExists(clickedNode.id, releasedNode.id);
                if(connection != null){
                    if (connection.count === 3) {
                        removeConnection(connection.id); 
                    } else {
                        connection.count++;
                    }
                }else{ //connection does not exist
                    connectNodes(clickedNode.id, releasedNode.id);
                    select(releasedNode);
                }
            }
                    clickCount = 0;
                
                
            
            

            

            
        }

        clickedPosX = null;
        clickedPosY = null;

    }

    var clicks = 0;
    var currentlyDeleted = false;
    function onMouseDown(event) {
        currentlyDeleted = false;
        isMouseDown = true;
        mouseTimer = 0;

        clicks++;
        
        setTimeout(() => {
            clicks = 0;
        }, 200);




        let button = event.button;


        const rect = canvas.getBoundingClientRect();

        var x;
        var y;
        if(event.changedTouches && event.changedTouches[0]){
            var touch = event.changedTouches[0];

            x = touch.clientX - rect.left;
            y = touch.clientY - rect.top;
        }else{
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        }
        
        

        clickedPosX = x;
        clickedPosY = y;

        let connected = false;

        clickedNode = getNodeAtPos(x,y);


        if(clicks == 2){
            removeNodeAndConnections(clickedNode.id);
            deselect();
            currentlyDeleted = true;
        }

        

        redrawCanvas();

        console.log(clickedPosX);
        
    }
    

    canvas.addEventListener("mousemove", onMouseMove)

    canvas.addEventListener("touchmove", onmousemove)
    

    canvas.addEventListener("mouseup", onMouseeUp)

    canvas.addEventListener("touchend", onMouseeUp)

    

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("touchstart", onMouseDown);
});

