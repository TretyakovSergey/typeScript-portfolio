import { Page, expect } from '@playwright/test';
import { BaseView } from '../BaseView';
import { variables, TIMEOUTS } from '../../helper/variables';
import { Actions } from '../core/Actions';

export class SaleNavigation extends BaseView {
  constructor(page: Page) {
    super(page);
  }

 async openSaleModule() {
    const sale = variables.sale(this.page);
    await this.actions.waitVisible(sale);
    await this.actions.click(sale);
  }

 async openNewSale() {
    const newSale = variables.newSale(this.page);
    await this.actions.waitVisible(newSale);
    await this.actions.click(newSale);
 }

  async openAllSales() {
    const newSale = variables.allSales(this.page);
    await this.actions.waitVisible(newSale);
    await this.actions.click(newSale);
  }

  async openCashShifts() {
    const cashShifts = variables.cashShifts(this.page);
    await this.actions.waitVisible(cashShifts);
    await this.actions.click(cashShifts);
  }

  async openCashboxOperations() {
    const cashboxOperations = variables.cashboxOperations(this.page);
    await this.actions.waitVisible(cashboxOperations);
    await this.actions.click(cashboxOperations);
  }

}
