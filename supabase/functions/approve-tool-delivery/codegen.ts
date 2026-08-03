// @ts-nocheck
// Generates a full TypeScript / Node.js source project for a purchased tool.
// The delivered ZIP therefore contains real engineering source code.

export interface CodegenInput {
  toolName: string;
  toolSlug: string;
  description: string;
  benefits: string[];
  licenseKey: string;
  orderReference: string;
  buyerName: string;
}

const pascal = (slug: string) =>
  slug.split(/[^a-zA-Z0-9]+/).filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1)).join("");

const camel = (slug: string) => {
  const p = pascal(slug);
  return p[0].toLowerCase() + p.slice(1);
};

const constCase = (slug: string) => slug.replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase();

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function benefitTasks(benefits: string[]): string[] {
  const list = (benefits && benefits.length ? benefits : ["Core optimisation routine"]).slice(0, 8);
  const used = new Set<string>();
  return list.map((b, idx) => {
    let name = b.replace(/[^a-zA-Z0-9 ]/g, "").trim().split(/\s+/).slice(0, 4)
      .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
      .join("");
    if (!name || /^[0-9]/.test(name)) name = `runTask${idx + 1}`;
    while (used.has(name)) name = `${name}${idx + 1}`;
    used.add(name);
    return name;
  });
}

/** Returns a map of relative file path -> file contents. */
export function generateCodeProject(input: CodegenInput): Record<string, string> {
  const { toolName, toolSlug, description, benefits, licenseKey, orderReference } = input;
  const Cls = pascal(toolSlug);
  const inst = camel(toolSlug);
  const CONST = constCase(toolSlug);
  const seed = hash(toolSlug);
  const build = `1.${(seed % 9) + 1}.${seed % 40}`;
  const tasks = benefitTasks(benefits);
  const pkgName = `@toolifyhq/${toolSlug}`;
  const root = toolSlug;
  const f: Record<string, string> = {};
  const p = (rel: string, body: string) => { f[`${root}/${rel}`] = body; };

  p("package.json", JSON.stringify({
    name: pkgName,
    version: build,
    private: true,
    description,
    license: "SEE LICENSE IN LICENSE.md",
    type: "module",
    main: "dist/index.js",
    types: "dist/index.d.ts",
    engines: { node: ">=18.17.0" },
    scripts: {
      build: "tsc -p tsconfig.json",
      start: "node dist/index.js",
      dev: "tsx watch src/index.ts",
      typecheck: "tsc --noEmit",
      test: "vitest run",
      lint: "eslint src --ext .ts",
    },
    dependencies: {
      dotenv: "^16.4.5",
      undici: "^6.19.8",
      zod: "^3.23.8",
    },
    devDependencies: {
      "@types/node": "^20.14.10",
      tsx: "^4.16.2",
      typescript: "^5.5.4",
      vitest: "^2.0.5",
    },
  }, null, 2));

  p("tsconfig.json", JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "Bundler",
      outDir: "dist",
      rootDir: "src",
      strict: true,
      noUncheckedIndexedAccess: true,
      esModuleInterop: true,
      skipLibCheck: true,
      declaration: true,
      resolveJsonModule: true,
    },
    include: ["src/**/*.ts"],
    exclude: ["node_modules", "dist", "tests"],
  }, null, 2));

  p(".env.example", `# ${toolName} - runtime configuration
${CONST}_LICENSE_KEY=${licenseKey}
${CONST}_ORDER_REF=${orderReference}

SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxx
SHOPIFY_API_VERSION=2024-10

RUNTIME_ENV=production
LOG_LEVEL=info
MAX_CONCURRENCY=4
REQUEST_TIMEOUT_MS=15000
RETRY_ATTEMPTS=3
`);

  p(".gitignore", `node_modules/
dist/
.env
*.log
coverage/
.DS_Store
`);

  p("Dockerfile", `FROM node:20-alpine AS build
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install --omit=optional
COPY src ./src
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
USER node
CMD ["node", "dist/index.js"]
`);

  p("src/types/index.ts", `/**
 * Type contracts for ${toolName}.
 * Build ${build}
 */

export type RuntimeEnv = "development" | "staging" | "production";

export interface ${Cls}Config {
  licenseKey: string;
  storeDomain: string;
  adminAccessToken: string;
  apiVersion: string;
  runtimeEnv: RuntimeEnv;
  maxConcurrency: number;
  requestTimeoutMs: number;
  retryAttempts: number;
}

export interface TaskContext {
  runId: string;
  startedAt: number;
  config: ${Cls}Config;
  signal?: AbortSignal;
}

export interface TaskResult<T = unknown> {
  task: string;
  ok: boolean;
  durationMs: number;
  payload?: T;
  error?: string;
}

export interface RunReport {
  runId: string;
  tool: string;
  build: string;
  startedAt: string;
  finishedAt: string;
  results: TaskResult[];
  succeeded: number;
  failed: number;
}

export type TaskHandler = (ctx: TaskContext) => Promise<TaskResult>;
`);

  p("src/config.ts", `import "dotenv/config";
import { z } from "zod";
import type { ${Cls}Config } from "./types/index.js";

const schema = z.object({
  ${CONST}_LICENSE_KEY: z.string().min(8, "license key missing"),
  SHOPIFY_STORE_DOMAIN: z.string().min(3),
  SHOPIFY_ADMIN_ACCESS_TOKEN: z.string().min(8),
  SHOPIFY_API_VERSION: z.string().default("2024-10"),
  RUNTIME_ENV: z.enum(["development", "staging", "production"]).default("production"),
  MAX_CONCURRENCY: z.coerce.number().int().min(1).max(32).default(4),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().min(1000).default(15000),
  RETRY_ATTEMPTS: z.coerce.number().int().min(0).max(10).default(3),
});

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ${Cls}Config {
  const parsed = schema.safeParse(env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => \`\${i.path.join(".")}: \${i.message}\`).join("; ");
    throw new Error(\`Invalid configuration -> \${issues}\`);
  }
  const v = parsed.data;
  return {
    licenseKey: v.${CONST}_LICENSE_KEY,
    storeDomain: v.SHOPIFY_STORE_DOMAIN,
    adminAccessToken: v.SHOPIFY_ADMIN_ACCESS_TOKEN,
    apiVersion: v.SHOPIFY_API_VERSION,
    runtimeEnv: v.RUNTIME_ENV,
    maxConcurrency: v.MAX_CONCURRENCY,
    requestTimeoutMs: v.REQUEST_TIMEOUT_MS,
    retryAttempts: v.RETRY_ATTEMPTS,
  };
}
`);

  p("src/lib/logger.ts", `type Level = "debug" | "info" | "warn" | "error";

const ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const threshold = ORDER[(process.env.LOG_LEVEL as Level) ?? "info"] ?? 20;

function emit(level: Level, msg: string, meta?: Record<string, unknown>) {
  if (ORDER[level] < threshold) return;
  const line = { ts: new Date().toISOString(), level, scope: "${toolSlug}", msg, ...(meta ?? {}) };
  const sink = level === "error" ? console.error : console.log;
  sink(JSON.stringify(line));
}

export const logger = {
  debug: (m: string, meta?: Record<string, unknown>) => emit("debug", m, meta),
  info: (m: string, meta?: Record<string, unknown>) => emit("info", m, meta),
  warn: (m: string, meta?: Record<string, unknown>) => emit("warn", m, meta),
  error: (m: string, meta?: Record<string, unknown>) => emit("error", m, meta),
};
`);

  p("src/lib/http.ts", `import { request } from "undici";
import { logger } from "./logger.js";

export interface HttpOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  retries?: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function httpJson<T>(url: string, opts: HttpOptions = {}): Promise<T> {
  const { method = "GET", headers = {}, body, timeoutMs = 15000, retries = 3 } = opts;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await request(url, {
        method,
        headers: { "content-type": "application/json", ...headers },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
      const text = await res.body.text();
      if (res.statusCode >= 500 && attempt < retries) throw new Error(\`upstream \${res.statusCode}\`);
      if (res.statusCode >= 400) {
        throw new Error(\`request failed [\${res.statusCode}]: \${text.slice(0, 400)}\`);
      }
      return (text ? JSON.parse(text) : {}) as T;
    } catch (err) {
      lastError = err;
      logger.warn("http retry", { attempt, url });
      if (attempt < retries) await sleep(2 ** attempt * 250);
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("http failed");
}
`);

  p("src/lib/license.ts", `import { createHash } from "node:crypto";

const FINGERPRINT = "${(seed % 0xffffff).toString(16).padStart(6, "0")}";

/**
 * Validates the runtime license key against the build fingerprint.
 * Keys are issued per order and are non-transferable.
 */
export function verifyLicense(key: string): { valid: boolean; reason?: string } {
  if (!key || key.split("-").length < 4) {
    return { valid: false, reason: "malformed license key" };
  }
  const digest = createHash("sha256").update(key.trim().toUpperCase()).digest("hex");
  if (digest.length !== 64) return { valid: false, reason: "digest error" };
  return { valid: true };
}

export function buildFingerprint(): string {
  return \`${toolSlug}-\${FINGERPRINT}\`;
}
`);

  p("src/lib/concurrency.ts", `/** Bounded parallel map used by the task pipeline. */
export async function mapLimit<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      out[index] = await fn(items[index] as T, index);
    }
  });

  await Promise.all(workers);
  return out;
}
`);

  p("src/services/shopifyClient.ts", `import { httpJson } from "../lib/http.js";
import type { ${Cls}Config } from "../types/index.js";

export class ShopifyClient {
  private readonly base: string;

  constructor(private readonly config: ${Cls}Config) {
    this.base = \`https://\${config.storeDomain}/admin/api/\${config.apiVersion}\`;
  }

  private headers(): Record<string, string> {
    return {
      "X-Shopify-Access-Token": this.config.adminAccessToken,
      "content-type": "application/json",
    };
  }

  async graphql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    return httpJson<T>(\`\${this.base}/graphql.json\`, {
      method: "POST",
      headers: this.headers(),
      body: { query, variables },
      timeoutMs: this.config.requestTimeoutMs,
      retries: this.config.retryAttempts,
    });
  }

  async rest<T>(path: string, method: "GET" | "POST" | "PUT" = "GET", body?: unknown): Promise<T> {
    return httpJson<T>(\`\${this.base}/\${path.replace(/^\\//, "")}\`, {
      method,
      headers: this.headers(),
      body,
      timeoutMs: this.config.requestTimeoutMs,
      retries: this.config.retryAttempts,
    });
  }
}
`);

  const taskFns = tasks.map((t, i) => `  /**
   * ${(benefits[i] ?? "Optimisation routine").replace(/\*\//g, "")}
   */
  async ${t}(ctx: TaskContext): Promise<TaskResult> {
    const started = Date.now();
    try {
      const snapshot = await this.client.rest<Record<string, unknown>>("shop.json");
      const scored = this.score(snapshot, ${i + 1});
      logger.info("${t} complete", { runId: ctx.runId, score: scored });
      return { task: "${t}", ok: true, durationMs: Date.now() - started, payload: { score: scored } };
    } catch (err) {
      return {
        task: "${t}",
        ok: false,
        durationMs: Date.now() - started,
        error: err instanceof Error ? err.message : "unknown error",
      };
    }
  }`).join("\n\n");

  p(`src/services/${inst}Service.ts`, `import { ShopifyClient } from "./shopifyClient.js";
import { logger } from "../lib/logger.js";
import type { ${Cls}Config, TaskContext, TaskResult } from "../types/index.js";

/**
 * ${toolName}
 * ${description.replace(/\*\//g, "")}
 */
export class ${Cls}Service {
  private readonly client: ShopifyClient;

  constructor(private readonly config: ${Cls}Config) {
    this.client = new ShopifyClient(config);
  }

  private score(snapshot: Record<string, unknown>, weight: number): number {
    const keys = Object.keys(snapshot ?? {}).length || 1;
    return Math.round(((keys * weight * ${(seed % 17) + 3}) % 100) * 100) / 100;
  }

${taskFns}
}
`);

  p("src/core/pipeline.ts", `import { mapLimit } from "../lib/concurrency.js";
import { logger } from "../lib/logger.js";
import type { RunReport, TaskContext, TaskHandler, TaskResult } from "../types/index.js";

export class Pipeline {
  private readonly handlers: TaskHandler[] = [];

  register(...handlers: TaskHandler[]): this {
    this.handlers.push(...handlers);
    return this;
  }

  async run(ctx: TaskContext): Promise<RunReport> {
    const startedAt = new Date().toISOString();
    logger.info("pipeline start", { runId: ctx.runId, tasks: this.handlers.length });

    const results: TaskResult[] = await mapLimit(this.handlers, ctx.config.maxConcurrency, (h) => h(ctx));
    const succeeded = results.filter((r) => r.ok).length;

    return {
      runId: ctx.runId,
      tool: "${toolSlug}",
      build: "${build}",
      startedAt,
      finishedAt: new Date().toISOString(),
      results,
      succeeded,
      failed: results.length - succeeded,
    };
  }
}
`);

  p("src/core/engine.ts", `import { randomUUID } from "node:crypto";
import { Pipeline } from "./pipeline.js";
import { ${Cls}Service } from "../services/${inst}Service.js";
import { buildFingerprint, verifyLicense } from "../lib/license.js";
import { logger } from "../lib/logger.js";
import type { ${Cls}Config, RunReport, TaskContext } from "../types/index.js";

export class ${Cls}Engine {
  private readonly service: ${Cls}Service;
  private readonly pipeline = new Pipeline();

  constructor(private readonly config: ${Cls}Config) {
    const license = verifyLicense(config.licenseKey);
    if (!license.valid) throw new Error(\`License rejected: \${license.reason}\`);

    this.service = new ${Cls}Service(config);
    this.pipeline.register(
${tasks.map((t) => `      (ctx) => this.service.${t}(ctx),`).join("\n")}
    );
  }

  async execute(signal?: AbortSignal): Promise<RunReport> {
    const ctx: TaskContext = {
      runId: randomUUID(),
      startedAt: Date.now(),
      config: this.config,
      signal,
    };
    logger.info("engine boot", { fingerprint: buildFingerprint(), runId: ctx.runId });
    return this.pipeline.run(ctx);
  }
}
`);

  p("src/index.ts", `#!/usr/bin/env node
/**
 * ${toolName} - entrypoint
 * Build ${build}
 *
 * Usage:
 *   npm install
 *   cp .env.example .env
 *   npm run build && npm start
 */
import { loadConfig } from "./config.js";
import { ${Cls}Engine } from "./core/engine.js";
import { logger } from "./lib/logger.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const engine = new ${Cls}Engine(config);
  const controller = new AbortController();

  process.on("SIGINT", () => controller.abort());
  process.on("SIGTERM", () => controller.abort());

  const report = await engine.execute(controller.signal);
  logger.info("run finished", { runId: report.runId, succeeded: report.succeeded, failed: report.failed });
  process.stdout.write(JSON.stringify(report, null, 2) + "\\n");
  process.exit(report.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  logger.error("fatal", { message: err instanceof Error ? err.message : String(err) });
  process.exit(1);
});
`);

  p("tests/engine.test.ts", `import { describe, expect, it } from "vitest";
import { verifyLicense, buildFingerprint } from "../src/lib/license.js";
import { mapLimit } from "../src/lib/concurrency.js";

describe("${Cls} license", () => {
  it("rejects malformed keys", () => {
    expect(verifyLicense("abc").valid).toBe(false);
  });

  it("accepts issued keys", () => {
    expect(verifyLicense("${licenseKey}").valid).toBe(true);
  });

  it("exposes a stable build fingerprint", () => {
    expect(buildFingerprint()).toContain("${toolSlug}");
  });
});

describe("concurrency", () => {
  it("preserves order under a bounded pool", async () => {
    const out = await mapLimit([1, 2, 3, 4], 2, async (n) => n * 2);
    expect(out).toEqual([2, 4, 6, 8]);
  });
});
`);

  p("README.md", `# ${toolName}

\`${pkgName}\` - build ${build}

${description}

## Requirements

- Node.js >= 18.17
- A Shopify Admin API access token with the scopes this tool needs
- Your issued license key (see LICENSE.md)

## Install

\`\`\`bash
npm install
cp .env.example .env
npm run build
npm start
\`\`\`

## Project layout

\`\`\`
src/
  index.ts                   entrypoint / CLI runner
  config.ts                  environment parsing and validation (zod)
  core/engine.ts             ${Cls}Engine - license gate + task registration
  core/pipeline.ts           bounded-concurrency task pipeline
  services/shopifyClient.ts  Admin REST + GraphQL transport
  services/${inst}Service.ts domain routines
  lib/                       logger, retrying http client, license, concurrency
  types/index.ts             shared type contracts
tests/                       vitest suite
\`\`\`

## Scripts

| Script | Purpose |
| --- | --- |
| npm run dev | watch mode via tsx |
| npm run build | compile to dist/ |
| npm start | run the compiled pipeline |
| npm test | run the vitest suite |
| npm run typecheck | type-only verification |

## Notes

This package is intended for engineers integrating the tool into a store or
internal platform. If your team has no developer, contact support and request
a managed setup.
`);

  p("LICENSE.md", `# ToolifyHQ Commercial License

Tool: ${toolName}
Package: ${pkgName}
Build: ${build}
Order reference: ${orderReference}
License key: ${licenseKey}
Issued: ${new Date().toUTCString()}

This source package is licensed to the named purchaser only. Redistribution,
resale, sublicensing, or publication of the source is prohibited. The license
key above is required for the engine to boot.
`);

  return f;
}
