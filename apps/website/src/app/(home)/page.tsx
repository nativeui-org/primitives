'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

const commands: Record<PackageManager, string> = {
  npm: 'npm install @native-ui-org/primitives',
  pnpm: 'pnpm add @native-ui-org/primitives',
  yarn: 'yarn add @native-ui-org/primitives',
  bun: 'bun add @native-ui-org/primitives',
};

export default function HomePage() {
  const [packageManager, setPackageManager] = useState<PackageManager>('npm');
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/version')
      .then((res) => res.json())
      .then((data) => setVersion(data.version))
      .catch(() => setVersion(null));
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-12 w-full">
        {/* Title */}
        <div className="space-y-4">
          {version && (
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium border border-neutral-200 dark:border-neutral-800 rounded-full animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-500"></span>
                </span>
                Beta v{version}
              </span>
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-center">
            NativeUI Primitives
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 text-center max-w-2xl mx-auto">
            Low-level UI primitives for building cross-platform design systems.
            Works across iOS, Android, and Web with a unified API.
          </p>
        </div>

        {/* Installation */}
        <div className="max-w-xl mx-auto w-full">
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            {/* Package Manager Tabs */}
            <div className="flex gap-1 px-2 pt-2 border-b border-neutral-200 dark:border-neutral-800">
              {(['npm', 'pnpm', 'yarn', 'bun'] as PackageManager[]).map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPackageManager(pm)}
                  className={`px-3 py-2 text-xs font-medium rounded-t-md transition-colors ${packageManager === pm
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                    }`}
                >
                  {pm}
                </button>
              ))}
            </div>

            {/* Command */}
            <div className="p-6">
              <code className="text-sm font-mono text-neutral-900 dark:text-neutral-100 block">
                {commands[packageManager]}
              </code>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
          <Link
            href="/docs"
            className="text-neutral-900 dark:text-neutral-100 font-medium underline underline-offset-4 hover:no-underline"
          >
            Documentation
          </Link>
          <span className="text-neutral-400">·</span>
          <a
            href="https://github.com/nativeui-org/primitives"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 dark:text-neutral-100 font-medium underline underline-offset-4 hover:no-underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </main>
  );
}