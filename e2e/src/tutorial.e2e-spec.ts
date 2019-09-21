import { AppPage } from './app.po';
import { browser, logging, element, by } from 'protractor';

describe('Tutorial', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should show the tutorial', () => {
    expect(element(by.id('tutorial')).getCssValue('display')).toEqual('block');
  });

  it('should skip the tutorial', () => {
    const skipButton = element(by.id('skipButton'));
    skipButton.click();
    expect(element(by.id('tutorial')).getCssValue('display')).toEqual('none');
  });

  it('should next the step in the tutorial', () => {
    const nextButton = element(by.id('nextButton'));
    nextButton.click();
    expect(
      element(by.id('tutorial'))
        .element(by.tagName('h3'))
        .getText(),
    ).toEqual('What is a pathfinding algorithm?');
  });

  it('should hide the tutorial when passing through all steps', () => {
    const nextButton = element(by.id('nextButton'));
    for (let num = 0; num < 8; num++) {
      nextButton.click();
    }
    const finishButton = element(by.id('finishButton'));
    finishButton.click();

    expect(element(by.id('tutorial')).getCssValue('display')).toEqual('none');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser
      .manage()
      .logs()
      .get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry),
    );
  });
});
