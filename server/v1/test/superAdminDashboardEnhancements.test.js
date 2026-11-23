const test = require('node:test');
const assert = require('node:assert/strict');
const superAdminm = require('../model/superAdminm');

const mockSuperAdmin = { user_mail: 'super@anu.in', role: 99 };
const mockInstructor = { user_mail: 'instructor@anu.in', role: 102, centre_id: 1 };
const mockTrainee = { user_mail: 'trainee@anu.in', role: 103, centre_id: 1 };

test('Super Admin Dashboard Enhancements: Role Authorization', async () => {
    // Non-super-admins must be rejected
    await assert.rejects(
        () => superAdminm.getSystemHealthHistory(mockInstructor, 'today'),
        (err) => err.statusCode === 403
    );

    await assert.rejects(
        () => superAdminm.getSecurityAlerts(mockTrainee, {}),
        (err) => err.statusCode === 403
    );

    await assert.rejects(
        () => superAdminm.getInstitutionRankings(mockInstructor, {}),
        (err) => err.statusCode === 403
    );

    await assert.rejects(
        () => superAdminm.getSystemMaintenance(mockTrainee),
        (err) => err.statusCode === 403
    );

    await assert.rejects(
        () => superAdminm.exportReport(mockInstructor, { type: 'daily_health' }),
        (err) => err.statusCode === 403
    );
});

test('Super Admin Dashboard Enhancements: System Maintenance details', async () => {
    const data = await superAdminm.getSystemMaintenance(mockSuperAdmin);
    assert.ok(data.backup);
    assert.equal(data.backup.configured, true);
    assert.ok(data.serverAvailability);
    assert.ok(data.serverAvailability.uptimeSeconds >= 0);
    assert.equal(data.serverAvailability.uptimePercentage, 99.95);
    assert.ok(data.maintenance);
    assert.ok(Array.isArray(data.maintenance.maintenanceHistory));
});

test('Super Admin Dashboard Enhancements: Export Reports (CSV and JSON)', async () => {
    // CSV export test
    const csvData = await superAdminm.exportReport(mockSuperAdmin, { type: 'api_performance', format: 'csv' });
    assert.equal(typeof csvData, 'string');
    assert.ok(csvData.includes('API Performance'));
    assert.ok(csvData.includes('Uptime SLA'));

    // JSON export test
    const jsonData = await superAdminm.exportReport(mockSuperAdmin, { type: 'api_performance', format: 'json' });
    assert.equal(typeof jsonData, 'object');
    assert.ok(jsonData.headers);
    assert.ok(Array.isArray(jsonData.rows));
});
