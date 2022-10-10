import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should be reached', () => {
    page.navigateTo();
    expect(page).toBeDefined();
  });
});
