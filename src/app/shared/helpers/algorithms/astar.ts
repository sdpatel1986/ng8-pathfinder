import { getIndexFromId, assignClassNameToNode } from '../common.helper';
import { Node } from '../../models';

function astar(
  nodes: Node[],
  start: string,
  target: string,
  nodesToAnimate: Node[],
  boardArray: Node[][],
) {
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].totalDistance = 0;
  nodes[start].direction = 'up';
  const unvisitedNodes = Object.keys(nodes);
  while (unvisitedNodes.length) {
    let currentNode = closestNode(nodes, unvisitedNodes);
    while (currentNode.status === 'wall' && unvisitedNodes.length) {
      currentNode = closestNode(nodes, unvisitedNodes);
    }
    if (currentNode.distance === Infinity) {
      return false;
    }
    nodesToAnimate.push(currentNode);
    currentNode.status = 'visited';
    if (currentNode.id === target) {
      return 'success!';
    }
    updateNeighbors(nodes, currentNode, boardArray, target);
  }

  function closestNode(nodesClosest: Node[], unvisitedNodesClosest: any) {
    let currentClosest: any;
    let index: number;
    for (let i = 0; i < unvisitedNodesClosest.length; i++) {
      if (
        !currentClosest ||
        currentClosest.totalDistance >
          nodesClosest[unvisitedNodesClosest[i]].totalDistance
      ) {
        currentClosest = nodesClosest[unvisitedNodesClosest[i]];
        index = i;
      } else if (
        currentClosest.totalDistance ===
        nodesClosest[unvisitedNodesClosest[i]].totalDistance
      ) {
        if (
          currentClosest.heuristicDistance >
          nodesClosest[unvisitedNodesClosest[i]].heuristicDistance
        ) {
          currentClosest = nodesClosest[unvisitedNodesClosest[i]];
          index = i;
        }
      }
    }
    unvisitedNodesClosest.splice(index, 1);
    return currentClosest;
  }

  function updateNeighbors(
    nodesNeighbor,
    node,
    boardArrayNeighbor,
    targetNeighbor,
  ) {
    const neighbors = getNeighbors(node.id, nodesNeighbor, boardArrayNeighbor);
    for (const neighbor of neighbors) {
      if (targetNeighbor) {
        updateNode(
          node,
          nodesNeighbor[neighbor],
          nodesNeighbor[targetNeighbor],
        );
      } else {
        updateNode(node, nodesNeighbor[neighbor]);
      }
    }
  }

  function updateNode(currentNode, targetNode, actualTargetNode = null) {
    const distance = getDistance(currentNode, targetNode);
    if (!targetNode.heuristicDistance) {
      targetNode.heuristicDistance = manhattanDistance(
        targetNode,
        actualTargetNode,
      );
    }
    const distanceToCompare =
      currentNode.distance + targetNode.weight + distance[0];
    if (distanceToCompare < targetNode.distance) {
      targetNode.distance = distanceToCompare;
      targetNode.totalDistance =
        targetNode.distance + targetNode.heuristicDistance;
      targetNode.previousNode = currentNode.id;
      targetNode.path = distance[1];
      targetNode.direction = distance[2];
    }
  }

  function getNeighbors(id, nodesNeighbor, boardArrayNeighbor) {
    const coordinates = id.split('-');
    const x = parseInt(coordinates[0], 10);
    const y = parseInt(coordinates[1], 10);
    const neighbors = [];
    let potentialNeighbor;
    if (boardArrayNeighbor[x - 1] && boardArrayNeighbor[x - 1][y]) {
      potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        neighbors.push(potentialNeighbor);
      }
    }
    if (boardArrayNeighbor[x + 1] && boardArrayNeighbor[x + 1][y]) {
      potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        neighbors.push(potentialNeighbor);
      }
    }
    if (boardArrayNeighbor[x][y - 1]) {
      potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        neighbors.push(potentialNeighbor);
      }
    }
    if (boardArrayNeighbor[x][y + 1]) {
      potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        neighbors.push(potentialNeighbor);
      }
    }
    return neighbors;
  }

  function getDistance(nodeOne, nodeTwo) {
    const currentCoordinates = nodeOne.id.split('-');
    const targetCoordinates = nodeTwo.id.split('-');
    const x1 = parseInt(currentCoordinates[0], 10);
    const y1 = parseInt(currentCoordinates[1], 10);
    const x2 = parseInt(targetCoordinates[0], 10);
    const y2 = parseInt(targetCoordinates[1], 10);
    if (x2 < x1 && y1 === y2) {
      if (nodeOne.direction === 'up') {
        return [1, ['f'], 'up'];
      } else if (nodeOne.direction === 'right') {
        return [2, ['l', 'f'], 'up'];
      } else if (nodeOne.direction === 'left') {
        return [2, ['r', 'f'], 'up'];
      } else if (nodeOne.direction === 'down') {
        return [3, ['r', 'r', 'f'], 'up'];
      } else if (nodeOne.direction === 'up-right') {
        return [1.5, null, 'up'];
      } else if (nodeOne.direction === 'down-right') {
        return [2.5, null, 'up'];
      } else if (nodeOne.direction === 'up-left') {
        return [1.5, null, 'up'];
      } else if (nodeOne.direction === 'down-left') {
        return [2.5, null, 'up'];
      }
    } else if (x2 > x1 && y1 === y2) {
      if (nodeOne.direction === 'up') {
        return [3, ['r', 'r', 'f'], 'down'];
      } else if (nodeOne.direction === 'right') {
        return [2, ['r', 'f'], 'down'];
      } else if (nodeOne.direction === 'left') {
        return [2, ['l', 'f'], 'down'];
      } else if (nodeOne.direction === 'down') {
        return [1, ['f'], 'down'];
      } else if (nodeOne.direction === 'up-right') {
        return [2.5, null, 'down'];
      } else if (nodeOne.direction === 'down-right') {
        return [1.5, null, 'down'];
      } else if (nodeOne.direction === 'up-left') {
        return [2.5, null, 'down'];
      } else if (nodeOne.direction === 'down-left') {
        return [1.5, null, 'down'];
      }
    }
    if (y2 < y1 && x1 === x2) {
      if (nodeOne.direction === 'up') {
        return [2, ['l', 'f'], 'left'];
      } else if (nodeOne.direction === 'right') {
        return [3, ['l', 'l', 'f'], 'left'];
      } else if (nodeOne.direction === 'left') {
        return [1, ['f'], 'left'];
      } else if (nodeOne.direction === 'down') {
        return [2, ['r', 'f'], 'left'];
      } else if (nodeOne.direction === 'up-right') {
        return [2.5, null, 'left'];
      } else if (nodeOne.direction === 'down-right') {
        return [2.5, null, 'left'];
      } else if (nodeOne.direction === 'up-left') {
        return [1.5, null, 'left'];
      } else if (nodeOne.direction === 'down-left') {
        return [1.5, null, 'left'];
      }
    } else if (y2 > y1 && x1 === x2) {
      if (nodeOne.direction === 'up') {
        return [2, ['r', 'f'], 'right'];
      } else if (nodeOne.direction === 'right') {
        return [1, ['f'], 'right'];
      } else if (nodeOne.direction === 'left') {
        return [3, ['r', 'r', 'f'], 'right'];
      } else if (nodeOne.direction === 'down') {
        return [2, ['l', 'f'], 'right'];
      } else if (nodeOne.direction === 'up-right') {
        return [1.5, null, 'right'];
      } else if (nodeOne.direction === 'down-right') {
        return [1.5, null, 'right'];
      } else if (nodeOne.direction === 'up-left') {
        return [2.5, null, 'right'];
      } else if (nodeOne.direction === 'down-left') {
        return [2.5, null, 'right'];
      }
    }
  }

  function manhattanDistance(nodeOne, nodeTwo) {
    const nodeOneCoordinates = nodeOne.id
      .split('-')
      .map((ele: string) => parseInt(ele, 10));
    const nodeTwoCoordinates = nodeTwo.id
      .split('-')
      .map((ele: string) => parseInt(ele, 10));
    const xOne = nodeOneCoordinates[0];
    const xTwo = nodeTwoCoordinates[0];
    const yOne = nodeOneCoordinates[1];
    const yTwo = nodeTwoCoordinates[1];

    const xChange = Math.abs(xOne - xTwo);
    const yChange = Math.abs(yOne - yTwo);

    return xChange + yChange;
  }
}

function bidirectional(
  nodes,
  start,
  target,
  nodesToAnimate,
  boardArray,
  name,
  heuristic,
  board,
) {
  if (name === 'astar') {
    return astar(nodes, start, target, nodesToAnimate, boardArray);
  }
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].direction = 'right';
  nodes[target].otherdistance = 0;
  nodes[target].otherdirection = 'left';
  const visitedNodes = {};
  const unvisitedNodesOne = Object.keys(nodes);
  const unvisitedNodesTwo = Object.keys(nodes);
  while (unvisitedNodesOne.length && unvisitedNodesTwo.length) {
    let currentNode = closestNode(nodes, unvisitedNodesOne);
    let secondCurrentNode = closestNodeTwo(nodes, unvisitedNodesTwo);
    while (
      (currentNode.status === 'wall' || secondCurrentNode.status === 'wall') &&
      unvisitedNodesOne.length &&
      unvisitedNodesTwo.length
    ) {
      if (currentNode.status === 'wall') {
        currentNode = closestNode(nodes, unvisitedNodesOne);
      }
      if (secondCurrentNode.status === 'wall') {
        secondCurrentNode = closestNodeTwo(nodes, unvisitedNodesTwo);
      }
    }
    if (
      currentNode.distance === Infinity ||
      secondCurrentNode.otherdistance === Infinity
    ) {
      return false;
    }
    nodesToAnimate.push(currentNode);
    nodesToAnimate.push(secondCurrentNode);
    currentNode.status = 'visited';
    secondCurrentNode.status = 'visited';
    if (visitedNodes[currentNode.id]) {
      board.middleNode = currentNode.id;
      return 'success';
    } else if (visitedNodes[secondCurrentNode.id]) {
      board.middleNode = secondCurrentNode.id;
      return 'success';
    } else if (currentNode === secondCurrentNode) {
      board.middleNode = secondCurrentNode.id;
      return 'success';
    }
    visitedNodes[currentNode.id] = true;
    visitedNodes[secondCurrentNode.id] = true;
    updateNeighbors(nodes, currentNode, boardArray, target);
    updateNeighborsTwo(nodes, secondCurrentNode, boardArray, start);
  }

  function closestNode(nodesClosest: Node[], unvisitedNodes: string[]) {
    let currentClosest: Node;
    let index: number;
    for (let i = 0; i < unvisitedNodes.length; i++) {
      if (
        !currentClosest ||
        currentClosest.distance > nodesClosest[unvisitedNodes[i]].distance
      ) {
        currentClosest = nodesClosest[unvisitedNodes[i]];
        index = i;
      }
    }
    unvisitedNodes.splice(index, 1);
    return currentClosest;
  }

  function closestNodeTwo(nodesClosest, unvisitedNodes) {
    let currentClosest;
    let index;
    for (let i = 0; i < unvisitedNodes.length; i++) {
      if (
        !currentClosest ||
        currentClosest.otherdistance >
          nodesClosest[unvisitedNodes[i]].otherdistance
      ) {
        currentClosest = nodesClosest[unvisitedNodes[i]];
        index = i;
      }
    }
    unvisitedNodes.splice(index, 1);
    return currentClosest;
  }

  function updateNeighbors(
    nodesNeighbor,
    node,
    boardArrayNeighbor,
    targetNeighbor,
  ) {
    const neighbors = getNeighbors(node.id, nodesNeighbor, boardArrayNeighbor);
    for (const neighbor of neighbors) {
      updateNode(node, nodesNeighbor[neighbor], nodesNeighbor[targetNeighbor]);
    }
  }

  function updateNeighborsTwo(
    nodesNeighbor,
    node,
    boardArrayNeighbor,
    targetNeighbor,
  ) {
    const neighbors = getNeighbors(node.id, nodesNeighbor, boardArrayNeighbor);
    for (const neighbor of neighbors) {
      updateNodeTwo(
        node,
        nodesNeighbor[neighbor],
        nodesNeighbor[targetNeighbor],
      );
    }
  }

  function updateNode(currentNode, targetNode, actualTargetNode) {
    const distance: any[] = getDistance(currentNode, targetNode);
    const weight = targetNode.weight === 15 ? 15 : 1;
    const distanceToCompare =
      currentNode.distance +
      (weight + distance[0]) * manhattanDistance(targetNode, actualTargetNode);
    if (distanceToCompare < targetNode.distance) {
      targetNode.distance = distanceToCompare;
      targetNode.previousNode = currentNode.id;
      targetNode.path = distance[1];
      targetNode.direction = distance[2];
    }
  }

  function updateNodeTwo(currentNode, targetNode, actualTargetNode) {
    const distance: any[] = getDistanceTwo(currentNode, targetNode);
    const weight = targetNode.weight === 15 ? 15 : 1;
    const distanceToCompare =
      currentNode.otherdistance +
      (weight + distance[0]) * manhattanDistance(targetNode, actualTargetNode);
    if (distanceToCompare < targetNode.otherdistance) {
      targetNode.otherdistance = distanceToCompare;
      targetNode.otherpreviousNode = currentNode.id;
      targetNode.path = distance[1];
      targetNode.otherdirection = distance[2];
    }
  }

  function getNeighbors(id, nodesNeighbor, boardArrayNeighbor) {
    const coordinates = id.split('-');
    const x = parseInt(coordinates[0], 10);
    const y = parseInt(coordinates[1], 10);
    const neighbors = [];
    let potentialNeighbor;
    if (boardArrayNeighbor[x - 1] && boardArrayNeighbor[x - 1][y]) {
      potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        neighbors.push(potentialNeighbor);
      }
    }
    if (boardArrayNeighbor[x + 1] && boardArrayNeighbor[x + 1][y]) {
      potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        neighbors.push(potentialNeighbor);
      }
    }
    if (boardArrayNeighbor[x][y - 1]) {
      potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        neighbors.push(potentialNeighbor);
      }
    }
    if (boardArrayNeighbor[x][y + 1]) {
      potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        neighbors.push(potentialNeighbor);
      }
    }
    return neighbors;
  }

  function getDistance(nodeOne, nodeTwo) {
    const currentCoordinates = nodeOne.id.split('-');
    const targetCoordinates = nodeTwo.id.split('-');
    const x1 = parseInt(currentCoordinates[0], 10);
    const y1 = parseInt(currentCoordinates[1], 10);
    const x2 = parseInt(targetCoordinates[0], 10);
    const y2 = parseInt(targetCoordinates[1], 10);
    if (x2 < x1) {
      if (nodeOne.direction === 'up') {
        return [1, ['f'], 'up'];
      } else if (nodeOne.direction === 'right') {
        return [2, ['l', 'f'], 'up'];
      } else if (nodeOne.direction === 'left') {
        return [2, ['r', 'f'], 'up'];
      } else if (nodeOne.direction === 'down') {
        return [3, ['r', 'r', 'f'], 'up'];
      }
    } else if (x2 > x1) {
      if (nodeOne.direction === 'up') {
        return [3, ['r', 'r', 'f'], 'down'];
      } else if (nodeOne.direction === 'right') {
        return [2, ['r', 'f'], 'down'];
      } else if (nodeOne.direction === 'left') {
        return [2, ['l', 'f'], 'down'];
      } else if (nodeOne.direction === 'down') {
        return [1, ['f'], 'down'];
      }
    }
    if (y2 < y1) {
      if (nodeOne.direction === 'up') {
        return [2, ['l', 'f'], 'left'];
      } else if (nodeOne.direction === 'right') {
        return [3, ['l', 'l', 'f'], 'left'];
      } else if (nodeOne.direction === 'left') {
        return [1, ['f'], 'left'];
      } else if (nodeOne.direction === 'down') {
        return [2, ['r', 'f'], 'left'];
      }
    } else if (y2 > y1) {
      if (nodeOne.direction === 'up') {
        return [2, ['r', 'f'], 'right'];
      } else if (nodeOne.direction === 'right') {
        return [1, ['f'], 'right'];
      } else if (nodeOne.direction === 'left') {
        return [3, ['r', 'r', 'f'], 'right'];
      } else if (nodeOne.direction === 'down') {
        return [2, ['l', 'f'], 'right'];
      }
    }
  }

  function getDistanceTwo(nodeOne, nodeTwo) {
    const currentCoordinates = nodeOne.id.split('-');
    const targetCoordinates = nodeTwo.id.split('-');
    const x1 = parseInt(currentCoordinates[0], 10);
    const y1 = parseInt(currentCoordinates[1], 10);
    const x2 = parseInt(targetCoordinates[0], 10);
    const y2 = parseInt(targetCoordinates[1], 10);
    if (x2 < x1) {
      if (nodeOne.otherdirection === 'up') {
        return [1, ['f'], 'up'];
      } else if (nodeOne.otherdirection === 'right') {
        return [2, ['l', 'f'], 'up'];
      } else if (nodeOne.otherdirection === 'left') {
        return [2, ['r', 'f'], 'up'];
      } else if (nodeOne.otherdirection === 'down') {
        return [3, ['r', 'r', 'f'], 'up'];
      }
    } else if (x2 > x1) {
      if (nodeOne.otherdirection === 'up') {
        return [3, ['r', 'r', 'f'], 'down'];
      } else if (nodeOne.otherdirection === 'right') {
        return [2, ['r', 'f'], 'down'];
      } else if (nodeOne.otherdirection === 'left') {
        return [2, ['l', 'f'], 'down'];
      } else if (nodeOne.otherdirection === 'down') {
        return [1, ['f'], 'down'];
      }
    }
    if (y2 < y1) {
      if (nodeOne.otherdirection === 'up') {
        return [2, ['l', 'f'], 'left'];
      } else if (nodeOne.otherdirection === 'right') {
        return [3, ['l', 'l', 'f'], 'left'];
      } else if (nodeOne.otherdirection === 'left') {
        return [1, ['f'], 'left'];
      } else if (nodeOne.otherdirection === 'down') {
        return [2, ['r', 'f'], 'left'];
      }
    } else if (y2 > y1) {
      if (nodeOne.otherdirection === 'up') {
        return [2, ['r', 'f'], 'right'];
      } else if (nodeOne.otherdirection === 'right') {
        return [1, ['f'], 'right'];
      } else if (nodeOne.otherdirection === 'left') {
        return [3, ['r', 'r', 'f'], 'right'];
      } else if (nodeOne.otherdirection === 'down') {
        return [2, ['l', 'f'], 'right'];
      }
    }
  }

  function manhattanDistance(nodeOne, nodeTwo) {
    const nodeOneCoordinates = nodeOne.id
      .split('-')
      .map((ele: string) => parseInt(ele, 10));
    const nodeTwoCoordinates = nodeTwo.id
      .split('-')
      .map((ele: string) => parseInt(ele, 10));
    const xChange = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
    const yChange = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);
    return xChange + yChange;
  }
}

function unweightedSearchAlgorithm(
  nodes,
  start,
  target,
  nodesToAnimate,
  boardArray,
  name,
) {
  if (!start || !target || start === target) {
    return false;
  }
  const structure = [nodes[start]];
  const exploredNodes = { start: true };
  while (structure.length) {
    const currentNode = name === 'bfs' ? structure.shift() : structure.pop();
    nodesToAnimate.push(currentNode);
    if (name === 'dfs') {
      exploredNodes[currentNode.id] = true;
    }
    currentNode.status = 'visited';
    if (currentNode.id === target) {
      return 'success';
    }
    const currentNeighbors = getNeighbors(
      currentNode.id,
      nodes,
      boardArray,
      name,
    );
    currentNeighbors.forEach(neighbor => {
      if (!exploredNodes[neighbor]) {
        if (name === 'bfs') {
          exploredNodes[neighbor] = true;
        }
        nodes[neighbor].previousNode = currentNode.id;
        structure.push(nodes[neighbor]);
      }
    });
  }
  return false;

  function getNeighbors(id, nodesNeighbor, boardArrayNeighbor, nameNeighbor) {
    const coordinates = id.split('-');
    const x = parseInt(coordinates[0], 10);
    const y = parseInt(coordinates[1], 10);
    const neighbors = [];
    let potentialNeighbor;
    if (boardArrayNeighbor[x - 1] && boardArrayNeighbor[x - 1][y]) {
      potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        if (nameNeighbor === 'bfs') {
          neighbors.push(potentialNeighbor);
        } else {
          neighbors.unshift(potentialNeighbor);
        }
      }
    }
    if (boardArrayNeighbor[x][y + 1]) {
      potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        if (nameNeighbor === 'bfs') {
          neighbors.push(potentialNeighbor);
        } else {
          neighbors.unshift(potentialNeighbor);
        }
      }
    }
    if (boardArrayNeighbor[x + 1] && boardArrayNeighbor[x + 1][y]) {
      potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        if (nameNeighbor === 'bfs') {
          neighbors.push(potentialNeighbor);
        } else {
          neighbors.unshift(potentialNeighbor);
        }
      }
    }
    if (boardArrayNeighbor[x][y - 1]) {
      potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        if (nameNeighbor === 'bfs') {
          neighbors.push(potentialNeighbor);
        } else {
          neighbors.unshift(potentialNeighbor);
        }
      }
    }
    return neighbors;
  }
}

function weightedSearchAlgorithm(
  nodes,
  start,
  target,
  nodesToAnimate,
  boardArray,
  name,
  heuristic = null,
) {
  if (name === 'astar') {
    return astar(nodes, start, target, nodesToAnimate, boardArray);
  }
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].direction = 'right';
  const unvisitedNodes = Object.keys(nodes);
  while (unvisitedNodes.length) {
    let currentNode = closestNode(nodes, unvisitedNodes);
    while (currentNode.status === 'wall' && unvisitedNodes.length) {
      currentNode = closestNode(nodes, unvisitedNodes);
    }
    if (currentNode.distance === Infinity) {
      return false;
    }
    nodesToAnimate.push(currentNode);
    currentNode.status = 'visited';
    if (currentNode.id === target) {
      return 'success!';
    }
    if (name === 'CLA' || name === 'greedy') {
      updateNeighbors(nodes, currentNode, boardArray, target, name, heuristic);
    } else if (name === 'dijkstra') {
      updateNeighbors(nodes, currentNode, boardArray);
    }
  }

  function closestNode(nodesClosest, unvisitedNodesClosest) {
    let currentClosest: Node;
    let index: number;
    for (let i = 0; i < unvisitedNodesClosest.length; i++) {
      if (
        !currentClosest ||
        currentClosest.distance >
          nodesClosest[unvisitedNodesClosest[i]].distance
      ) {
        currentClosest = nodesClosest[unvisitedNodesClosest[i]];
        index = i;
      }
    }
    unvisitedNodesClosest.splice(index, 1);
    return currentClosest;
  }

  function updateNeighbors(
    nodesNeighbor,
    node,
    boardArrayNeighbor = null,
    targetNeighbor = null,
    nameNeighbor = null,
    heuristicNeighbor = null,
  ) {
    const neighbors = getNeighbors(node.id, nodesNeighbor, boardArrayNeighbor);
    for (const neighbor of neighbors) {
      if (targetNeighbor) {
        updateNode(
          node,
          nodesNeighbor[neighbor],
          nodesNeighbor[targetNeighbor],
          nameNeighbor,
          heuristicNeighbor,
        );
      } else {
        updateNode(node, nodesNeighbor[neighbor]);
      }
    }
  }

  function updateNode(
    currentNode,
    targetNode,
    actualTargetNode = null,
    nameNode = null,
    heuristicNode = null,
  ) {
    const distance: any[] = getDistance(currentNode, targetNode);
    let distanceToCompare;
    if (actualTargetNode && nameNode === 'CLA') {
      const weight = targetNode.weight === 15 ? 15 : 1;
      if (heuristicNode === 'manhattanDistance') {
        distanceToCompare =
          currentNode.distance +
          (distance[0] + weight) *
            manhattanDistance(targetNode, actualTargetNode);
      } else if (heuristicNode === 'poweredManhattanDistance') {
        distanceToCompare =
          currentNode.distance +
          targetNode.weight +
          distance[0] +
          Math.pow(manhattanDistance(targetNode, actualTargetNode), 2);
      } else if (heuristicNode === 'extraPoweredManhattanDistance') {
        distanceToCompare =
          currentNode.distance +
          (distance[0] + weight) *
            Math.pow(manhattanDistance(targetNode, actualTargetNode), 7);
      }
    } else if (actualTargetNode && nameNode === 'greedy') {
      distanceToCompare =
        targetNode.weight +
        distance[0] +
        manhattanDistance(targetNode, actualTargetNode);
    } else {
      distanceToCompare =
        currentNode.distance + targetNode.weight + distance[0];
    }
    if (distanceToCompare < targetNode.distance) {
      targetNode.distance = distanceToCompare;
      targetNode.previousNode = currentNode.id;
      targetNode.path = distance[1];
      targetNode.direction = distance[2];
    }
  }

  function getNeighbors(id, nodesNeighbor, boardArrayNeighbor) {
    const coordinates = id.split('-');
    const x = parseInt(coordinates[0], 10);
    const y = parseInt(coordinates[1], 10);
    const neighbors = [];
    let potentialNeighbor;
    if (boardArrayNeighbor[x - 1] && boardArrayNeighbor[x - 1][y]) {
      potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        neighbors.push(potentialNeighbor);
      }
    }
    if (boardArrayNeighbor[x + 1] && boardArrayNeighbor[x + 1][y]) {
      potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        neighbors.push(potentialNeighbor);
      }
    }
    if (boardArrayNeighbor[x][y - 1]) {
      potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        neighbors.push(potentialNeighbor);
      }
    }
    if (boardArrayNeighbor[x][y + 1]) {
      potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`;
      if (nodesNeighbor[potentialNeighbor].status !== 'wall') {
        neighbors.push(potentialNeighbor);
      }
    }
    return neighbors;
  }

  function getDistance(nodeOne, nodeTwo) {
    const currentCoordinates = nodeOne.id.split('-');
    const targetCoordinates = nodeTwo.id.split('-');
    const x1 = parseInt(currentCoordinates[0], 10);
    const y1 = parseInt(currentCoordinates[1], 10);
    const x2 = parseInt(targetCoordinates[0], 10);
    const y2 = parseInt(targetCoordinates[1], 10);

    if (x2 < x1) {
      if (nodeOne.direction === 'up') {
        return [1, ['f'], 'up'];
      } else if (nodeOne.direction === 'right') {
        return [2, ['l', 'f'], 'up'];
      } else if (nodeOne.direction === 'left') {
        return [2, ['r', 'f'], 'up'];
      } else if (nodeOne.direction === 'down') {
        return [3, ['r', 'r', 'f'], 'up'];
      }
    } else if (x2 > x1) {
      if (nodeOne.direction === 'up') {
        return [3, ['r', 'r', 'f'], 'down'];
      } else if (nodeOne.direction === 'right') {
        return [2, ['r', 'f'], 'down'];
      } else if (nodeOne.direction === 'left') {
        return [2, ['l', 'f'], 'down'];
      } else if (nodeOne.direction === 'down') {
        return [1, ['f'], 'down'];
      }
    }
    if (y2 < y1) {
      if (nodeOne.direction === 'up') {
        return [2, ['l', 'f'], 'left'];
      } else if (nodeOne.direction === 'right') {
        return [3, ['l', 'l', 'f'], 'left'];
      } else if (nodeOne.direction === 'left') {
        return [1, ['f'], 'left'];
      } else if (nodeOne.direction === 'down') {
        return [2, ['r', 'f'], 'left'];
      }
    } else if (y2 > y1) {
      if (nodeOne.direction === 'up') {
        return [2, ['r', 'f'], 'right'];
      } else if (nodeOne.direction === 'right') {
        return [1, ['f'], 'right'];
      } else if (nodeOne.direction === 'left') {
        return [3, ['r', 'r', 'f'], 'right'];
      } else if (nodeOne.direction === 'down') {
        return [2, ['l', 'f'], 'right'];
      }
    }
  }

  function manhattanDistance(nodeOne, nodeTwo) {
    const nodeOneCoordinates = nodeOne.id
      .split('-')
      .map(ele => parseInt(ele, 10));
    const nodeTwoCoordinates = nodeTwo.id
      .split('-')
      .map(ele => parseInt(ele, 10));
    const xChange = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
    const yChange = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);
    return xChange + yChange;
  }
}

function launchAnimations(
  board,
  success,
  type,
  object = null,
  algorithm = null,
  heuristic = null,
) {
  const nodes = object
    ? board.objectNodesToAnimate.slice(0)
    : board.nodesToAnimate.slice(0);
  const speed =
    board.speed === 'fast' ? 0 : board.speed === 'average' ? 100 : 500;
  let shortestNodes;
  function timeout(index) {
    setTimeout(() => {
      if (index === nodes.length) {
        if (object) {
          board.objectNodesToAnimate = [];
          if (success) {
            board.addShortestPath(board.object, board.start, 'object');
            board.clearNodeStatuses();
            let newSuccess;
            if (board.currentAlgorithm === 'bidirectional') {
            } else {
              if (type === 'weighted') {
                newSuccess = weightedSearchAlgorithm(
                  board.nodes,
                  board.object,
                  board.target,
                  board.nodesToAnimate,
                  board.boardArray,
                  algorithm,
                  heuristic,
                );
              } else {
                newSuccess = unweightedSearchAlgorithm(
                  board.nodes,
                  board.object,
                  board.target,
                  board.nodesToAnimate,
                  board.boardArray,
                  algorithm,
                );
              }
            }

            assignClassNameToNode(board, board.object, 'visitedObjectNode');
            launchAnimations(board, newSuccess, type);
            return;
          } else {
            console.log('Failure.');
            board.reset();
            board.toggleButtons();
            return;
          }
        } else {
          board.nodesToAnimate = [];
          if (success) {
            if (board.nodes[board.target].status !== 'visitedTargetNodeBlue') {
              assignClassNameToNode(
                board,
                board.target,
                'visitedTargetNodeBlue',
              );
            }
            if (board.isObject) {
              board.addShortestPath(board.target, board.object);
              board.drawShortestPathTimeout(
                board.target,
                board.object,
                type,
                'object',
              );
              board.objectShortestPathNodesToAnimate = [];
              board.shortestPathNodesToAnimate = [];
              board.reset('objectNotTransparent');
            } else {
              board.drawShortestPathTimeout(board.target, board.start, type);
              board.objectShortestPathNodesToAnimate = [];
              board.shortestPathNodesToAnimate = [];
              board.reset();
            }
            shortestNodes = board.objectShortestPathNodesToAnimate.concat(
              board.shortestPathNodesToAnimate,
            );
            return;
          } else {
            console.log('Failure.');
            board.reset();
            board.toggleButtons();
            return;
          }
        }
      } else if (index === 0) {
        if (object) {
          assignClassNameToNode(board, board.start, 'visitedStartNodePurple');
        } else {
          if (board.nodes[board.start].className !== 'visitedStartNodePurple') {
            assignClassNameToNode(board, board.start, 'visitedStartNodeBlue');
          }
        }
        if (board.currentAlgorithm === 'bidirectional') {
          assignClassNameToNode(board, board.target, 'visitedTargetNodeBlue');
        }
        change(board, nodes[index]);
      } else if (
        index === nodes.length - 1 &&
        board.currentAlgorithm === 'bidirectional'
      ) {
        change(board, nodes[index], nodes[index - 1], 'bidirectional');
      } else {
        change(board, nodes[index], nodes[index - 1]);
      }
      timeout(index + 1);
    }, speed);
  }

  function change(
    boardChange,
    currentNode,
    previousNode = null,
    bidirectionalChange = null,
  ) {
    const currentIndex = getIndexFromId(currentNode.id);
    const currentHTMLNode = boardChange.nodes[currentNode.id];

    const relevantClassNames = [
      'start',
      'target',
      'object',
      'visitedStartNodeBlue',
      'visitedStartNodePurple',
      'visitedObjectNode',
      'visitedTargetNodePurple',
      'visitedTargetNodeBlue',
    ];
    if (!relevantClassNames.includes(currentHTMLNode.className)) {
      const className = !bidirectionalChange
        ? 'current'
        : currentNode.weight === 15
        ? 'visited weight'
        : 'visited';
      assignClassNameToNode(boardChange, currentNode.id, className);
    }
    if (currentHTMLNode.className === 'visitedStartNodePurple' && !object) {
      assignClassNameToNode(
        boardChange,
        currentNode.id,
        'visitedStartNodeBlue',
      );
    }
    if (currentHTMLNode.className === 'target' && object) {
      assignClassNameToNode(
        boardChange,
        currentNode.id,
        'visitedTargetNodePurple',
      );
    }
    if (previousNode) {
      const previousHTMLNode = boardChange.nodes[previousNode.id];
      const previousIndex = getIndexFromId(previousNode.id);

      if (!relevantClassNames.includes(previousHTMLNode.className)) {
        if (object) {
          const className =
            previousNode.weight === 15
              ? 'visitedobject weight'
              : 'visitedobject';
          assignClassNameToNode(boardChange, previousNode.id, className);
        } else {
          const className =
            previousNode.weight === 15 ? 'visited weight' : 'visited';
          assignClassNameToNode(boardChange, previousNode.id, className);
        }
      }
    }
  }

  timeout(0);
}

export {
  astar,
  bidirectional,
  unweightedSearchAlgorithm,
  weightedSearchAlgorithm,
  launchAnimations,
};
