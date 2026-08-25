// const path = require('path');
// const { Pool } = require('pg');

// require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// const connectionString = process.env.DATABASE_URL;
// if (!connectionString) {
//   throw new Error('DATABASE_URL is required');
// }

// const DNS_RETRY_COUNT = 5;
// const DNS_RETRY_DELAY_MS = 250;

// const retryDelay = (attempt) => DNS_RETRY_DELAY_MS * (2 ** attempt);
// const isRetryableDnsError = (err) => err?.code === 'EAI_AGAIN';

// class DnsRetryPool extends Pool {
//   query(...args) {
//     const callback = typeof args[args.length - 1] === 'function'
//       ? args.pop()
//       : null;

//     if (callback) {
//       let retryCount = 0;

//       const run = () => super.query(...args, (err, result) => {
//         if (isRetryableDnsError(err) && retryCount < DNS_RETRY_COUNT) {
//           const delay = retryDelay(retryCount);
//           retryCount += 1;
//           console.warn(
//             `Database DNS lookup failed; retrying (${retryCount}/${DNS_RETRY_COUNT}) in ${delay}ms`
//           );
//           setTimeout(run, delay);
//           return;
//         }

//         callback(err, result);
//       });

//       return run();
//     }

//     return (async () => {
//       for (let retryCount = 0; ; retryCount += 1) {
//         try {
//           return await super.query(...args);
//         } catch (err) {
//           if (!isRetryableDnsError(err) || retryCount >= DNS_RETRY_COUNT) {
//             throw err;
//           }

//           const delay = retryDelay(retryCount);
//           console.warn(
//             `Database DNS lookup failed; retrying (${retryCount + 1}/${DNS_RETRY_COUNT}) in ${delay}ms`
//           );
//           await new Promise((resolve) => setTimeout(resolve, delay));
//         }
//       }
//     })();
//   }
// }

// const client = new DnsRetryPool({
//   connectionString,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// client.on('error', (err) => {
//   console.error('Unexpected idle database connection error', {
//     code: err.code,
//     message: err.message,
//   });
// });

// module.exports = client;

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