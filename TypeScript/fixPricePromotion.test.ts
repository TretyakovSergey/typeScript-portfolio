import { test } from '../../fixtures/authUser.ts';
import { variables } from '../../helper/variables.ts';
import { CreatePromotion } from '../../pagesNew/Marketing/creatingPromotion.ts';
import { saleUser2 } from '../../helper/hp.ts';
import { PromotionConfig } from '../../pagesNew/Marketing/promotionsType.ts';
import { MarketingNavigation } from '../../pagesNew/Navigation/moduleMarketing.ts';
import { feature, story } from 'allure-js-commons';

test.describe('Маркетинг', () => {
 test('Создание новой акции с фиксированной ценой на продукты', async ({page})=> {
  await feature('Маркетинг')
  await story('Создание фиксированной цены для товаров')
  await test.step('Создание фиксированной цены', async () => {

  const createPromotion = new CreatePromotion(page);
  const marketingNavigation = new MarketingNavigation(page)

  await saleUser2(page);
  await page.waitForLoadState('load');

  const promoConfig: PromotionConfig = {
    type: 'fixedPrice',
    discountAmount: 55,
    products: [
      { search: 'Mercedec' },
    ],
    endDateCheckbox: false
  };

  await marketingNavigation.openMarketingModule();
  await marketingNavigation.openPromotionsModule();

  await createPromotion.createPromotion( promoConfig );
  await createPromotion.deletePromotion();

  await variables.clearCookies(page);
  })
 })
})
