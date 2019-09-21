import { getIndexFromId } from '../common.helper';
import { Board } from '../../models';

function mazeGenerationAnimations(board: Board) {
  const nodes = board.wallsToAnimate.slice(0);
  const speed =
    board.speed === 'fast' ? 5 : board.speed === 'average' ? 25 : 75;
  function timeout(index) {
    setTimeout(() => {
      if (index === nodes.length) {
        board.wallsToAnimate = [];
        board.toggleButtons();
        return;
      }
      const animationIndex = getIndexFromId(nodes[index].id);
      const className =
        board.nodes[nodes[index].id].weight === 15
          ? 'unvisited weight'
          : 'wall';
      board.boardArray[animationIndex[0]][
        animationIndex[1]
      ].className = className;

      timeout(index + 1);
    }, speed);
  }

  timeout(0);
}

export { mazeGenerationAnimations };
