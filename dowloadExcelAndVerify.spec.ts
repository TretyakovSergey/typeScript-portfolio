import { test, expect } from '@playwright/test';
import { variables } from '../searchProducts/variables.ts';
import { downloadExcelAndParse, matchHeaders } from '../../helper/excelUtils.ts';
import { expectedHeaders } from '../../helper/expectedHeaders.ts';
import fs from 'fs/promises';

test('Download excel report transaction', async ({page}) => {
 
 const transactionReportButton = page.locator('a[href="/reports/shop/transactions"]', { hasText: 'Go to report' });
 const shopCells = page.getByRole('gridcell').filter({ hasText: 'e2e-2sale' });
 const allShopFilterButton = page.locator('span.multiple.value', { hasText: 'All stores' });
 const allStoresButton = page.locator('div.option.all', { hasText: 'All stores' });
 const selectStore = page.locator('div.option', { hasText: 'e2e-2sale' });
 const now = new Date();
 const currentYear = now.getFullYear();
 const currentMonth = now.getMonth();

 await variables.clearCookies(page);
 await // some user for logi in
 await page.waitForLoadState('load');

 await variables.reports(page).click();
 await expect(variables.shopReports(page)).toBeVisible({timeout: 10000});
 await variables.shopReports(page).click();
 await expect(transactionReportButton).toBeVisible({timeout: 10000});
 await transactionReportButton.click();
 await page.waitForLoadState('networkidle');
 
 await expect(variables.datadButton(page)).toBeVisible({timeout: 10000});
 await variables.datadButton(page).click();
 await expect(variables.monthDataButton(page)).toBeVisible({timeout: 10000});
 await variables.monthDataButton(page).click();
 await variables.applyButton(page).click();

 await expect(allShopFilterButton).toBeVisible({timeout: 10000});
 await allShopFilterButton.click();
 await page.waitForTimeout(500);
 await allStoresButton.click();
 await page.waitForTimeout(1000);
 await selectStore.click();
 await page.waitForTimeout(700);
 await variables.enter(page);
 await page.waitForTimeout(1500);

 await expect(shopCells.first()).toContainText('e2e-2sale');
 
 const { headers, rows, filePath } = await downloadExcelAndParse(page, variables.downloadExcelFile(page));
 
 expect(rows.length).toBeGreaterThan(0);
 
   if (filePath) {
     const stats = await fs.stat(filePath);
     expect(stats.size).toBeGreaterThan(0);
   }

 const expected = expectedHeaders.transactionsReport.map(header => [header.ru, header.en]);
 expect(matchHeaders(headers, expected)).toBeTruthy();

 const dateColumnIndex = headers.findIndex(header =>
   header.toLowerCase().includes('дата') || header.toLowerCase().includes('date')
 );
 expect(dateColumnIndex).toBeGreaterThan(-1);

 const shopColumnIndex = headers.findIndex(header =>
  header.toLowerCase().includes('магазин') || header.toLowerCase().includes('shop')
 );
 expect(shopColumnIndex).toBeGreaterThan(-1);

 const dateRegex = /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/;

 rows.forEach((row, rowIndex) => {
   const cell = String(row[dateColumnIndex]).trim();
   
   if (!dateRegex.test(cell)) {
     throw new Error(`❌ Неверный формат даты "${cell}" в строке ${rowIndex + 1}`);
   }

   const [year, month] = cell.split('-').map(Number);
   const rowDate = new Date(year, month - 1);

   if (rowDate.getFullYear() !== currentYear) {
     throw new Error(`❌ Дата "${cell}" не принадлежит текущему году`);
   }

   if (rowDate.getMonth() !== currentMonth) {
     throw new Error(`❌ Дата "${cell}" не принадлежит текущему месяцу`);
   }
 
   const rowValues = row.map(cell => String(cell).trim());
   const hasData = rowValues.some(value => value !== '');
   if (!hasData) {
     throw new Error(`❌ Строка ${rowIndex + 1} полностью пустая`);
   }

   const shopCell = String(row[shopColumnIndex]).trim();
    if (shopCell !== 'e2e-2sale') {
      throw new Error(`❌ В строке ${rowIndex + 1} колонка "Магазин" содержит "${shopCell}", ожидалось "e2e-2sale"`);
    }

 });

 if (filePath) {
    await fs.unlink(filePath);
  }

});

