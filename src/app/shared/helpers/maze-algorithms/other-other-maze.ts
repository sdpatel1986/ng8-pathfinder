import { Board } from '../../models';

function otherOtherMaze(
  board: Board,
  rowStart,
  rowEnd: number,
  colStart: number,
  colEnd: number,
  orientation: string,
  surroundingWalls: boolean,
) {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }
  if (!surroundingWalls) {
    const relevantIds = [board.start, board.target];
    if (board.object) {
      relevantIds.push(board.object);
    }
    Object.keys(board.nodes).forEach(node => {
      if (!relevantIds.includes(node)) {
        const r = parseInt(node.split('-')[0], 10);
        const c = parseInt(node.split('-')[1], 10);
        if (
          r === 0 ||
          c === 0 ||
          r === board.height - 1 ||
          c === board.width - 1
        ) {
          const currentHTMLNode = document.getElementById(node);
          board.wallsToAnimate.push(currentHTMLNode);
          board.nodes[node].status = 'wall';
        }
      }
    });
    surroundingWalls = true;
  }
  if (orientation === 'horizontal') {
    const possibleRows = [];
    for (let num = rowStart; num <= rowEnd; num += 2) {
      possibleRows.push(num);
    }
    const possibleCols = [];
    for (let num = colStart - 1; num <= colEnd + 1; num += 2) {
      possibleCols.push(num);
    }
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const currentRow = possibleRows[randomRowIndex];
    const colRandom = possibleCols[randomColIndex];
    Object.keys(board.nodes).forEach(node => {
      const r = parseInt(node.split('-')[0], 10);
      const c = parseInt(node.split('-')[1], 10);
      if (
        r === currentRow &&
        c !== colRandom &&
        c >= colStart - 1 &&
        c <= colEnd + 1
      ) {
        const currentHTMLNode = document.getElementById(node);
        if (
          !currentHTMLNode.className.toLowerCase().includes('start') &&
          !currentHTMLNode.className.toLowerCase().includes('shortest-path-') &&
          currentHTMLNode.className !== 'target' &&
          currentHTMLNode.className !== 'object' &&
          currentHTMLNode.className !== 'objectTransparent'
        ) {
          board.wallsToAnimate.push(currentHTMLNode);
          board.nodes[node].status = 'wall';
        }
      }
    });
    if (currentRow - 2 - rowStart > colEnd - colStart) {
      otherOtherMaze(
        board,
        rowStart,
        currentRow - 2,
        colStart,
        colEnd,
        orientation,
        surroundingWalls,
      );
    } else {
      otherOtherMaze(
        board,
        rowStart,
        currentRow - 2,
        colStart,
        colEnd,
        'horizontal',
        surroundingWalls,
      );
    }
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      otherOtherMaze(
        board,
        currentRow + 2,
        rowEnd,
        colStart,
        colEnd,
        orientation,
        surroundingWalls,
      );
    } else {
      otherOtherMaze(
        board,
        currentRow + 2,
        rowEnd,
        colStart,
        colEnd,
        'vertical',
        surroundingWalls,
      );
    }
  } else {
    const possibleCols = [];
    for (let num = colStart; num <= colEnd; num += 2) {
      possibleCols.push(num);
    }
    const possibleRows = [];
    for (let num = rowStart - 1; num <= rowEnd + 1; num += 2) {
      possibleRows.push(num);
    }
    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const currentCol = possibleCols[randomColIndex];
    const rowRandom = possibleRows[randomRowIndex];
    Object.keys(board.nodes).forEach(node => {
      const r = parseInt(node.split('-')[0], 10);
      const c = parseInt(node.split('-')[1], 10);
      if (
        c === currentCol &&
        r !== rowRandom &&
        r >= rowStart - 1 &&
        r <= rowEnd + 1
      ) {
        const currentHTMLNode = document.getElementById(node);
        if (
          !currentHTMLNode.className.toLowerCase().includes('start') &&
          !currentHTMLNode.className.toLowerCase().includes('shortest-path-') &&
          currentHTMLNode.className !== 'target' &&
          currentHTMLNode.className !== 'object' &&
          currentHTMLNode.className !== 'objectTransparent'
        ) {
          board.wallsToAnimate.push(currentHTMLNode);
          board.nodes[node].status = 'wall';
        }
      }
    });
    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      otherOtherMaze(
        board,
        rowStart,
        rowEnd,
        colStart,
        currentCol - 2,
        'horizontal',
        surroundingWalls,
      );
    } else {
      otherOtherMaze(
        board,
        rowStart,
        rowEnd,
        colStart,
        currentCol - 2,
        'horizontal',
        surroundingWalls,
      );
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      otherOtherMaze(
        board,
        rowStart,
        rowEnd,
        currentCol + 2,
        colEnd,
        'horizontal',
        surroundingWalls,
      );
    } else {
      otherOtherMaze(
        board,
        rowStart,
        rowEnd,
        currentCol + 2,
        colEnd,
        orientation,
        surroundingWalls,
      );
    }
  }
}

export { otherOtherMaze };
