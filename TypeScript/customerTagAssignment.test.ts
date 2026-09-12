import { test } from '../../../fixtures/authUser';
import { expect } from '@playwright/test';
import { feature, story } from 'allure-js-commons';
import { CustomersNavigation } from '../../../pagesNew/Navigation/moduleCustomers';
import { CustomerGroupsPage } from '../../../pagesNew/Customers/customerGroupsPage';
import { CustomerPage } from '../../../pagesNew/Customers/createCustomer';
import { ClientsListPage } from '../../../pagesNew/Customers/clientsListPage';
import { ClientDetailsPage } from '../../../pagesNew/Customers/clientDetailsPage';
import chalk from 'chalk';

test.use({ userKey: 'newLoyaltyDiscount' });

test('Тег клиента: создание, присвоение и отображение в карточке клиента @allure.id:6038', async ({ page }) => {
  await feature('Клиенты');
  await story('Теги клиентов — создание и присвоение');

  const customersNavigation = new CustomersNavigation(page);
  const customerGroupsPage = new CustomerGroupsPage(page);
  const customerPage = new CustomerPage(page);
  const clientsListPage = new ClientsListPage(page);
  const clientDetailsPage = new ClientDetailsPage(page);

  const timestamp = Date.now();
  const tagName = `tag_${timestamp}`;
  const customerName = `tag_client_${timestamp}`;
  const customerPhone = `9${String(timestamp).slice(-8)}`;

  console.log(chalk.magenta('START Тег клиента: создание, присвоение и отображение'));

  await test.step('Создание тега', async () => {
    await customersNavigation.openCustomersModule();
    await customersNavigation.openCustomerGroupsSubModule();
    await customerGroupsPage.createTag(tagName);
    console.log(chalk.green(`✔ Тег создан: ${tagName}`));
  });

  await test.step('Создание клиента и присвоение тега', async () => {
    await customersNavigation.openCustomersModule();
    await customersNavigation.openCustomersListSubModule();
    await customerPage.createCustomerWithTag(customerName, customerPhone, tagName);
    console.log(chalk.green(`✔ Клиент создан с тегом: ${customerName}`));
  });

  await test.step('Проверка отображения тега в карточке клиента', async () => {
    await clientsListPage.searchClient(customerName);
    await page.waitForTimeout(2000);
    await clientsListPage.clickOnClient(customerName);
    await page.waitForTimeout(2000);

    const tagText = await clientDetailsPage.getTagText();
    console.log(chalk.yellow(`Тег в карточке: "${tagText}", ожидается "${tagName}"`));
    expect(tagText, 'Присвоенный тег должен отображаться в карточке клиента').toContain(tagName);
    console.log(chalk.green(`✔ Тег "${tagName}" корректно отображается в карточке клиента`));
  });

  console.log(chalk.magenta('END Тег клиента: создание, присвоение и отображение'));
});
