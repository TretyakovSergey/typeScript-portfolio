import { test } from '../../fixtures/authUser.ts';
import { CreatePromotion } from '../../pagesNew/Marketing/creatingPromotion.ts';
import { saleUser2 } from '../../helper/hp.ts';
import { PromotionConfig } from '../../pagesNew/Marketing/promotionsType.ts';
import { MarketingNavigation } from '../../pagesNew/Navigation/moduleMarketing.ts';
import { feature, story } from 'allure-js-commons';

//test.use({ userKey: 'TBAadmin' });
test.describe('Маркетинг', () => {
 test('Создание акции скидка на чек', async ({ page, redirectUrl }) => {
  await feature('Маркетинг')
  await story('Создание скидки на чек')
  await test.step('Авторизация и переход в маркетинг', async () => {

   const createPromotion = new CreatePromotion(page);
   const marketingNavigation = new MarketingNavigation(page)
      
   await saleUser2(page);
   await page.waitForLoadState('load');

   const promoConfig: PromotionConfig = {
    type: 'totalAmount',
    products: [
      { search: 'Mercedec' },
      { search: 'Audi' }
    ],
    levels: [
      { discountPercent: 10 },
      { discountPercent: 20 }
    ],
    endDateCheckbox: false
   };

   await marketingNavigation.openMarketingModule();
   await marketingNavigation.openPromotionsModule();

   await createPromotion.createPromotion(promoConfig);
    
   await createPromotion.deletePromotion();
   });
 });
});
