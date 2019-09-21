import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css'],
})
export class TutorialComponent implements OnInit {
  public showTutorial = true;

  public currentStepNumber = 1;
  public isFinish = false;

  constructor() {}

  ngOnInit() {}

  public hideTutorial(): void {
    this.showTutorial = false;
  }

  public nextStep(): void {
    if (this.currentStepNumber < 9) {
      this.currentStepNumber++;
    }
    this.updateCurrentStep();
  }

  public previousStep(): void {
    if (this.currentStepNumber > 1) {
      this.currentStepNumber--;
    }
    this.updateCurrentStep();
  }

  public updateCurrentStep(): void {
    if (this.currentStepNumber === 9) {
      this.isFinish = true;
    } else {
      this.isFinish = false;
    }
  }
}
