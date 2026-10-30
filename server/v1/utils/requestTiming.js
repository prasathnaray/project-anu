const { AsyncLocalStorage } = require('node:async_hooks');
const { performance } = require('node:perf_hooks');
const { randomUUID } = require('node:crypto');
const context = new AsyncLocalStorage();

const enabled = () => process.env.API_TIMING === 'true' ||
  (process.env.NODE_ENV !== 'production' && process.env.API_TIMING !== 'false');

function requestTiming(req, res, next) {
  if (!enabled()) return next();
  const stats = { requestId: randomUUID(), authCalls: 0, authMs: 0, dbQueries: 0, dbMs: 0, authDbQueries: 0, authDbMs: 0 };
  const start = performance.now();
  let finished = false;
  const writeHead = res.writeHead;
  res.writeHead = function (...args) {
    const total = performance.now() - start;
    res.setHeader('X-Request-Id', stats.requestId);
    res.setHeader('Server-Timing', `total;dur=${total.toFixed(2)}, auth;dur=${stats.authMs.toFixed(2)};desc="${stats.authCalls} passes", db;dur=${stats.dbMs.toFixed(2)};desc="${stats.dbQueries} queries", authdb;dur=${stats.authDbMs.toFixed(2)};desc="${stats.authDbQueries} queries"`);
    return writeHead.apply(this, args);
  };
  res.once('finish', () => {
    finished = true;
    console.info('[api-timing]', JSON.stringify({ method: req.method, ...stats, status: res.statusCode, totalMs: +(performance.now() - start).toFixed(2) }));
  });
  context.run({ stats, phase: 'handler', active: () => !finished }, next);
}

function timeAuthentication(handler) {
  return function (req, res, next) {
    const parent = context.getStore();
    if (!parent) return handler(req, res, next);
    parent.stats.authCalls += 1;
    const start = performance.now();
    let counted = false;
    const finish = () => {
      if (!counted) parent.stats.authMs += performance.now() - start;
      counted = true;
    };
    return context.run({ ...parent, phase: 'auth' }, async () => {
      try {
        await handler(req, res, (err) => {
          finish();
          context.run(parent, () => next(err));
        });
      } finally { finish(); }
    });
  };
}

// Measures pool queries, including connection wait. No SQL or parameter values are logged.
function instrumentPool(pool) {
  const query = pool.query;
  pool.query = function (...args) {
    const store = context.getStore();
    if (!store || !store.active()) return query.apply(this, args);
    const start = performance.now();
    store.stats.dbQueries += 1;
    if (store.phase === 'auth') store.stats.authDbQueries += 1;
    const done = () => {
      const ms = performance.now() - start;
      store.stats.dbMs += ms;
      if (store.phase === 'auth') store.stats.authDbMs += ms;
    };
    const callback = args[args.length - 1];
    if (typeof callback === 'function') {
      args[args.length - 1] = function (...result) { done(); return callback.apply(this, result); };
      try { return query.apply(this, args); } catch (error) { done(); throw error; }
    }
    try { return query.apply(this, args).finally(done); } catch (error) { done(); throw error; }
  };
}

module.exports = { requestTiming, timeAuthentication, instrumentPool };
