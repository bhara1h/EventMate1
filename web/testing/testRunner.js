const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const Mocha = require('mocha');

// Configuration
const BACKEND_PORT = 5000;
const FRONTEND_PORT = 5173;
const WORKSPACE_DIR = path.resolve(__dirname, '..');
const REPORT_DIR = path.resolve(__dirname, 'reports');

let backendProcess = null;
let frontendProcess = null;

// Helpers to check if service is up
function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.request({ host: 'localhost', port, path: '/', method: 'GET', timeout: 1000 }, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

function waitPort(port, timeoutMs = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      const isUp = await checkPort(port);
      if (isUp) {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        reject(new Error(`Timeout waiting for port ${port}`));
      }
    }, 1000);
  });
}

// Start backend
async function startBackend() {
  const isAlreadyRunning = await checkPort(BACKEND_PORT);
  if (isAlreadyRunning) {
    console.log(`Backend is already running on port ${BACKEND_PORT}. Using existing instance.`);
    return;
  }

  console.log('Starting backend server...');
  const backendDir = path.join(WORKSPACE_DIR, 'backend');
  
  // Set in-memory mongodb variables and secret jwt key for test stability
  const env = {
    ...process.env,
    PORT: BACKEND_PORT.toString(),
    JWT_SECRET: 'test_jwt_secret_key_for_testing_suite_only',
    FRONTEND_URL: `http://localhost:${FRONTEND_PORT}`,
    MONGO_URI: '' // Empty MONGO_URI triggers MongoMemoryServer in backend/server.js
  };

  backendProcess = spawn('node', ['server.js'], {
    cwd: backendDir,
    env,
    shell: true
  });

  backendProcess.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Server is running') || output.includes('Connected to MongoDB')) {
      console.log(`[Backend Log] ${output.trim()}`);
    }
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`[Backend Error] ${data}`);
  });

  await waitPort(BACKEND_PORT);
  console.log('Backend server is ready!');
}

// Start frontend
async function startFrontend() {
  const isAlreadyRunning = await checkPort(FRONTEND_PORT);
  if (isAlreadyRunning) {
    console.log(`Frontend is already running on port ${FRONTEND_PORT}. Using existing instance.`);
    return;
  }

  console.log('Starting frontend dev server (Vite)...');
  const frontendDir = path.join(WORKSPACE_DIR, 'frontend');

  const env = {
    ...process.env,
    VITE_API_URL: `http://localhost:${BACKEND_PORT}/api`,
    VITE_SOCKET_URL: `http://localhost:${BACKEND_PORT}`
  };

  frontendProcess = spawn('npx', ['vite', '--port', FRONTEND_PORT.toString(), '--strictPort'], {
    cwd: frontendDir,
    env,
    shell: true
  });

  frontendProcess.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Local:') || output.includes('ready in')) {
      console.log(`[Frontend Log] ${output.trim()}`);
    }
  });

  frontendProcess.stderr.on('data', (data) => {
    console.error(`[Frontend Error] ${data}`);
  });

  await waitPort(FRONTEND_PORT);
  console.log('Frontend Vite server is ready!');
}

// Stop services
function stopServices() {
  console.log('Stopping test servers...');
  if (backendProcess) {
    backendProcess.kill();
    console.log('Backend stopped.');
  }
  if (frontendProcess) {
    frontendProcess.kill();
    console.log('Frontend stopped.');
  }
}

// Generate Dashboard Report
function generateReport(testResults, startTime) {
  console.log('Generating E2E HTML Report...');
  const durationMs = Date.now() - startTime;
  
  // Calculate aggregate stats
  const total = testResults.length;
  const passed = testResults.filter(t => t.status === 'passed').length;
  const failed = total - passed;
  const passPercent = total > 0 ? (passed / total) * 100 : 0;

  // Breakdown by suites
  const seleniumTests = testResults.filter(t => t.suite === 'selenium');
  const seleniumTotal = seleniumTests.length;
  const seleniumPassed = seleniumTests.filter(t => t.status === 'passed').length;
  const seleniumFailed = seleniumTotal - seleniumPassed;
  const seleniumRate = seleniumTotal > 0 ? (seleniumPassed / seleniumTotal) * 100 : 0;

  const appiumTests = testResults.filter(t => t.suite === 'appium');
  const appiumTotal = appiumTests.length;
  const appiumPassed = appiumTests.filter(t => t.status === 'passed').length;
  const appiumFailed = appiumTotal - appiumPassed;
  const appiumRate = appiumTotal > 0 ? (appiumPassed / appiumTotal) * 100 : 0;

  const reportData = {
    meta: {
      timestamp: new Date().toISOString(),
      durationMs,
      environment: process.env.GITHUB_ACTIONS ? 'GitHub Actions CI/CD Pipeline' : 'Local Testing Environment'
    },
    stats: {
      total,
      passed,
      failed,
      passPercent
    },
    suites: {
      selenium: { total: seleniumTotal, passed: seleniumPassed, failed: seleniumFailed, rate: seleniumRate },
      appium: { total: appiumTotal, passed: appiumPassed, failed: appiumFailed, rate: appiumRate }
    },
    tests: testResults
  };

  // Ensure reports folder exists
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }

  // Write JSON report
  fs.writeFileSync(
    path.join(REPORT_DIR, 'report.json'),
    JSON.stringify(reportData, null, 2),
    'utf-8'
  );

  // Read HTML template
  const templatePath = path.join(__dirname, 'reporter', 'report-template.html');
  if (!fs.existsSync(templatePath)) {
    console.error('Template report-template.html not found! Skipping HTML generation.');
    return;
  }
  
  let html = fs.readFileSync(templatePath, 'utf-8');

  // Replace placeholder with actual data injection
  const injection = `const REPORT_DATA = ${JSON.stringify(reportData, null, 2)};`;
  html = html.replace('// [REPORT_DATA_PLACEHOLDER]', injection);

  // Write final HTML
  const finalHtmlPath = path.join(REPORT_DIR, 'report.html');
  fs.writeFileSync(finalHtmlPath, html, 'utf-8');
  
  console.log(`=========================================`);
  console.log(`SUCCESS: Test execution complete.`);
  console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`Pass Rate: ${passPercent.toFixed(2)}% | Duration: ${(durationMs / 1000).toFixed(2)}s`);
  console.log(`HTML Report generated at: ${finalHtmlPath}`);
  console.log(`=========================================`);
}

// Run Main Process
async function main() {
  const args = process.argv.slice(2);
  const suiteFilterIndex = args.indexOf('--suite');
  const suiteFilter = suiteFilterIndex !== -1 ? args[suiteFilterIndex + 1] : null;

  const startTime = Date.now();
  const testResults = [];

  try {
    // Start backend and frontend
    await startBackend();
    await startFrontend();

    console.log('Running test suites...');

    // Initialize Mocha
    const mocha = new Mocha({
      timeout: 15000,
      reporter: 'spec'
    });

    const suitesDir = path.join(__dirname, 'suites');

    if (!suiteFilter || suiteFilter === 'selenium') {
      const file = path.join(suitesDir, 'selenium.test.js');
      if (fs.existsSync(file)) mocha.addFile(file);
    }
    
    if (!suiteFilter || suiteFilter === 'appium') {
      const file = path.join(suitesDir, 'appium.test.js');
      if (fs.existsSync(file)) mocha.addFile(file);
    }

    // Set up global helper for test collection
    global.addTestResult = (result) => {
      testResults.push(result);
    };

    // Run tests programmatically
    mocha.run((failures) => {
      stopServices();
      generateReport(testResults, startTime);
      process.exit(failures > 0 ? 1 : 0);
    });

  } catch (error) {
    console.error('Fatal error during testing execution:', error);
    stopServices();
    process.exit(1);
  }
}

main();
