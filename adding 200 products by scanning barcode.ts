import {test, expect, Page} from '@playwright/test';
import {saleUser2} from '../../../helper/hp.ts';
import {BARCODE_200} from '../constans.ts';

test ('adding 200 products by scanning a barcode', async ({page})=> {
 test.setTimeout(9000000);
 
 const context = page.context();
 await context.clearCookies();
 await someUser(page);
 
 const sale = page.getByRole('link', { name: /sales/i });                            
 const newSale = page.getByRole('link', { name: /new sale/i });                      
 const searchInput = page.getByRole('textbox', { name: /sku|barcode|title/i});       
 const cartItemsCount = page.locator('#cart-items-count')                          
 
 await sale.click();
 await page.waitForLoadState('networkidle');
 await newSale.click(); 
 await page.waitForLoadState('networkidle');

 await searchInput.waitFor({state: 'visible'});
 let cartItemsText = await cartItemsCount.innerText();
 let cartItemsCountValue = parseInt(cartItemsText.trim(), 10);

 for (const barcode of BARCODE_200){
  await searchInput.fill(barcode);
  await page.getByText(`${barcode}`).waitFor({state: 'visible'});
  await page.keyboard.press('Enter');
  await page.waitForTimeout (1000);
}
 await cartItemsCount.waitFor({ state: 'visible' });
 cartItemsText = await cartItemsCount.innerText();
 cartItemsCountValue = parseInt(cartItemsText.trim(), 10);
 expect (cartItemsCountValue).toBe(200);                                

});
