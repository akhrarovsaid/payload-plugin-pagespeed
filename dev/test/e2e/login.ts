import { expect, type Page } from '@playwright/test'

export const login = async ({ page }: { page: Page }) => {
  await page.goto('/admin/login')
  await page.fill('#field-email', 'dev@payloadcms.com')
  await page.fill('#field-password', 'test')
  await page.click('.form-submit button')
  await expect(page).toHaveTitle(/Dashboard/)
}
