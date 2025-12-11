import { test } from '@playwright/test';
import { feature, story } from 'allure-js-commons';
import { saleUser2 } from '../../../helper/hp';
import { BARCODE_200 } from '../../../helper/constans';
import { MassAddProductBarcode } from '../../../pagesNew/Sale/massAddProductBarcode';
import { SaleNavigation } from '../../../pagesNew/Navigation/moduleSale';
import { CartVerifyItem } from '../../../pagesNew/Sale/cartVerifyItem';
import { SalePayment } from '../../../pagesNew/Sale/salePayment';
import { Actions } from '../../../pagesNew/core/Actions';
import { variables } from '../../../helper/variables';
 
test('Добавление 100 продуктов сканированием баркода', async ({ page }) => {
 await feature('Поиск продуктов')
 await story('Добавление 200 продуктов сканированием баркода')
 await test.step('Добавление 200 продуктов сканированием баркода', async () => {

 const addProductBarcode = new MassAddProductBarcode(page);
 const cartVerifyItem = new CartVerifyItem(page);
 const saleNavigation = new SaleNavigation(page);
 const completeSale = new SalePayment(page);
 const action = new Actions(page);

 await saleUser2(page);
 await page.waitForLoadState('load');

 await saleNavigation.openSaleModule();
 await saleNavigation.openNewSale();

 await addProductBarcode.addProducts(BARCODE_200);
 await cartVerifyItem.verifyCartItems(BARCODE_200.length);

 await action.click(variables.payButtonCart(page));
 await completeSale.completeSale('cash');
 
 })
});

