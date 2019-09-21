function weightsDemonstration(board) {
  let currentIdX = board.height - 1;
  const currentIdY = 35;
  while (currentIdX > 5) {
    const currentId = `${currentIdX}-${currentIdY}`;

    const currentNode = board.nodes[currentId];
    currentNode.status = 'wall';
    currentNode.weight = 0;
    currentIdX--;
  }
  for (
    let cursorIdX = board.height - 2;
    cursorIdX > board.height - 11;
    cursorIdX--
  ) {
    for (let cursorIdY = 1; cursorIdY < 35; cursorIdY++) {
      const currentId = `${cursorIdX}-${cursorIdY}`;
      const currentNode = board.nodes[currentId];
      if (cursorIdX === board.height - 2 && cursorIdY < 35 && cursorIdY > 26) {
        currentNode.status = 'wall';
        currentNode.weight = 0;
      } else {
        currentNode.status = 'unvisited';
        currentNode.weight = 15;
      }
    }
  }
}

export { weightsDemonstration };
