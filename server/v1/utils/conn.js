// const { Client } = require('pg');

// const client = new Client({
//   connectionString: 'postgresql://postgres.rnrnzmqtvcyqhpakynls:182Ovp53rfeA1Rbf@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });
// client.connect(err => {
//   if (err) {
//     console.error('Connection error', err.stack);
//   } else {
//     console.log('Connected');
//   }
// });
// module.exports = client;

const { Client } = require('pg');

const client = new Client({
  host: 'localhost',      // Local PostgreSQL host
  port: 5433,             // Your PostgreSQL port
  user: 'postgres',       // Your PostgreSQL username
  password: '1234', // Replace with your local password
  database: 'postgres',   // Your database name
});

client.connect(err => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to local PostgreSQL!');
  }
});

module.exports = client;