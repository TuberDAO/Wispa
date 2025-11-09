/**
 * E2E tests for email subscription flow
 * 
 * Tests:
 * - Modal opens and closes
 * - Valid email submission
 * - Invalid email rejection
 * - Rate limiting
 * - Accessibility (focus trap, keyboard navigation)
 */

import { test, expect } from '@playwright/test';

test.describe('Email Subscription Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open modal when clicking Notify Me button', async ({ page }) => {
    // Find and click "Notify Me" button at bottom of page
    await page.getByRole('button', { name: /notify me/i }).first().click();
    
    // Modal should be visible
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    // Modal should have correct title
    await expect(modal.getByRole('heading', { level: 2 })).toBeVisible();
  });

  test('should close modal when clicking close button', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: /notify me/i }).first().click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    // Click close button
    await page.getByRole('button', { name: /close/i }).click();
    
    // Modal should be hidden
    await expect(modal).not.toBeVisible();
  });

  test('should close modal when pressing Escape key', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: /notify me/i }).first().click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    // Modal should be hidden
    await expect(modal).not.toBeVisible();
  });

  test('should have focus trap - tab navigation stays within modal', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: /notify me/i }).first().click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    // Email input should be focused
    const emailInput = page.getByLabel(/email address/i);
    await expect(emailInput).toBeFocused();
    
    // Tab to submit button
    await page.keyboard.press('Tab');
    const submitButton = page.getByRole('button', { name: /join waitlist/i });
    await expect(submitButton).toBeFocused();
    
    // Tab to close button
    await page.keyboard.press('Tab');
    const closeButton = page.getByRole('button', { name: /close/i });
    await expect(closeButton).toBeFocused();
    
    // Tab should cycle back to email input
    await page.keyboard.press('Tab');
    await expect(emailInput).toBeFocused();
  });

  test('should reject invalid email addresses', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: /notify me/i }).first().click();
    
    // Enter invalid email
    const emailInput = page.getByLabel(/email address/i);
    await emailInput.fill('notanemail');
    
    // Submit form
    await page.getByRole('button', { name: /join waitlist/i }).click();
    
    // Should show error message
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('should successfully submit valid email', async ({ page }) => {
    // Mock the API response
    await page.route('**/api/subscribe', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    // Open modal
    await page.getByRole('button', { name: /notify me/i }).first().click();
    
    // Enter valid email
    const emailInput = page.getByLabel(/email address/i);
    await emailInput.fill('test@example.com');
    
    // Submit form
    await page.getByRole('button', { name: /join waitlist/i }).click();
    
    // Should show success message
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/on the list/i)).toBeVisible();
  });

  test('should show rate limit error after threshold', async ({ page }) => {
    let requestCount = 0;

    // Mock API to return 429 after 5 requests
    await page.route('**/api/subscribe', async (route) => {
      requestCount++;
      if (requestCount > 5) {
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({ 
            error: 'Too many requests. Please try again later.',
            retryAfter: 60 
          }),
        });
      } else {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true }),
        });
      }
    });

    // Submit multiple times
    for (let i = 0; i < 6; i++) {
      await page.goto('/');
      await page.getByRole('button', { name: /notify me/i }).first().click();
      
      const emailInput = page.getByLabel(/email address/i);
      await emailInput.fill(`test${i}@example.com`);
      
      await page.getByRole('button', { name: /join waitlist/i }).click();
      await page.waitForTimeout(500);
    }

    // Last attempt should show rate limit error
    await expect(page.getByText(/too many requests/i)).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/subscribe', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'An error occurred' }),
      });
    });

    // Open modal and submit
    await page.getByRole('button', { name: /notify me/i }).first().click();
    const emailInput = page.getByLabel(/email address/i);
    await emailInput.fill('test@example.com');
    await page.getByRole('button', { name: /join waitlist/i }).click();
    
    // Should show error message
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/something went wrong/i)).toBeVisible();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: /notify me/i }).first().click();
    const modal = page.getByRole('dialog');
    
    // Check ARIA attributes
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    await expect(modal).toHaveAttribute('aria-describedby', 'modal-description');
    
    // Check email input
    const emailInput = page.getByLabel(/email address/i);
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('required');
  });

  test('should not display honeypot field to users', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: /notify me/i }).first().click();
    
    // Honeypot field should be hidden
    const honeypot = page.locator('#company');
    await expect(honeypot).toBeHidden();
    await expect(honeypot).toHaveAttribute('tabindex', '-1');
  });
});

test.describe('Cross-Origin Request Protection', () => {
  test('should block requests with invalid origin', async ({ page, context }) => {
    let blocked = false;

    // Intercept API requests
    await page.route('**/api/subscribe', async (route) => {
      const request = route.request();
      
      // Try to send with different origin
      await route.continue({
        headers: {
          ...request.headers(),
          'origin': 'https://evil.com',
        },
      });
    });

    await page.goto('/');
    
    // Try to submit
    await page.getByRole('button', { name: /notify me/i }).first().click();
    const emailInput = page.getByLabel(/email address/i);
    await emailInput.fill('test@example.com');
    
    // This should be blocked by the server
    const response = await page.request.post('/api/subscribe', {
      data: {
        email: 'test@example.com',
        tag: 'notify',
      },
      headers: {
        'Origin': 'https://evil.com',
        'Content-Type': 'application/json',
      },
    });
    
    // Should return 403 or handle the cross-origin appropriately
    expect([403, 0]).toContain(response.status());
  });
});

