# Project ANU v1 authentication performance fix

Date: 30 October 2026

## Outcome

The local v1 backend now performs successful authentication once per HTTP request, even when that request passes through many protected routers. Every new request still validates its token, session and current account status. All 65 backend tests passed after the change. This fix has not been deployed to Lambda in this task.

## Observed problem

The local frontend showed API response delays of approximately five to ten seconds. Request timing logs established that repeated authentication accounted for most of the elapsed time. These are actual pre-fix logs supplied during diagnosis; endpoint names were not included in those logs.

| Authentication passes | Authentication queries | Authentication time | Total request time |
| ---: | ---: | ---: | ---: |
| 58 | 174 | 4.85 s | 5.37 s |
| 47 | 141 | 5.19 s | 5.59 s |
| 84 | 252 | 7.53 s | 7.57 s |
| 65 | 195 | 8.83 s | 9.81 s |
| 65 | 195 | 8.98 s | 10.09 s |
| 1 | 3 | 0.126 s | 0.127 s |

Authentication consumed approximately 89 to 99 percent of the duration of the five slow requests. The single-pass request is context, not a guaranteed post-fix response-time target for other endpoints.

## Root cause

In `server/v1/app.js`, many routers are mounted at the same `/api/v1` prefix with `Authenticate` before each router. Express executes that middleware even when the following router has no matching endpoint and passes control to the next router. Requests for later routes therefore repeated authentication many times.

Each successful authentication performs three sequential database calls: read the active session, read the current user, and conditionally update the session last-seen timestamp. The conditional update is still a database round trip even when no row needs updating. Repeating this work multiplies database latency and load.

## Implementation

`server/v1/Auth/authenticate.js` now maintains a module-private WeakSet of request objects that have successfully completed all authentication checks and the session timestamp update. Subsequent invocations for that same request call `next()` immediately. The marker is added only after successful authentication, never after a rejected token, revoked session or failed query.

The marker is not a client header, token claim or general `req.user` check, so a caller cannot supply it. It is limited to the exact request object and is not reused between users or requests. Weak references allow completed requests to be garbage collected. Existing route permissions and institution scoping continue to run normally.

The timing wrapper runs only for actual authentication work, so `authCalls` now reports completed or attempted validation passes rather than the number of middleware mounts visited.

## Verification

Run from `server/v1`:

```powershell
npm test
```

Result: 65 tests passed, zero failed.

The HTTP regression test in `test/requestTiming.test.js` reconstructs the protected router mount order from `app.js`, uses the real authentication implementation and supplies mocked database results. It does not load the production handlers or modify the live database.

| Diagnostic for the cluster route | Before | After |
| --- | ---: | ---: |
| Successful authentication passes | 65 | 1 |
| Authentication database queries | 195 | 3 |

That removes 192 authentication queries per request in this diagnostic, a 98.46 percent reduction in authentication query count. It is not a measured percentage reduction in real response time.

The regression test also makes a second request with the same token and verifies that the three checks run again. It then simulates session revocation and verifies that the following request returns 401. The existing suite additionally covers invalid sessions, inactive accounts, roles and institution boundaries.

## Check actual local response times

1. Restart the local v1 server, or let nodemon reload the changed module.
2. Open the Cluster page and refresh it.
3. Inspect GET requests in Chrome Network, then Timing and Server Timing.
4. Inspect the corresponding `[api-timing]` terminal entries. Match `X-Request-Id` in the response headers to `requestId` in the log.
5. For successful protected requests, expect `authCalls: 1` and `authDbQueries: 3`. Total `dbQueries` may be higher because the endpoint performs its own work.
6. Compare several requests under similar network and load conditions. Real post-fix database timings have not yet been collected.

The metrics overlap: authentication time includes its database time. Database duration sums query durations and includes connection waits; concurrent queries can overlap. Do not add all displayed durations together. OPTIONS requests with 204 and zero database queries are normal CORS preflight checks. A 304 response can still perform backend authentication.

Timing is enabled locally by default. Set `API_TIMING=false` to disable it, or `API_TIMING=true` to explicitly enable it in production. The diagnostic logger records counters and durations without SQL text, tokens or query parameters.

## Remaining performance work

This change addresses redundant authentication only. Cluster request-time table setup and seed writes, full-list database responses despite browser pagination, expensive dashboard queries, and database pool behavior remain separate optimization opportunities. Lambda cold starts do not explain the local timings above.

For Lambda rollout, build and deploy the updated v1 package using `server/v1/LAMBDA_DEPLOYMENT.md`, then verify authenticated endpoints as well as `/health`. The health endpoint alone does not exercise authentication or database work. To roll back this optimization, remove the request marker and its early return while retaining the underlying authentication checks.
