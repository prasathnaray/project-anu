const client = require('../server/v1/utils/conn.js');

async function run() {
  try {
    const tl = await client.query('SELECT * FROM targeted_learning WHERE target_learning_id=$1', ['ea3ff15e-d095-4608-977e-4a7e2ebd2a3b']);
    console.log('TL Row:', tl.rows[0]);
    if (tl.rows[0]) {
      const lm = await client.query('SELECT * FROM learning_module WHERE learning_module_id=$1', [tl.rows[0].learning_module_id]);
      console.log('Learning Module:', lm.rows);
      const res = await client.query('SELECT * FROM resource_data WHERE resource_id::text = ANY($1::varchar[])', [tl.rows[0].resources_id]);
      console.log('Resources:', res.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
run();
