import { test, expect } from "@playwright/test";
import { registerAndUnlock, loginAndUnlock, BASE_PW } from "./helpers";

test.describe("Authentication", () => {

  test("register → unlock step → see vault", async ({ page }) => {
    await registerAndUnlock(page);
    await expect(page.getByText("Vault")).toBeVisible();
  });

  test("register with short password shows validation error", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Register", exact: true }).click();
    await page.locator('input[type="email"]').fill("short@test.dev");
    await page.locator('input[type="password"]').fill("abc");
    await page.getByRole("button", { name: /Create Account/i }).click();
    await expect(page.getByText(/8 characters/i)).toBeVisible();
  });

  test("login with wrong password shows error", async ({ page }) => {
    await page.goto("/");
    await page.locator('input[type="email"]').fill("nobody@nowhere.dev");
    await page.locator('input[type="password"]').fill("WrongPass99!");
    await page.getByRole("button", { name: /Enter the Cave/i }).click();
    await expect(page.locator("text=/invalid|wrong|not found/i")).toBeVisible({ timeout: 5_000 });
  });

  test("logout returns to auth screen", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Lock & Sign Out/i }).click();
    await expect(page.getByRole("button", { name: /Enter the Cave/i })).toBeVisible();
  });

  test("persistent session — reload keeps auth, still asks to unlock vault", async ({ page }) => {
    await registerAndUnlock(page);
    await page.reload();
    // Should show the unlock step again (token still valid, vault re-locked)
    await expect(page.getByText("One More Step")).toBeVisible({ timeout: 6_000 });
    await page.locator('input[type="password"]').fill(BASE_PW);
    await page.getByRole("button", { name: /Unlock Vault/i }).click();
    await expect(page.getByText("Vault")).toBeVisible();
  });

  test("explanation box is visible on both login and register tabs", async ({ page }) => {
    await page.goto("/");
    // Login tab — explains the second unlock step in advance
    await expect(page.getByText(/asked for this same password once more/i)).toBeVisible();
    // Register tab — explains the password's dual purpose
    await page.getByRole("button", { name: "Register", exact: true }).click();
    await expect(page.getByText(/does two jobs/i)).toBeVisible();
  });
});
