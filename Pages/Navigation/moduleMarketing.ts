// moduleFinance.ts
import { Page } from '@playwright/test';
import { BaseView } from '../BaseView';
import { variables } from '../../helper/variables';

export class MarketingNavigation extends BaseView {
  constructor(page: Page) {
    super(page);
  }

  async openMarketingModule() {
    const sale = variables.marketing(this.page);
    await this.actions.click(sale);
  }

  async openPromotionsModule() {
    const newSale = variables.promotions(this.page);
    await this.actions.click(newSale);
  }

  async openPromocodesModule() {
    const cashShifts = variables.promoCodes(this.page);
    await this.actions.click(cashShifts);
  }

  async openSmsMailing() {
    const cashboxOperations = variables.smsMailing(this.page);
    await this.actions.click(cashboxOperations);
  }

  async openGiftCards() {
    const cashboxOperations = variables.giftCards(this.page);
    await this.actions.click(cashboxOperations);
  }
}
