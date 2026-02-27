const { Pool } = require('pg');

const client = new Pool({
  connectionString: 'postgresql://postgres.rnrnzmqtvcyqhpakynls:182Ovp53rfeA1Rbf@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false,
  },
});
client.connect(err => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected');
  }
});
module.exports = client;