import { AppPage } from './app.po';
import { browser, logging, element, by } from 'protractor';

describe('Path finding Visualizer App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
    element(by.id('skipButton')).click();
  });

  it('should run the app successfully', () => {
    expect(page.getTitleText()).toEqual('Pathfinding Visualizer');
    expect(element(by.id('board')).isPresent()).toBeTruthy();
  });

  it('should visualize the path successfully', () => {
    const visualizeButton = element(by.id('actualStartButton'));
    expect(visualizeButton.getText()).toEqual('Visualize!');

    visualizeButton.click();
    browser.waitForAngular();
    expect(element(by.css('td.shortest-path')).isPresent()).toBeTruthy();
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
