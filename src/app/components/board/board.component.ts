import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Board, Node } from '../../shared/models';

@Component({
  selector: 'app-board-component',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() board: Board;

  @Output() mousedownEventEmitter: EventEmitter<Node> = new EventEmitter();
  @Output() mouseupEventEmitter: EventEmitter<Node> = new EventEmitter();
  @Output() mouseenterEventEmitter: EventEmitter<Node> = new EventEmitter();
  @Output() mouseleaveEventEmitter: EventEmitter<Node> = new EventEmitter();

  public mousedown(currentNode: Node): void {
    this.mousedownEventEmitter.emit(currentNode);
  }

  public mouseup(currentNode: Node): void {
    this.mouseupEventEmitter.emit(currentNode);
  }

  public mouseenter(currentNode: Node): void {
    this.mouseenterEventEmitter.emit(currentNode);
  }

  public mouseleave(currentNode: Node): void {
    this.mouseleaveEventEmitter.emit(currentNode);
  }
}
