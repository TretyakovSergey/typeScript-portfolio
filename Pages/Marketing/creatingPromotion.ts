import { Page, expect, Locator } from '@playwright/test';
import { variables } from '../../helper/variables';
import { promotionLocators } from '../Locators/promotionLocators';
import { PromotionConfig } from './promotionsType';
import { Actions } from '../core/Actions';

export class CreatePromotion {
 page: Page;
 locators: ReturnType<typeof promotionLocators>;
 actions: Actions;
 toast: Locator;

 constructor(page: Page) {
  this.page = page;
  this.locators = promotionLocators(page);
  this.actions = new Actions(page);
  this.toast = variables.toastifyMessageSuccess(this.page);
 }

 async createPromotion(config: PromotionConfig) {
  const name = config.name ?? await variables.randomName();
  const startHour = config.startHour ?? '00';

  await this.actions.click(this.locators.createPromotion);
  await this.selectPromotionType(config);

  // --- Отмена чекбокса окончания акции, если нужно ---
  if (config.endDateCheckbox === false) {
    await this.actions.uncheck(this.locators.endCheckbox);
    await expect(this.locators.endCheckbox).not.toBeChecked();
  }

  // --- Заполняем название и время начала ---
  await this.actions.fill(this.locators.promotionNameInput, name);
  const storeInput = this.locators.chooseStorePromotion.locator('input');
  await this.actions.fill(storeInput, 'e2e-2sale');
  await this.locators.chooseStorePromotion.press('Enter');
  await this.locators.inputStartHour.scrollIntoViewIfNeeded();
  await this.actions.fill(this.locators.inputStartHour, startHour);

  if (config.levels && config.levels.length > 0) {
    for (let i = 0; i < config.levels.length; i++) {
      if (i > 0) {
        await this.actions.click(this.locators.addLevelButton);
      }
      await this.actions.fill(
        this.locators.levelsPercentDiscount[i],
        String(config.levels[i].discountPercent)
      );
      const levelInput = (this.locators as any)[`level${i + 1}`] as Locator;
      if (levelInput) {
        await this.actions.fill(levelInput, String(i + 1));
      }
    }
  }

  // --- Выбор продуктов ---
  if (config.products && config.products.length) {
    await this.actions.click(this.locators.promotionDetailsButton);
    await this.page.waitForLoadState('networkidle');

    for (const product of config.products) {
      if (!product.search) continue;

      await this.locators.searchProductInput.fill('');
      await this.locators.searchProductInput.fill(product.search);

      const row = this.page.locator('tr', { hasText: product.search });
      await row.waitFor({ state: 'visible', timeout: 20000 });

      const rowCheckbox = this.locators.rowCheckbox(0);
      await rowCheckbox.waitFor({ state: 'visible', timeout: 20000 });
      if (!(await rowCheckbox.isChecked())) {
        await rowCheckbox.check();
      }

      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  // --- Остальные действия перед созданием ---
  await this.actions.click(this.locators.mutalExclusionButton);
  await this.page.waitForLoadState('domcontentloaded');
  await this.actions.click(this.locators.previewButton);
  await this.actions.click(this.locators.createPromotionButton);

  await this.actions.waitVisible(this.toast);
  await this.actions.waitHidden(this.toast);
  console.log('Акция успешно созданна ✅');
  return name;
 }

  // метод выбора типа акции
 private async selectPromotionType(config: PromotionConfig) {
  switch (config.type) {
    case 'fixedPrice':
      await this.actions.waitVisible(this.locators.fixedPriceButton);
      await this.actions.click(this.locators.fixedPriceButton);
        if (config.discountAmount !== undefined) {
        const discountInputFix = this.page.getByPlaceholder('Enter discount price');
        await this.actions.fill(discountInputFix, String(config.discountAmount));
        }
    break;

  case 'discountX%':
    await this.actions.waitVisible(this.locators.percentageDiscountButton);
    await this.actions.click(this.locators.percentageDiscountButton);
      if (config.discountPercent !== undefined) {
        await this.actions.fill(
        this.locators.discountPercentInput,
        String(config.discountPercent)
        );
      }
  break;

  case 'onePlusOne':
    await this.actions.waitVisible(this.locators.buyOneGetDiscountButton);
    await this.actions.click(this.locators.buyOneGetDiscountButton);
    await this.actions.fill(this.locators.onePlusOneBuyCount, String(config.buyCount ?? 1));
    await this.actions.fill(this.locators.onePlusOneReceiveCount, String(config.receiveCount ?? 1));
    await this.actions.fill(this.locators.onePlusOneReceiveDiscount, String(config.receiveDiscount ?? 0));
  break;

  case 'carousel':
    await this.actions.waitVisible(this.locators.carouselDiscout);
    await this.actions.click(this.locators.carouselDiscout);
  break;

  case 'totalAmount':
    await this.actions.waitVisible(this.locators.discountOnReceipt);
    await this.actions.click(this.locators.discountOnReceipt);
    if (config.discountAmount !== undefined) {
      await this.actions.fill(this.locators.totalAmountInput, String(config.discountAmount));
    }
  break;

  default:
    throw new Error(`Unknown promotion type: ${config.type}`);
  }
 }

 // Удаление созданной акции со списка 
 async deletePromotion() {
  await this.page.reload({waitUntil: 'domcontentloaded'});
  await this.actions.click(this.locators.promotionActionsPlayPauseButton);
  await this.actions.click(this.locators.promotionActionsDeleteButton);
  await this.actions.waitVisible(this.toast);
  console.log('Акция успешно удалена ✅');
 
 }
}
