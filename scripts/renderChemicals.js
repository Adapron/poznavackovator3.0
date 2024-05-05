//rendering

var sizeMultiplier = 0.5;

let nodes = [];
let lines = [];
var canvas    = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const offscreenCanvas = document.createElement("canvas"); // Create offscreen canvas
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;
const offscreenCtx = offscreenCanvas.getContext("2d");

var highlightedNodeId = null;

// Function to draw a node
function drawNode(node, context, isSelected) {

    let text = node.type;

    let isNodeConnected = getAnyLineOfANode(node.id) != null;

    if(node.id != selectedNodeId && text.length == 0){
        removeNodeAndConnections(node.id); 
        return;
    }

    if(node.type == "C" && isNodeConnected && node.id != selectedNodeId && node.id != highlightedNodeId && node.highlight == "white"){return;}


    context.beginPath();
    context.arc(node.x , node.y, node.radius, 0, 2 * Math.PI);
    if (node.id === selectedNodeId) {
        context.strokeStyle = "black"; // Outline color
        context.lineWidth = 2; // Outline width
        context.stroke();
    }
    else if (node.id === highlightedNodeId) {
        context.strokeStyle = "red"; // Outline color
        context.lineWidth = 2; // Outline width
        context.stroke();
    }
    
    context.fillStyle = node.highlight; // Fill color
    context.fill();

    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fillStyle = "black";
    // Start with a large font size
    var fontSize = 40;

    do {
        // Set font properties
        context.font = fontSize + "px Arial";
        
        // Measure text width
        var textWidth = ctx.measureText(text.charAt(0)).width;
        
        // Decrease font size if text width is greater than circle diameter
        if (textWidth > node.radius * 2) {
            node.radius--;
        }
    } while (textWidth > node.radius * 2 - 5*sizeMultiplier && fontSize > 0);

    



    context.font = fontSize*sizeMultiplier+"px Arial"

    context.fillText(node.type, node.x- ctx.measureText(text.charAt(0)).width*1, node.y);

    

    //const img = new Image();
    //img.src = getNodeSpriteUrl(node.type);
    //img.onload = function() {
    //    context.drawImage(img, node.x - node.radius, node.y - node.radius, node.radius * 2, node.radius * 2);
    //    if (node.id === selectedNodeId) {
    //        // Draw border or change color to indicate selection
    //        context.strokeStyle = "blue"; // Change to desired color
    //        context.lineWidth = 2; // Change to desired border width
    //        context.strokeRect(node.x - node.radius - 1, node.y - node.radius - 1, node.radius * 2 + 2, node.radius * 2 + 2);
    //    }
    //};
}

const connectionWidth = 2;

// Function to draw a line
function drawLine(line, context, count, isBlack) {
    const startNode = nodes.find(element => element.id === line.startNodeId);
    const endNode = nodes.find(element => element.id === line.endNodeId);
    context.strokeStyle = isBlack ? "white":"black"; // Change to desired color
    context.beginPath();
    context.moveTo(startNode.x, startNode.y);
    context.lineTo(endNode.x, endNode.y);
    context.lineWidth = connectionWidth * count;
    context.stroke();
    if(count > 1) drawLine(line, context, count-2, !isBlack);
}

function drawLineToMouse(startNodeId, mousePosX, mousePosY, context) {
    const startNode = nodes.find(element => element.id === startNodeId);
    if(!startNode) return;

    context.strokeStyle = "black"; // Change to desired color
    context.beginPath();
    context.moveTo(startNode.x, startNode.y);
    context.lineTo(mousePosX, mousePosY);
    context.lineWidth = connectionWidth * 1;

    context.stroke();
}

// Function to get node sprite URL based on type
function getNodeSpriteUrl(type) {
    return type + ".png";
}


function redrawCanvas() {
    // Clear offscreen canvas
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

    lines.forEach(element => {drawLine(element, offscreenCtx, (element.count * 2 - 1), !element.count%2);});

    if(clickedNode != null && currentMouseX != null && isMouseDown){
        drawLineToMouse(clickedNode.id, currentMouseX, currentMouseY, offscreenCtx);
    }

    // Draw elements on offscreen canvas
    nodes.forEach(element => {drawNode(element, offscreenCtx);});

    
    //if(mouseDown){
    //    const startNode = clickedNode;
    //    offscreenCtx.strokeStyle = "black"; // Change to desired color
    //    offscreenCtx.beginPath();
    //    offscreenCtx.moveTo(startNode.x, startNode.y);
    //    offscreenCtx.lineTo(currentMousePos.x, currentMousePos.y);
    //    offscreenCtx.lineWidth = connectionWidth * 1;
    //    offscreenCtx.stroke();
    //}
    
        

    // Copy offscreen canvas to the visible canvas
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(offscreenCanvas, 0, 0);
        
    }, 10);
}

var currentID = 0;

function newId(){
    currentID++;
    return currentID;
}