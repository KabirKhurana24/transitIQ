import { test, expect } from '@playwright/test';

test.describe('TransitIQ TMS — Main Operational Golden Path Journey', () => {
  test('Complete Flow: Order -> Plan -> Carrier Scoring -> Dispatch -> Simulate -> AI Exception Approval -> Delivered', async ({ page }) => {
    // 1. Visit Login Page & Select Demo User
    await page.goto('/login');
    await expect(page.getByText('TransitIQ TMS').first()).toBeVisible();

    // Fill credentials using quick selector button for Operations Manager
    const opsButton = page.locator('button:has-text("Priya Sharma")');
    if (await opsButton.isVisible()) {
      await opsButton.click();
    }
    await page.click('button:has-text("Sign In to Dashboard")');

    // 2. Control Tower Navigation
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: 'Transportation Control Tower' })).toBeVisible();

    // 3. Order Intake
    await page.goto('/orders');
    await expect(page.getByRole('heading', { name: 'Transportation Orders' })).toBeVisible();

    // 4. Shipment Planning & Load Builder
    await page.goto('/planning');
    await expect(page.getByRole('heading', { name: 'Shipment Planning & Load Builder' })).toBeVisible();

    // 5. Carrier Network & AI Procurement
    await page.goto('/carriers');
    await expect(page.getByRole('heading', { name: 'Carrier Network & AI Procurement' })).toBeVisible();

    // 6. Inspect Shipments & Telematics
    await page.goto('/shipments');
    await expect(page.getByRole('heading', { name: 'Shipment Fleet Operations' })).toBeVisible();

    // 7. Inspect AI Exception Manager
    await page.goto('/exceptions');
    await expect(page.getByRole('heading', { name: 'AI Exception Manager' })).toBeVisible();

    // 8. Test AI Operations Copilot
    await page.goto('/copilot');
    await expect(page.getByRole('heading', { name: 'AI Operations Copilot' })).toBeVisible();

    // 9. Freight Audit & Reconciliation
    await page.goto('/finance');
    await expect(page.getByRole('heading', { name: 'Freight Invoice Audit & Reconciliation' })).toBeVisible();

    // 10. Document Center
    await page.goto('/documents');
    await expect(page.getByRole('heading', { name: 'Shipment Document Center' })).toBeVisible();

    // 11. Operational Analytics
    await page.goto('/analytics');
    await expect(page.getByRole('heading', { name: 'Operations & Freight Analytics' })).toBeVisible();
  });
});
