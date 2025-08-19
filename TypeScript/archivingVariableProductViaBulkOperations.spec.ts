import { test, expect } from '@playwright/test';
import { saleUser2 } from '../../helper/hp.ts';
import { variables, TIMEOUTS } from '../searchProducts/variables.ts';

test('Archiving variable product via bulk operations', async ({ page }) => {

 const confirmArchiveButton = page.getByRole('button', { name: 'Archive' });
 const productNameLocator = page.locator('[id^="product-name-"] span');
 const productNameText = 'Variative_Product_for_archiving';
 const checkbox = page.locator('#header-checkbox');
 const unarchiveButton =page.locator('#unarchive');
 const unzipButton = page.getByRole('button', { name: 'Yes, unzip' });
 const selectPropertyMenu =  page.getByText('Select from list');
 const pickProperty = page.locator('#Name');
 const listInput = page.getByPlaceholder('For example, 579135791397');
 const statusCell = page.getByRole('cell', { name: 'Ready to add' });

 await variables.clearCookies(page);
 await saleUser2(page);
 await page.waitForLoadState('load');
 
 await variables.products(page).click();
 await expect(variables.catalog(page)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await variables.catalog(page).click();
 await page.waitForLoadState('networkidle');

 await expect(page).toHaveURL(/\/products\/catalog(\?|$)/, {timeout: TIMEOUTS.MS_10000});
 await expect(page).toHaveTitle('Catalog | BILLZ', {timeout: TIMEOUTS.MS_10000});

 await variables.actionCatalogButton(page).click();

 await expect(variables.hightLightProductsButton(page)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(variables.hightLightProductsButton(page)).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await variables.hightLightProductsButton(page).click();

 await expect(selectPropertyMenu).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await selectPropertyMenu.click();

 await expect(pickProperty).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await pickProperty.click();

 await page.waitForTimeout(500);
 await listInput.fill(productNameText);
 await page.waitForTimeout(300);
 await variables.nextButton(page).click();
 await page.waitForLoadState('networkidle');

 await expect(statusCell.nth(0)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(statusCell.nth(1)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(statusCell.nth(0)).toHaveText(/Ready to add/i);
 await expect(statusCell.nth(1)).toHaveText(/Ready to add/i);

 await variables.bulkOperationButton(page).click();

 await expect(variables.productArchivingBulkOperation(page)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await variables.productArchivingBulkOperation(page).click();
 
 await expect(confirmArchiveButton).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(confirmArchiveButton).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await confirmArchiveButton.click();
 await page.waitForTimeout(1000);
 await page.reload();
 await page.waitForTimeout(1000);
 await page.waitForLoadState('networkidle');

 await variables.searchInputCatalog(page).fill(productNameText);
 await expect(productNameLocator.filter({ hasText: productNameText })).toHaveCount(0);

 await variables.archiveCatalogButton(page).click();
 await expect(variables.searchInputArchiving(page)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await variables.searchInputArchiving(page).fill(productNameText);
 await expect(checkbox).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await checkbox.check();
 await page.waitForTimeout(500);
 await expect(checkbox).toBeChecked({timeout: TIMEOUTS.MS_10000});
 await unarchiveButton.click();
 await page.waitForTimeout(500);
 await expect(unzipButton).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await unzipButton.click();

 await expect(variables.toastifyMessageSuccess(page)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(variables.toastifyMessageSuccess(page)).toContainText(/unzipped successfully!/);

 await page.waitForTimeout(500);
 await page.reload();
 await page.waitForTimeout(1000);
 await page.waitForLoadState('networkidle');

 await variables.searchInputCatalog(page).fill(productNameText);
 await page.waitForTimeout(1000)
 
 const productNames = await page.locator('[id^="product-name-"]').allTextContents();
 await expect(productNames).toContain('Variative_Product_for_archiving / m');
 await expect(productNames).toContain('Variative_Product_for_archiving / XXL');

});

