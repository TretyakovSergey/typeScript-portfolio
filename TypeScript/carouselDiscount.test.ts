import { test } from '../../fixtures/authUser.ts';
import { CreatePromotion } from '../../pagesNew/Marketing/creatingPromotion.ts';
import { saleUser2 } from '../../helper/hp.ts';
import { PromotionConfig } from '../../pagesNew/Marketing/promotionsType.ts';
import { MarketingNavigation } from '../../pagesNew/Navigation/moduleMarketing.ts';
import { feature, story } from 'allure-js-commons';

//test.use({ userKey: 'TBAadmin' });
test.describe('Маркетинг', () => {
 test('Создание карусельной скидки', async ({ page }) => {
  await feature('Маркетинг');
  await story('Создание каскадной скидки на товары');

  const createPromotion = new CreatePromotion(page);
  const marketingNavigation = new MarketingNavigation(page)

  await saleUser2(page);
  await page.waitForLoadState('load');

  const promoConfig: PromotionConfig = {
    type: 'carousel',
    products: [
      { search: 'Mercedec' },
      { search: 'Ducati' },
      { search: 'Audi' }
    ],
    levels: [
      { discountPercent: 10 },
      { discountPercent: 20 },
      { discountPercent: 30 },
    ],
    endDateCheckbox: false
  };

  await marketingNavigation.openMarketingModule();
  await marketingNavigation.openPromotionsModule();

  await createPromotion.createPromotion(promoConfig);
    
  await createPromotion.deletePromotion();
 });
});
