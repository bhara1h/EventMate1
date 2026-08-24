import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

export class ExcelReporter {
    constructor() {
        this.workbook = new ExcelJS.Workbook();
        this.excelDir = './excel';
        if (!fs.existsSync(this.excelDir)) {
            fs.mkdirSync(this.excelDir, { recursive: true });
        }
        this.reportPath = path.join(this.excelDir, 'Flutter_E2E_Report.xlsx');
        
        this.summarySheet = this.workbook.addWorksheet('Summary');
        this.testCasesSheet = this.workbook.addWorksheet('Test Cases');
        this.failedTestsSheet = this.workbook.addWorksheet('Failed Tests');
        this.executionLogsSheet = this.workbook.addWorksheet('Execution Logs');

        this.setupHeaders();
        this.testResults = [];
        this.failedTests = [];
        this.logs = [];
        this.stats = { passed: 0, failed: 0, skipped: 0, total: 0 };
        this.startTime = new Date();
    }

    setupHeaders() {
        this.summarySheet.columns = [
            { header: 'Execution Date', key: 'date', width: 25 },
            { header: 'Device Name', key: 'device', width: 20 },
            { header: 'Android Version', key: 'version', width: 15 },
            { header: 'Total Tests', key: 'total', width: 15 },
            { header: 'Passed', key: 'passed', width: 15 },
            { header: 'Failed', key: 'failed', width: 15 },
            { header: 'Skipped', key: 'skipped', width: 15 },
            { header: 'Pass Percentage', key: 'percentage', width: 20 },
            { header: 'Duration', key: 'duration', width: 25 }
        ];

        this.testCasesSheet.columns = [
            { header: 'Test ID', key: 'id', width: 15 },
            { header: 'Module', key: 'module', width: 25 },
            { header: 'Scenario', key: 'scenario', width: 50 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Device', key: 'device', width: 20 },
            { header: 'Duration (ms)', key: 'duration', width: 15 }
        ];

        this.failedTestsSheet.columns = [
            { header: 'Test Name', key: 'name', width: 50 },
            { header: 'Failure Reason', key: 'reason', width: 80 },
            { header: 'Screenshot Path', key: 'screenshot', width: 50 },
            { header: 'Device', key: 'device', width: 20 },
            { header: 'Android Version', key: 'version', width: 15 }
        ];

        this.executionLogsSheet.columns = [
            { header: 'Timestamp', key: 'time', width: 25 },
            { header: 'Test Name', key: 'test', width: 50 },
            { header: 'Step', key: 'step', width: 60 },
            { header: 'Result', key: 'result', width: 15 },
            { header: 'Remarks', key: 'remarks', width: 50 }
        ];
    }

    addTestResult(result) {
        this.testResults.push(result);
        this.stats.total++;
        if (result.status === 'passed') this.stats.passed++;
        else if (result.status === 'failed') this.stats.failed++;
        else this.stats.skipped++;
        
        this.testCasesSheet.addRow(result);
    }

    addFailure(failureDetails) {
        this.failedTests.push(failureDetails);
        this.failedTestsSheet.addRow(failureDetails);
    }

    addLog(logDetail) {
        this.logs.push(logDetail);
        this.executionLogsSheet.addRow(logDetail);
    }

    async generateReport() {
        const endTime = new Date();
        const duration = Math.abs(endTime - this.startTime) / 1000;
        const passPct = this.stats.total > 0 ? ((this.stats.passed / this.stats.total) * 100).toFixed(2) : 0;

        this.summarySheet.addRow({
            date: this.startTime.toISOString(),
            device: this.testResults.length > 0 ? this.testResults[0].device : 'Unknown',
            version: 'Unknown',
            total: this.stats.total,
            passed: this.stats.passed,
            failed: this.stats.failed,
            skipped: this.stats.skipped,
            percentage: `${passPct}%`,
            duration: `${duration}s`
        });

        await this.workbook.xlsx.writeFile(this.reportPath);
    }
}
