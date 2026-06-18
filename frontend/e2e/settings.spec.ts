import { test, expect } from "@playwright/test";
import { registerAndUnlock } from "./helpers";

test.describe("Settings", () => {

  test("auto-lock timeout saves to localStorage", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Settings/i }).click();

    // Click "5 minutes"
    await page.getByRole("button", { name: "5 minutes" }).click();

    // Verify it's persisted
    const stored = await page.evaluate(() => localStorage.getItem("sc_autolock"));
    expect(stored).toBe(String(5 * 60_000));
  });

  test("auto-lock disabled by default", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Settings/i }).click();
    // "Disabled" button should be styled as active (has blue-ish border)
    const disabledBtn = page.getByRole("button", { name: "Disabled" });
    await expect(disabledBtn).toBeVisible();
    const stored = await page.evaluate(() => localStorage.getItem("sc_autolock") ?? "0");
    expect(["0", null]).toContain(stored);
  });

  test("export button disabled when vault empty", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Settings/i }).click();
    const exportBtn = page.getByRole("button", { name: /Export 0 Entries/i });
    await expect(exportBtn).toBeDisabled();
  });

  test("security architecture section visible", async ({ page }) => {
    await registerAndUnlock(page);
    await page.getByRole("button", { name: /Settings/i }).click();
    await expect(page.getByText("Security Architecture")).toBeVisible();
    await expect(page.getByText("AES-256-GCM Encryption")).toBeVisible();
    await expect(page.getByText("PBKDF2 Key Derivation")).toBeVisible();
    await expect(page.getByText("Zero-Knowledge Backend")).toBeVisible();
  });
});
