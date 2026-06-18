import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,   // vault tests share state; run serially
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL:     "http://localhost:5173",
    headless:    true,
    screenshot:  "only-on-failure",
    video:       "retain-on-failure",
    trace:       "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile",   use: { ...devices["Pixel 5"] } },
  ],
  webServer: [
    {
      command:              "npm run dev",
      url:                  "http://localhost:5173",
      reuseExistingServer:  !process.env.CI,
      timeout:              30_000,
    },
    {
      command:              "cd ../backend && npm run dev",
      url:                  "http://localhost:5000/api/health",
      reuseExistingServer:  !process.env.CI,
      timeout:              30_000,
    },
  ],
});
