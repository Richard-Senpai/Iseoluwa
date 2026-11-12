import fs from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

const systemChromium = fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined;

export default defineConfig({
  testDir: './src/tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    launchOptions: systemChromium
      ? {
          executablePath: systemChromium,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }
      : undefined,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
