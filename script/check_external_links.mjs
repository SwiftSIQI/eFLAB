import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = path.join(ROOT, 'config', 'external-links.json');
const STRICT = process.argv.includes('--strict');
const REQUEST_TIMEOUT_MS = 12_000;

const links = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));

if (!Array.isArray(links) || links.length === 0) {
  throw new Error('外链清单为空，无法执行检查。');
}

function isCheckableResponse(status) {
  return status >= 200 && status < 400;
}

function isManualVerificationStatus(status) {
  return status === 401 || status === 403 || status === 405 || status === 429;
}

async function request(url, method) {
  const response = await fetch(url, {
    method,
    redirect: 'follow',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      'user-agent': 'eFLAB external-link-checker/1.0',
      ...(method === 'GET' ? { range: 'bytes=0-0' } : {}),
    },
  });
  await response.body?.cancel();
  return response;
}

async function checkLink(link) {
  let response;
  let firstError;

  try {
    response = await request(link.url, 'HEAD');
  } catch (error) {
    firstError = error;
  }

  if (!response || response.status === 405 || response.status === 403) {
    try {
      response = await request(link.url, 'GET');
    } catch (error) {
      if (firstError) {
        return {
          link,
          state: 'failed',
          detail: `${firstError.message}; ${error.message}`,
        };
      }
      return { link, state: 'failed', detail: error.message };
    }
  }

  if (isCheckableResponse(response.status)) {
    return {
      link,
      state: 'ok',
      detail: `${response.status} ${response.url}`,
    };
  }

  if (isManualVerificationStatus(response.status)) {
    return {
      link,
      state: 'manual',
      detail: `${response.status} ${response.url}`,
    };
  }

  return {
    link,
    state: 'failed',
    detail: `${response.status} ${response.url}`,
  };
}

const results = await Promise.all(links.map(checkLink));
const counts = results.reduce(
  (summary, result) => {
    summary[result.state] += 1;
    return summary;
  },
  { ok: 0, manual: 0, failed: 0 },
);

for (const result of results) {
  const prefix =
    result.state === 'ok' ? 'OK' : result.state === 'manual' ? 'WARN' : 'FAIL';
  console.log(`[${prefix}] ${result.link.label}: ${result.detail}`);
}

console.log(
  `外链检查完成：${counts.ok} 个正常，${counts.manual} 个需要人工确认，${counts.failed} 个失败。`,
);

if (counts.failed > 0 || (STRICT && counts.manual > 0)) {
  process.exitCode = 1;
}
