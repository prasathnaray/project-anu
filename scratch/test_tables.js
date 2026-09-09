const client = require('../server/v1/utils/conn.js');

async function run() {
  try {
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('Tables:', res.rows.map(r => r.table_name));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
run();
