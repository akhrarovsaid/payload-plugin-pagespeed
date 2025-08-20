import type { Payload } from 'payload'

import config from '@payload-config'
import { expect, test } from '@playwright/test'
import { getPayload } from 'payload'

import { insightsSlug } from '../../helpers/defaults.js'
import { seed } from '../../seed.js'
import { login } from './login.js'

/**
 * TODO: Better test coverage
 */

let payload: Payload

test.beforeAll(async () => {
  payload = await getPayload({ config })
})

test.afterAll(async () => {
  if (payload) {
    await payload.destroy()
  }
})

test.beforeEach(async ({ page }) => {
  await seed(payload, true)
  await login({ page })
})

test('should not render "Report" tab in create view', async ({ page }) => {
  await page.goto(`/admin/collections/${insightsSlug}/create`)
  const reportsTab = page.locator('.tabs-field__tabs > button.tabs-field__tab-button--hidden', {
    hasText: 'Report',
  })
  await expect(reportsTab).not.toBeVisible()
})

test.skip('should show progress banner on first navigation to insights doc', async ({ page }) => {
  // TODO
})

test.skip('should show error banner after endpoint error', async ({ page }) => {
  // TODO
})

test.skip('should render pagespeed insights report', async ({ page }) => {
  // TODO
})

test.skip('should render lighthouse speed score guages', async ({ page }) => {
  // TODO
})

test.skip('should render lighthouse speed score metrics', async ({ page }) => {
  // TODO
})

test.skip('should render every pagespeed category supplied in parameters', async ({ page }) => {
  // TODO
})

test.skip('should render lighthouse audits', async ({ page }) => {
  // TODO
})

test.skip('should hide audit group when hide pill is clicked', async ({ page }) => {
  // TODO
})

test.skip('should expand audit details when audit label is clicked', async ({ page }) => {
  // TODO
})

test.skip('should render audit tables and opportunities', async ({ page }) => {
  // TODO
})

test.skip('should render audit table cells', async ({ page }) => {
  // TODO
})

test.skip('should render audit lists', async ({ page }) => {
  // TODO
})

test.skip('should render audit list-sections', async ({ page }) => {
  // TODO
})

test.skip('should render audit network-trees', async ({ page }) => {
  // TODO
})
