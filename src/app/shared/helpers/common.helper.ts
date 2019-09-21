import { ALGORITHMS, ALGORITHM_NAMES, HEURISTICS } from './../constants';
import { Board } from '../models';

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

function getIndexFromId(id: string) {
  return id.split('-');
}

function assignClassNameToNode(
  board: Board,
  id: string,
  className: string,
): void {
  const index = getIndexFromId(id);
  board.boardArray[index[0]][index[1]].className = className;
  board.nodes[id].className = className;
}

function getAlgorithmName(
  algorithm: string,
  currentHeuristic: string = null,
): string {
  switch (algorithm) {
    case ALGORITHMS.DIJIKSTRA:
      return ALGORITHM_NAMES.DIJIKSTRA;
    case ALGORITHMS.A_STAR:
      return ALGORITHM_NAMES.A_STAR;
    case ALGORITHMS.GREEDY:
      return ALGORITHM_NAMES.GREEDY;
    case ALGORITHMS.CLA:
      if (currentHeuristic === HEURISTICS.MANHATTAN_DISTANCE) {
        return ALGORITHM_NAMES.SWARM;
      } else if (currentHeuristic === HEURISTICS.EXTRA_MANHATTAN_DISTANCE) {
        return ALGORITHM_NAMES.CONVERGENT_SWARM;
      }
      break;
    case ALGORITHMS.BIDIRECTIONAL:
      return ALGORITHM_NAMES.BIDIRECTIONAL;
    case ALGORITHMS.BFS:
      return ALGORITHM_NAMES.BFS;
    case ALGORITHMS.DFS:
      return ALGORITHM_NAMES.DFS;
    default:
      return '';
  }
}

export { getDistance, getIndexFromId, assignClassNameToNode, getAlgorithmName };
