import { Page, expect } from "@playwright/test";

const BASE_PW = "Mammoth99!!";

/**
 * Register a fresh user and land on the unlocked vault.
 * Uses a unique timestamp-based email to avoid conflicts between test runs.
 */
export async function registerAndUnlock(page: Page, email?: string): Promise<string> {
  const testEmail = email ?? `cave.test.${Date.now()}@tribe.dev`;

  await page.goto("/");

  // Auth screen — Register tab (tab label: "Register", submit button: "Create Account")
  await page.getByRole("button", { name: "Register", exact: true }).click();
  await page.locator('input[type="email"]').fill(testEmail);
  await page.locator('input[type="password"]').fill(BASE_PW);
  await page.getByRole("button", { name: /Create Account/i }).click();

  // Lock screen — same password, re-entered
  await expect(page.getByText("One More Step")).toBeVisible({ timeout: 6_000 });
  await page.locator('input[type="password"]').fill(BASE_PW);
  await page.getByRole("button", { name: /Unlock Vault/i }).click();

  // Should reach vault
  await expect(page.getByText("Vault")).toBeVisible({ timeout: 8_000 });
  return testEmail;
}

/**
 * Login existing user and unlock vault.
 */
export async function loginAndUnlock(page: Page, email: string): Promise<void> {
  await page.goto("/");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(BASE_PW);
  await page.getByRole("button", { name: /Enter the Cave/i }).click();
  await expect(page.getByText("One More Step")).toBeVisible({ timeout: 6_000 });
  await page.locator('input[type="password"]').fill(BASE_PW);
  await page.getByRole("button", { name: /Unlock Vault/i }).click();
  await expect(page.getByText("Vault")).toBeVisible({ timeout: 8_000 });
}

export { BASE_PW };
