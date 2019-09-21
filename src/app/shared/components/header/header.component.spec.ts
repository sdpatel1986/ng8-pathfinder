import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { ALGORITHMS, MAZE_TYPES } from '../../constants';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change algorithm', () => {
    spyOn(component.startButtonEventEmitter, 'emit');

    component.changeAlgorithm(ALGORITHMS.DIJIKSTRA, null);
    expect(component.startButtonEventEmitter.emit).toHaveBeenCalledWith({
      algorithm: ALGORITHMS.DIJIKSTRA,
      currentHeuristic: null,
    });
  });

  it('should not change algorithm', () => {
    spyOn(component.startButtonEventEmitter, 'emit');
    component.inProgressVisualize = true;
    component.changeAlgorithm(ALGORITHMS.DIJIKSTRA, null);
    expect(component.startButtonEventEmitter.emit).not.toHaveBeenCalled();
  });

  it('should add bomb', () => {
    spyOn(component.addBombEventEmitter, 'emit');

    component.addBomb();
    expect(component.addBombEventEmitter.emit).toHaveBeenCalled();
  });

  it('should not add bomb', () => {
    spyOn(component.addBombEventEmitter, 'emit');
    component.isDisableAddBomb = true;

    component.addBomb();
    expect(component.addBombEventEmitter.emit).not.toHaveBeenCalled();
  });

  it('should adjust speed fast', () => {
    spyOn(component.adjustSpeedEventEmitter, 'emit');

    component.adjustSpeedFast();
    expect(component.adjustSpeedEventEmitter.emit).toHaveBeenCalledWith('fast');
  });

  it('should adjust speed average', () => {
    spyOn(component.adjustSpeedEventEmitter, 'emit');

    component.adjustSpeedAverage();
    expect(component.adjustSpeedEventEmitter.emit).toHaveBeenCalledWith(
      'average',
    );
  });

  it('should adjust speed slow', () => {
    spyOn(component.adjustSpeedEventEmitter, 'emit');

    component.adjustSpeedSlow();
    expect(component.adjustSpeedEventEmitter.emit).toHaveBeenCalledWith('slow');
  });

  it('should not adjust speed', () => {
    spyOn(component.adjustSpeedEventEmitter, 'emit');
    component.inProgressVisualize = true;
    component.adjustSpeedSlow();
    expect(component.adjustSpeedEventEmitter.emit).not.toHaveBeenCalled();
  });

  it('should create maze', () => {
    spyOn(component.createMazeEventEmitter, 'emit');
    component.createMaze(MAZE_TYPES.BASIC_RANDOM);
    expect(component.createMazeEventEmitter.emit).toHaveBeenCalledWith(
      MAZE_TYPES.BASIC_RANDOM,
    );
  });

  it('should not create maze', () => {
    spyOn(component.createMazeEventEmitter, 'emit');
    component.inProgressVisualize = true;

    component.createMaze(MAZE_TYPES.BASIC_RANDOM);
    expect(component.createMazeEventEmitter.emit).not.toHaveBeenCalled();
  });

  it('should reset board', () => {
    spyOn(component.resetEventEmitter, 'emit');
    component.reset();
    expect(component.resetEventEmitter.emit).toHaveBeenCalledWith();
  });

  it('should reset board while visualizing', () => {
    spyOn(component.resetEventEmitter, 'emit');
    component.inProgressVisualize = true;
    component.reset();
    expect(component.resetEventEmitter.emit).toHaveBeenCalledWith();
  });
});
