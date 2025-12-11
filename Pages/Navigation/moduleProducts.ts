import { Page, expect } from '@playwright/test';
import { BaseView } from '../BaseView';
import { variables, TIMEOUTS } from '../../helper/variables';

export class ProductsNavigation extends BaseView {
  constructor(page: Page) {
    super(page);
  }

  async openProductsModule() {
   const productsModule = variables.products(this.page);
   await expect(productsModule).toBeVisible({timeout: TIMEOUTS.MS_10000});
   await productsModule.click();
  }

 async openCatalogModule() {
    const catalogModule = variables.catalog(this.page);
    await expect(catalogModule).toBeVisible({timeout: TIMEOUTS.MS_10000});
    await catalogModule.click();
 }

 async openImportModule() {
    const importModule = variables.importModule(this.page);
    await expect(importModule).toBeVisible({timeout: TIMEOUTS.MS_10000});
    await importModule.click();
 }

 async openOrdersModule() {
    const ordersModule = variables.ordersModule(this.page);
    await expect(ordersModule).toBeVisible({timeout: TIMEOUTS.MS_10000});
    await ordersModule.click();
 }

 async openInventoryModeule() {
    const inventoryModule = variables.inventoryModule(this.page);
    await expect(inventoryModule).toBeVisible({timeout: TIMEOUTS.MS_10000});
    await inventoryModule.click();
 }

 async openTransferModule() {
    const transferModule = variables.transferModule(this.page);
    await expect(transferModule).toBeVisible({timeout: TIMEOUTS.MS_10000});
    await transferModule.click();
 }

 async openRepricingModule() {
    const repricingModule = variables.repricingModule(this.page);
    await expect(repricingModule).toBeVisible({timeout: TIMEOUTS.MS_10000});
    await repricingModule.click();
 }

 async openWriteOffModule() {
    const writeOffModule = variables.writeOffModule(this.page);
    await expect(writeOffModule).toBeVisible({timeout: TIMEOUTS.MS_10000});
    await writeOffModule.click();
 }

 async openSuppliersModule() {
   const supplierModul = variables.supplierModul(this.page);
   await expect(supplierModul).toBeVisible({timeout: TIMEOUTS.MS_10000});
   await supplierModul.click();
 }

}
