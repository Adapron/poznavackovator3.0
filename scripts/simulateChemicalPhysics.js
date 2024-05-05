//sim
    
            // Constants
            const springConstant = 0.1;
            const dampingFactor = 0.05;
            const repulsionConstant = 100;
    
            // Initialize nodes and lines (assuming you have them stored in 'nodes' and 'lines' arrays)
    
            // Example arrays
            
    
            
    
            
    
            // Function to calculate distance between two points
            function distance(x1, y1, x2, y2) {
                return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            }
    
            // Function to calculate spring force between two nodes
            function springForce(node1, node2) {
                const distanceBetweenNodes = distance(node1.x, node1.y, node2.x, node2.y);
                const displacement = distanceBetweenNodes - 100*sizeMultiplier; // You need to define this value
                const forceMagnitude = springConstant * displacement;
                const dx = (node2.x - node1.x) / distanceBetweenNodes;
                const dy = (node2.y - node1.y) / distanceBetweenNodes;
                return { fx: forceMagnitude * dx, fy: forceMagnitude * dy };
            }
    
            //
            function repulsionForce(node, otherNode) {
                const dx = otherNode.x - node.x;
                const dy = otherNode.y - node.y;
                const distanceSquared = dx * dx + dy * dy;
                const distance = Math.sqrt(distanceSquared);
    
                // Calculate force magnitude (inverse relationship with distance)
                const forceMagnitude = (-1 / distanceSquared) * repulsionConstant;
    
                // Calculate force components
                const fx = forceMagnitude * (dx / distance);
                const fy = forceMagnitude * (dy / distance);
    
                return { fx, fy };
            }

           

            function findLoops(startNode, nodes, lines) {
                const visited = new Set();
                const stack = [{ node: startNode, path: [startNode] }];
            
                while (stack.length > 0) {
                    const { node, path } = stack.pop();
                    visited.add(node.id);
            
                    for (const line of lines) {
                        if (line.startNodeId === node.id || line.endNodeId === node.id) {
                            const nextNodeId = line.startNodeId === node.id ? line.endNodeId : line.startNodeId;
                            const nextNode = nodes.find(n => n.id === nextNodeId);
                            if (!visited.has(nextNode.id) && !path.some(p => p.id === nextNode.id)) {
                                stack.push({ node: nextNode, path: [...path, nextNode] });
                            } else if (path.some(p => p.id === nextNode.id)) {
                                const loop = path.slice(path.findIndex(p => p.id === nextNode.id));
                                if(loop.length>2){
                                    console.log("Found loop:", loop);
                                    return loop;
                                }
                                
                            }
                        }
                    }
                }
            }
    
           
    
            // Function to update positions and velocities of nodes
            function updateNodes() {
    
                if (nodes.length == 0) return;
    
                let sumx = 0;
                let sumy = 0;
                nodes.forEach(node => {
                    sumx += node.x - canvas.width/2;
                    sumy += node.y - canvas.height/2;
                })
    
                sumx = (sumx / nodes.length) * -0.01;
                sumy = (sumy / nodes.length) * -0.01;
    
                nodes.forEach(node => {
                    let totalForceX = 0;
                    let totalForceY = 0;
                    
                    // Calculate spring forces from connected nodes
                    lines.forEach(line => {
                        if (line.startNodeId === node.id) {
                            const connectedNode = nodes.find(n => n.id === line.endNodeId);
                            const { fx, fy } = springForce(node, connectedNode);
                            totalForceX += fx;
                            totalForceY += fy;
                        } else if (line.endNodeId === node.id) {
                            const connectedNode = nodes.find(n => n.id === line.startNodeId);
                            const { fx, fy } = springForce(node, connectedNode);
                            totalForceX += fx;
                            totalForceY += fy;
                        }
                    });

                    
                    
                    
                    // Calculate repulsion forces between all nodes
                    nodes.forEach(otherNode => {
                        if (node.id !== otherNode.id) {
                            const { fx, fy } = repulsionForce(node, otherNode);
                            totalForceX += fx;
                            totalForceY += fy;
                        }
                    });
    
                    // Apply damping
                    totalForceX -= dampingFactor * node.vx;
                    totalForceY -= dampingFactor * node.vy;
    
    
                    node.vx = 0;
                    node.vy = 0;
    
                    // Update velocity
                    node.vx += totalForceX + sumx;
                    node.vy += totalForceY + sumy;
    
                    // Update position
                    node.x += node.vx;
                    node.y += node.vy;
    
                });
            }
    
            setInterval(() => {
                 // Update positions of nodes
                 updateNodes();
    
                // Render nodes and lines (not implemented here)
                redrawCanvas();
    
                
    
            }, 100);
    
            
    
        