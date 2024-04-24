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

function areListsSameCircular(list1, list2, invert) {
    // Find the index of the smallest element in list1
    if(list1.length == 1) return (list1[0].count == list2[0].count && areTheSameNode(list1[0].node,list2[0].node))
    let shiftedArray = list2;
    for (let index = 0; index < list1.length; index++) {
        shiftedArray = [...shiftedArray.slice(1), shiftedArray[0]];
        var foundInconsistency = false;
        for (let j = 0; j < list1.length; j++) {
            if(list1[j].count != shiftedArray[j].count || !areTheSameNode(list1[j].node,shiftedArray[j].node)){
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
function areListsSame(list1, list2, invert) {
    


    // Create a copy of array2 to keep track of matched objects
    const copyArray2 = [...list2];

    // Iterate through array1
    for (let obj1 of list1) {
        // Flag to check if obj1 is found in array2
        
        let found = false;

        // Iterate through copyArray2
        for (let i = 0; i < copyArray2.length; i++) {
            // Check if obj1 is the same as any object in copyArray2
            if (areTheSameNode(obj1.node, copyArray2[i].node, invert)) {
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

function areTheSameNode(node1, node2, invert) {
    if(node1.type != node2.type) return false;
    if(node1.connections.length != node2.connections.length) return false;
    if(node1.connections.length == 0) return true;
    if(node1.connections.some(obj => obj.count > 1)){
        return areListsSameCircular(node1.connections, node2.connections, invert);
    }else{
        return areListsSame(node1.connections, node2.connections, invert);
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
