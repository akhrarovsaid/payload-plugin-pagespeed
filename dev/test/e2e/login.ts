import { expect, type Page } from '@playwright/test'
import { wait } from 'payload/shared'

export const login = async ({ page }: { page: Page }) => {
  await page.goto('/admin/login')
  await page.fill('#field-email', 'dev@payloadcms.com')
  await page.fill('#field-password', 'test')
  await page.click('.form-submit button')
  await wait(500)
  await expect(page).toHaveTitle(/Dashboard/)
}
