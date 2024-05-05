//check and correct
function getNodeLinearObject(node, connections){
    return {
        type: node.type,
        connections: connections
    };
}

// Calculate the angle between two points
function calculateAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

function getConnectedNodes(node, lines, nodes) {
    // Initialize an array to store connected nodes with their angles
    var connectedNodesWithAngles = [];

    // Get the coordinates of the reference node
    const refX = node.x;
    const refY = node.y;

    

    // Calculate angles for each connected node
    lines.forEach(line => {
        if (line.startNodeId === node.id) {
            // Find the connected node
            const connectedNode = nodes.find(element => element.id === line.endNodeId);
            // Calculate angle between reference node and connected node
            const angle = calculateAngle(refX, refY, connectedNode.x, connectedNode.y);


            // Push connected node and its angle to the array
            connectedNodesWithAngles.push({ node: {node: connectedNode, count: line.count}, angle });
        }
        if (line.endNodeId === node.id) {
            // Find the connected node
            const connectedNode = nodes.find(element => element.id === line.startNodeId);
            // Calculate angle between reference node and connected node
            const angle = calculateAngle(refX, refY, connectedNode.x, connectedNode.y);
            // Push connected node and its angle to the array
            connectedNodesWithAngles.push({ node: {node: connectedNode, count: line.count}, angle });
        }
    });

    // Sort connected nodes based on angles
    connectedNodesWithAngles.sort((a, b) => a.angle - b.angle);

    // Extract nodes in sorted order
    const connectedNodes = connectedNodesWithAngles.map(item => item.node);

    return connectedNodes;
}

//convert a graph into simplified form
function convertLinear(nodes, lines) {
    var linearData = [];
    nodes.forEach(node => {
        linearData.push(recurseNode(node, lines, nodes, 2));
    });
    return linearData;

}


function recurseNode(node, lines, nodes, depth) {
    if (depth < 1) {
        return getNodeLinearObject(node, []);
    }

    var connectedNodes = [];
    getConnectedNodes(node, lines, nodes).forEach(connectedNode => {
        let nodeObject = recurseNode(connectedNode.node, lines, nodes, depth-1);
        connectedNodes.push({count:connectedNode.count, node: nodeObject})
    });
    return getNodeLinearObject(node, connectedNodes);
}

function areListsSameCircular(list1, list2, invert, depth) {
    // Find the index of the smallest element in list1
    if(list1.length == 1) return (list1[0].count == list2[0].count && areTheSameNode(list1[0].node,list2[0].node, invert, depth))
    let shiftedArray = list2;
    for (let index = 0; index < list1.length; index++) {
        shiftedArray = [...shiftedArray.slice(1), shiftedArray[0]];
        var foundInconsistency = false;
        for (let j = 0; j < list1.length; j++) {
            if(list1[j].count != shiftedArray[j].count || !areTheSameNode(list1[j].node,shiftedArray[j].node, invert, depth)){
                foundInconsistency = true;
                break;
            }
            
        }
        if (!foundInconsistency){
            return true;
        }
        
    }
    return false;
}
function areListsSame(list1, list2, invert, depth) {
    


    // Create a copy of array2 to keep track of matched objects
    const copyArray2 = [...list2];

    // Iterate through array1
    for (let obj1 of list1) {
        // Flag to check if obj1 is found in array2
        
        let found = false;

        // Iterate through copyArray2
        for (let i = 0; i < copyArray2.length; i++) {
            // Check if obj1 is the same as any object in copyArray2
            if (areTheSameNode(obj1.node, copyArray2[i].node, invert, depth)) {
                // If found, remove the object from copyArray2
                copyArray2.splice(i, 1);
                found = true;
                break; // Exit the loop
            }
        }

        // If obj1 is not found in array2, arrays don't contain the same objects
        if (!found) {
            return false;
        }
    }

    // If all objects in array1 are found in array2, and vice versa, return true
    return true;
}

function areTheSameNode(node1, node2, invert, depth = 4) {
    if(node1.type != node2.type) return false;
    if(depth == 0 ) return true;

    if(node1.connections.length != node2.connections.length) return false;
    if(node1.connections.length == 0) return true;
    if(node1.connections.some(obj => obj.count > 1)){
        return areListsSameCircular(node1.connections, node2.connections, invert, depth-1);
    }else{
        return areListsSame(node1.connections, node2.connections, invert, depth-1);
    }

}

function compareLinearObjects(object1, object2, invert) {
    if (object1.length !== object2.length) {
        return false; // If the arrays have different lengths, they can't contain the same objects
    }

    // Create a copy of array2 to keep track of matched objects
    const copyArray2 = [...object2];

    // Iterate through array1
    for (let obj1 of object1) {
        // Flag to check if obj1 is found in array2
        
        let found = false;

        // Iterate through copyArray2
        for (let i = 0; i < copyArray2.length; i++) {
            // Check if obj1 is the same as any object in copyArray2
            if (areTheSameNode(obj1, copyArray2[i], invert)) {
                // If found, remove the object from copyArray2
                copyArray2.splice(i, 1);
                found = true;
                break; // Exit the loop
            }
        }

        // If obj1 is not found in array2, arrays don't contain the same objects
        if (!found) {
            return false;
        }
    }

    // If all objects in array1 are found in array2, and vice versa, return true
    return true;
}

function blendColors(color1, color2, percentage) {

    if(isNaN(percentage)) percentage = 0;
    percentage = Math.min(Math.max(percentage, 0), 1)
    console.log(percentage)
    // Convert hexadecimal color strings to RGB arrays
    const rgb1 = [parseInt(color1.slice(1, 3), 16), parseInt(color1.slice(3, 5), 16), parseInt(color1.slice(5, 7), 16)];
    const rgb2 = [parseInt(color2.slice(1, 3), 16), parseInt(color2.slice(3, 5), 16), parseInt(color2.slice(5, 7), 16)];

    // Linearly interpolate between the two colors
    const blendedRgb = rgb1.map((channel, index) => Math.round(channel * (1 - percentage) + rgb2[index] * percentage));

    // Convert the blended RGB array back to hexadecimal format
    const blendedColor = `#${blendedRgb.map(channel => channel.toString(16).padStart(2, '0')).join('')}`;

    return blendedColor;
}

// Function to shuffle an array of indices
function shuffleIndices(indices) {
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
}

// Function to unshuffle an array of indices
function unshuffleIndices(indices, shuffledIndices) {
    const unshuffledIndices = new Array(indices.length);
    for (let i = 0; i < indices.length; i++) {
        unshuffledIndices[shuffledIndices[i]] = indices[i];
    }
    return unshuffledIndices;
}

// Function to apply modification to a list based on shuffled indices
function modifyListByShuffledIndices(list, shuffledIndices, modificationFunction, arg) {
    const modifiedList = new Array(list.length);
    for (let i = 0; i < list.length; i++) {
        modifiedList[shuffledIndices[i]] = modificationFunction(list[i], arg);
    }
    return modifiedList;
}

// Main function to perform shuffling, modification, and unshuffling
function shuffleModifyUnshuffle(list, modificationFunction, arg) {
    // Generate indices for the original list
    const indices = list.map((_, index) => index);

    // Shuffle the indices
    const shuffledIndices = shuffleIndices([...indices]);

    // Apply modification to the list based on shuffled indices
    const modifiedList = modifyListByShuffledIndices(list, shuffledIndices, modificationFunction, arg);

    // Unshuffle the modified list
    const unshuffledIndices = unshuffleIndices(indices, shuffledIndices);
    const unshuffledList = modifyListByShuffledIndices(modifiedList, unshuffledIndices, item => item, arg); // Identity function

    return unshuffledList;
}
function averageArrays(arrays) {
    // Initialize an array to hold the sums of corresponding elements
    let sumArray = [];

    // Calculate the sum of corresponding elements across arrays
    arrays.forEach(array => {
        array.forEach((num, index) => {
            sumArray[index] = (sumArray[index] || 0) + num;
        });
    });

    // Calculate the average by dividing each sum by the number of arrays
    let numArrays = arrays.length;
    let averageArray = sumArray.map(sum => sum / numArrays);

    return averageArray;
}


function checkButton(intendedChemical){
    var intendedLinearObject = convertLinear(intendedChemical.nodes, intendedChemical.lines);
    var myLinearObject = convertLinear(nodes, lines);

    

    var allpercentages = []

    for (let index = 0; index < 20; index++) {
        allpercentages.push(matchLists(intendedLinearObject, myLinearObject));
        
    }
    var percentages = averageArrays(allpercentages);

    intendedChemical.nodes.forEach((node, index) => {
        node.highlight = blendColors("#ff5733", "#33ff57", (percentages[index]));
    });

    nodes = intendedChemical.nodes;
    lines = intendedChemical.lines;
    
}


function compare(a, b) {
    return compareObjects(a,b);
  }
  
  /**
   * Matches elements from the secondary list to the main list and returns a list of match percentages.
   * Each element in the secondary list is assigned to the best matching element in the main list,
   * without using the same element from the main list more than once.
   * @param {number[]} mainList - The main list of elements.
   * @param {number[]} secondaryList - The secondary list of elements.
   * @returns {number[]} A list of match percentages for each element in the secondary list.
   */
  function matchLists(mainList, secondaryList) {
    const matchPercentages = [];
    

    mainList.forEach(element => {
        var bestmatch = -1;
        var matchelemetn;
        var matchindex;
        secondaryList.forEach((secelement, index) => {
            var match = compareObjects(element, secelement);
            if(match > bestmatch){
                bestmatch = match;
                matchelemetn = element;
                matchindex = index;
            }
        });

        matchPercentages.push(bestmatch);
        secondaryList.splice(matchindex, 1);
    });
    return matchPercentages;
  }
  
  function compareObjects(obj1, obj2) {
    var weigh = 1;
    var similarity = 0;

    for (let index = 0; index < 5; index++) {
        weigh = weigh/2;
        similarity += areTheSameNode(obj1, obj2, false, index)?weigh:0;
        
    }
    similarity += 0.03125;

    return similarity;
}