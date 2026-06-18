import { test, expect } from "@playwright/test";
import { registerAndUnlock } from "./helpers";

test.describe("Vault CRUD", () => {

  test("add entry → appears in list", async ({ page }) => {
    await registerAndUnlock(page);

    await page.getByRole("button", { name: /Add/i }).click();
    await expect(page.getByText("Carve New Secret")).toBeVisible();

    await page.locator('input[placeholder="github.com"]').fill("playwright-test.io");
    await page.locator('input[placeholder*="password"]').fill("SuperSecret42!");
    await page.getByRole("button", { name: /Carve Into Stone/i }).click();

    await expect(page.getByText("playwright-test.io")).toBeVisible({ timeout: 5_000 });
    // Toast confirmation
    await expect(page.getByText(/carved into stone/i)).toBeVisible();
  });

  test("add entry without username — no validation error", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Add/i }).click();
    // Fill site + password, leave username empty
    await page.locator('input[placeholder="github.com"]').fill("no-user-needed.com");
    await page.locator('input[placeholder*="password"]').fill("AnotherPass1!");
    await page.getByRole("button", { name: /Carve Into Stone/i }).click();
    // Should succeed (username is optional)
    await expect(page.getByText("no-user-needed.com")).toBeVisible({ timeout: 5_000 });
  });

  test("reveal password shows decrypted value", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Add/i }).click();
    await page.locator('input[placeholder="github.com"]').fill("reveal-test.io");
    await page.locator('input[placeholder*="password"]').fill("MySecretPass1!");
    await page.getByRole("button", { name: /Carve Into Stone/i }).click();

    await expect(page.getByText("reveal-test.io")).toBeVisible();
    // Click the reveal (eye) button on the card
    await page.locator(".pw-card").last().getByTitle("Reveal").click();
    await expect(page.getByText("MySecretPass1!")).toBeVisible();
  });

  test("copy password triggers toast", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Add/i }).click();
    await page.locator('input[placeholder="github.com"]').fill("copy-test.io");
    await page.locator('input[placeholder*="password"]').fill("CopyMePlease99!");
    await page.getByRole("button", { name: /Carve Into Stone/i }).click();
    await expect(page.getByText("copy-test.io")).toBeVisible();
    await page.locator(".pw-card").last().getByTitle("Copy password").click();
    await expect(page.getByText(/copied/i)).toBeVisible();
  });

  test("edit entry — changes persist", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Add/i }).click();
    await page.locator('input[placeholder="github.com"]').fill("edit-target.io");
    await page.locator('input[placeholder*="password"]').fill("OriginalPass1!");
    await page.getByRole("button", { name: /Carve Into Stone/i }).click();
    await expect(page.getByText("edit-target.io")).toBeVisible();

    // Open edit modal
    await page.locator(".pw-card").last().getByTitle("Edit").click();
    await expect(page.getByText("Reshape Secret")).toBeVisible();
    await page.locator('input[placeholder="github.com"]').fill("edit-target-updated.io");
    await page.getByRole("button", { name: /Update Tablet/i }).click();

    await expect(page.getByText("edit-target-updated.io")).toBeVisible({ timeout: 5_000 });
    await expect(page.getByText(/updated/i)).toBeVisible();
  });

  test("delete entry — removed from list", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Add/i }).click();
    await page.locator('input[placeholder="github.com"]').fill("delete-me.io");
    await page.locator('input[placeholder*="password"]').fill("GonePassword1!");
    await page.getByRole("button", { name: /Carve Into Stone/i }).click();
    await expect(page.getByText("delete-me.io")).toBeVisible();

    await page.locator(".pw-card").last().getByTitle("Delete").click();
    await expect(page.getByText("Delete Entry")).toBeVisible();
    await page.getByRole("button", { name: /^Delete$/i }).click();

    await expect(page.getByText("delete-me.io")).not.toBeVisible({ timeout: 5_000 });
  });

  test("search filters vault", async ({ page }) => {
    await registerAndUnlock(page);

    // Add two entries
    for (const site of ["github.com", "notion.so"]) {
      await page.getByRole("button", { name: /Add/i }).click();
      await page.locator('input[placeholder="github.com"]').fill(site);
      await page.locator('input[placeholder*="password"]').fill("Pass12345!");
      await page.getByRole("button", { name: /Carve Into Stone/i }).click();
      await expect(page.getByText(site)).toBeVisible();
    }

    // Search for "github" — notion should disappear
    await page.locator('input[placeholder*="Search"]').fill("github");
    await expect(page.getByText("github.com")).toBeVisible();
    await expect(page.getByText("notion.so")).not.toBeVisible();
  });

  test("password generator forge produces a password", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Add/i }).click();
    // Open forge
    await page.getByRole("button", { name: /Forge/i }).click();
    await expect(page.getByText("Roll Dice")).toBeVisible();
    await page.getByRole("button", { name: "Roll Dice" }).click();
    // Preview should appear and "Use This" button becomes visible
    await expect(page.getByRole("button", { name: "Use This" })).toBeVisible({ timeout: 3_000 });
    await page.getByRole("button", { name: "Use This" }).click();
    // Password field should be filled
    await expect(page.locator('input[placeholder*="password"]')).not.toHaveValue("");
  });

  test("passphrase forge produces a passphrase", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Add/i }).click();
    await page.getByRole("button", { name: /Forge/i }).click();
    // Switch to passphrase tab
    await page.getByRole("button", { name: /Passphrase/i }).click();
    await page.getByRole("button", { name: "Roll Dice" }).click();
    await expect(page.getByRole("button", { name: "Use This" })).toBeVisible();
    await page.getByRole("button", { name: "Use This" }).click();
    const pwValue = await page.locator('input[placeholder*="password"]').inputValue();
    // Passphrase uses hyphens (default separator) and has multiple words
    expect(pwValue).toMatch(/-/);
  });

  test("add entry without required fields shows errors", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Add/i }).click();
    // Submit with empty fields
    await page.getByRole("button", { name: /Carve Into Stone/i }).click();
    await expect(page.getByText("Site is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });
});
