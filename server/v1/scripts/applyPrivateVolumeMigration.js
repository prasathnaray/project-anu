const fs = require('fs/promises');
const path = require('path');
const client = require('../utils/conn');

const migrationPaths = [
    path.resolve(__dirname, '../migrations/20260819_private_volume_management.sql'),
    path.resolve(__dirname, '../migrations/20260820_super_admin_volume_approval.sql')
];

const run = async () => {
    for (const migrationPath of migrationPaths) {
        const sql = await fs.readFile(migrationPath, 'utf8');
        await client.query(sql);
    }
    const result = await client.query(
        `SELECT column_name, data_type
         FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = 'volumes'
           AND column_name = 'uploader_role'`
    );
    if (result.rows.length !== 1) throw new Error('volumes.uploader_role was not created.');
    console.log('Private volume migrations applied successfully.');
};

run()
    .catch((error) => {
        console.error('Private volume migration failed:', error.message);
        process.exitCode = 1;
    })
    .finally(() => client.end());
