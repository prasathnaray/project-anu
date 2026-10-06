const client = require('../server/v1/utils/conn');

async function run() {
  const res = await client.query(`
    SELECT question_no, prompt, question_type, resource_id
    FROM mind_spark_questions
    WHERE resource_id = 'e196c6db-dc0b-4ebd-93b2-10a2125188e5'
    ORDER BY question_no ASC;
  `);
  console.log("Questions for e196c6db-dc0b-4ebd-93b2-10a2125188e5:");
  console.log(JSON.stringify(res.rows, null, 2));

  // Also check questions with question_no between 6 and 10
  const q6_10 = await client.query(`
    SELECT question_no, prompt, question_type, feedback_correct, feedback_wrong, resource_id
    FROM mind_spark_questions
    WHERE question_no BETWEEN 6 AND 10
    ORDER BY question_no ASC;
  `);
  console.log("Questions between 6 and 10:");
  console.log(JSON.stringify(q6_10.rows, null, 2));

  // Check what resources exist with name like %find% or %freeze% or %bpd%
  const resources = await client.query(`
    SELECT id, name, topic, type
    FROM learning_resources
    WHERE LOWER(name) LIKE '%find%' OR LOWER(name) LIKE '%freeze%' OR LOWER(name) LIKE '%plane%'
    ORDER BY name;
  `);
  console.log("Resources matching find/freeze/plane:");
  console.log(JSON.stringify(resources.rows, null, 2));

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
