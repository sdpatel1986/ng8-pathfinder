import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
  @Input() name: string;
  @Input() className: string;
  @Input() defaultColor: string;

  @Output() changePathColorEmitter: EventEmitter<object> = new EventEmitter();

  public onChangePathColor(name: string, color: string): void {
    this.changePathColorEmitter.emit({ name, color });
  }
}
