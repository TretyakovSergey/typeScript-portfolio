// helper/promotionLocators.ts
import { Page, Locator } from '@playwright/test';

export const promotionLocators = (page: Page) => ({
 // --- Маркетинг ---
 marketing: page.locator('#marketing'),
 promotions: page.locator('#promotions'),
 promoCodes: page.locator('#promo-codes'),
 smsMailing: page.locator('#sms_mailing'),
 giftCards: page.locator('#gift_cards'),
 createPromotion: page.locator('#create'),
 createPromotionButton: page.locator('#create-promo'),
 promotionNameInput: page.locator('#promotion-name'),
 inputPromotionName: page.getByTestId('promotionNameInput'),
 chooseStorePromotion: page.locator('.css-1e57izu'),
 setStore: page.getByText('All stores'),

  /*-----------------------------------------
  //   ** Локаторы при создании акций **
  -----------------------------------------*/

 // --- Карусельная скидка и Уровни скидки ---
 level1: page.getByTestId('productOrder-0'),
 level2: page.getByTestId('productOrder-1'),
 level3: page.getByTestId('productOrder-2'),
 levelsPercentDiscount: [
 page.getByTestId('productDiscount-0'),
 page.getByTestId('productDiscount-1'),
 page.getByTestId('productDiscount-2')],
 addLevelButton: page.getByRole('button', { name: /Add level|Добавить уровень/i }),
 carouselDiscout: page.getByTestId('discountCarousel'),
  
 // --- Скидка на чек ---
 discountOnReceipt: page.getByTestId('discounOnTotalAmount'),
 totalAmountInput: page.getByTestId('productOrder-0'),

 // -- Скидка Х% на продукт 
 discountPercentInputX: page.getByTestId('discountPercentageInput'),

 // -- Фикс. Цена на продукт --
 discountInputFix: page.getByPlaceholder('Enter discount price'),

 // --- Детали и продукты ---
 promotionDetailsButton: page.locator('#promotion_details-button'),
 productSelectionButton: page.locator('#product_selection-button'),
 inputStartHour: page.locator('#start-hour'),
 searchProductInput: page.locator('#search'),
 mutalExclusionButton: page.locator('#product_selection-button'),
 mutualExclusionButton: page.getByRole('button', { name: 'Mutual Exclusion' }),
 endCheckbox: page.getByTestId('endDateCheckbox'),
 previewButton: page.locator('#mutual_exclusions-button'),
 rowCheckbox: (index: number) => page.locator(`#checkbox-${index}`),

 // --- Типы акций ---
 fixedPriceButton: page.getByTestId('discountProductsFixedPrice'),
 fixedPriceForProduct: page.getByTestId('discountProductsFixedPrice'),
 fixedPriceForProductWithPromo: page.getByTestId('promoDiscountProductsFixedPrice'),
 fixedPriceInput: page.getByPlaceholder('Enter discount price'),

 percentageDiscountButton: page.getByTestId('discountProductsPercentage'),
 discountPercentInput: page.getByPlaceholder('Enter discount percentage'),
 discountProductWithPromo: page.getByTestId('promoDiscountProductsPercentage'),

 buyOneGetDiscountButton: page.getByTestId('discountBuyOneGetDiscount'),
 buyOneGetDiscount: page.getByTestId('discountBuyOneGetDiscount'),
 buyOneGetDiscountWithPromoCode: page.getByTestId('promoDiscountBuyOneGetDiscount'),
 onePlusOneBuyCount: page.locator('input[type="number"][placeholder="0"]').first(),
 onePlusOneReceiveCount: page.locator('input[type="number"][placeholder="0"]').nth(1),
 onePlusOneReceiveDiscount: page.locator('input[type="number"][placeholder="0"]').nth(2),

 // --- Навигация и действия ---
 newPromotion: page.getByText('New Promotion'),
 backNavigationButton: page.getByTestId('navbarGoBackItem'),
 promotionActionsPlayPauseButton: page.getByTestId('promotionActionsActionButton').first(),
 promotionActionsDeleteButton: page.getByTestId('promotionActionsDeleteButton').first(),
});
