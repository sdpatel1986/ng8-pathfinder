import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared';
import {
  BoardComponent,
  BoardDescriptionComponent,
  TutorialComponent,
  ColorPickerComponent,
} from './components';
import { ALGORITHMS, HEURISTICS } from './shared/constants';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        BoardComponent,
        BoardDescriptionComponent,
        TutorialComponent,
        ColorPickerComponent,
      ],
      imports: [AppRoutingModule, SharedModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a board', () => {
    expect(component.board).toBeTruthy();
  });

  it(`should init with Dijksra's algorithm`, () => {
    expect(component.board.currentAlgorithm).toEqual(ALGORITHMS.DIJIKSTRA);
    expect(component.board.currentHeuristic).toBeNull();
  });

  it('should adjust the speed successfully', () => {
    component.adjustSpeed('fast');
    expect(component.board.speed).toEqual('fast');
  });

  it('should change color EventEmitter', () => {
    component.changeColorEventEmitter({
      shortestPathColor: 'red',
      visitedNodeColor: 'yellow',
      visitedObjectNodeColor: 'green',
      wallColor: 'black',
    });
    expect(component.boardAnimationColor).toEqual(
      'shortest-path__red visitedobject__green visited__yellow wall__black',
    );
  });
});
