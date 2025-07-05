import { test, expect, Page } from '@playwright/test';
import { someUser } from '../../helper/hp';

test ('search by product barcode', async ({page})=> {

 const context = page.context();
 await context.clearCookies();
 await SomeUser(page);
  
 await page.getByRole('link', { name: /sales/i }).click();
 await page.getByRole('link', { name: /new sale/i }).click();
 await page.getByRole('textbox', { name: /sku|barcode|title/i}).fill('66666');

 const productNameText = await page.getByText('66666').textContent();
 const trimmedProductName = productNameText?.trim();
 expect (trimmedProductName).toBe('66666');                                          

 await page.getByRole('textbox',{name: /sku|barcode|title/i}).clear();
 await page.getByRole('textbox',{name: /sku|barcode|title/i}).fill('95103006');

 const productName2Text = await page.getByText('95103006').textContent();
 const trimmedProductName2 = productName2Text?.trim();
 expect (trimmedProductName2).toBe('95103006');                                         

});
