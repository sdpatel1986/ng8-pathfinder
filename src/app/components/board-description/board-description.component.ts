import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-board-description-component',
  templateUrl: './board-description.component.html',
  styleUrls: ['./board-description.component.scss'],
})
export class BoardDescriptionComponent {
  @Input() algorithm: string;
  @Input() algorithmDescription: string;
  @Input() isDisableAddBomb: boolean;
  @Input() isDisableWeightNode: boolean;

  @Output() changeColorEventEmitter: EventEmitter<object> = new EventEmitter();

  public shortestPathColor = 'default';
  public visitedNodeColor = 'default';
  public visitedObjectNodeColor = 'default';
  public wallColor = 'default';

  public colorObj = {
    shortestPathColor: this.shortestPathColor,
    visitedNodeColor: this.visitedNodeColor,
    visitedObjectNodeColor: this.visitedObjectNodeColor,
    wallColor: this.wallColor,
  };

  constructor() {}

  public onChangePathColor(event: { name: string; color: string }): void {
    const { name, color } = event;
    this.colorObj[name] = color;
    this.changeColorEventEmitter.emit(this.colorObj);
  }
}
