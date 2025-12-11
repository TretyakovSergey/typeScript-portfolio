import { Page } from '@playwright/test';

/**
 * Универсальный poll с перезагрузкой страницы.
 *
 * @param page - Playwright Page
 * @param checkFn - callback, который должен возвращать true, когда условие выполнено
 * @param timeout - общее время ожидания (мс)
 * @param interval - интервал между проверками (мс)
 */
export async function pollWithReload(
  page: Page,
  checkFn: () => Promise<boolean>,
  timeout: number = 20000,
  interval: number = 2000
) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const ok = await checkFn().catch(() => false);
    if (ok) return;

    await page.reload({ waitUntil: 'networkidle' });

    await page.waitForTimeout(interval);
  }

  throw new Error('Условие не выполнено после повторной загрузки страницы в течение таймаута');
}
