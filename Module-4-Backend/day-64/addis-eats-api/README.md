<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Day 59 cross-cutting concerns

Set `API_KEY` in the application environment before making requests. Send it in
the `x-api-key` header; a missing key returns 401 and an invalid key returns 403.
All routes use the `/api` prefix, including the request-count endpoint at
`GET /api/metrics`.

The request lifecycle, written from memory and checked against Nest's ordering:

1. Middleware
2. Global guards
3. Controller guards
4. Route guards
5. Global interceptors (inbound)
6. Controller interceptors (inbound)
7. Route interceptors (inbound)
8. Global pipes
9. Controller pipes
10. Route pipes
11. Route-parameter pipes

The handler and service run next; interceptors unwind in reverse order, and
exception filters handle thrown errors. The correction to watch for is that
inbound interceptors run before pipes, not after them.

`OwnershipGuard` currently compares each order's `ownerId` with the demo
identity `user-1`; Week 12's JWT work must validate the token, attach its
verified subject (for example `request.user.sub`), and use that identity both
when creating an order and when checking ownership.

The temporary global envelope was wired to wrap successful payloads as
`{ data }`; it was removed because it changes every controller's response
contract and forces clients to unwrap it. Nest exception responses would keep
their separate error shape, and no current requirement justifies adding that
inconsistency.

The request-ID and metrics middleware run at ingress, before guards and route
handling. Reimplementing request-ID assignment as a guard could overlap for
matched routes, but it would run too late to cover unmatched routes or requests
rejected by earlier guards.

## Day 60 logging and API documentation

Set `LOG_LEVEL` to `fatal`, `error`, `warn`, `info`, `debug`, or `verbose`.
Logs are structured JSON outside development; development uses a readable
pretty format. The logger redacts `authorization`, `x-api-key`, and phone-named
fields recursively. Request IDs are propagated with async context so service
logs can correlate with their originating request without changing method
signatures.

In non-production environments, Swagger UI is available at `/docs`. The
generated `openapi.json` is written to the project root at startup, including
in production; only the UI is disabled when `NODE_ENV=production`. The current
API has nine route handlers, each tagged and summarized with its documented
success and failure responses. Swagger uses the `x-api-key` header scheme.

## Day 63 API security

The API uses Helmet, including HSTS, and no longer sends `X-Powered-By`.
`CORS_ORIGINS` is a comma-separated allowlist (default:
`http://localhost:5173`); credentials are enabled only for those origins, with
methods and request headers explicitly listed. Set `API_KEY` before starting
the app. JSON and URL-encoded bodies are limited to 100 KB, and the global
validation pipe rejects unknown fields on every write. Create services map
accepted DTO fields explicitly rather than spreading request objects.

The global in-memory throttle allows 300 requests per IP per minute. Health at
`GET /api` skips throttling. A 429 includes `Retry-After`, the Day 58
`statusCode` / `message` / `error` fields, and the request ID. This app does not
currently define login, registration, or token-refresh routes; apply
`@StrictAuthThrottle()` (five requests per minute) to each when those routes
are introduced.

### Required reading

Read the [OWASP API Security Top 10](https://owasp.org/API-Security/) beside
the API. These are brief working summaries of the ten risks; use the linked
source for the complete guidance.

1. **Broken Object Level Authorization (BOLA):** An authenticated caller can
   access another user's object when a handler trusts a supplied identifier
   without checking that object's owner against the caller's verified identity.
2. **Broken Authentication:** Weak credential handling, token validation, or
   session lifecycle controls can let an attacker impersonate another user or
   keep access after it should expire.
3. **Broken Object Property Level Authorization (BOPLA):** APIs may expose
   sensitive fields or allow clients to modify protected properties when
   responses and write DTOs are not restricted to an explicit property set.
4. **Unrestricted Resource Consumption:** Missing limits on request size,
   frequency, execution cost, or downstream usage can exhaust capacity or
   create unexpected operational costs.
5. **Broken Function Level Authorization (BFLA):** A caller may invoke
   administrative or otherwise privileged operations when authorization is
   not enforced for each function and role.
6. **Unrestricted Access to Sensitive Business Flows:** Automated use of
   legitimate business workflows can abuse scarce or costly operations even
   when each individual request is valid.
7. **Server Side Request Forgery (SSRF):** An API that fetches a
   caller-influenced URL can be induced to connect to internal or otherwise
   unintended services unless destinations and redirects are constrained.
8. **Security Misconfiguration:** Unsafe defaults, overly broad CORS, missing
   security headers, verbose errors, or exposed debug interfaces can weaken
   an otherwise correctly implemented API.
9. **Improper Inventory Management:** Unknown, forgotten, or outdated API
   versions and endpoints expand the attack surface and may retain weaker
   protections than the maintained API.
10. **Unsafe Consumption of APIs:** Treating responses from third-party APIs
    as trusted can allow malicious or malformed data to bypass validation,
    leak information, or trigger unsafe behavior.

Read the [MDN CORS guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
in full, particularly its explanations of preflight requests and credentials.
For the exercise, use `starter/cors-test.html` from a different local origin
and configure that origin explicitly in `CORS_ORIGINS`.

### Optional deeper reading

- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [Helmet documentation](https://helmetjs.github.io/) — review which defaults
  are useful for a JSON API and which are primarily browser-document policies.
- [NestJS rate limiting](https://docs.nestjs.com/security/rate-limiting) —
  storage providers and custom tracker/key generation.

Run the local probes with `API_KEY` set to the running app's key:
`bash starter/attack.sh`. Record observations in `SECURITY.md`, starting from
`starter/SECURITY.template.md`. The script is intentionally restricted to
loopback hosts.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

This project is already instrumented. To connect it, run this and approve the code it prints at [observe.nestjs.com/link](https://observe.nestjs.com/link) - signing up for free if you have no account:

```bash
$ npx @nestjs/observe link
```

It writes the app key and secret into `.env` and makes every `nest start` script (`start`, `start:dev`, `start:debug`) load it. In production, set `OBSERVE_APP_KEY` and `OBSERVE_APP_SECRET` in the environment instead.

Or do it by hand: create an application and an API key at [observe.nestjs.com](https://observe.nestjs.com), and set the pair as `OBSERVE_APP_KEY` and `OBSERVE_APP_SECRET` in the environment the app runs in.

The free plan needs no payment details and covers 300,000 events a month. You can also browse the [live demo](https://www.observe-demo.nestjs.com/dashboard) first - the whole dashboard over a busy service's data, with nothing to install.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observe](https://observe.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
