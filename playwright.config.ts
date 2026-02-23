import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
        name: 'setup',
        testMatch: /.*\.setup\.ts/,
    },
    {
        name: 'chromium',
        testIgnore: /.*login\.spec\.ts/,
        use: { ...devices['Desktop Chrome'],
            storageState: '.auth/user.json',
        },
        dependencies: ['setup'],
    },
    {
        name: 'firefox',
        testIgnore: /.*login\.spec\.ts/,
        use: { ...devices['Desktop Firefox'],
            storageState: '.auth/user.json',
        },
        dependencies: ['setup'],
    },
    {
        name: 'webkit',
        testIgnore: /.*login\.spec\.ts/,
        use: { ...devices['Desktop Safari'],
            storageState: '.auth/user.json',
        },
        dependencies: ['setup'],
    },
    {
        name: 'chromium-no-auth',
        testMatch: /.*login\.spec\.ts/,
        use: { ...devices['Desktop Chrome'] },
    },
    {
        name: 'firefox-no-auth',
        testMatch: /.*login\.spec\.ts/,
        use: { ...devices['Desktop Firefox'] },
    },
    {
        name: 'webkit-no-auth',
        testMatch: /.*login\.spec\.ts/,
        use: { ...devices['Desktop Safari'] },
    },
  ]
});