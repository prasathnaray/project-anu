const client = require('../server/v1/utils/conn');

async function main() {
  try {
    const res = await client.query(`
      SELECT mq.question_id, mq.resource_id, mq.question_no, mq.prompt, mq.options, mq.correct_answer, rd.resource_name, md.module_name
      FROM public.mind_spark_questions mq
      LEFT JOIN public.resource_data rd ON mq.resource_id = rd.resource_id
      LEFT JOIN public.module_data md ON rd.module_id = md.module_id
      WHERE md.module_name ILIKE '%AC%' OR rd.resource_name ILIKE '%AC%' OR mq.prompt ILIKE '%AC%'
      ORDER BY mq.resource_id, mq.question_no;
    `);
    console.log('COUNT:', res.rows.length);
    console.log('AC QUESTIONS IN DB:', JSON.stringify(res.rows, null, 2));

    const allResources = await client.query(`
      SELECT rd.resource_id, rd.resource_name, rd.resource_type, md.module_name
      FROM public.resource_data rd
      LEFT JOIN public.module_data md ON rd.module_id = md.module_id
      WHERE rd.resource_type ILIKE '%interpret%' OR rd.resource_name ILIKE '%image%' OR rd.resource_name ILIKE '%find%'
      ORDER BY md.module_name, rd.resource_name;
    `);
    console.log('ALL INTERPRET RESOURCES:', JSON.stringify(allResources.rows, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
