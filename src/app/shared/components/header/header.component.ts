import { ALGORITHM_NAMES, MAZE_TYPES } from './../../constants';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { getAlgorithmName } from '../../helpers';
import { ALGORITHMS, HEURISTICS } from '../../constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() isAddedBomb: boolean;
  @Input() isDisableAddBomb: boolean;
  @Input() inProgressVisualize: boolean;

  @Output() runBoardEventEmitter: EventEmitter<null> = new EventEmitter();
  @Output() clearBoardEventEmitter: EventEmitter<null> = new EventEmitter();
  @Output() clearWallEventEmitter: EventEmitter<null> = new EventEmitter();
  @Output() clearPathEventEmitter: EventEmitter<null> = new EventEmitter();
  @Output() addBombEventEmitter: EventEmitter<null> = new EventEmitter();
  @Output() removeBombEventEmitter: EventEmitter<null> = new EventEmitter();
  @Output() startButtonEventEmitter: EventEmitter<object> = new EventEmitter();
  @Output() adjustSpeedEventEmitter: EventEmitter<string> = new EventEmitter();
  @Output() createMazeEventEmitter: EventEmitter<string> = new EventEmitter();
  @Output() resetEventEmitter: EventEmitter<null> = new EventEmitter();

  public ALGORITHMS = ALGORITHMS;
  public HEURISTICS = HEURISTICS;
  public MAZE_TYPES = MAZE_TYPES;
  public selectedSpeed = 'fast';
  public selectedAlgorithmName = ALGORITHM_NAMES.DIJIKSTRA;

  public runBoard(): void {
    if (!this.inProgressVisualize) {
      this.runBoardEventEmitter.emit();
    }
  }

  public clearBoard(): void {
    if (!this.inProgressVisualize) {
      this.clearBoardEventEmitter.emit();
    }
  }

  public clearWall(): void {
    if (!this.inProgressVisualize) {
      this.clearWallEventEmitter.emit();
    }
  }

  public clearPath(): void {
    if (!this.inProgressVisualize) {
      this.clearPathEventEmitter.emit();
    }
  }

  public changeAlgorithm(
    algorithm: string,
    currentHeuristic: string = null,
  ): void {
    if (!this.inProgressVisualize) {
      this.startButtonEventEmitter.emit({ algorithm, currentHeuristic });
      this.selectedAlgorithmName = getAlgorithmName(
        algorithm,
        currentHeuristic,
      );
    }
  }

  public addBomb(): void {
    if (!this.inProgressVisualize && !this.isDisableAddBomb) {
      this.addBombEventEmitter.emit();
    }
  }

  public removeBomb(): void {
    if (!this.inProgressVisualize && !this.isDisableAddBomb) {
      this.removeBombEventEmitter.emit();
    }
  }

  public adjustSpeedFast(): void {
    if (!this.inProgressVisualize) {
      this.adjustSpeedEventEmitter.emit('fast');
      this.selectedSpeed = 'fast';
    }
  }

  public adjustSpeedAverage(): void {
    if (!this.inProgressVisualize) {
      this.adjustSpeedEventEmitter.emit('average');
      this.selectedSpeed = 'average';
    }
  }

  public adjustSpeedSlow(): void {
    if (!this.inProgressVisualize) {
      this.adjustSpeedEventEmitter.emit('slow');
      this.selectedSpeed = 'slow';
    }
  }

  public createMaze(mazeType): void {
    if (!this.inProgressVisualize) {
      this.createMazeEventEmitter.emit(mazeType);
    }
  }

  public reset() {
    this.resetEventEmitter.emit();
    this.selectedSpeed = 'fast';
    this.selectedAlgorithmName = ALGORITHM_NAMES.DIJIKSTRA;
  }

  public getSelectedSpeedCapitalize(): string {
    return (
      this.selectedSpeed.charAt(0).toUpperCase() + this.selectedSpeed.slice(1)
    );
  }
}
