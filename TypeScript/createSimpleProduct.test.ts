import { test } from '../../../fixtures/authUser';
import { expect } from '@playwright/test';
import { locators, TIMEOUTS } from '../../../pagesNew/Locators/locators';
import { CreateProduct } from '../../../pagesNew/Catalog/CreateProduct';
import { Actions } from '../../../pagesNew/core/Actions';
import { ProductsNavigation } from '../../../pagesNew/Navigation/moduleProducts';
import { feature, story } from 'allure-js-commons';
import chalk from 'chalk';

test.use({ userKey: 'newProducts' });

test('Создание простого товара с единицей измерения "Штука" @allure.id:***', async ({ page }) => {
  await feature('Каталог');
  await story('Проверка отображения созданного товара в таблице каталога');

  const locator = locators(page);
  const product = new CreateProduct(page);
  const action = new Actions(page);
  const randomName = locator.randomName();
  const navigation = new ProductsNavigation(page);

  console.log(chalk.magenta('START Создание простого товара'));

  await test.step('Открытие каталога', async () => {
    await navigation.openProductsModule();
    await navigation.openCatalogModule();
    await action.waitVisible(locator.catalogFirstproduct);
    console.log(chalk.green('✔ Модуль Каталог открыт'));
  });

  await test.step('Создание товара', async () => {
    console.log(chalk.yellow(`Название товара: ${randomName}`));
    await product.openCreateForm();
    await product.fillSimpleProductForm({
      name: randomName,
      supplyPrice: '10000',
      retailPrice: '11000',
      quantity: '1',
    });
    await product.saveProduct();
    console.log(chalk.green('✔ Товар успешно создан'));
  });

  await test.step('Проверка товара в таблице', async () => {
    const productRow = page.locator('[id^="product-name-"]', { hasText: randomName });

    await expect.poll(async () => {
      const count = await productRow.count();
      if (count === 0) {
        await page.reload({ waitUntil: 'load' });
        await action.waitVisible(locator.catalogFirstproduct);
      }
      return count;
    }, { timeout: TIMEOUTS.MS_60000, intervals: [3000] }).toBeGreaterThan(0);

    console.log(chalk.yellow(`Продукт в каталоге: ${randomName}`));
    console.log(chalk.green('✔ Товар найден в таблице каталога'));
  });

  console.log(chalk.magenta('END Создание простого товара'));
});
