import { Page } from '@playwright/test';
import { Actions } from '../pagesNew/core/Actions';

export class BaseView {
  readonly page: Page;
  readonly actions: Actions;

  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
  }

  async open(url: string) {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }
}
