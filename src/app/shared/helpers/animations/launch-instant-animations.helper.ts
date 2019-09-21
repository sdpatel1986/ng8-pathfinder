import {
  weightedSearchAlgorithm,
  unweightedSearchAlgorithm,
} from '../algorithms';
import { assignClassNameToNode } from '../common.helper';

function launchInstantAnimations(
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
  let shortestNodes;
  for (let i = 0; i < nodes.length; i++) {
    if (i === 0) {
      change(board, nodes[i]);
    } else {
      change(board, nodes[i], nodes[i - 1]);
    }
  }
  if (object) {
    board.objectNodesToAnimate = [];
    if (success) {
      board.drawShortestPath(board.object, board.start, 'object');
      board.clearNodeStatuses();
      let newSuccess;
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
      launchInstantAnimations(board, newSuccess, type);
      shortestNodes = board.objectShortestPathNodesToAnimate.concat(
        board.shortestPathNodesToAnimate,
      );
    } else {
      console.log('Failure.');
      board.reset();
      return;
    }
  } else {
    board.nodesToAnimate = [];
    if (success) {
      if (board.isObject) {
        board.drawShortestPath(board.target, board.object);
      } else {
        board.drawShortestPath(board.target, board.start);
      }
      shortestNodes = board.objectShortestPathNodesToAnimate.concat(
        board.shortestPathNodesToAnimate,
      );
    } else {
      console.log('Failure');
      board.reset();
      return;
    }
  }

  let j;
  for (j = 0; j < shortestNodes.length; j++) {
    if (j === 0) {
      shortestPathChange(board, shortestNodes[j]);
    } else {
      shortestPathChange(board, shortestNodes[j], shortestNodes[j - 1]);
    }
  }
  board.reset();
  if (object) {
    shortestPathChange(board, board.nodes[board.target], shortestNodes[j - 1]);
    board.objectShortestPathNodesToAnimate = [];
    board.shortestPathNodesToAnimate = [];
    board.clearNodeStatuses();
    let newSuccess;
    if (type === 'weighted') {
      newSuccess = weightedSearchAlgorithm(
        board.nodes,
        board.object,
        board.target,
        board.nodesToAnimate,
        board.boardArray,
        algorithm,
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
    launchInstantAnimations(board, newSuccess, type);
  } else {
    shortestPathChange(board, board.nodes[board.target], shortestNodes[j - 1]);
    board.objectShortestPathNodesToAnimate = [];
    board.shortestPathNodesToAnimate = [];
  }

  function change(boardAnimation, currentNode, previousNode = null) {
    const relevantClassNames = [
      'start',
      'shortest-path',
      'instantshortest-path',
      'instantshortest-path weight',
    ];
    if (previousNode) {
      const previousHTMLNode = boardAnimation.nodes[previousNode.id];
      if (!relevantClassNames.includes(previousHTMLNode.className)) {
        if (object) {
          const className =
            previousNode.weight === 15
              ? 'instantvisitedobject weight'
              : 'instantvisitedobject';
          assignClassNameToNode(boardAnimation, previousNode.id, className);
        } else {
          const className =
            previousNode.weight === 15
              ? 'instantvisited weight'
              : 'instantvisited';
          assignClassNameToNode(boardAnimation, previousNode.id, className);
        }
      }
    }
  }

  function shortestPathChange(
    boardAnimation,
    currentNode,
    previousNode = null,
  ) {
    if (type === 'unweighted') {
      assignClassNameToNode(
        boardAnimation,
        currentNode.id,
        'shortest-path-unweighted',
      );
    } else {
      if (currentNode.direction === 'up') {
        assignClassNameToNode(
          boardAnimation,
          currentNode.id,
          'shortest-path-up',
        );
      } else if (currentNode.direction === 'down') {
        assignClassNameToNode(
          boardAnimation,
          currentNode.id,
          'shortest-path-down',
        );
      } else if (currentNode.direction === 'right') {
        assignClassNameToNode(
          boardAnimation,
          currentNode.id,
          'shortest-path-right',
        );
      } else if (currentNode.direction === 'left') {
        assignClassNameToNode(
          boardAnimation,
          currentNode.id,
          'shortest-path-left',
        );
      }
    }
    if (previousNode) {
      const className =
        previousNode.weight === 15
          ? 'instantshortest-path weight'
          : 'instantshortest-path';
      assignClassNameToNode(boardAnimation, previousNode.id, className);
    } else {
      assignClassNameToNode(boardAnimation, board.start, 'startTransparent');
    }
  }
}

export { launchInstantAnimations };
