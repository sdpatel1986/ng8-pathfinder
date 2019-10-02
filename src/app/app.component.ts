import { ALGORITHMS, HEURISTICS, MAZE_TYPES } from './shared/constants';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterContentInit,
} from '@angular/core';
import { Board, Node } from './shared/models';
import {
  assignClassNameToNode,
  mazeGenerationAnimations,
  recursiveDivisionMaze,
  otherMaze,
  otherOtherMaze,
  stairDemonstration,
  getAlgorithmName,
} from './shared/helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterContentInit {
  @ViewChild('navbarDiv', { static: true })
  navbarDiv: ElementRef;
  @ViewChild('boardDescription', { static: true }) boardDescription: ElementRef;
  algorithmDescriptor: ElementRef;

  public board: Board;
  public buttonsOn: boolean;
  public isAddedBomb: boolean = false;
  public isDisableAddBomb: boolean = false;
  public isDisableWeightNode: boolean = false;
  public algorithmDescription: string = `Dijkstra's Algorithm is <i><b>weighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
  public boardAnimationColor: string =
    'shortest-path__default visitedobject__default visited__default wall__default';

  constructor() {
    this.buttonsOn = true;
  }

  ngAfterContentInit(): void {
    this.initializeMap();
    this.board.currentAlgorithm = ALGORITHMS.DIJIKSTRA;
    this.board.currentHeuristic = null;
  }

  private initializeMap(
    currentAlgorithm = null,
    currentHeuristic = null,
  ): void {
    const navbarDivHeight = this.getNavbarHeight();
    const boardDescriptionHeight = this.getBoardDescriptionHeight();
    const innerWidth: number = window.innerWidth;
    const innerHeight: number = window.innerHeight;
    const height: number = Math.floor(
      (innerHeight - navbarDivHeight - boardDescriptionHeight) / 28,
    );
    const width: number = Math.floor(innerWidth / 25);

    this.board = new Board(height, width);
    this.board.initialise();
    if (currentAlgorithm) {
      this.board.currentAlgorithm = currentAlgorithm;
      this.board.currentHeuristic = currentHeuristic;
    }
    window.onkeydown = e => {
      this.board.keyDown = e.keyCode;
    };

    window.onkeyup = e => {
      this.board.keyDown = false;
    };
  }

  public runBoard(): void {
    this.board.startButtonStartClicked();
  }

  public clearWall(): void {
    this.board.clearWalls();
  }

  public clearPath(): void {
    this.board.clearPath('clickedButton');
  }

  public changeColorEventEmitter(colorObj: any): void {
    let className = `shortest-path__${colorObj.shortestPathColor}`;
    className += ` visitedobject__${colorObj.visitedObjectNodeColor}`;
    className += ` visited__${colorObj.visitedNodeColor}`;
    className += ` wall__${colorObj.wallColor}`;

    this.boardAnimationColor = className;
  }

  public changeAlgorithm(event: any): void {
    const { algorithm, currentHeuristic } = event;
    let name: string = getAlgorithmName(algorithm, currentHeuristic);
    this.board.currentAlgorithm = algorithm;
    this.board.currentHeuristic = currentHeuristic;
    if (algorithm === ALGORITHMS.BFS || algorithm === ALGORITHMS.DFS) {
      this.isDisableAddBomb = false;
      this.isDisableWeightNode = true;
      this.board.clearWeights();
      for (let i = 0; i < 14; i++) {
        const j: string = i.toString();
        const backgroundImage =
          document.styleSheets['1'].rules[j].style.backgroundImage;
        document.styleSheets['1'].rules[
          j
        ].style.backgroundImage = backgroundImage.replace(
          'triangle',
          'spaceship',
        );
      }
      if (algorithm === ALGORITHMS.DFS) {
        this.algorithmDescription = `${name} Algorithm is <i><b>unweighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
      } else {
        this.algorithmDescription = `${name} Algorithm is <i><b>unweighted</b></i> and <i><b>guarantees</b></i> the shortest path!`;
      }
    } else {
      this.isDisableWeightNode = false;
      this.isDisableAddBomb = false;
      if (algorithm === ALGORITHMS.GREEDY || algorithm === ALGORITHMS.CLA) {
        if (
          algorithm === ALGORITHMS.CLA &&
          currentHeuristic === HEURISTICS.EXTRA_MANHATTAN_DISTANCE
        ) {
          name = 'Convergent Swarm';
        }
      }
      this.algorithmDescription = `${name} Algorithm is <i><b>weighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
      for (let i = 0; i < 14; i++) {
        const j: string = i.toString();
        const backgroundImage =
          document.styleSheets['1'].rules[j].style.backgroundImage;
        document.styleSheets['1'].rules[
          j
        ].style.backgroundImage = backgroundImage.replace(
          'spaceship',
          'triangle',
        );
      }
    }
    if (algorithm === ALGORITHMS.BIDIRECTIONAL) {
      this.isAddedBomb = false;
      this.isDisableAddBomb = true;
      this.isDisableWeightNode = false;
      if (this.board.numberOfObjects) {
        const objectNodeId = this.board.object;
        assignClassNameToNode(this.board, objectNodeId, 'unvisited');
        this.board.object = null;
        this.board.numberOfObjects = 0;
        this.board.nodes[objectNodeId].status = 'unvisited';
        this.board.isObject = false;
      }
      this.algorithmDescription = `${name} Algorithm is <i><b>weighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
      this.clearPath();
    }
  }

  public addBomb(): void {
    const rowNum: number = Math.floor(this.board.height / 2);
    const colNum: number = Math.floor((2 * this.board.width) / 4);
    const objectNodeId: string = `${rowNum}-${colNum}`;
    if (
      this.board.target === objectNodeId ||
      this.board.start === objectNodeId ||
      this.board.numberOfObjects === 1
    ) {
      console.log('Failure to place object.');
    } else {
      this.board.clearPath('clickedButton');
      this.board.object = objectNodeId;
      this.board.numberOfObjects = 1;
      this.board.nodes[objectNodeId].status = 'object';
      this.board.nodes[objectNodeId].className = 'object';
    }
    this.isAddedBomb = true;
  }

  public removeBomb(): void {
    const objectNodeId: string = this.board.object;
    this.board.object = null;
    this.board.numberOfObjects = 0;
    this.board.nodes[objectNodeId].status = 'unvisited';
    this.board.nodes[objectNodeId].className = 'unvisited';
    this.board.isObject = false;
    this.board.clearPath('clickedButton');
    this.isAddedBomb = false;
  }

  public adjustSpeed(speed: string): void {
    this.board.speed = speed;
  }

  public createMaze(mazeType: string): void {
    if (this.board.buttonsOn) {
      return;
    }
    this.board.clearWalls();
    this.board.clearPath('clickedButton');
    switch (mazeType) {
      case MAZE_TYPES.RECURSIVE_DIVISION:
        this.board.toggleButtons();
        recursiveDivisionMaze(
          this.board,
          2,
          this.board.height - 3,
          2,
          this.board.width - 3,
          'horizontal',
          false,
          'wall',
        );
        mazeGenerationAnimations(this.board);
        break;
      case MAZE_TYPES.RECURSIVE_DIVISION_VERTICAL:
        this.board.toggleButtons();
        otherMaze(
          this.board,
          2,
          this.board.height - 3,
          2,
          this.board.width - 3,
          'vertical',
          false,
        );
        mazeGenerationAnimations(this.board);
        break;
      case MAZE_TYPES.RECURSIVE_DIVISION_HORIZONTAL:
        this.board.toggleButtons();
        otherOtherMaze(
          this.board,
          2,
          this.board.height - 3,
          2,
          this.board.width - 3,
          'horizontal',
          false,
        );
        mazeGenerationAnimations(this.board);
        break;
      case MAZE_TYPES.BASIC_RANDOM:
        this.board.createMazeOne('wall');
        break;
      case MAZE_TYPES.BASIC_WEIGHT:
        this.board.createMazeOne('weight');
        break;
      case MAZE_TYPES.SIMPLE_STAIR:
        this.board.toggleButtons();
        stairDemonstration(this.board);
        mazeGenerationAnimations(this.board);
        break;
    }
  }

  public mousedown(currentNode: Node): void {
    if (this.buttonsOn) {
      this.board.mouseDown = true;
      if (
        currentNode.status.includes('start') ||
        currentNode.status.includes('target') ||
        currentNode.status.includes('object')
      ) {
        this.board.pressedNodeStatus = currentNode.status;
      } else {
        this.board.pressedNodeStatus = 'normal';
        this.board.changeNormalNode(currentNode);
      }
    }
  }

  public mouseup(currentNode: Node): void {
    if (this.buttonsOn) {
      this.board.mouseDown = false;
      if (this.board.pressedNodeStatus.includes('target')) {
        this.board.target = currentNode.id;
      } else if (this.board.pressedNodeStatus.includes('start')) {
        this.board.start = currentNode.id;
      } else if (this.board.pressedNodeStatus.includes('object')) {
        this.board.object = currentNode.id;
      }
      this.board.pressedNodeStatus = 'normal';
    }
  }

  public mouseenter(currentNode: Node): void {
    if (this.buttonsOn) {
      if (this.board.mouseDown && this.board.pressedNodeStatus !== 'normal') {
        this.board.changeSpecialNode(currentNode);
        if (this.board.pressedNodeStatus.includes('target')) {
          this.board.target = currentNode.id;
          if (this.board.algoDone) {
            this.board.redoAlgorithm();
          }
        } else if (this.board.pressedNodeStatus.includes('start')) {
          this.board.start = currentNode.id;
          if (this.board.algoDone) {
            this.board.redoAlgorithm();
          }
        } else if (this.board.pressedNodeStatus.includes('object')) {
          this.board.object = currentNode.id;
          if (this.board.algoDone) {
            this.board.redoAlgorithm();
          }
        }
      } else if (this.board.mouseDown) {
        this.board.changeNormalNode(currentNode);
      }
    }
  }

  public mouseleave(currentNode: Node): void {
    if (this.buttonsOn) {
      if (this.board.mouseDown && this.board.pressedNodeStatus !== 'normal') {
        this.board.changeSpecialNode(currentNode);
      }
    }
  }

  public clearBoard(): void {
    const { currentAlgorithm, currentHeuristic } = this.board;
    this.initializeMap(currentAlgorithm, currentHeuristic);
    this.isAddedBomb = false;
  }

  public reset(): void {
    this.changeAlgorithm({
      algorithm: ALGORITHMS.DIJIKSTRA,
      currentHeuristic: null,
    });
    this.clearBoard();
    this.board.currentAlgorithm = ALGORITHMS.DIJIKSTRA;
    this.board.currentHeuristic = null;
    this.board.speed = 'fast';
    this.boardAnimationColor =
      'shortest-path__default visitedobject__default visited__default wall__default';
    this.isAddedBomb = false;
    this.isDisableAddBomb = false;
    this.isDisableWeightNode = false;
    this.algorithmDescription = `Dijkstra's Algorithm is <i><b>weighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
  }

  private getNavbarHeight(): any {
    return (
      this.navbarDiv &&
      this.navbarDiv.nativeElement &&
      this.navbarDiv.nativeElement.offsetHeight
    );
  }

  private getBoardDescriptionHeight(): any {
    return (
      (this.boardDescription &&
        this.boardDescription.nativeElement &&
        this.boardDescription.nativeElement.offsetHeight) ||
      0
    );
  }
}
