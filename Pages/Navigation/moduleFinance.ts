// moduleFinance.ts
import { Page } from '@playwright/test';
import { BaseView } from '../BaseView';
import { variables } from '../../helper/variables';

export class FinanceNavigation extends BaseView {
  constructor(page: Page) {
    super(page);
  }

  async openFinanceModule() {
    const sale = variables.finance(this.page);
    await this.actions.click(sale);
  }

  async openFinanceCategory() {
    const newSale = variables.financeCategory(this.page);
    await this.actions.click(newSale);
  }

  async openFinanceTransaction() {
    const cashShifts = variables.financeTransactions(this.page);
    await this.actions.click(cashShifts);
  }

  async openSatateOfAccount() {
    const cashboxOperations = variables.stateOfAccounts(this.page);
    await this.actions.click(cashboxOperations);
  }
}
