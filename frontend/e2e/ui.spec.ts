import { test, expect } from "@playwright/test";
import { registerAndUnlock } from "./helpers";

test.describe("UI — Theme & Mobile", () => {

  test("dark/light theme toggle persists across reload", async ({ page }) => {
    await registerAndUnlock(page);

    // Initial state should be dark
    let theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    expect(theme).toBe("dark");

    // Click toggle (Sun/Moon button in sidebar)
    await page.getByRole("button", { name: /Light Mode/i }).click();
    theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    expect(theme).toBe("light");

    // Reload — preference should persist from localStorage
    await page.reload();
    // Re-enter master key
    await page.locator('input[type="password"]').fill("Mammoth99!!");
    await page.getByRole("button", { name: /Unlock Vault/i }).click();
    await expect(page.getByText("Vault")).toBeVisible();
    theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    expect(theme).toBe("light");
  });

  test("toggle back to dark mode", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Light Mode/i }).click();
    await page.getByRole("button", { name: /Dark Mode/i }).click();
    const theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    expect(theme).toBe("dark");
  });
});

test.describe("UI — Mobile @mobile", () => {

  test("sidebar hidden by default on mobile", async ({ page }) => {
    await registerAndUnlock(page);
    // On mobile viewport, sidebar should be off-screen (translated)
    const sidebar = page.locator(".sidebar");
    await expect(sidebar).not.toHaveClass(/open/);
  });

  test("hamburger opens and closes sidebar", async ({ page }) => {
    await registerAndUnlock(page);
    // Open
    await page.locator(".hamburger-btn").click();
    await expect(page.locator(".sidebar")).toHaveClass(/open/);
    // Close via X button inside sidebar
    await page.locator(".sidebar .hamburger-btn").click();
    await expect(page.locator(".sidebar")).not.toHaveClass(/open/);
  });

  test("backdrop click closes sidebar", async ({ page }) => {
    await registerAndUnlock(page);
    await page.locator(".hamburger-btn").click();
    await expect(page.locator(".sidebar")).toHaveClass(/open/);
    await page.locator(".sidebar-backdrop").click();
    await expect(page.locator(".sidebar")).not.toHaveClass(/open/);
  });
});
