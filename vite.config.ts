import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig, type UserConfig } from 'vite';
import hostingConfig from './.openai/hosting.json' with { type: 'json' };

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  '00000000-0000-4000-8000-000000000000';

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === 'seatbelt';

const localBindingConfig = {
  main: 'vinext/server/fetch-handler',
  compatibility_flags: ['nodejs_compat'],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: 'site-creator-d1',
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: 'site-creator-r2',
        },
      ]
    : [],
};

const ignoredBundlerWarnings = new Set(['INEFFECTIVE_DYNAMIC_IMPORT']);

type BundlerLogHandler = NonNullable<
  NonNullable<NonNullable<UserConfig['build']>['rolldownOptions']>['onLog']
>;

function handleBundlerLog(
  level: Parameters<BundlerLogHandler>[0],
  warning: Parameters<BundlerLogHandler>[1],
  log: Parameters<BundlerLogHandler>[2],
) {
  if (
    level === 'warn' &&
    warning.code &&
    ignoredBundlerWarnings.has(warning.code)
  ) {
    return;
  }

  if (
    level === 'warn' &&
    warning.message?.includes(
      '`output.codeSplitting.groups[0].name` is a function.',
    )
  ) {
    return;
  }

  log(level, warning);
}

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import('@cloudflare/vite-plugin');

  return {
    css: { postcss: { plugins: [tailwindcss()] } },
    build: {
      rolldownOptions: {
        onLog: handleBundlerLog,
      },
    },
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        inspectorPort: isCodexSeatbeltSandbox ? false : undefined,
        config: localBindingConfig,
      }),
    ],
  };
});
