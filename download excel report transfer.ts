import { test, expect } from '@playwright/test';
import { someLogin } from '../../helper/hp.ts';
import { variables } from '../searchProducts/variables.ts';
import { downloadExcelAndParse, matchHeaders } from '../../helper/excelUtils.ts';
import { expectedHeaders } from '../../helper/expectedHeaders.ts';
import fs from 'fs/promises';

test('Download excel report transfer', async ({ page }) => {
  
 const reportTransfer = page.locator('a[href="/reports/products/transfers"]', { hasText: 'Go to report' });
 const now = new Date();
 const currentYear = now.getFullYear();

 await variables.clearCookies(page);
 await someLogin(page);
 await page.waitForLoadState('load');

 await variables.reports(page).click();
 await expect(variables.productsReport(page)).toBeVisible({ timeout: 10000 });
 await variables.productsReport(page).click();
 await expect(reportTransfer).toBeVisible({ timeout: 10000 });
 await reportTransfer.click();
 await page.waitForLoadState('networkidle');

 await variables.datadButton(page).click();
 await page.waitForTimeout(500);
 await variables.yearDataButton(page).click();
 await page.waitForTimeout(500);
 await variables.applyButton(page).click();
 await page.waitForTimeout(1000);
 

 const { headers, rows, filePath } = await downloadExcelAndParse(page, variables.downloadExcelFile(page));
 expect(rows.length).toBeGreaterThan(0);

 if (filePath) {
  const stats = await fs.stat(filePath);
  expect(stats.size).toBeGreaterThan(0);
 }

 const expected = expectedHeaders.transferReport.map(header => [header.ru, header.en]);
 expect(matchHeaders(headers, expected)).toBeTruthy();

 const sentDateColumnIndex = headers.findIndex(header =>
  header.toLowerCase().includes('отправлено') || header.toLowerCase().includes('sent at')
 );
 const receivedDateColumnIndex = headers.findIndex(header =>
  header.toLowerCase().includes('принято') || header.toLowerCase().includes('received at')
 );
 const fromColumnIndex = headers.findIndex(header => header.trim().toLowerCase() === 'откуда');
 const toColumnIndex = headers.findIndex(header => header.trim().toLowerCase() === 'куда');
 const nameColumnIndex = headers.findIndex(header => header.toLowerCase() === 'наименование');
 const skuCodeColumnIndex = headers.findIndex(header => header.toLowerCase() === 'артикул');
 const barcodeColumnIndex = headers.findIndex(header => header.toLowerCase() === 'баркод');

 expect(sentDateColumnIndex).toBeGreaterThan(-1);
 expect(receivedDateColumnIndex).toBeGreaterThan(-1);
 expect(fromColumnIndex).toBeGreaterThan(-1);
 expect(toColumnIndex).toBeGreaterThan(-1);
 expect(nameColumnIndex).toBeGreaterThan(-1);
 expect(skuCodeColumnIndex).toBeGreaterThan(-1);
 expect(barcodeColumnIndex).toBeGreaterThan(-1);

 const dateRegex = /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/;

 rows.forEach((row, rowIndex) => {
  const sentCell = String(row[sentDateColumnIndex]).trim();
  const receivedCell = String(row[receivedDateColumnIndex]).trim();
  const fromLocation = String(row[fromColumnIndex]).trim();
  const toLocation = String(row[toColumnIndex]).trim();
  const productName = String(row[nameColumnIndex]).trim();
  const productSKUCode = String(row[skuCodeColumnIndex]).trim();
  const productBarcode = String(row[barcodeColumnIndex]).trim();

  if (!dateRegex.test(sentCell)) {
    throw new Error(`❌ Неверный формат даты отправки "${sentCell}" в строке ${rowIndex + 1}`);
  }
  if (!dateRegex.test(receivedCell)) {
    throw new Error(`❌ Неверный формат даты получения "${receivedCell}" в строке ${rowIndex + 1}`);
  }

  const sentDate = new Date(sentCell);
  const receivedDate = new Date(receivedCell);
  if (sentDate.getFullYear() !== currentYear) {
    throw new Error(`❌ Дата отправки "${sentCell}" в строке ${rowIndex + 1} не принадлежит текущему году`);
  }
  if (receivedDate.getFullYear() !== currentYear) {
    throw new Error(`❌ Дата получения "${receivedCell}" в строке ${rowIndex + 1} не принадлежит текущему году`);
  }

  const rowValues = row.map(cell => String(cell).trim());
  const hasData = rowValues.some(value => value !== '');
  if (!hasData) {
    throw new Error(`❌ Строка ${rowIndex + 1} полностью пустая`);
  }

  if (fromLocation === toLocation) {
    throw new Error(`❌ Откуда и Куда совпадают в строке ${rowIndex + 1}: "${fromLocation}"`);
  }

  if (!productName || !productSKUCode || !productBarcode) {
    throw new Error(`❌ Пустое поле в строке ${rowIndex + 1}: Наименование/Артикул/Баркод`);
  }
 });

 if (filePath) {
  await fs.unlink(filePath);
 }

});

