import { test, expect } from "@playwright/test";
import { registerAndUnlock } from "./helpers";

test.describe("Health Scanner", () => {

  test("empty vault shows placeholder message", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Health/i }).click();
    await expect(page.getByText(/Add passwords to begin/i)).toBeVisible();
  });

  test("weak password flagged after reveal", async ({ page }) => {
    await registerAndUnlock(page);
    // Add a deliberately weak password
    await page.getByRole("button", { name: /Add/i }).click();
    await page.locator('input[placeholder="github.com"]').fill("weak-site.io");
    await page.locator('input[placeholder*="password"]').fill("abc");
    await page.getByRole("button", { name: /Carve Into Stone/i }).click();
    await expect(page.getByText("weak-site.io")).toBeVisible();

    // Reveal the password so the health scanner can read it
    await page.locator(".pw-card").last().getByTitle("Reveal").click();

    // Navigate to health
    await page.getByRole("button", { name: /Health/i }).click();
    await expect(page.getByText(/Weak/i)).toBeVisible({ timeout: 3_000 });
    await expect(page.getByText("weak-site.io")).toBeVisible();
  });

  test("reused password detected across entries", async ({ page }) => {
    await registerAndUnlock(page);
    const REUSED = "ReusedForBoth99!";
    for (const site of ["site-a.io", "site-b.io"]) {
      await page.getByRole("button", { name: /Add/i }).click();
      await page.locator('input[placeholder="github.com"]').fill(site);
      await page.locator('input[placeholder*="password"]').fill(REUSED);
      await page.getByRole("button", { name: /Carve Into Stone/i }).click();
      await expect(page.getByText(site)).toBeVisible();
    }

    // Reveal both
    for (const card of await page.locator(".pw-card").all()) {
      await card.getByTitle("Reveal").click();
    }

    await page.getByRole("button", { name: /Health/i }).click();
    await expect(page.getByText(/Reused/i)).toBeVisible();
  });

  test("health score circle visible", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Health/i }).click();
    // SVG score circle should render
    await expect(page.locator("svg circle").first()).toBeVisible();
    await expect(page.getByText("/ 100")).toBeVisible();
  });

  test("fix button navigates to edit modal", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Add/i }).click();
    await page.locator('input[placeholder="github.com"]').fill("fixable.io");
    await page.locator('input[placeholder*="password"]').fill("weak");
    await page.getByRole("button", { name: /Carve Into Stone/i }).click();
    await expect(page.getByText("fixable.io")).toBeVisible();
    await page.locator(".pw-card").last().getByTitle("Reveal").click();

    await page.getByRole("button", { name: /Health/i }).click();
    await page.getByRole("button", { name: /Fix/i }).first().click();

    // Should navigate to vault with edit modal open
    await expect(page.getByText("Reshape Secret")).toBeVisible({ timeout: 4_000 });
  });
});
