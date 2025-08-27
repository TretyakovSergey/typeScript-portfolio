import { test, expect } from '@playwright/test';
import { saleUser2 } from '../../helper/hp.ts';
import { variables, TIMEOUTS } from '../searchProducts/variables.ts';

test('Create a characteristic and delete', async ({ page }) => {

 const characteristicTab = page.getByText('Characteristics')
 const createNewCharacteristic = page.getByRole('button', { name: 'New field' });
 const inputNewNameCharacteristic = page.getByPlaceholder('Enter name');
 const nameCharacteristicText = variables.randomName();
 const searchInputCharacteritic = page.getByPlaceholder('Name of the characteristic');
 const rowNameAtrribute = page.getByRole('row', { name: nameCharacteristicText });
 const deleteButton = rowNameAtrribute.locator('button:has(svg[data-icon="trash"])');
 const yesDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });

 await variables.clearCookies(page);
 await saleUser2(page);
 await page.waitForLoadState('load');

 await variables.products(page).click();
 await expect(variables.catalog(page)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await variables.catalog(page).click();

 await expect(variables.catalogManagementButton(page)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(variables.catalogManagementButton(page)).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await variables.catalogManagementButton(page).click();

 await expect(characteristicTab).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await characteristicTab.click();

 await expect(createNewCharacteristic).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(createNewCharacteristic).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await createNewCharacteristic.click();
 await page.waitForTimeout(500);

 await expect(inputNewNameCharacteristic.nth(0)).toHaveValue('', {timeout: TIMEOUTS.MS_10000});
 await inputNewNameCharacteristic.nth(0).fill(nameCharacteristicText);
 await expect(inputNewNameCharacteristic.nth(0)).toHaveValue(nameCharacteristicText, {timeout: TIMEOUTS.MS_10000});

 await expect(variables.createBtn(page)).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(variables.createBtn(page)).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await variables.createBtn(page).click();

 await expect(searchInputCharacteritic).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(searchInputCharacteritic).toHaveValue('');

 await searchInputCharacteritic.fill(nameCharacteristicText);
 await expect(searchInputCharacteritic).toHaveValue(nameCharacteristicText, {timeout: TIMEOUTS.MS_10000});

 const row = page.getByRole('row').filter({has: page.getByRole('cell', { name: nameCharacteristicText })});

 await expect(row).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(row).toContainText(nameCharacteristicText);

 await expect(deleteButton).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(deleteButton).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await deleteButton.click();
 await page.waitForTimeout(500);

 await expect(yesDeleteButton).toBeVisible({timeout: TIMEOUTS.MS_10000});
 await expect(yesDeleteButton).toBeEnabled({timeout: TIMEOUTS.MS_10000});
 await yesDeleteButton.click();

 try {
    await expect(page.getByRole('row').filter({ has: page.getByRole('cell', { name: nameCharacteristicText }) })).toHaveCount(0);
  } catch (error) {
    console.error(`❌ Характеристика "${nameCharacteristicText}" всё ещё существует в таблице после удаления!`);
    throw error;
  }

});

