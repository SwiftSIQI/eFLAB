'use client';

import { useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

const ACCESS_PASSWORD = 'eflab666';
const ACCESS_STORAGE_KEY = 'eflab-access-granted';
const ACCESS_CHANGE_EVENT = 'eflab-access-change';

function subscribeToAccess(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(ACCESS_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(ACCESS_CHANGE_EVENT, onChange);
  };
}

function getAccessSnapshot() {
  try {
    return window.localStorage.getItem(ACCESS_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function getServerAccessSnapshot() {
  return false;
}

export function SiteAccessGate({ children }: { readonly children: ReactNode }) {
  const isUnlocked = useSyncExternalStore(
    subscribeToAccess,
    getAccessSnapshot,
    getServerAccessSnapshot,
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (password !== ACCESS_PASSWORD) {
      setError('密码不正确，请重新输入。');
      return;
    }

    window.localStorage.setItem(ACCESS_STORAGE_KEY, 'true');
    window.dispatchEvent(new Event(ACCESS_CHANGE_EVENT));
    setError('');
  }

  if (isUnlocked) {
    return children;
  }

  return (
    <main className="access-gate">
      <section className="access-card" aria-labelledby="access-title">
        <p className="eyebrow">eflab private preview</p>
        <h1 id="access-title">输入访问密码</h1>
        <p>请输入密码后继续使用 eflab。</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="site-access-password">访问密码</label>
          <input
            id="site-access-password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError('');
            }}
            autoComplete="current-password"
            aria-describedby={error ? 'site-access-error' : undefined}
          />
          <button type="submit">进入 eflab</button>
          <p
            id="site-access-error"
            className="access-error"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        </form>
      </section>
    </main>
  );
}
