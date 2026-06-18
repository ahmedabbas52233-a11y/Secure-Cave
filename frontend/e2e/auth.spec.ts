import { test, expect } from "@playwright/test";
import { registerAndUnlock, loginAndUnlock, BASE_PW } from "./helpers";

test.describe("Authentication", () => {

  test("register → lock screen → unlock → see vault", async ({ page }) => {
    await registerAndUnlock(page);
    // Vault is visible and shows empty state
    await expect(page.getByText("Vault")).toBeVisible();
  });

  test("register with short password shows validation error", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Register/i }).click();
    await page.locator('input[type="email"]').fill("short@test.dev");
    await page.locator('input[type="password"]').fill("abc");
    await page.getByRole("button", { name: /Claim/i }).click();
    await expect(page.getByText(/8 characters/i)).toBeVisible();
  });

  test("login with wrong password shows error", async ({ page }) => {
    await page.goto("/");
    await page.locator('input[type="email"]').fill("nobody@nowhere.dev");
    await page.locator('input[type="password"]').fill("WrongPass99!");
    await page.getByRole("button", { name: /Enter the Cave/i }).click();
    // Backend returns 401 — should show an error in the UI
    await expect(page.locator("text=/invalid|wrong|not found/i")).toBeVisible({ timeout: 5_000 });
  });

  test("logout returns to auth screen", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Lock & Sign Out/i }).click();
    // Should be back at auth screen
    await expect(page.getByRole("button", { name: /Enter the Cave/i })).toBeVisible();
  });

  test("persistent session — reload keeps auth, still asks for master key", async ({ page }) => {
    const email = await registerAndUnlock(page);
    await page.reload();
    // Should show lock screen (token valid, vault locked again)
    await expect(page.getByText("Cave Locked")).toBeVisible({ timeout: 6_000 });
    // Enter master key
    await page.locator('input[type="password"]').fill(BASE_PW);
    await page.getByRole("button", { name: /Unlock Cave/i }).click();
    await expect(page.getByText("Vault")).toBeVisible();
  });
});
