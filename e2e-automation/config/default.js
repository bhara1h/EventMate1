import dotenv from 'dotenv';
dotenv.config();

export const config = {
    baseUrl: process.env.BASE_URL || 'http://localhost:5173',
    browser: process.env.BROWSER || 'chrome',
    headless: process.env.HEADLESS === 'true' || false,
    timeouts: {
        implicit: 10000,
        explicit: 15000,
        pageLoad: 30000
    },
    retries: process.env.RETRIES || 1,
    paths: {
        reports: './reports',
        screenshots: './reports/failures',
        logs: './logs',
        excel: './excel'
    }
};
