import { test, expect } from '@playwright/test';
import { //Some User for log in } from '../../helper/hp.ts';
import { variables } from '../searchProducts/variables.ts';
import { MOTORS } from '../searchProducts/motors.ts';

test('Edit sale date should remain unchanged after customer edit', async ({ page }) => {
  
/* Note: This test is not functional in its current state — it is intended for portfolio purposes only.
It showcases my ability to write automated end-to-end tests using Playwright,
 structure test logic clearly, and handle UI/backend validation workflows. */

  const cartItem = page.locator('#cart-item').first();
  const editButton = page.getByRole('button', { name: 'Edit' });
  const customerInput = page.locator('#customers');
  const dateInput = page.locator('div.react-datepicker__input-container input[type="text"]');
  const saveButton = page.getByRole('button', { name: 'Save' });
  const cashboxShifts = page.getByRole('link', { name: 'Cashbox shifts' });
  const closeCashbox = page.locator('#cashbox-close-0');
  const closeRegisterButton = page.locator('#closeCashbox');
  const companyAccountButton = page.locator('#all_to_transfer-span');
  const closeCashRegister = page.getByRole('button', { name: 'Close' });
  const openCashboxButton = page.getByRole('button', { name: 'Open cash register' });
  const customerName = page.locator('#customer-name').first();
  const closeButton = page.locator('#close-button');
  const choseCashRegister = page.locator('.css-18opwfc-placeholder', { hasText: 'Select cash desk' });

  await variables.clearCookies(page);
  // Some User for Log in
  await page.waitForLoadState('load');

  await variables.sale(page).click();
  await variables.newSale(page).click();
  await page.waitForTimeout(500);
  await variables.searchInput(page).fill(MOTORS.Ducati.barcode);
  await variables.enter(page);

  await expect(variables.payBtn(page)).toBeEnabled({ timeout: 5000 });
  await variables.payBtn(page).click();

  await expect(variables.cashButton(page)).toBeEnabled({ timeout: 5000 });
  await variables.cashButton(page).click();
  await variables.payBtn(page).click();
  await variables.Esc(page);

  await expect(variables.allSales(page)).toBeVisible({ timeout: 5000 });
  await variables.allSales(page).click();
  await cartItem.click();

  await expect(editButton).toBeVisible({ timeout: 5000 });
  const uiDateBefore = await dateInput.inputValue();
  await editButton.click();

  await customerInput.focus();
  await customerInput.fill('Test Customer 1');
  await page.waitForTimeout(500);
  await variables.enter(page);

  const [response] = await Promise.all([
    page.waitForResponse(resp =>
      resp.url().includes('/api/v2/order/') &&
      resp.request().method() === 'PUT' &&
      resp.status() === 200
    ),
    saveButton.click(),
  ]);

  await expect(customerName).toContainText('Test Customer 1');

  const responseBody = await response.json();
  const rawBackendDate = responseBody?.data?.new_order?.display_sold_at || responseBody?.data?.new_order?.sold_at;

  function formatDate(raw: string | undefined): string | undefined {
    if (!raw) return undefined;
    const date = new Date(raw);
    if (isNaN(date.getTime())) return undefined;

    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} | ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  const backendDate = formatDate(rawBackendDate);
  expect(backendDate).toBeDefined();
  expect(uiDateBefore).toContain(backendDate!);

  await cashboxShifts.click();
  await closeCashbox.click();

  const diffText = await page.locator('#cash-shift-difference-0').textContent();
  const cleanedAmount = diffText?.replace(/\s/g, '') ?? '';
  await page.fill('#actually-0-actually_first', cleanedAmount);
  await page.locator('body').click();
  await page.waitForTimeout(500);
  await closeRegisterButton.click();

  await companyAccountButton.click();
  await page.waitForTimeout(500);
  await closeCashRegister.click();
  await page.waitForTimeout(1000);

  await page.reload();
  await variables.allSales(page).click();
  await cartItem.click();
  await editButton.click();

  await customerInput.fill('Test Customer 2');
  await customerInput.press('Enter');
  await saveButton.click();

  await expect(customerName).toContainText('Test Customer 2');
  await cartItem.click();

  const uiDateAfter = await dateInput.inputValue();
  expect(uiDateAfter).toBe(uiDateBefore);

  await closeButton.click();
  await variables.newSale(page).click();
  await choseCashRegister.click();
  await page.getByText('Cashbox test-billz-emptyshop', { exact: true }).click();
  await openCashboxButton.click();

  await expect(variables.toastifyMessage(page).nth(1)).toContainText('The cash register was opened successfully');

});

