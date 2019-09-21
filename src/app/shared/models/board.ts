import Node from './node';
import {
  getDistance,
  getIndexFromId,
  weightedSearchAlgorithm,
  unweightedSearchAlgorithm,
  bidirectional,
  launchAnimations,
  launchInstantAnimations,
  mazeGenerationAnimations,
  stairDemonstration,
  assignClassNameToNode,
} from '../helpers';
import { ALGORITHMS } from '../constants';

export default class Board {
  public width: number;
  public height: number;
  public start: string = null;
  public target: string = null;
  public middleNode: string = null;
  public object: string = null;
  public boardArray: Node[][];
  public nodes: object;
  public nodesToAnimate: any[];
  public objectNodesToAnimate: any[];
  public shortestPathNodesToAnimate: any[];
  public objectShortestPathNodesToAnimate: any[];
  public wallsToAnimate: any[];
  public mouseDown = false;
  public pressedNodeStatus: string;
  public previouslyPressedNodeStatus: any;
  public previouslySwitchedNode: any;
  public previouslySwitchedNodeWeight: number;
  public keyDown: any;
  public algoDone: boolean;
  public currentAlgorithm: any;
  public currentHeuristic: any;
  public numberOfObjects: number;
  public isObject: boolean;
  public buttonsOn: boolean;
  public speed: string;
  counter = 1;

  constructor(height: number = 24, width: number = 24) {
    this.width = width;
    this.height = height;
    this.start = null;
    this.target = null;
    this.object = null;
    this.boardArray = [];
    this.nodes = {};
    this.nodesToAnimate = [];
    this.objectNodesToAnimate = [];
    this.shortestPathNodesToAnimate = [];
    this.objectShortestPathNodesToAnimate = [];
    this.wallsToAnimate = [];
    this.mouseDown = false;
    this.pressedNodeStatus = 'normal';
    this.previouslyPressedNodeStatus = null;
    this.previouslySwitchedNode = null;
    this.previouslySwitchedNodeWeight = 0;
    this.keyDown = false;
    this.algoDone = false;
    this.currentAlgorithm = ALGORITHMS.DIJIKSTRA;
    this.currentHeuristic = null;
    this.numberOfObjects = 0;
    this.isObject = false;
    this.buttonsOn = false;
    this.speed = 'fast';
  }

  public initialise(): void {
    this.createGrid();
  }

  public createGrid(): void {
    for (let r = 0; r < this.height; r++) {
      const currentArrayRow = [];
      for (let c = 0; c < this.width; c++) {
        const newNodeId = `${r}-${c}`;
        let newNodeClass: string;
        let newNode: Node;
        if (
          r === Math.floor(this.height / 2) &&
          c === Math.floor(this.width / 4)
        ) {
          newNodeClass = 'start';
          this.start = `${newNodeId}`;
        } else if (
          r === Math.floor(this.height / 2) &&
          c === Math.floor((3 * this.width) / 4)
        ) {
          newNodeClass = 'target';
          this.target = `${newNodeId}`;
        } else {
          newNodeClass = 'unvisited';
        }
        newNode = new Node(newNodeId, newNodeClass);
        currentArrayRow.push(newNode);
        this.nodes[`${newNodeId}`] = newNode;
      }
      this.boardArray.push(currentArrayRow);
    }
  }

  public getNode(id: string): Node {
    const coordinates = id.split('-');
    const r = parseInt(coordinates[0], 10);
    const c = parseInt(coordinates[1], 10);
    return this.boardArray[r][c];
  }

  public changeSpecialNode(currentNode: any): void {
    let previousElement;
    if (this.previouslySwitchedNode) {
      previousElement = this.previouslySwitchedNode;
    }
    if (
      currentNode.status !== 'target' &&
      currentNode.status !== 'start' &&
      currentNode.status !== 'object'
    ) {
      if (this.previouslySwitchedNode) {
        this.previouslySwitchedNode.status = this.previouslyPressedNodeStatus;
        previousElement.className =
          this.previouslySwitchedNodeWeight === 15
            ? 'unvisited weight'
            : this.previouslyPressedNodeStatus;

        this.previouslySwitchedNode.weight =
          this.previouslySwitchedNodeWeight === 15 ? 15 : 0;
        this.previouslySwitchedNode = null;
        this.previouslySwitchedNodeWeight = currentNode.weight;

        this.previouslyPressedNodeStatus = currentNode.status;
        currentNode.status = this.pressedNodeStatus;
        currentNode.className = this.pressedNodeStatus;

        currentNode.weight = 0;
      }
    } else if (
      currentNode.status !== this.pressedNodeStatus &&
      !this.algoDone
    ) {
      this.previouslySwitchedNode.status = this.pressedNodeStatus;
      previousElement.className = this.pressedNodeStatus;
    } else if (currentNode.status === this.pressedNodeStatus) {
      this.previouslySwitchedNode = currentNode;
      currentNode.status = this.previouslyPressedNodeStatus;
      currentNode.className = this.previouslyPressedNodeStatus;
    }
  }

  public changeNormalNode(currentNode: any): void {
    const relevantStatuses = ['start', 'target', 'object'];
    const unweightedAlgorithms = ['dfs', 'bfs'];
    if (!this.keyDown) {
      if (
        !relevantStatuses.includes(currentNode.status) &&
        !currentNode.status.includes('start')
      ) {
        currentNode.className =
          currentNode.status !== 'wall' ? 'wall' : 'unvisited';
        currentNode.status =
          currentNode.className !== 'wall' ? 'unvisited' : 'wall';
        currentNode.weight = 0;
      }
    } else if (
      this.keyDown === 87 &&
      !unweightedAlgorithms.includes(this.currentAlgorithm) &&
      !currentNode.status.includes('start')
    ) {
      if (!relevantStatuses.includes(currentNode.status)) {
        currentNode.className =
          currentNode.weight !== 15 ? 'unvisited weight' : 'unvisited';
        currentNode.weight =
          currentNode.className !== 'unvisited weight' ? 0 : 15;
        currentNode.status = 'unvisited';
      }
    }
  }

  public drawShortestPath(targetNodeId, startNodeId, object): void {
    let currentNode;
    let secondCurrentNode;
    if (this.currentAlgorithm !== 'bidirectional') {
      currentNode = this.nodes[this.nodes[targetNodeId].previousNode];
      if (object) {
        while (currentNode.id !== startNodeId) {
          this.objectShortestPathNodesToAnimate.unshift(currentNode);
          currentNode = this.nodes[currentNode.previousNode];
        }
      } else {
        while (currentNode.id !== startNodeId) {
          this.shortestPathNodesToAnimate.unshift(currentNode);

          this.nodes[currentNode.id].status = 'shortest-path';
          const index = getIndexFromId(currentNode.id);
          this.boardArray[index[0]][index[1]].className = 'shortest-path';
          currentNode = this.nodes[currentNode.previousNode];
        }
      }
    } else {
      if (this.middleNode !== this.target && this.middleNode !== this.start) {
        currentNode = this.nodes[this.nodes[this.middleNode].previousNode];
        secondCurrentNode = this.nodes[
          this.nodes[this.middleNode].otherpreviousNode
        ];
        if (secondCurrentNode.id === this.target) {
          this.nodes[this.target].direction = getDistance(
            this.nodes[this.middleNode],
            this.nodes[this.target],
          )[2];
        }
        if (this.nodes[this.middleNode].weight === 0) {
          this.nodes[this.middleNode].className = 'shortest-path';
          const index = getIndexFromId(this.middleNode);
          this.boardArray[index[0]][index[1]].className = `shortest-path`;
        } else {
          this.nodes[this.middleNode].className = 'shortest-path weight';
          const index = getIndexFromId(this.middleNode);
          this.boardArray[index[0]][
            index[1]
          ].className = `shortest-path weight`;
        }
        while (currentNode.id !== startNodeId) {
          this.shortestPathNodesToAnimate.unshift(currentNode);
          this.nodes[currentNode.id].className = 'shortest-path';
          const index = getIndexFromId(currentNode.id);
          this.boardArray[index[0]][index[1]].className = `shortest-path`;
          currentNode = this.nodes[currentNode.previousNode];
        }
        while (secondCurrentNode.id !== targetNodeId) {
          this.shortestPathNodesToAnimate.unshift(secondCurrentNode);
          this.nodes[secondCurrentNode.id].className = 'shortest-path';
          const index = getIndexFromId(secondCurrentNode.id);
          this.boardArray[index[0]][index[1]].className = `shortest-path`;
          if (secondCurrentNode.otherpreviousNode === targetNodeId) {
            if (secondCurrentNode.otherdirection === 'left') {
              secondCurrentNode.direction = 'right';
            } else if (secondCurrentNode.otherdirection === 'right') {
              secondCurrentNode.direction = 'left';
            } else if (secondCurrentNode.otherdirection === 'up') {
              secondCurrentNode.direction = 'down';
            } else if (secondCurrentNode.otherdirection === 'down') {
              secondCurrentNode.direction = 'up';
            }
            this.nodes[this.target].direction = getDistance(
              secondCurrentNode,
              this.nodes[this.target],
            )[2];
          }
          secondCurrentNode = this.nodes[secondCurrentNode.otherpreviousNode];
        }
      } else {
        const previousNode = this.nodes[this.target].previousNode;
        this.nodes[this.target].previousNode.className = 'shortest-path';
        const index = getIndexFromId(previousNode.id);
        this.boardArray[index[0]][index[1]].status = `shortest-path`;
      }
    }
  }

  public addShortestPath(targetNodeId, startNodeId, object): void {
    let currentNode = this.nodes[this.nodes[targetNodeId].previousNode];
    if (object) {
      while (currentNode.id !== startNodeId) {
        this.objectShortestPathNodesToAnimate.unshift(currentNode);
        currentNode.relatesToObject = true;
        currentNode = this.nodes[currentNode.previousNode];
      }
    } else {
      while (currentNode.id !== startNodeId) {
        this.shortestPathNodesToAnimate.unshift(currentNode);
        currentNode = this.nodes[currentNode.previousNode];
      }
    }
  }

  public drawShortestPathTimeout(
    targetNodeId,
    startNodeId,
    type,
    object,
  ): void {
    const board = this;
    let currentNode;
    let secondCurrentNode;
    let currentNodesToAnimate;

    if (board.currentAlgorithm !== 'bidirectional') {
      currentNode = board.nodes[board.nodes[targetNodeId].previousNode];
      if (object) {
        board.objectShortestPathNodesToAnimate.push('object');
        currentNodesToAnimate = board.objectShortestPathNodesToAnimate.concat(
          board.shortestPathNodesToAnimate,
        );
      } else {
        currentNodesToAnimate = [];
        while (currentNode && currentNode.id !== startNodeId) {
          currentNodesToAnimate.unshift(currentNode);
          currentNode = board.nodes[currentNode.previousNode];
        }
      }
    } else {
      if (
        board.middleNode !== board.target &&
        board.middleNode !== board.start
      ) {
        currentNode = board.nodes[board.nodes[board.middleNode].previousNode];
        secondCurrentNode =
          board.nodes[board.nodes[board.middleNode].otherpreviousNode];
        if (secondCurrentNode.id === board.target) {
          board.nodes[board.target].direction = getDistance(
            board.nodes[board.middleNode],
            board.nodes[board.target],
          )[2];
        }
        if (object) {
        } else {
          currentNodesToAnimate = [];
          board.nodes[board.middleNode].direction = getDistance(
            currentNode,
            board.nodes[board.middleNode],
          )[2];
          while (currentNode.id !== startNodeId) {
            currentNodesToAnimate.unshift(currentNode);
            currentNode = board.nodes[currentNode.previousNode];
          }
          currentNodesToAnimate.push(board.nodes[board.middleNode]);
          while (secondCurrentNode.id !== targetNodeId) {
            if (secondCurrentNode.otherdirection === 'left') {
              secondCurrentNode.direction = 'right';
            } else if (secondCurrentNode.otherdirection === 'right') {
              secondCurrentNode.direction = 'left';
            } else if (secondCurrentNode.otherdirection === 'up') {
              secondCurrentNode.direction = 'down';
            } else if (secondCurrentNode.otherdirection === 'down') {
              secondCurrentNode.direction = 'up';
            }
            currentNodesToAnimate.push(secondCurrentNode);
            if (secondCurrentNode.otherpreviousNode === targetNodeId) {
              board.nodes[board.target].direction = getDistance(
                secondCurrentNode,
                board.nodes[board.target],
              )[2];
            }
            secondCurrentNode =
              board.nodes[secondCurrentNode.otherpreviousNode];
          }
        }
      } else {
        currentNodesToAnimate = [];
        const target = board.nodes[board.target];
        currentNodesToAnimate.push(board.nodes[target.previousNode], target);
      }
    }

    timeout(0);

    function timeout(index) {
      if (!currentNodesToAnimate.length) {
        currentNodesToAnimate.push(board.nodes[board.start]);
      }
      setTimeout(() => {
        if (index === 0) {
          shortestPathChange(currentNodesToAnimate[index]);
        } else if (index < currentNodesToAnimate.length) {
          shortestPathChange(
            currentNodesToAnimate[index],
            currentNodesToAnimate[index - 1],
          );
        } else if (index === currentNodesToAnimate.length) {
          shortestPathChange(
            board.nodes[board.target],
            currentNodesToAnimate[index - 1],
            'isActualTarget',
          );
        }
        if (index > currentNodesToAnimate.length) {
          board.toggleButtons();
          return;
        }
        timeout(index + 1);
      }, 40);
    }

    function shortestPathChange(
      currentNodeShortestPath,
      previousNode = null,
      isActualTarget = null,
    ): void {
      if (currentNodeShortestPath === 'object') {
        const index = getIndexFromId(board.object);
        board.boardArray[index[0]][index[1]].className = 'objectTransparent';
      } else if (currentNodeShortestPath.id !== board.start) {
        if (
          currentNodeShortestPath.id !== board.target ||
          (currentNodeShortestPath.id === board.target && isActualTarget)
        ) {
          const index = getIndexFromId(currentNodeShortestPath.id);
          if (type === 'unweighted') {
            board.boardArray[index[0]][index[1]].className =
              'shortest-path-unweighted';
          } else {
            let direction;
            if (
              currentNodeShortestPath.relatesToObject &&
              !currentNodeShortestPath.overwriteObjectRelation &&
              currentNodeShortestPath.id !== board.target
            ) {
              direction = 'storedDirection';
              currentNodeShortestPath.overwriteObjectRelation = true;
            } else {
              direction = 'direction';
            }
            if (currentNodeShortestPath[direction] === 'up') {
              board.boardArray[index[0]][index[1]].className =
                'shortest-path-up';
            } else if (currentNodeShortestPath[direction] === 'down') {
              board.boardArray[index[0]][index[1]].className =
                'shortest-path-down';
            } else if (currentNodeShortestPath[direction] === 'right') {
              board.boardArray[index[0]][index[1]].className =
                'shortest-path-right';
            } else if (currentNodeShortestPath[direction] === 'left') {
              board.boardArray[index[0]][index[1]].className =
                'shortest-path-left';
            } else {
              board.boardArray[index[0]][index[1]].className = 'shortest-path';
            }
          }
        }
      }
      if (previousNode) {
        if (
          previousNode !== 'object' &&
          previousNode.id !== board.target &&
          previousNode.id !== board.start
        ) {
          const index = getIndexFromId(previousNode.id);
          board.boardArray[index[0]][index[1]].className =
            previousNode.weight === 15
              ? 'shortest-path weight'
              : 'shortest-path';
        }
      } else {
        const index = getIndexFromId(board.start);
        board.boardArray[index[0]][index[1]].className = 'startTransparent';
      }
    }
  }

  public createMazeOne(type): void {
    Object.keys(this.nodes).forEach(node => {
      const random = Math.random();

      const currentHTMLNode = this.nodes[node];
      const relevantClassNames = ['start', 'target', 'object'];
      const randomTwo = type === 'wall' ? 0.25 : 0.35;

      if (
        random < randomTwo &&
        !relevantClassNames.includes(currentHTMLNode.status)
      ) {
        if (type === 'wall') {
          const index = getIndexFromId(currentHTMLNode.id);
          this.boardArray[index[0]][index[1]].className = 'wall';
          this.nodes[node].status = 'wall';
          this.nodes[node].className = 'wall';
          this.nodes[node].weight = 0;
        } else if (type === 'weight') {
          const index = getIndexFromId(currentHTMLNode.id);
          this.boardArray[index[0]][index[1]].className = 'unvisited weight';
          this.nodes[node].status = 'unvisited';
          this.nodes[node].className = 'unvisited weight';
          this.nodes[node].weight = 15;
        }
      }
    });
  }

  public clearPath(clickedButton): void {
    if (clickedButton) {
      const start = this.nodes[this.start];
      const target = this.nodes[this.target];
      const startIndex = getIndexFromId(start.id);
      this.boardArray[startIndex[0]][startIndex[1]].className = 'start';
      start.status = 'start';
      const targetIndex = getIndexFromId(target.id);
      this.boardArray[targetIndex[0]][targetIndex[1]].className = 'target';
      const object = this.numberOfObjects ? this.nodes[this.object] : null;
      target.status = 'target';
      if (object) {
        const objectIndex = getIndexFromId(object.id);
        this.boardArray[objectIndex[0]][objectIndex[1]].className = 'object';
        object.status = 'object';
      }
    }

    this.algoDone = false;
    Object.keys(this.nodes).forEach(id => {
      const currentNode = this.nodes[id];
      currentNode.previousNode = null;
      currentNode.distance = Infinity;
      currentNode.totalDistance = Infinity;
      currentNode.heuristicDistance = null;
      currentNode.direction = null;
      currentNode.storedDirection = null;
      currentNode.relatesToObject = false;
      currentNode.overwriteObjectRelation = false;
      currentNode.otherpreviousNode = null;
      currentNode.otherdistance = Infinity;
      currentNode.otherdirection = null;

      const relevantStatuses = ['wall', 'start', 'target', 'object'];
      const index = getIndexFromId(id);
      if (
        (!relevantStatuses.includes(currentNode.status) ||
          this.boardArray[index[0]][index[1]].className === 'visitedobject') &&
        currentNode.weight !== 15
      ) {
        this.boardArray[index[0]][index[1]].className = 'unvisited';
      } else if (currentNode.weight === 15) {
        this.boardArray[index[0]][index[1]].className = 'unvisited weight';
      }
    });
  }

  public clearWalls(): void {
    this.clearPath('clickedButton');
    Object.keys(this.nodes).forEach(id => {
      const currentNode = this.nodes[id];
      if (currentNode.status === 'wall' || currentNode.weight === 15) {
        const index = getIndexFromId(id);
        currentNode.status = 'unvisited';
        currentNode.weight = 0;
        this.boardArray[index[0]][index[1]].className = 'unvisited';
      }
    });
  }

  public clearWeights(): void {
    Object.keys(this.nodes).forEach(id => {
      const currentNode = this.nodes[id];

      if (currentNode.weight === 15) {
        currentNode.status = 'unvisited';
        currentNode.weight = 0;
        assignClassNameToNode(this, id, 'unvisited');
      }
    });
  }

  public clearNodeStatuses(): void {
    Object.keys(this.nodes).forEach(id => {
      const currentNode = this.nodes[id];
      currentNode.previousNode = null;
      currentNode.distance = Infinity;
      currentNode.totalDistance = Infinity;
      currentNode.heuristicDistance = null;
      currentNode.storedDirection = currentNode.direction;
      currentNode.direction = null;
      const relevantStatuses = ['wall', 'start', 'target', 'object'];
      if (!relevantStatuses.includes(currentNode.status)) {
        currentNode.status = 'unvisited';
      }
    });
  }

  public instantAlgorithm(): void {
    const weightedAlgorithms = ['dijkstra', 'CLA', 'greedy'];
    const unweightedAlgorithms = ['dfs', 'bfs'];
    let success;
    if (this.currentAlgorithm === 'bidirectional') {
      if (!this.numberOfObjects) {
        success = bidirectional(
          this.nodes,
          this.start,
          this.target,
          this.nodesToAnimate,
          this.boardArray,
          this.currentAlgorithm,
          this.currentHeuristic,
          this,
        );
        launchInstantAnimations(this, success, 'weighted');
      } else {
        this.isObject = true;
      }
      this.algoDone = true;
    } else if (this.currentAlgorithm === 'astar') {
      if (!this.numberOfObjects) {
        success = weightedSearchAlgorithm(
          this.nodes,
          this.start,
          this.target,
          this.nodesToAnimate,
          this.boardArray,
          this.currentAlgorithm,
          this.currentHeuristic,
        );
        launchInstantAnimations(this, success, 'weighted');
      } else {
        this.isObject = true;
        success = weightedSearchAlgorithm(
          this.nodes,
          this.start,
          this.object,
          this.objectNodesToAnimate,
          this.boardArray,
          this.currentAlgorithm,
          this.currentHeuristic,
        );
        launchInstantAnimations(
          this,
          success,
          'weighted',
          'object',
          this.currentAlgorithm,
        );
      }
      this.algoDone = true;
    }
    if (weightedAlgorithms.includes(this.currentAlgorithm)) {
      if (!this.numberOfObjects) {
        success = weightedSearchAlgorithm(
          this.nodes,
          this.start,
          this.target,
          this.nodesToAnimate,
          this.boardArray,
          this.currentAlgorithm,
          this.currentHeuristic,
        );
        launchInstantAnimations(this, success, 'weighted');
      } else {
        this.isObject = true;
        success = weightedSearchAlgorithm(
          this.nodes,
          this.start,
          this.object,
          this.objectNodesToAnimate,
          this.boardArray,
          this.currentAlgorithm,
          this.currentHeuristic,
        );
        launchInstantAnimations(
          this,
          success,
          'weighted',
          'object',
          this.currentAlgorithm,
          this.currentHeuristic,
        );
      }
      this.algoDone = true;
    } else if (unweightedAlgorithms.includes(this.currentAlgorithm)) {
      if (!this.numberOfObjects) {
        success = unweightedSearchAlgorithm(
          this.nodes,
          this.start,
          this.target,
          this.nodesToAnimate,
          this.boardArray,
          this.currentAlgorithm,
        );
        launchInstantAnimations(this, success, 'unweighted');
      } else {
        this.isObject = true;
        success = unweightedSearchAlgorithm(
          this.nodes,
          this.start,
          this.object,
          this.objectNodesToAnimate,
          this.boardArray,
          this.currentAlgorithm,
        );
        launchInstantAnimations(
          this,
          success,
          'unweighted',
          'object',
          this.currentAlgorithm,
        );
      }
      this.algoDone = true;
    }
  }

  public redoAlgorithm(): void {
    this.clearPath('clickedButton');
    this.instantAlgorithm();
  }

  public reset(objectNotTransparent): void {
    this.nodes[this.start].status = 'start';

    const index = getIndexFromId(this.start);
    this.boardArray[index[0]][index[1]].status = 'startTransparent';
    this.nodes[this.target].status = 'target';
    if (this.object) {
      this.nodes[this.object].status = 'object';
      if (objectNotTransparent) {
        const vistedObjectIndex = getIndexFromId(this.object);
        this.boardArray[vistedObjectIndex[0]][vistedObjectIndex[1]].className =
          'visitedObjectNode';
      } else {
        const transparentIndex = getIndexFromId(this.object);
        this.boardArray[transparentIndex[0]][transparentIndex[1]].className =
          'objectTransparent';
      }
    }
  }

  public resetHTMLNodes(): void {
    const startIndex = getIndexFromId(this.start);
    this.boardArray[startIndex[0]][startIndex[1]].className = 'start';

    const targetIndex = getIndexFromId(this.start);
    this.boardArray[targetIndex[0]][targetIndex[1]].className = 'target';
  }

  public changeStartNodeImages(): void {
    let algorithmDescriptor = '';
    const unweighted = [ALGORITHMS.BFS, ALGORITHMS.DFS];
    const guaranteed = [ALGORITHMS.DIJIKSTRA, ALGORITHMS.A_STAR];
    let name = '';
    if (this.currentAlgorithm === ALGORITHMS.BFS) {
      name = 'Breath-first Search';
    } else if (this.currentAlgorithm === ALGORITHMS.DFS) {
      name = 'Depth-first Search';
    } else if (this.currentAlgorithm === ALGORITHMS.DIJIKSTRA) {
      name = 'Dijkstra"s Algorithm';
    } else if (this.currentAlgorithm === ALGORITHMS.A_STAR) {
      name = 'A* Search';
    } else if (this.currentAlgorithm === ALGORITHMS.GREEDY) {
      name = 'Greedy Best-first Search';
    } else if (
      this.currentAlgorithm === ALGORITHMS.CLA &&
      this.currentHeuristic !== 'extraPoweredManhattanDistance'
    ) {
      name = 'Swarm Algorithm';
    } else if (
      this.currentAlgorithm === ALGORITHMS.CLA &&
      this.currentHeuristic === 'extraPoweredManhattanDistance'
    ) {
      name = 'Convergent Swarm Algorithm';
    } else if (this.currentAlgorithm === ALGORITHMS.BIDIRECTIONAL) {
      name = 'Bidirectional Swarm Algorithm';
    }
    if (unweighted.includes(this.currentAlgorithm)) {
      if (this.currentAlgorithm === ALGORITHMS.DFS) {
        algorithmDescriptor = `${name} is unweighted and does not guarantee</b></i> the shortest path!`;
      } else {
        algorithmDescriptor = `${name} is unweighted and does not guarantee</b></i> the shortest path!`;
      }
    } else {
      if (
        this.currentAlgorithm === ALGORITHMS.GREEDY ||
        this.currentAlgorithm === ALGORITHMS.CLA
      ) {
        algorithmDescriptor = `${name} is <i><b>weighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
      }
    }
    if (this.currentAlgorithm === ALGORITHMS.BIDIRECTIONAL) {
      algorithmDescriptor = `${name} is <i><b>weighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
    } else {
    }
    if (guaranteed.includes(this.currentAlgorithm)) {
      algorithmDescriptor = `${name} is <i><b>weighted</b></i> and <i><b>guarantees</b></i> the shortest path!`;
    }
  }

  public toggleButtons(): void {
    if (!this.buttonsOn) {
      this.buttonsOn = true;
    } else {
      this.buttonsOn = false;
    }
  }

  public startButtonStartClicked(): void {
    if (!this.currentAlgorithm) {
      alert('Pick an Algorithm');
    } else {
      this.clearPath('clickedButton');
      this.toggleButtons();
      this.changeStartNodeImages();
      const weightedAlgorithms = ['dijkstra', 'CLA', 'CLA', 'greedy'];
      const unweightedAlgorithms = ['dfs', 'bfs'];
      let success;
      if (this.currentAlgorithm === 'bidirectional') {
        if (!this.numberOfObjects) {
          success = bidirectional(
            this.nodes,
            this.start,
            this.target,
            this.nodesToAnimate,
            this.boardArray,
            this.currentAlgorithm,
            this.currentHeuristic,
            this,
          );
          launchAnimations(this, success, 'weighted');
        } else {
          this.isObject = true;
          success = bidirectional(
            this.nodes,
            this.start,
            this.object,
            this.nodesToAnimate,
            this.boardArray,
            this.currentAlgorithm,
            this.currentHeuristic,
            this,
          );
          launchAnimations(this, success, 'weighted');
        }
        this.algoDone = true;
      } else if (this.currentAlgorithm === 'astar') {
        if (!this.numberOfObjects) {
          success = weightedSearchAlgorithm(
            this.nodes,
            this.start,
            this.target,
            this.nodesToAnimate,
            this.boardArray,
            this.currentAlgorithm,
            this.currentHeuristic,
          );
          launchAnimations(this, success, 'weighted');
        } else {
          this.isObject = true;
          success = weightedSearchAlgorithm(
            this.nodes,
            this.start,
            this.object,
            this.objectNodesToAnimate,
            this.boardArray,
            this.currentAlgorithm,
            this.currentHeuristic,
          );
          launchAnimations(
            this,
            success,
            'weighted',
            'object',
            this.currentAlgorithm,
          );
        }
        this.algoDone = true;
      } else if (weightedAlgorithms.includes(this.currentAlgorithm)) {
        if (!this.numberOfObjects) {
          success = weightedSearchAlgorithm(
            this.nodes,
            this.start,
            this.target,
            this.nodesToAnimate,
            this.boardArray,
            this.currentAlgorithm,
            this.currentHeuristic,
          );
          launchAnimations(this, success, 'weighted');
        } else {
          this.isObject = true;
          success = weightedSearchAlgorithm(
            this.nodes,
            this.start,
            this.object,
            this.objectNodesToAnimate,
            this.boardArray,
            this.currentAlgorithm,
            this.currentHeuristic,
          );
          launchAnimations(
            this,
            success,
            'weighted',
            'object',
            this.currentAlgorithm,
            this.currentHeuristic,
          );
        }
        this.algoDone = true;
      } else if (unweightedAlgorithms.includes(this.currentAlgorithm)) {
        if (!this.numberOfObjects) {
          success = unweightedSearchAlgorithm(
            this.nodes,
            this.start,
            this.target,
            this.nodesToAnimate,
            this.boardArray,
            this.currentAlgorithm,
          );
          launchAnimations(this, success, 'unweighted');
        } else {
          this.isObject = true;
          success = unweightedSearchAlgorithm(
            this.nodes,
            this.start,
            this.object,
            this.objectNodesToAnimate,
            this.boardArray,
            this.currentAlgorithm,
          );
          launchAnimations(
            this,
            success,
            'unweighted',
            'object',
            this.currentAlgorithm,
          );
        }
        this.algoDone = true;
      }
    }
  }
}
