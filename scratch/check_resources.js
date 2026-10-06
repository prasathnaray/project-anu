const client = require('../server/v1/utils/conn');

async function main() {
  try {
    const res = await client.query(`
      SELECT rd.resource_id, rd.resource_name, rd.resource_type, rd.module_id, md.module_name, cd.course_name
      FROM public.resource_data rd
      LEFT JOIN public.module_data md ON rd.module_id = md.module_id
      LEFT JOIN public.course_data cd ON md.course_id = cd.course_id
      WHERE md.module_name ILIKE '%BPD%' 
         OR md.module_name ILIKE '%head%' 
         OR rd.resource_name ILIKE '%image%' 
         OR rd.resource_type ILIKE '%interpret%'
      ORDER BY cd.course_name, md.module_name, rd.resource_name;
    `);
    console.log('RESOURCES FOUND:', JSON.stringify(res.rows, null, 2));

    const questions = await client.query(`
      SELECT * FROM public.mind_spark_questions
      WHERE prompt ILIKE '%biparietal%' OR prompt ILIKE '%thalami%'
      LIMIT 10;
    `);
    console.log('EXISTING QUESTIONS:', JSON.stringify(questions.rows, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error querying DB:', err);
    process.exit(1);
  }
}

main();
