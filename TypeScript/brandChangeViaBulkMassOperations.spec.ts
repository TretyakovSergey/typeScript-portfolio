import { test, expect } from '@playwright/test';
import { saleUser2 } from '../../helper/hp.ts';
import { variables, TIMEOUTS } from '../searchProducts/variables.ts';

test('Brand change via bulk mass operations', async ({ page }) => {

 const selectPropertyMenu1 =  page.getByText('Select from list');
 const pickProperty = page.locator('#Name');
 const listInput = page.getByPlaceholder('For example, 579135791397');
 const productName = 'Product for changing brand';
 const statusCell = page.getByRole('cell', { name: 'Ready to add' });
 const selectPropertyMenu2 =  page.locator('#custom_fields');
 const enterProperty = page.getByPlaceholder('Enter property');
 const propertyText = await variables.randomName();
 const columnHeaderBrand = page.getByRole('columnheader', {name: 'Brand'});

 await variables.clearCookies(page);
 await saleUser2(page);
 await page.waitForLoadState('load');

 await variables.products(page).click();
 await expect(variables.catalog(page)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await variables.catalog(page).click();
 
 await expect(variables.actionCatalogButton(page)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(variables.actionCatalogButton(page)).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await variables.actionCatalogButton(page).click();

 await expect(variables.hightLightProductsButton(page)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(variables.hightLightProductsButton(page)).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await variables.hightLightProductsButton(page).click();

 await expect(selectPropertyMenu1).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(selectPropertyMenu1).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await selectPropertyMenu1.click();

 await expect(pickProperty).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(pickProperty).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await pickProperty.click();

 await expect(listInput).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await listInput.fill(productName);
 await expect(listInput).toHaveValue(productName, {timeout: TIMEOUTS.MS_10000});

 await expect(variables.nextButton(page)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(variables.nextButton(page)).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await variables.nextButton(page).click();

 await expect(statusCell).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(statusCell).toHaveText(/Ready to add/i);

 await expect(variables.bulkOperationButton(page)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(variables.bulkOperationButton(page)).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await variables.bulkOperationButton(page).click();

 await expect(variables.editProductProperties(page)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(variables.editProductProperties(page)).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await variables.editProductProperties(page).click();

 await expect(selectPropertyMenu2).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(selectPropertyMenu2).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await selectPropertyMenu2.click({force: true});
 await selectPropertyMenu2.fill('Brand');
 await page.keyboard.press('Enter');

 await enterProperty.fill(propertyText);
 await expect(enterProperty).toHaveValue(propertyText, {timeout: TIMEOUTS.MS_10000});

 await variables.applyButton(page).click();
 await page.waitForTimeout(1000);
 
 await page.reload();
 await page.waitForLoadState('networkidle');
 
 await expect(variables.searchInputCatalog(page)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await variables.searchInputCatalog(page).fill(productName);
 await expect(variables.searchInputCatalog(page)).toHaveValue(productName);

 await columnHeaderBrand.scrollIntoViewIfNeeded({timeout: TIMEOUTS.MS_10000});
 await expect(columnHeaderBrand).toBeVisible({timeout: TIMEOUTS.MS_10000});


 const colIndex = await columnHeaderBrand.getAttribute('aria-colindex');
 const cellLocator = page.locator(`[role="gridcell"][aria-colindex="${colIndex}"] .ag-cell-value`).first();

 await expect(cellLocator).toHaveText(propertyText, {timeout: TIMEOUTS.MS_10000});

});

